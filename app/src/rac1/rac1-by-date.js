const baseURL = 'https://api.audioteca.rac1.cat';

class Rac1 {

  // Cache for UUID => podcast
  _podcastsData = {};

  // Cache for pageNumber => UUIDs
  _pages_uuids = [];

  // Cache for reloads
  _previous_uuids = [];

  // Abort controller
  // Used to stop pending fetches when user changes the date
  controller = new AbortController();

  constructor(props) {
    const noop = () => {};
    this.onListUpdate = props.onListUpdate || noop;
    this.onError = props.onError || noop;
    this.setDate(props.date);
  }

  // Abort the abort controller and clean it up creating a new one for next fetches
  abort() {
    this.controller.abort();
    this.controller = new AbortController();
  }

  // Raises exception on response error
  handleFetchErrors(response) {
    // Raise succeeded non-ok responses
    if ( !response.ok ) {
      return Promise.reject( Error(`Rac1 backend: ${response.statusText}`) );
    }
    return response;
  }

  // Catches fetch errors, original or 'self-raised', and throws to `onError` prop
  // Filters out non-error "Connection aborted"
  catchFetchErrors(err) {
    if ( err.name === 'AbortError' ) {
      console.log('Connection aborted', err);
    }
    else {
      err.message = `Rac1 backend: ${err.message}`;
      this.onError(err);
    }
  }

  setDate(date) {
    if ( this.date !== date ) {
      this._previous_uuids = [];
      this.abort();
    }
    this.date = date;
    this.updateList();
  }

  // Download podcasts UUIDs and then, each podcast data
  updateList(pageNumber=0) {
    if ( pageNumber === 0 ) {
      this._pages_uuids = [];
      this.pages = [0];
      this.handleListUpdate();
    }

    // Get list of UUIDs
    return this.getPodcastsUUIDs(pageNumber)

      // Download podcast data if needed
      .then( podcasts => this.getMissingPodcasts(pageNumber, podcasts) )

      // Trigger event for list updated
      .then( podcasts => this.handleListUpdate() )

      // Catch Exceptions
      .catch( this.catchFetchErrors.bind(this) )
  }

  getMissingPodcasts(pageNumber, podcasts) {
    return podcasts
      .map( podcast => {

        // If it's a podcast and is not in the cache
        if ( podcast.uuid !== '...' && !(podcast.uuid in this._podcastsData) ) {

          // Download podcast data and then trigger
          // update event when updated
          this.getPodcastData(podcast.uuid)
            .then( podcast => this.handlePodcastUpdate(pageNumber, podcast) )
            .catch( this.catchFetchErrors.bind(this) )
        }

        return podcast;
      })
  }

  // Creates a list with all known podcast or UUIDs
  // and fires event onListUpdate with that
  // () => null
  handleListUpdate() {
    let newList = [ ...this._previous_uuids.filter(podcast => podcast.uuid !== '...') ];
    let completed = true;

    // Helper functions
    const dateToString = d => `${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`;
    const compareDates = (d1, d2) => dateToString(d1) === dateToString(d2);
    const filterByDates = podcast => !("date" in podcast) || compareDates( podcast.date, this.date );

    // Create a virtual list of all podcasts correctly ordered
    this.pages.forEach( page => {

      // Get UUIDs from the pages cache
      var pageUuids = this._pages_uuids[ page ];

      // Set temporal UUID for unresolved pages
      if ( pageUuids === undefined ) {
        newList.push({uuid: '...'});
        completed = false;
      }
      else {

        // Add this page's podcasts to the list
        pageUuids

          // Filter out already added podcasts
          .filter( podcastPage => newList.find( podcast => podcast.uuid === podcastPage.uuid ) === undefined )

          // Filter out podcasts from other dates
          .filter( filterByDates )

          // Add remaining podcasts to the list
          .forEach( podcast => newList.push( podcast ) );
      }
    });

    // Get cached data if available
    newList = newList.map( podcast => this._podcastsData[podcast.uuid] || podcast )
          // Filter out podcasts from other dates
          .filter( filterByDates );

    // Save complete list on finish
    if ( completed ) {
      this._previous_uuids = newList;
    }

    // See if all podcasts have already been downloaded
    const allCompleted = completed && newList.every( podcast => 'path' in podcast );

    // Trigger update event
    this.onListUpdate(newList, allCompleted);

    return newList;
  }

  // Saves the new podcast to the pages cache and fires onPodcastUpdate
  // (pageNumber, podcastNew) => null
  handlePodcastUpdate(pageNumber, podcastNew) {
    try {
      podcastNew.page = pageNumber;

      this._pages_uuids[pageNumber].forEach( (podcast,index) => {
        if ( podcast.uuid === podcastNew.uuid ) {
          this._pages_uuids[pageNumber][index] = podcastNew;
        }
      });

      // Trigger update event
      this.handleListUpdate();
    } catch (err) {
      console.log("Podcast data arrived after pages clean. Discarding data.");
    }
  }

  // Gets all the podcasts UUIDs of a page
  // and, if pageNumer is 0, calls to do the same for the rest of pages
  // (pageNumber) => Promise(Array(String(UUID)))
  getPodcastsUUIDs(pageNumber=0) {
    return this.getPage(pageNumber)
      .then( dataRaw => this.parsePage(dataRaw) )
      .then( ({ uuidsPage, pages }) => {

        // If it's the first page, call to process the rest of pages, if any
        if ( pageNumber === 0 ) {

          // Save the list of pages, in reverse order
          // If there are no pages (only one page), create a one element array,
          // with page zero in it's first element
          this.pages = pages.length > 0 ? pages.reverse() : [0];

          // Resolve first the last page, so we have first the first day's UUIDs
          // Don't call again first page
          this.pages.forEach( page => (page !== 0) && this.updateList( page ) );
        }

        // Save in reversed order, along with the page number
        this._pages_uuids[pageNumber] = uuidsPage
          .reverse()
          .map( uuid => ({uuid, page: pageNumber}) );

        return this._pages_uuids[pageNumber];
      });
  }

  // Gets a page with HTML containning a list of podcasts from the server
  // (pageNumber) => Promise(String)
  getPage(pageNumber=0) {

    // Format day and month to 2 digits 0 padded strings
    const pad2 = num => ( num < 10 ? '0' : '' ) + num;
    const date =
      pad2( this.date.getDate() ) + '/' +
      pad2( 1 + this.date.getMonth() ) + '/' +
      this.date.getFullYear();

    // Set next day's date and string
    let next = new Date(this.date.getTime());
    next.setDate(next.getDate() + 1);
    let dateNext = '';

    // Don't use next day date if it's 2018's last day
    if ( !(next.getFullYear() === 2019 && next.getMonth() === 0 && next.getDate() === 1) ) {
      dateNext =
        pad2( next.getDate() ) + '/' +
        pad2( 1 + next.getMonth() ) + '/' +
        next.getFullYear();
    }

    return fetch(
      `${baseURL}/a-la-carta/cerca?`
      + "text=&programId=&sectionId=HOUR&"
      + `from=${date}&to=${dateNext}&pageNumber=${pageNumber}`,
      {
        "Content-Type": "application/json; charset=utf-8",
        signal: this.controller.signal,
      })
      .then( this.handleFetchErrors )

      .then( response => response.text() )
  }

  // Cached/compiled regexps & strings for parsing HTML
  dataAttrsFind  = / class="(audioteca-item|pagination-link)" /;
  dataAttrsClean = /.* (data-(audio-id|audioteca-search-page))="([^"]*)".*/;
  searchData = ['data-audio-id','data-audioteca-search-page'];

  // Parses a page raw HTML to obtain audio UUIDs and the list of pages
  // (dataRawHTML) => {uuidsPage: Array(String), pages: Array(Number)}
  parsePage(dataRaw) {
    const data = dataRaw
      .split('\n')

      // Filter by class, eliminating sidebar unwanted info
      .filter( line => this.dataAttrsFind.test(line) )

      // Get relevant data-* attributes
      .map( v => v.replace(this.dataAttrsClean, '$1=$3') )

      // Convert to an array of 2 strings separating attr name and it's value
      .map( line => line.split('=') );

    return {

      // Filter audio UUID's
      uuidsPage: data
        .filter( v => v[0] === this.searchData[0] )
        .map( v => v[1] ),

      // Filter page numbers
      pages: data
        .filter( v => v[0] === this.searchData[1] )
        .map( v => Number(v[1]) ),
    };
  }

  // Downloads podcast JSON
  // (uuid) => Promise(podcastJSON)
  getPodcastData(uuid) {

    // Return cached version if we've got it
    if ( uuid in this._podcastsData ) {
      // Return podcast as an immediatelly resolved Promise,
      // as it is what's expected
      return new Promise( resolve => resolve(this._podcastsData[uuid]) );
    }

    return fetch(
      `${baseURL}/piece/audio?id=${uuid}`,
      { signal: this.controller.signal }
    )
      .then( this.handleFetchErrors )
      .then( data => data.json() )
      .then( podcast => {

        // Fix server bug on year's last day, in which gives dates in the future
        if ( podcast.dateTime.startsWith(
          `${this.date.getFullYear() + 1}-${this.date.getMonth() + 1}`
        )) {
          podcast.dateTime = podcast.dateTime
            .replace(`${this.date.getFullYear() + 1}`, `${this.date.getFullYear()}`);
          console.log("Podcast date in future. Fixing to: " + podcast.dateTime);
        }

        // Add some data to the podcast
        podcast.uuid      = uuid;
        podcast.date      = new Date(podcast.dateTime);
        podcast.hour      = Number(podcast.audio.time.split(':')[0]);
        podcast.minute    = Number(podcast.audio.time.split(':')[1]);
        podcast.title     = podcast.appTabletTitle.replace(/ \d\d\/.*/, '');
        podcast.titleFull = podcast.appTabletTitle;
        podcast.author    = podcast.audio.section.program.subtitle.replace(/^amb /, '');
        Object.keys( podcast.audio.section.program.images )
          .forEach( kind =>
            podcast.audio.section.program.images[kind] =
              `${baseURL}/`
              + podcast.audio.section.program.images[kind]
              + `?v${podcast.audio.section.program.imageVersion}`
           );

        // Prevent a redirect of 400ms :/
        podcast.path = podcast.path.replace(/\/get\//, '/file/').replace(/\/(\d)\//, '/$1/-/')

        // Save to cache
        this._podcastsData[uuid] = podcast;

        return podcast;
      })
  }
}

export default Rac1;

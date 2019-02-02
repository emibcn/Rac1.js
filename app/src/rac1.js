import 'abortcontroller-polyfill'; // For GoogleBot

class Rac1 {

  // Cache for UUID => podcast
  _podcastsData = {};

  // Cache for pageNumber => UUIDs
  _pages_uuids = [];

  // Cache for reloads
  _previous_uuids = [];

  // Abort controller
  controller = new AbortController();

  // Anti-CORS backends
  antiCorsBackends = [
    { // Direct access to server
      url: url => `${url}`,
      parser: async response => {
        return await response.text();
      },
      extraOptions: {
        "Content-Type": "application/json; charset=utf-8",
      },
    },
    {
      url: url => `https://cors-anywhere.herokuapp.com/${url}`,
      parser: response => response.text(),
      extraOptions: {
        credentials: 'same-origin',
      },
    },
    {
      url: url => `https://api.allorigins.ml/get?url=${encodeURIComponent(url)}`,
      parser: async response => {
        const json = await response.json();
        if ( json.status.http_code === 200 ) {
          return json.contents;
        }
        else {
          throw Error(json);
        }
      },
    },
    { // https://github.com/messier31/cors-proxy-server
      url: url => `https://secret-ocean-49799.herokuapp.com/${url}`,
      parser: async response => {
        return await response.text();
      },
      extraOptions: {
        "Content-Type": "application/json; charset=utf-8",
      },
    },
    /*
    {
      url: url => `http://www.whateverorigin.org/get?url=${encodeURIComponent(url)}`,
      parser: async response => {
        const text = await response.text();
        console.log({text: JSON.parse(JSON.stringify(text))});
        const json = JSON.parse(text);
        console.log({json});
        if ( json.status.http_code === 200 ) {
          return json.contents;
        }
        else {
          throw Error(json);
        }
      },
      extraOptions: {
        "Content-Type": "application/json; charset=utf-8",
        headers: {
          "Accept": "application/jsonp",
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Request-Method": "GET",
          "Access-Control-Request-Headers": "content-type,script-charset",
        },
      },
    },
    {
      url: url => `https://crossorigin.me/${url}`,
      parser: async response => await response.text(),
      extraOptions: {
        "Content-Type": "application/json; charset=utf-8",
      },
    },
    {
      url: url => `http://alloworigin.com/get?compress=1&url=${encodeURIComponent(url)}`,
      parser: response => response.text(),
      extraOptions: {
      },
    },
    */
  ];

  constructor(props) {
    const noop = () => {};
    this.onListUpdate = props.onListUpdate || noop;
    this.onError = props.onError || noop;
    this.setDate(props.date);
  }

  abort() {
    this.controller.abort();
  }

  // Raises exception on response error
  handleFetchErrors(response) {
    if ( !response.ok ) {
      throw Error(`Rac1 backend: ${response.statusText}`);
    }
    return response;
  }

  // Catches the fetch error, original or 'self-raised'
  catchFetchErrors(callback) {
    return err => {
      if ( err.name === 'AbortError' ) {
        console.log(err.message);
        return Promise.reject(err);
      }
      else {
        err.message = `Rac1 backend: ${err.message}`;
        if ( typeof callback === 'function' ) {
          callback(err);
        }
        else {
          this.onError(err);
        }
      }
    }
  }

  setDate(date) {
    if ( this.date !== date ) {
      this._previous_uuids = [];
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
      .then( this.getPodcasts.bind(this, pageNumber) )

      // Trigger event for list updated
      .then( this.handleListUpdate.bind(this, pageNumber) )

      // Catch Exceptions
      .catch( this.catchFetchErrors() )
  }

  getPodcasts(pageNumber, podcasts) {
    return podcasts
      .map( podcast => {

        // If it's a podcast and is not in the cache
        if ( podcast.uuid !== '...' && !(podcast.uuid in this._podcastsData) ) {

          // Download podcast data and then trigger
          // event when updated
          this.getPodcastData(podcast.uuid)
            .then( this.handlePodcastUpdate.bind(this, pageNumber) )
            .catch( this.catchFetchErrors() )
        }
        return podcast;
      })
  }

  // Creates a list with all known podcast or UUIDs
  // and fires event onListUpdate with that
  // () => null
  handleListUpdate() {
    let newList = [ ...this._previous_uuids.filter(w => w.uuid !== '...') ];
    let completed = true;

    // Helper functions
    const dateToString = d => `${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`;
    const compareDates = (d1, d2) => dateToString(d1) === dateToString(d2);
    const filterByDates = podcast => {
      return !("date" in podcast) || compareDates( podcast.date, this.date )
    };

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
          .filter( podcastPage => {
            const found = newList.filter(
              podcast => podcast.uuid === podcastPage.uuid );
            return found.length === 0;
          })

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
    podcastNew.page = pageNumber;
    this._pages_uuids[pageNumber].forEach( (podcast,index) => {
      if ( podcast.uuid === podcastNew.uuid ) {
        this._pages_uuids[pageNumber][index] = podcastNew;
      }
    });

    // Trigger update event
    this.handleListUpdate(podcastNew);
  }

  // Gets all the podcasts UUIDs of a date
  // (pageNumber) => Promise(Array(String(UUID)))
  getPodcastsUUIDs(pageNumber=0) {
    return this.getPage(pageNumber)
      .then( dataRaw => {

        const { uuidsPage, pages } = this.parsePage(dataRaw);


        // If it's the first page, call the rest
        if ( pageNumber === 0 ) {

          // Save the list of pages, in reverse order
          // If there are no pages (only one page), create a one element array,
          // with page zero in it's first element
          this.pages = pages.length > 0 ? pages.reverse() : [0];

          // Resolve first the last page, so we have first the first day's UUIDs
          // Don't call again first page
          this.pages.forEach( page => (page !== 0) && this.updateList( page ) );
        }

        // Save in reversed order and along with the page number
        this._pages_uuids[pageNumber] = uuidsPage
          .reverse()
          .map( uuid => { return {uuid, page: pageNumber} } );

        return this._pages_uuids[pageNumber];
      });
  }

  // Gets a page with HTML containning a list of podcasts from the server
  // (pageNumber) => Promise(String)
  getPage(pageNumber=0, backend=0) {

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
      this.antiCorsBackends[backend].url( // Anti CORS
      "https://api.audioteca.rac1.cat/a-la-carta/cerca?"
      + "text=&programId=&sectionId=HOUR&"
      + `from=${date}&to=${dateNext}&pageNumber=${pageNumber}`),
      {
        ...this.antiCorsBackends[backend].extraOptions,
        signal: this.controller.signal,
      })
      .then( this.handleFetchErrors )

      .then( this.antiCorsBackends[backend].parser )

      // Early catch backend error to retry with the next on list
      // Reraise error when no more backends available
      .catch( this.catchFetchErrors( err => {
        console.error(err);

        // If user aborted, reject promise silently
        if ( err.name !== 'AbortError' ) {

          // Deactivate AntiCORS feature
          if ( true || backend === (this.antiCorsBackends.length - 1) ) {
            //console.log(`AntiCORS backend ${backend} failed. No more backends available.`);
            throw Error(err);
          }
          else {
            console.log(`AntiCORS backend ${backend} failed. Trying next.`);
            return this.getPage(pageNumber, backend + 1)
          }
        }
        else {
          Promise.reject(err);
        }
      }))
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
      `https://api.audioteca.rac1.cat/piece/audio?id=${uuid}`,
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

        // Prevent a redirect of 400ms :/
        podcast.path = podcast.path.replace(/\/get\//, '/file/').replace(/\/(\d)\//, '/$1/-/')

        // Save to cache
        this._podcastsData[uuid] = podcast;

        return podcast;
      })
  }
}

export default Rac1;

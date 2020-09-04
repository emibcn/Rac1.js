import Common from './Common';

class ByDate extends Common {

  name = 'By Date';

  // Cache for UUID => podcast
  podcastsData = {};

  // List of pages to parse: 0, 1, 2, ...
  pages = [];

  // Cache for pageNumber => UUIDs
  pagesUuids = [];

  // Cache for reloads
  previousListUpdate = [];

  constructor(props) {
    super(props);
    this.setDate(props.date);
  }

  setDate(date) {
    if ( this.date !== date ) {
      this.previousListUpdate = [];
      this.abort();
    }
    this.date = date;
    this.updateList();
  }

  // Download podcasts UUIDs and then, each podcast data
  updateList(pageNumber=0) {
    if ( pageNumber === 0 ) {
      this.pagesUuids = [];
      this.pages = [0]; // Add first (this) page
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
        if ( podcast.uuid !== '...' && !(podcast.uuid in this.podcastsData) ) {

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
  // and fires event onUpdate with that
  // () => null
  handleListUpdate() {
    let newList = [ ...this.previousListUpdate.filter(podcast => podcast.uuid !== '...') ];
    let completed = true;

    // Helper functions
    const dateToString = d => `${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`;
    const compareDates = (d1, d2) => dateToString(d1) === dateToString(d2);
    const filterByDates = podcast => !("date" in podcast) || compareDates( podcast.date, this.date );

    // Create a virtual list of all podcasts correctly ordered
    this.pages.forEach( page => {

      // Get UUIDs from the pages cache
      var pageUuids = this.pagesUuids[ page ];

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
    newList = newList.map( podcast => this.podcastsData[podcast.uuid] || podcast )
          // Filter out podcasts from other dates
          .filter( filterByDates );

    // Save complete list on finish
    if ( completed ) {
      this.previousListUpdate = newList;
    }

    // See if all podcasts have already been downloaded
    const allCompleted = completed && newList.every( podcast => 'path' in podcast );

    // Trigger update event
    this.onUpdate(newList, allCompleted);

    return newList;
  }

  // Saves the new podcast to the pages cache and fires onPodcastUpdate
  // (pageNumber, podcastNew) => null
  handlePodcastUpdate(pageNumber, podcastNew) {
    try {
      podcastNew.page = pageNumber;

      this.pagesUuids[pageNumber].forEach( (podcast,index) => {
        if ( podcast.uuid === podcastNew.uuid ) {
          this.pagesUuids[pageNumber][index] = podcastNew;
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
        this.pagesUuids[pageNumber] = uuidsPage
          .reverse()
          .map( uuid => ({uuid, page: pageNumber}) );

        return this.pagesUuids[pageNumber];
      });
  }

  // Gets a page with HTML containning a list of podcasts from the server
  // (pageNumber) => Promise(String)
  getPage(pageNumber=0) {

    return fetch(
      this.pageUrl(pageNumber),
      {
        signal: this.controller.signal
      })
      .then( this.handleFetchErrors )

      .then( response => response.text() )
  }

  // Downloads podcast JSON
  // (uuid) => Promise(podcastJSON)
  getPodcastData(uuid) {

    // Return cached version if we've got it
    if ( uuid in this.podcastsData ) {
      // Return podcast as an immediatelly resolved Promise,
      // as it is what's expected
      return new Promise( resolve => resolve(this.podcastsData[uuid]) );
    }

    return fetch(
      this.podcastUrl(uuid),
      { signal: this.controller.signal }
    )
      .then( this.handleFetchErrors )
      .then( data => data.json() )
      .then( podcast => this.parsePodcast(uuid, podcast) )
      .then( podcast => {

        // Save to cache
        this.podcastsData[uuid] = podcast;

        return podcast;
      })
  }

  /****************************
    Virtual/Abstract functions
    Must override on subclass
  */
  pageUrl(pageNumber) {
    console.warn(`Need to subclass 'pageUrl' on ${this.name} backend class`);
    return ''
  }

  parsePage(dataRaw) {
    console.warn(`Need to subclass 'parsePage' on ${this.name} backend class`);
    return {
      uuidsPage: [],
      pages: []
    }
  }

  podcastUrl(uuid) {
    console.warn(`Need to subclass 'podcastUrl' on ${this.name} backend class`);
    return ''
  }

  parsePodcast(uuid, podcast) {
    console.warn(`Need to subclass 'parsePodcast' on ${this.name} backend class`);
    return {
      uuid: '',
      date: new Date(),
      hour: 0,
      minute: 0,
      title: '',
      titleFull: '',
      author: '',
      path: '',
      programUrl: '',
      schedule: '',
      image: '',
    };
  }
}

export default ByDate;

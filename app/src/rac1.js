// Raises exception on response error
function handleFetchErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

// Catches the fetch error, original or 'self-raised'
function catchFetchErrors(error) {
  console.error(error);
}

// Cached/compiled regexps for parsing HTML
const dataAttrsFind  = /.*"(audioteca-item|pagination-link)" (data-[^=]*)="([^"]*)"[ \t>]/g;
const dataAttrsClean = /^.*[ \t](data-[^=]*)="([^"]*)"[ \t>].*$/;

class Rac1 {

  // Cache for UUID => podcast
  _podcastsData = {};

  // Cache for pageNumber => UUIDs
  _pages_uuids = [];

  // Cache for reloads
  _previous_uuids = [];

  constructor(props) {
    const noop = () => {};
    this.date = props.date;
    this.onListUpdate = props.onListUpdate || noop;

    this.updateList();
  }

  setDate(date) {
    if(this.date !== date) {
      this._previous_uuids = [];
    }
    this.date = date;
    this.updateList();
  }

  // Download podcasts UUIDs and then, each podcast data
  updateList(pageNumber=0) {
    if(pageNumber === 0) {
      this._pages_uuids = [];
      this.pages = [0];
      this.handleListUpdate();
    }

    // Get list of UUIDs
    return this.getPodcastsUUIDs(pageNumber)
      // Download podcast data if needed
      .then(this.getPodcasts.bind(this, pageNumber))
      // Trigger event for list updated
      .then(this.handleListUpdate.bind(this, pageNumber));
  }

  getPodcasts(pageNumber, podcasts) {
    return podcasts
      .map(podcast => {
        // If it's a podcast and is not in the cache
        if(podcast.uuid !== '...' && !(podcast.uuid in this._podcastsData)) {
          // Download podcast data and then trigger
          // event when updated
          this.getPodcastData(podcast.uuid)
            .then( this.handlePodcastUpdate.bind(this, pageNumber) )
        }
        return podcast;
      })
  }

  // Creates a list with all known podcast or UUIDs
  // and fires event onListUpdate with that
  // () => null
  handleListUpdate() {
    let newList = [...this._previous_uuids.filter(w => w.uuid !== '...')];
    let completed = true;

    // Create a virtual list of all podcasts correctly ordered
    this.pages.forEach( page => {

      // Get UUIDs from the pages cache
      var pageUuids = this._pages_uuids[ page ];

      // Set temporal UUID for unresolved pages
      if(pageUuids === undefined) {
        newList.push({uuid: '...'});
        completed = false;
      }
      else {
        // Add this page's podcasts to the list
        pageUuids
          // filter out already added podcasts
          .filter( podcastPage => {
            const found = newList.filter(
              podcast => podcast.uuid === podcastPage.uuid );
            return found.length === 0;
          })
          .forEach( podcast => newList.push( podcast ) );
      }
    });

    // Get cached data if available
    newList = newList.map(podcast => this._podcastsData[podcast.uuid] || podcast );

    // Save complete list on finish
    if(completed) {
      this._previous_uuids = newList;
    }

    // See if all podcasts have already been downloaded
    const allCompleted = completed && newList.every(podcast => 'path' in podcast);

    // Trigger update event
    this.onListUpdate(newList, allCompleted);

    return newList;
  }

  // Saves the new podcast to the pages cache and fires onPodcastUpdate
  // (pageNumber, podcastNew) => null
  handlePodcastUpdate(pageNumber, podcastNew) {
    podcastNew.page = pageNumber;
    this._pages_uuids[pageNumber].forEach((podcast,index) => {
      if(podcast.uuid === podcastNew.uuid) {
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
      .then(dataRaw => {

        //console.log({pageNumber, dataRaw});
        const { uuidsPage, pages } = this.parsePage(dataRaw);

        // If it's the first page, call the rest
        if(pageNumber === 0) {

          // Save the list of pages, in reverse order
          // If there are no pages (only one page), create a one element array,
          // with page zero in it's first element
          this.pages = pages.length > 0 ? pages.reverse() : [0];

          // Resolve first the last page, so we have first the first day's UUIDs
          // Don't call again first page
          this.pages.forEach( page => (page !== 0) && this.updateList( page ) );
        }

        this._pages_uuids[pageNumber] = uuidsPage
          .reverse()
          .map(uuid => { return {uuid, page: pageNumber} });

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

    return fetch(
      "https://cors-anywhere.herokuapp.com/" // Anti CORS
      //+ "https://www.rac1.cat/a-la-carta/cerca?"
      + "https://api.audioteca.rac1.cat/a-la-carta/cerca?"
      + `text=&programId=&sectionId=HOUR&from=${date}&to=${date}&pageNumber=${pageNumber}`,
      {
        //mode: 'no-cors',
        credentials: 'omit',
      })
      .then(handleFetchErrors)
      .then(response => response.text())
      .catch(catchFetchErrors)
  }

  // Parses a page raw HTML to obtain audio UUIDs and the list of pages
  // (dataRawHTML) => {uuidsPage: Array(String), pages: Array(Number)}
  parsePage(dataRaw) {
    const searchData = ['data-audio-id','data-audioteca-search-page'];
    const data = (dataRaw
      .match(dataAttrsFind)||[])
      .map(v => v.replace(dataAttrsClean, '$1=$2').split('='))
      .filter(v => searchData.includes(v[0]));

    return {
      uuidsPage: data
        .filter(v => v[0] === 'data-audio-id')
        .map(v => v[1]),
      pages: data
        .filter(v => v[0] === 'data-audioteca-search-page')
        .map(v => Number(v[1])),
    };
  }

  // Downloads podcast JSON
  // (uuid) => Promise(podcastJSON)
  getPodcastData(uuid) {

    // Return cached version if we've got it
    if(uuid in this._podcastsData) {
      // Return podcast as an immediatelly resolved Promise,
      // as it is what's expected
      return new Promise( resolve => resolve(this._podcastsData[uuid]) );
    }

    return fetch(`https://api.audioteca.rac1.cat/piece/audio?id=${uuid}`)
      .then(handleFetchErrors)
      .then(data => data.json())
      .then(podcast => {
        // Add some data to the podcast
        podcast.uuid = uuid;
        podcast.audio.hour = podcast.audio.time.split(':')[0];

        // Save to cache
        this._podcastsData[uuid] = podcast;

        return podcast;
      })
      .catch(catchFetchErrors)
  }

}

export default Rac1;

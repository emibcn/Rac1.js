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

  constructor(props) {
    const noop = () => {};
    this.date = props.date;
    this.onListUpdate = props.onListUpdate || noop;
    this.onPodcastUpdate = props.onPodcastUpdate || noop;

    // Cache for UUID => podcast
    this._podcastsData = {};

    // Cache for pageNumber => UUIDs
    this._pages_uuids = [];

    // Download podcasts UUIDs and then, each podcast data
    this.getPodcastsUUIDs()
      .then(this.getPodcasts.bind(this, 0));
  }

  getPodcasts(pageNumber, podcasts) {
    // Trigger event for list updated
    this.handleListUpdate();

    return podcasts
      .map(podcast => {
        if(podcast.uuid !== '...') {
          this.getPodcastData(podcast.uuid)
            // Trigger event for each podcast when updated
            .then(this.handlePodcastUpdate.bind(this, pageNumber))
        }
        return podcast;
      })
  }

  // Creates a list with all known podcast or UUIDs
  // and fires event onListUpdate with that
  // () => null
  handleListUpdate() {
    let newList = [];

    // Create a virtual list of all podcasts correctly ordered
    this.pages.forEach( page => {

      // Get UUIDs from the pages cache
      var pageUuids = this._pages_uuids[ page ];

      if(pageUuids === undefined) {
        // Set temporal UUID for unresolved pages
        newList.push({uuid: '...'});
      }
      else {
        // Add this page's podcasts to the list
        pageUuids.forEach( podcastPage => {
          // Only add podcast not already added to the list
          const found = newList.filter( podcast => podcast.uuid === podcastPage.uuid );
          if(found.length === 0) {
            newList.push( podcastPage );
          }
        });
      }
    });

    this.onListUpdate(newList);
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
    this.onPodcastUpdate(podcastNew);
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
          this.pages = pages.reverse();

          // Resolve first the last page, so we have first the first day's UUIDs
          for(let page in this.pages) {

            // Don't call again first page
            if(this.pages[page] !== 0) {
              this.getPodcastsUUIDs(this.pages[page])
                .then(this.getPodcasts.bind(this, this.pages[page]));
            }
          }
        }

        this._pages_uuids[pageNumber] = uuidsPage
          .reverse()
          .map(uuid => {return {uuid, page: pageNumber} });

        return this._pages_uuids[pageNumber];
      });
  }

  // Gets a page with HTML containning a list of podcasts from the server
  // (pageNumber) => Promise(String)
  getPage(pageNumber) {
    const date = this.date.toLocaleDateString("es-ES");
    return fetch(
      "https://cors-anywhere.herokuapp.com/" // Anti CORS
      + "https://www.rac1.cat/a-la-carta/cerca?"
      + `text=&programId=&sectionId=HOUR&from=${date}&to=${date}&pageNumber=${pageNumber}&btn-search=`,
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
    const data = dataRaw
      .match(dataAttrsFind)
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
      return new Promise( (resolve) => resolve(this._podcastsData) );
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


function handleFetchErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

function catchFetchErrors(error) {
  console.error(error);
}

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

    // Begin work
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

  handleListUpdate() {
    let newList = [];

    // Create a virtual list of all podcasts ordered correctly
    for(let pageIndex in this.pages) {
      var pageUuids = this._pages_uuids[ this.pages[pageIndex] ];

      if(pageUuids === undefined) {
        // Set temporal UUID for unresolved pages
        newList.push({uuid: '...'});
      }
      else {

        for(let podcastIndex in pageUuids) {
          const podcast = pageUuids[podcastIndex];

          let found = false;
          for(let done in newList) {
            if(newList[done].uuid === podcast.uuid) {
              found = true;
            }
          }
          if(!found) {
            newList.push(podcast);
          }
        }

      }
    }

    this.onListUpdate(newList);
  }

  handlePodcastUpdate(pageNumber, podcastNew) {
    podcastNew.page = pageNumber;
    for( let index in this._pages_uuids[pageNumber] ) {
      if(this._pages_uuids[pageNumber][index].uuid === podcastNew.uuid) {
        this._pages_uuids[pageNumber][index] = podcastNew;
      }
    }
    this.onPodcastUpdate(podcastNew);
  }

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

  getPodcastData(uuid) {
    return fetch(`https://api.audioteca.rac1.cat/piece/audio?id=${uuid}`)
      .then(handleFetchErrors)
      .then(data => data.json())
      .then(podcast => {
        podcast.uuid = uuid;
        podcast.audio.hour = podcast.audio.time.split(':')[0];
        this._podcastsData[uuid] = podcast;
        return podcast;
      })
      .catch(catchFetchErrors)
  }

}

export default Rac1;

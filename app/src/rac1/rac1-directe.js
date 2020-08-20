const baseURL = 'https://api.audioteca.rac1.cat';

class Rac1Live {
  podcastUrl = 'https://streaming.rac1.cat/;*.nsv';

  _podcastData = {};

  // Abort controller
  // Used to stop pending fetches when user changes the date
  controller = new AbortController();

  constructor(props) {
    const noop = () => {};
    this.onUpdate = props.onUpdate || noop;
    this.onError = props.onError || noop;
    this.timer = false;
    this.launchTimer();
  }

  // Abort the abort controller
  abort() {
    if ( this.timer !== false ) {
      clearTimeout( this.timer );
      this.timer = true;
    }
    this.controller.abort();
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

  // Launch a timer to check future updates
  launchTimer(timeout=0) {
    if ( this.timer === false) {
      this.timer = setTimeout( () => {
        this.timer = false;
        this.checkUpdate();
      }, timeout );
    }
  }

  checkUpdate() {
    return fetch(
      `${baseURL}/directe`,
      {
        signal: this.controller.signal,
      })
      .then( this.handleFetchErrors )

      .then( response => response.text() )

      .then( dataRaw => this.parseData(dataRaw) )

      .then( podcast => {
        if ( podcast.programURL !== this._podcastData ) {
          this._podcastData = podcast;
          this.onUpdate( this._podcastData );
          this.launchTimer(5 * 60 * 1000); // Check update in 5 minutes
        }
      })

      .catch( this.catchFetchErrors.bind(this) )
  }

  dataAttrsFind  = /\s(data-ajax-href=|class="(program-header-title-link|program-listed-author|story-image))/;
  dataAttrsClean = /.*\s(src|alt|href|data-ajax-href)="([^"]*)".*/;
  dataTagContent = /<?[^<>]*>([^<]*)<\/[^>]*>/;
  dataTagContents = /\s*<?[^<>]*>(?:amb )?([^<]*?)<\/[^>]*>\s*<?[^<>]*>([^<]*?)<\/[^>]*>/g;
  dataFilenameClean = /^.*[^/.].png$/;

  parseData(dataRaw) {
    const data = dataRaw
        .split('\n')

        // Get only interesting lines
        .filter( line => this.dataAttrsFind.test(line) );

    // Compute data
    const programURL = data
        .find( line => line.includes('program-header-title-link') )
        .replace(this.dataAttrsClean, '$2');
    const title = data
        .filter( line => !line.includes('program-next-link') )
        .find( line => line.includes('data-ajax-href') )
        .replace(this.dataTagContent, '$1');
    const [ author, schedule ] =
      data
        .find( line => line.includes('program-listed-author') )
        .replace(this.dataTagContents, (match, author, schedule) => `${author}\n${schedule}`)
        .split('\n');
    const image = data
        .find( line => line.includes('thumbnail') )
        .replace(this.dataAttrsClean, '$2');

    return {

      // Constant ;)
      path: this.podcastUrl,

      // Get previously computed values
      programURL,
      title,
      author,
      schedule,
      image,
    };
  }
}

export default Rac1Live;

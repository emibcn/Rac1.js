import Common from './Common';

class Live extends Common {

  name = 'Live';
  updateTimeout = 5 * 60 * 1000; // Check update in 5 minutes
  updateUrl = '';
  updateOptions = {};
  podcastData = {};

  // Start the timer to update live podcast info in background
  constructor(props) {
    super(props);
    this.timer = false;
    this.launchTimer();
  }

  // Stop the timer on abort
  abort() {
    if ( this.timer !== false ) {
      clearTimeout( this.timer );
      this.timer = true;
    }
    super.abort();
  }

  // Launch a timer to check updates on live podcast info
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
      this.updateUrl,
      {
        signal: this.controller.signal,
        ...this.updateOptions,
      })
      .then( this.handleFetchErrors )

      .then( response => this.parseResponse(response) )

      .then( dataRaw => this.parseData(dataRaw) )

      .then( podcast => {
        if ( podcast.programURL !== this.podcastData.programURL ) {
          this.podcastData = podcast;
          this.onUpdate( this.podcastData );
          this.launchTimer( this.updateTimeout );
        }
      })

      .catch( this.catchFetchErrors.bind(this) )
  }

  parseResponse = (response) => response.text()

  // Virtual/Abstract function
  // Must override on subclass
  parseData(dataRaw) {
    const [
      path,
      programURL,
      title,
      author,
      schedule,
      image
    ] = ['','','','','',''];

    console.warn(`Need to subclass 'parseData' on ${this.name} backend class`);

    return {
      path,
      programURL,
      title,
      author,
      schedule,
      image,
    };
  }
}

export default Live;

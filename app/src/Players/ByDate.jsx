import React, { Component } from 'react';

import { translate } from 'react-translate';
import MediaQuery from 'react-responsive';

import { Rac1 } from '../Backends';
import Throtle from '../Throtle';

import AudioWrapper from './Base/AudioWrapper';
import Playlist from './Base/Playlist';
import PodcastCover from './Base/PodcastCover';

// 1st date with HOUR podcasts
const minDate = new Date(2015, 5, 1);

class ByDate extends Component {

  getDateFromParams(props) {
    const date = props.match.params;
    return new Date(
        date.year,
        date.month-1,
        date.day,
        date.hour||0,
        date.minute||0,
      )
  }

  constructor(props) {
    super();

    this.history = props.history;

    // Initial state
    this.state = {
      podcasts: [{uuid: '...'}],
      currentUUID: '',
      date: this.getDateFromParams(props),
      maxDate: new Date(),
      completed: false,
      waitingUpdate: false,
      hasError: false,
      error: {},
    };

    // Add keybinding for list updating
    this.extraControls = [
      {
        help: 'Update playlist',
        action: this.handleClickUpdate,
        keys: [ 'r', 'R' ],
      },
    ];

    // Used to throtle list updates
    this.throtle = new Throtle();

    // Debugging on development
    if ( process.env.NODE_ENV === 'development' ) {

      // Log state changes
      this._setState = this.setState;
      this.setState = props => {
        console.log({
          a0_prev: JSON.parse(JSON.stringify(this.state)),
          a1_next: JSON.parse(JSON.stringify(props)),
        });
        this._setState(props);
      };

      // Add a button to remove the last podcast in the list
      this.extraControls.push({
        icon: 'RL',
        text: 'Remove last',
        help: 'Remove last podcast from playlist',
        action: this.handlePodcastsLastRemove,
        group: 'advanced basic',
      });
    }
  }

  // Saves errors from backend into state so they
  // can be reraised into ReactDOM tree and catched correctly
  handleError = (error) => {
    error.message = `Rac1ByDate: ${error.message}`;
    this.setState({
      hasError: true,
      error: error,
    });
  }

  // Handle focus when key handler is active
  controlsKeyHandlerFocus = null; // Updated by React ref at this.refControls()
  keyHandlerFocus = (e) => {
    if ( typeof this.controlsKeyHandlerFocus === 'function' ) {
      return this.controlsKeyHandlerFocus(e)
    }
  }

  componentDidMount() {
    // Register history change event listener
    this.unlisten = this.history.listen( this.handleHistoryChange );

    // Initiate backend library
    this.backend = new Rac1({
      date: this.state.date,
      onUpdate: this.handleListUpdate,
      // Get errors from backend
      onError: this.handleError,
    });
  }

  componentWillUnmount() {
    // Unregister history change event listener
    this.unlisten();

    // Abort backend fetches
    this.backend.abort();

    // Stop throtle mechanism
    this.throtle.clear();
  }

  render() {
    const {
      podcasts,
      completed,
      date,
      maxDate,
      hasError,
      error,
    } = this.state;

    // If we have a backend error, reraise into ReactDOM tree
    if ( hasError ) {
      throw Error(error);
    }

    const dateText = date instanceof Date ?
      `${date.getDate()}/${1 + date.getMonth()}/${date.getFullYear()}`
      : '...';

    // Find current podcast (selected by uuid instead of just position)
    const current = this.findCurrentPodcast();
    const autoplay = current > 0;
    const currentPodcast =
      podcasts !== undefined
        && podcasts.length > current
        && 'path' in podcasts[current]
        ? podcasts[current] : undefined;
    const currentPath =
      currentPodcast !== undefined
        ? currentPodcast.path : '';
    const title =
      !currentPodcast ||
      !currentPodcast.titleFull
        ? dateText
        : currentPodcast.titleFull;

    return (
      <MediaQuery minWidth={ 1024 }>
        { matches => (
          <div style={{
            padding: '.5em',
            display: 'flex',
            alignItems: 'stretch',
            ...( matches ? {
                justifyContent: 'space-evenly',
              } : {
                flexDirection: 'column',
              }
            )
          }}>
            <AudioWrapper
              autoPlay={ autoplay }
              title={ title }
              titleHead={ title }
              path={ currentPath }
              allowFocus={ this.allowFocus }
              onEnded={ this.handlePlayNext }
              onPlayNext={ this.handlePlayNext }
              onPlayPrev={ this.handlePlayPrev }
              extraControls={ this.extraControls }
              volumeAsAdvanced={ true }
              artist={ currentPodcast && currentPodcast.author }
              album={ currentPodcast && currentPodcast.schedule }
              image={ currentPodcast && currentPodcast.image }
            />
            <Playlist
              date={ date }
              minDate={ minDate }
              maxDate={ maxDate }
              completedDownload={ completed }
              podcasts={ podcasts }
              current={ current }
              onClickPodcast={ this.handleClickPodcast }
              onClickUpdate={ this.handleClickUpdate }
              onDateBlur={ this.keyHandlerFocus }
              onDateChange={ this.handleDateChange }
            />
            { currentPodcast !== undefined ? (
                <>
                  <div style={{ width: '.5em', height: '.5em' }} />
                  <PodcastCover
                    image={ currentPodcast.image }
                    programUrl={ currentPodcast.programUrl }
                    title={ currentPodcast.title }
                    author={ currentPodcast.author }
                    schedule={ currentPodcast.schedule }
                  />
                </>
              ) : null }
          </div>
        )}
      </MediaQuery>
    );
  }

  handleHistoryChange = (location, action) => {
    const dateNew = this.getDateFromParams(this.props);
    const { date } = this.state;

    // Do nothing when change is made by us
    if( action !== 'POP' ) {
      return;
    }

    /*
     * Determine action depending on what changed
     */

    // Date changed
    if ( date.getFullYear() !== dateNew.getFullYear() ||
      date.getMonth() !== dateNew.getMonth() ||
      date.getDate() !== dateNew.getDate() ) {
      this.handleDateChange(dateNew);
    }

    // Podcast changed
    else if ( date.getHours() !== dateNew.getHours()  ||
      date.getMinutes() !== dateNew.getMinutes() ) {
      // Save new date to state
      this.setState({
        currentUUID: '',
        dateNew,
      });
      this.selectPodcastByDate(dateNew, false);
    }
  }

  historyPush(date, replace=false) {
    const newPath = `/${date.getFullYear()}/${1 + date.getMonth()}/${date.getDate()}/${date.getHours()}/${date.getMinutes()}`;

    // Only PUSH or REPLACE if something have to change
    if ( this.history.location.pathname !== newPath ) {
      if ( !replace ) {
        this.history.push(newPath + this.history.location.hash);
      }
      else {
        this.history.replace(newPath + this.history.location.hash);
      }
    }
  }

  allowFocus = el => el.className.match( /date-?picker|rc-slider-handle|ReactModal/ )

  handleListUpdate = (podcasts, completed) => {
    // Stop waiting if completed
    const { waitingUpdate, currentUUID, date } = this.state;
    const waitingUpdateNext = waitingUpdate && completed ? false : waitingUpdate;

    // Only update the podcasts lists if start, completed or every 500ms
    this.throtle.run(completed, 1000, () => {
      this.setState({
        podcasts,
        completed,
        waitingUpdate: waitingUpdateNext,
        maxDate: new Date(),
      });
    });

    // If there is no podcast selected on update completed, select one
    if ( completed && currentUUID === '' ) {
      this.selectPodcastByDate(date);
    }

    // Play next podcast if stop waiting, but without retrying download
    if ( waitingUpdate === true && waitingUpdateNext === false ) {
      this.handlePlayNext(false);
    }
  }

  handleDateChange = (date) => {
    if ( date !== this.state.date ) {

      // Save new date to state
      this.setState({
        currentUUID: '',
        date,
      });

      // If it's a valid date, trigger state change
      if ( date !== null ) {
        // Push new date to URL and history
        this.historyPush(date);

        // Abort backend fetches
        this.backend.abort();

        // Stop throtle mechanism
        this.throtle.clear();

        // Call in background to prevent list update's state overwrite
        setTimeout(() => this.backend.setDate(date), 50);
      }
    }
  }

  // Select a podcast from list using date&time argument
  selectPodcastByDate(date) {
    // Find all podcasts matching >= date
    const found = this.state.podcasts.filter( podcast => {
      return podcast.hour >= date.getHours() &&
        (podcast.hour > date.getHours() ||
        podcast.minute >= date.getMinutes())
    });

    // Play first matched podcast
    if ( found.length > 0 ) {
      this.playPodcast(
        this.findPodcastByUUID(found[0].uuid));
    }
  }

  findPodcastByUUID(uuid) {
    const index = this.state.podcasts.findIndex( (podcast) => podcast.uuid === uuid );

    // Return index = 0 (first element in list) if
    // UUID is not found in the podcasts list
    return index !== -1 ? index : 0;
  }

  findCurrentPodcast() {
    return this.findPodcastByUUID( this.state.currentUUID );
  }

  playPodcast(index) {
    const { date, currentUUID } = this.state;
    const podcast = this.state.podcasts[index];

    // Set podcast hour&minute to date in state
    if ( podcast.hour !== date.getHours() ||
      podcast.minute !== date.getMinutes() ) {
      date.setHours( Number(podcast.hour) );
      date.setMinutes( Number(podcast.minute) );
    }

    // Update date in state
    this.setState({
      currentUUID: podcast.uuid,
      date,
    });

    // Force push&replace if current podcast is not set
    const replace = currentUUID === '';
    this.historyPush(date, replace);
  }

  handlePlayPrev = () => {
    const current = this.findCurrentPodcast();
    if ( current > 0 &&
       'path' in this.state.podcasts[current - 1]) {
      this.playPodcast(current - 1);
      return `${this.state.podcasts[current - 1].titleFull}`
    }
  }

  handlePlayNext = (retry=true) => {
    const current = this.findCurrentPodcast();

    // If there is a next podcast and it has path, play it
    if ( current < (this.state.podcasts.length - 1 ) &&
       'path' in this.state.podcasts[current + 1]) {
      this.playPodcast(current + 1);
      return `${this.state.podcasts[current + 1].titleFull}`
    }
    else {
      // If we are called to retry, update list
      if ( retry ) {
        // If we are not already waiting for update,
        // set  and trigger a list update
        if ( !this.state.waitingUpdate ) {
          this.handleClickUpdate();
          this.setState({
            waitingUpdate: true,
          });
          return "Updating podcasts list"
        }
      }
    }
  }

  handleClickPodcast = (uuid, e) => {
    e.stopPropagation();
    e.preventDefault();
    this.playPodcast( this.findPodcastByUUID(uuid) );
  }

  // Updates podcasts list from backend
  handleClickUpdate = () => {

    // If there is not already an incomplete update
    if ( this.state.completed ) {
      this.setState({
        completed: false,
      });

      // Trigger a list update
      return this.backend.updateList();
    }
  }

  // Removes last podcast from list (for testing purposes)
  handlePodcastsLastRemove = () => {
    this.setState({
      podcasts: [...this.state.podcasts].slice(0,-1),
    });
  }
}

export default translate('ByDate')(ByDate);

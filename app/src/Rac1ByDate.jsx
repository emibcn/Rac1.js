import React, { Component } from 'react';

import { translate } from 'react-translate';
import { Helmet } from 'react-helmet';
import ReactAudioPlayer from 'react-audio-player';
import MediaQuery from 'react-responsive';

import Controls from './Controls';
import Playlist from './Playlist';
import PodcastsList from './PodcastsList';
import Podcast from './Podcast';
import PodcastCover from './PodcastCover';
import MediaSession from './MediaSession';

import { Rac1 } from './rac1';
import Throtle from './Throtle';

class Rac1ByDate extends Component {

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
      volume: 1,
      muted: false,
      isPlaying: false,
      completed: false,
      waitingUpdate: false,
      showAdvancedControls: false,
      hasError: false,
      error: {},
    };

    this.extraControls = [
      {
        help: 'Update playlist',
        action: this.handleClickUpdate.bind(this),
        keys: [ 'r', 'R' ],
      },
    ];

    this.throtle = new Throtle();
    this.mediaSessionActions = {
      onPlayPrev: this.playPrev.bind(this),
      onPlayNext: this.playNext.bind(this),
      onSeekBackward: this.seekBackward.bind(this),
      onSeekForward: this.seekForward.bind(this),
    };

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
        action: this.handlePodcastsLastRemove.bind(this),
        group: 'advanced basic',
      });
    }
  }

  // Saves errors from backend into state so they
  // can be reraised into ReactDOM tree and catched correctly
  handleError(error) {
    error.message = `Rac1ByDate: ${error.message}`;
    this.setState({
      hasError: true,
      error: error,
    });
  }

  componentDidMount() {

    // Register history change event listener
    this.unlisten = this.history.listen( this.handleHistoryChange.bind(this) );

    // Initiate backend library
    this.rac1 = new Rac1({
      date: this.state.date,
      onListUpdate: this.handleListUpdate.bind(this),
      // Get errors from backend
      onError: this.handleError.bind(this),
    });
  }

  componentWillUnmount() {
    // Unregister history change event listener
    this.unlisten();

    // Unregister player event listeners
    const player = this.player().current;
    if ( player && player.removeEventListener ) {
      player.removeEventListener('play', this.handlePlayStatusChangeTrue);
      player.removeEventListener('pause', this.handlePlayStatusChangeFalse);
    }

    // Abort backend fetches
    this.rac1.abort();

    // Stop throtle mechanism
    this.throtle.clear();
  }

  render() {
    const {
      podcasts,
      volume,
      muted,
      completed,
      date,
      maxDate,
      isPlaying,
      showAdvancedControls,
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
      currentPodcast !== undefined ?
      ( 'audio' in currentPodcast ?
          currentPodcast.titleFull :
          dateText )
      : dateText;

    const controls = <Controls
          getPlayer={ this.player.bind(this) }
          volume={ volume }
          muted={ muted }
          allowFocus={ el => el.className.match( /date-?picker|rc-slider-handle|ReactModal/ ) }
          onPlayNext={ this.playNext.bind(this) }
          onPlayPrev={ this.playPrev.bind(this) }
          onSetVolume={ volume => this.setState({ volume }) }
          onSetMuted={ muted => this.setState({ muted }) }
          showAdvanced={ showAdvancedControls }
          volumeAsAdvanced={ true }
          onShowAdvancedChange={ show => {
            this.setState({ showAdvancedControls: show });
            return `${show ? 'Show' : 'Hide'} advanced buttons`
          }}
          isPlaying={ isPlaying }
          ref={ el => { if ( el ) { this.keyHandlerFocus = el.keyHandlerFocus } } }
          extraControls={ this.extraControls }
        />;
    const player = <ReactAudioPlayer
          ref={ element => { this._player = element; }}
          style={{ width: '100%' }}
          src={ currentPath }
          autoPlay={ autoplay }
          title={ title }
          controls
          controlsList='nodownload'
          preload={ (autoplay ? 'auto' : 'metadata') }
          onEnded={ this.playNext.bind(this) }
          volume={ volume }
          muted={ muted }
          onPlay={ this.handlePlayStatusChangeTrue }
          onPause={ this.handlePlayStatusChangeFalse }
          onVolumeChanged={ e => this.setState({
            volume: e.currentTarget.volume,
            muted: e.currentTarget.muted,
          }) }
        />;
    const playlist = <Playlist
          date={ date }
          minDate={ new Date(2015, 5, 1) /* 1st date with HOUR podcasts */ }
          maxDate={ maxDate }
          completedDownload={ completed }
          onClickUpdate={ this.handleClickUpdate.bind(this) }
          onDateBlur={ () => this.keyHandlerFocus() }
          onDateChange={ this.handleDateChange.bind(this) }
        >
          <PodcastsList current={ current } >
            { podcasts.map((podcast, index) =>
              <Podcast
                key={ podcast.uuid !== '...' ? podcast.uuid : `..._${index}` }
                { ...podcast }
                onClick={ this.handlePodcastClick.bind(this, index) }
              />
            )}
          </PodcastsList>
        </Playlist>;
    const cover =
      currentPodcast !== undefined ? (
        <PodcastCover
          imageUrl={ currentPodcast.audio.section.program.images.person }
          programUrl={ currentPodcast.audio.section.program.url }
          title={ currentPodcast.title }
          author={ currentPodcast.author }
          schedule={ currentPodcast.audio.section.program.schedule }
        />
      ) : null;

    return (
      <>
        <Helmet>
          <title>{ title }</title>
        </Helmet>
        <MediaSession
           title={ title }
           artist={ currentPodcast === undefined ? undefined : currentPodcast.author }
           album={ currentPodcast === undefined ? undefined : currentPodcast.audio.section.program.schedule }
           image={ currentPodcast === undefined ? undefined : currentPodcast.audio.section.program.images.person }
           { ...this.mediaSessionActions }
        />
        <MediaQuery minWidth={ 1024 }>
          { matches => {
            if ( matches ) {
              return (
                <div style={{
                  padding: '.5em',
                  display: 'flex',
                  alignItems: 'stretch',
                  justifyContent: 'space-evenly',
                }}>
                  <div style={{
                    padding: '1%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                  }}>
                    <h3>{ title }</h3>
                    <div>{ controls }</div>
                    <div style={{ width: '100%' }}>{ player }</div>
                  </div>
                  { playlist }
                  <div style={{ width: '.5em' }} />
                  { cover }
                </div>
              );
            } else {
              return (
                <div style={{
                  padding: '.5em',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                }}>
                  <h3>{ title }</h3>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center'
                  }}>{ controls }</div>
                  { player }
                  <div style={{ height: '.5em' }} />
                  { playlist }
                  <div style={{ height: '.5em' }} />
                  { cover }
                </div>
              );
            }
          }}
        </MediaQuery>
      </>
    );
  }

  handleHistoryChange(location, action) {
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

  handlePlayStatusChange(isPlaying) {
    this.setState({
      isPlaying,
    });
  }

  handlePlayStatusChangeTrue = this.handlePlayStatusChange.bind(this, true);
  handlePlayStatusChangeFalse = this.handlePlayStatusChange.bind(this, false);

  handleListUpdate(podcasts, completed) {
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
      this.playNext(false);
    }
  }

  handleDateChange(date) {
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
        this.rac1.abort();

        // Stop throtle mechanism
        this.throtle.clear();

        // Call in background to prevent list update's state overwrite
        setTimeout(() => this.rac1.setDate(date), 50);
      }
    }
  }

  // Removes last podcast from list
  handlePodcastsLastRemove() {
    this.setState({
      podcasts: [...this.state.podcasts].slice(0,-1),
    });
  }

  // Updates podcasts list from backend
  handleClickUpdate() {

    // If there is not already an incomplete update
    if ( this.state.completed ) {
      this.setState({
        completed: false,
      });

      // Trigger a list update
      return this.rac1.updateList();
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
    let found = 0;
    this.state.podcasts.forEach( (podcast, index) => {
      if ( podcast.uuid === uuid ) {
        found = index
      }
    });

    return found;
  }

  findCurrentPodcast() {
    return this.findPodcastByUUID( this.state.currentUUID );
  }

  playPodcast(index) {
    const { date, currentUUID } = this.state;
    const podcast = this.state.podcasts[index];

    // Force push&replace if it's not exact match with date, and update date in state
    let replace = false;
    if ( podcast.hour !== date.getHours() ||
      podcast.minute !== date.getMinutes() ) {
      date.setHours( Number(podcast.hour) );
      date.setMinutes( Number(podcast.minute) );
    }

    replace = currentUUID === '';
    this.setState({
      currentUUID: podcast.uuid,
      date,
    });
    this.historyPush(date, replace);
  }

  playPrev() {
    const current = this.findCurrentPodcast();
    if ( current > 0 &&
       'path' in this.state.podcasts[current - 1]) {
      this.playPodcast(current - 1);
      return `${this.state.podcasts[current - 1].titleFull}`
    }
  }

  playNext(retry=true) {
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

  seekBackward() {
    this.player().current.currentTime -= 10
  }

  seekForward() {
    this.player().current.currentTime += 10
  }

  player() {
    return this._player.audioEl;
  }

  handlePodcastClick(index, e) {
    e.stopPropagation();
    e.preventDefault();
    this.playPodcast(index);
  }
}

export default translate('Rac1ByDate')(Rac1ByDate);

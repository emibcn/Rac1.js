import React, { Component } from 'react';

import ReactAudioPlayer from 'react-audio-player';

import Controls from './Controls';
import Playlist from './Playlist';
import PodcastsList from './PodcastsList';
import Podcast from './Podcast';

import Rac1 from './rac1';

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

  constructor(props, history) {
    super();

    this.history = props.history;
    this.initialTitle = document.title;

    // Initial state
    this.state = {
      podcasts: [{uuid: '...'}],
      currentUUID: '',
      date: this.getDateFromParams(props),
      maxDate: new Date(),
      volume: 1,
      completed: false,
      waitingUpdate: false,
    };

    this.extraControls = [
      {
        help: 'Reload playlist',
        action: this.handleClickReload.bind(this),
        keys: [ 'r', 'R' ],
      },
    ];

    // Debugging on development
    if(process.env.NODE_ENV === 'development') {

      // Log state changes
      this._setState = this.setState;
      this.setState = (props) => {
        console.log({
          a0_prev: JSON.parse(JSON.stringify(this.state)),
          a1_next: JSON.parse(JSON.stringify(props)),
        });
        this._setState(props);
      }

      // Add a button to remove the last podcast in the list
      this.extraControls.push({
        icon: 'RL',
        text: 'Remove last',
        help: 'Remove last podcast from playlist',
        action: this.handlePodcastsLastRemove.bind(this),
      });
    }
  }

  componentWillMount() {

    // Register history change event listener
    this.unlisten = this.history.listen(this.handleHistoryChange.bind(this))

    // Initiate backend library
    this.rac1 = new Rac1({
      date: this.state.date,
      onListUpdate: this.handleListUpdate.bind(this),
    });
  }

  componentWillUnmount() {
    // Unregister history change event listener
    this.unlisten();

    // Abort backend fetches
    this.rac1.abort();

    // Reset initial title
    document.title = this.initialTitle;
  }

  render() {
    const { podcasts, volume, completed, date, maxDate } = this.state;
    const dateText = date instanceof Date ?
      `${date.getDate()}/${1 + date.getMonth()}/${date.getFullYear()}`
      : '...';

    // Find current podcast (selected by uuid instead of just position)
    const current = this.findCurrentPodcast();
    const autoplay = current > 0;
    const currentPath =
      podcasts !== undefined
        && podcasts.length > current
        && 'path' in podcasts[current]
        ? podcasts[current].path : '';
    const title = podcasts !== undefined && podcasts.length > 0 ?
      ( 'audio' in podcasts[current] ?
          `${podcasts[current].titleFull}` :
          dateText )
      : dateText;

    return (
      <React.Fragment>
        <h3>{ title }</h3>
        <Controls
          getPlayer={ this.player.bind(this) }
          volume={ volume }
          allowFocus={ (el) => el.className.match( /date-?picker/ ) }
          onPlayNext={ this.playNext.bind(this) }
          onPlayPrev={ this.playPrev.bind(this) }
          onSetVolume={ (v) => this.setState({ ...this.state, volume: v }) }
          ref={ (el) => { if(el) { this.keyHandlerFocus = el.keyHandlerFocus } } }
          extraControls={ this.extraControls }
        />
        <ReactAudioPlayer
          ref={(element) => { this._player = element; }}
          style={{ width: '100%' }}
          src={ currentPath }
          autoPlay={ autoplay }
          controls
          controlsList='nodownload'
          preload={ (autoplay ? 'auto' : 'metadata') }
          onEnded={ this.playNext.bind(this) }
          volume={ volume }
        />
        <Playlist
          date={ date }
          minDate={ new Date(2015, 5, 1) /* 1st date with HOUR podcasts */ }
          maxDate={ maxDate }
          completedDownload={ completed }
          onClickReload={ this.handleClickReload.bind(this) }
          onDateBlur={ () => this.keyHandlerFocus() }
          onDateChange={ this.handleDateChange.bind(this) }
        >
          <PodcastsList
            current={ current }
          >
          { podcasts.map((podcast, index) =>
            <Podcast
              key={ podcast.uuid !== '...' ? podcast.uuid : `..._${index}` }
              { ...podcast }
              onClick={ this.handlePodcastClick.bind(this, index) }
            />
          )}
          </PodcastsList>
        </Playlist>
      </React.Fragment>
    );
  }

  handleHistoryChange(location, action) {
    const dateNew = this.getDateFromParams(this.props);
    const { date } = this.state;

    // Do nothing when change is made by us
    if(action !== 'POP') {
      return;
    }

    /*
     * Determine action depending on what changed
     */

    // Date changed
    if(date.getFullYear() !== dateNew.getFullYear() ||
      date.getMonth() !== dateNew.getMonth() ||
      date.getDate() !== dateNew.getDate() ) {
      this.handleDateChange(dateNew);
    }

    // Podcast changed
    else if( date.getHours() !== dateNew.getHours()  ||
      date.getMinutes() !== dateNew.getMinutes() ) {
      // Save new date to state
      this.setState({
        ...this.state,
        currentUUID: '',
        dateNew,
      });
      this.selectPodcastByDate(dateNew, false);
    }
  }

  historyPush(date, replace=false) {
    const newPath = `/${date.getFullYear()}/${1 + date.getMonth()}/${date.getDate()}/${date.getHours()}/${date.getMinutes()}`;

    // Only PUSH or REPLACE if something have to change
    if(this.history.location.pathname !== newPath) {
      if(!replace) {
        this.history.push(newPath);
      }
      else {
        this.history.replace(newPath);
      }
    }
  }

  handleListUpdate(newList, completed) {
    // Stop waiting if completed
    const { waitingUpdate, currentUUID, date } = this.state;
    const waitingUpdateNext = waitingUpdate && completed ? false : waitingUpdate;

    this.setState({
      ...this.state,
      podcasts: newList,
      completed,
      waitingUpdate: waitingUpdateNext,
      maxDate: new Date(),
    });

    // If there is no podcast selected on update completed, select one
    if(completed && currentUUID === '') {
      this.selectPodcastByDate(date);
    }

    // Play next podcast if stop waiting, but without retrying download
    if(waitingUpdate === true && waitingUpdateNext === false) {
      this.playNext(false);
    }
  }

  handleDateChange(date) {
    if(date !== this.state.date) {

      // Save new date to state
      this.setState({
        ...this.state,
        currentUUID: '',
        date,
      });

      // If it's a valid date, trigger state change
      if(date !== null) {
        // Push new date to URL and history
        this.historyPush(date);

        // Call in background to prevent list update's state overwrite
        setTimeout(() => this.rac1.setDate(date), 50);
      }
    }
  }

  // Removes last podcast from list
  handlePodcastsLastRemove() {
    this.setState({
      ...this.state,
      podcasts: [...this.state.podcasts].slice(0,-1),
    });
  }

  // Updates podcasts list from backend
  handleClickReload() {

    // If there is not already an incomplete update
    if(this.state.completed) {
      this.setState({
        ...this.state,
        completed: false,
      });

      // Trigger a list update
      return this.rac1.updateList();
    }
  }

  // Select a podcast from list using date&time argument
  selectPodcastByDate(date) {
    // Find all podcasts matching >= date
    const found = this.state.podcasts.filter(podcast => {
      return podcast.hour >= date.getHours() &&
        (podcast.hour > date.getHours() ||
        podcast.minute >= date.getMinutes())
    });

    // Play first matched podcast
    if(found.length > 0) {
      this.playPodcast(
        this.findPodcastByUUID(found[0].uuid));
    }
  }

  findPodcastByUUID(uuid) {
    let found = 0;
    this.state.podcasts.forEach((podcast, index) => {
      if(podcast.uuid === uuid) {
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
    if(podcast.hour !== date.getHours() ||
      podcast.minute !== date.getMinutes()) {
      date.setHours(Number(podcast.hour));
      date.setMinutes(Number(podcast.minute));
    }

    replace = currentUUID === '';
    document.title = `${this.initialTitle}: ${podcast.titleFull}`;
    this.setState({
      ...this.state,
      currentUUID: podcast.uuid,
      date,
    });
    this.historyPush(date, replace);
  }

  playPrev() {
    const current = this.findCurrentPodcast();
    if(current > 0) {
      this.playPodcast(current - 1);
    }
  }

  playNext(retry=true) {
    const current = this.findCurrentPodcast();

    // If there is a next podcast and it has path, play it
    if(current < (this.state.podcasts.length - 1) &&
       'path' in this.state.podcasts[current]) {
      this.playPodcast(current + 1);
    }
    else {
      // If we are called to retry, update list
      if(retry) {
        // If we are not already waiting for update,
        // set  and trigger a list update
        if(!this.state.waitingUpdate) {
          this.handleClickReload();
          this.setState({
            ...this.state,
            waitingUpdate: true,
          });
        }
      }
    }
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

export default Rac1ByDate;
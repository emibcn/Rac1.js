import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import ReactAudioPlayer from 'react-audio-player';

import Controls from './Controls';
import Playlist from './Playlist';
import PodcastsList from './PodcastsList';
import Podcast from './Podcast';

import Rac1 from './rac1';
import './App.css';

class Rac1Player extends Component {
  constructor(props, history) {
    super();

    console.log(process);
    this.history = props.history;

    // Initial state
    const date = props.match.params;
    this.state = {
      podcasts: [{uuid: '...'}],
      currentUUID: '',
      date: new Date(
        date.year,
        date.month-1,
        date.day,
        date.hour,
        date.minute,
      ),
      volume: 1,
      completed: false,
      waitingUpdate: false,
    };

    // Debugging on development
    if(process.env.NODE_ENV === "development") {
      // Log state changes
      this._setState = this.setState;
      this.setState = (props) => {
        console.log({
          a0_prev: JSON.parse(JSON.stringify(this.state)),
          a1_next: JSON.parse(JSON.stringify(props)),
        });
        this._setState(props);
      }
    }
  }

  componentWillMount() {
    this.rac1 = new Rac1({
      date: this.state.date,
      onListUpdate: this.handleListUpdate.bind(this),
    });
  }

  render() {
    const { podcasts, volume, completed, date } = this.state;
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

    return (
      <div className="App">
        <header className="App-header">
          <h3>
          { podcasts !== undefined && podcasts.length > 0 ?
                ( 'audio' in podcasts[current] ?
                    `${podcasts[current].appTabletTitle}` :
                    dateText )
              : dateText
          }
          </h3>
          <Controls
            getPlayer={ this.player.bind(this) }
            volume={ volume }
            allowFocus={ (el) => el.className.match(/date-?picker/) }
            onPlayNext={ this.playNext.bind(this) }
            onPlayPrev={ this.playPrev.bind(this) }
            onSetVolume={ (v) => this.setState({ ...this.state, volume: v }) }
            onPodcastsLastRemove={ this.handlePodcastsLastRemove.bind(this) }
            ref={ (el) => { if(el) { this.keyHandlerFocus = el.keyHandlerFocus } } }
          />
          <ReactAudioPlayer
            ref={(element) => { this._player = element; }}
            style={{ width: '100%' }}
            src={ currentPath }
            autoPlay={ autoplay }
            controls
            preload={ (autoplay ? "auto" : "metadata") }
            onEnded={ this.playNext.bind(this) }
            volume={ volume }
          />
          <Playlist
            date={ date }
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
        </header>
      </div>
    );
  }

  historyPush(date) {
    if(date === undefined) {
      date = this.state.date;
    }
    this.history.push(`/${date.getFullYear()}/${1 + date.getMonth()}/${date.getDate()}/${date.getHours()}/${date.getMinutes()}`);
  }

  handleListUpdate(newList, completed) {
    // Stop waiting if completed
    const { waitingUpdate, currentUUID } = this.state;
    const waitingUpdateNext = waitingUpdate && completed ? false : waitingUpdate;

    this.setState({
      ...this.state,
      podcasts: newList,
      completed,
      waitingUpdate: waitingUpdateNext,
    });

    if(completed && currentUUID === '') {
      this.selectPodcastByDate();
    }

    // Play next podcast if stop waiting, but without retrying download
    if(waitingUpdate === true && waitingUpdateNext === false) {
      this.playNext(false);
    }
  }

  handleDateChange(date) {
    if(date !== this.state.date) {
      this.setState({
        ...this.state,
        currentUUID: '',
        date,
      });
      if(date !== null) {
        this.historyPush(date);

        // Call in background to prevent list update's state overwrite
        setTimeout(() => this.rac1.setDate(date), 50);
      }
    }
  }

  handlePodcastsLastRemove() {
    this.setState({
      ...this.state,
      podcasts: [...this.state.podcasts].slice(0,-1),
    });
  }

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

  selectPodcastByDate() {
    const { date } = this.state;
    const found = this.state.podcasts.filter(podcast => {
      return podcast.audio.hour >= date.getHours() &&
        podcast.audio.minute >= date.getMinutes()
      });
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
    const { date } = this.state;
    date.setHours(Number(this.state.podcasts[index].audio.hour));
    date.setMinutes(Number(this.state.podcasts[index].audio.minute));
    this.setState({
      ...this.state,
      currentUUID: this.state.podcasts[index].uuid,
      date,
    });
    this.historyPush();
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

class App extends Component {
  render() {
    const date = new Date();

    const todayStr = `/${date.getFullYear()}/${1 + date.getMonth()}/${date.getDate()}/0/0`;

    return (
      <Router>
        <Switch>
          <Route
            path="/:year/:month/:day/:hour/:minute"
            render={props => <Rac1Player { ...props } /> } />
          <Redirect to={{ pathname: todayStr }} />
        </Switch>
      </Router>
    )
  }
}

export default App;

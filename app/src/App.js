import React, { Component } from 'react';
import ReactAudioPlayer from 'react-audio-player';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEject,
  faForward,
  faFastForward,
  faSyncAlt as faRefresh,
} from '@fortawesome/free-solid-svg-icons'


import Rac1 from './rac1';
import './App.css';

class App extends Component {
  constructor(props) {
    super();

    // Initial state
    this.state = {
      podcasts: [{uuid: '...'}],
      currentUUID: '',
      date: new Date(), // Today
      volume: 1,
      completed: false,
      waitingUpdate: false,
      controls: [],
    };

    // Controls definitions
    this.controls = [
      {
        icon: <FontAwesomeIcon icon={faFastForward} flip="horizontal" />,
        text: 'Prev',
        action: this.playPrev,
      },
      {
        icon: (
          <span>
            <FontAwesomeIcon icon={faForward} flip="horizontal" />
            <FontAwesomeIcon icon={faForward} flip="horizontal" />
          </span>
        ),
        text: '-10m',
        action: () => this.player().currentTime -= 600,
      },
      {
        icon: (
          <span>
            <FontAwesomeIcon icon={faForward} flip="horizontal" style={{ position: 'relative', left: '.25em' }} />
            <FontAwesomeIcon icon={faForward} flip="horizontal" style={{ position: 'relative', left: '-.25em' }} />
          </span>
        ),
        text: '-60s',
        action: () => this.player().currentTime -= 60,
      },
      {
        icon: <FontAwesomeIcon icon={faForward} flip="horizontal" />,
        text: '-10s',
        action: () => this.player().currentTime -= 10,
      },
      {
        icon: <FontAwesomeIcon icon={faEject} rotation={90} />,
        text: 'Play/Pause',
        action: () => this.player().paused ? this.player().play() : this.player().pause(),
      },
      {
        icon: <FontAwesomeIcon icon={faForward} />,
        text: '+10s',
        action: () => this.player().currentTime += 10,
      },
      {
        icon: (
          <span>
            <FontAwesomeIcon icon={faForward} style={{ position: 'relative', left: '.25em' }} />
            <FontAwesomeIcon icon={faForward} style={{ position: 'relative', left: '-.25em' }} />
          </span>
        ),
        text: '+60s',
        action: () => this.player().currentTime += 60,
      },
      {
        icon: (
          <span>
            <FontAwesomeIcon icon={faForward} />
            <FontAwesomeIcon icon={faForward} />
          </span>
        ),
        text: '+10m',
        action: () => this.player().currentTime += 600,
      },
      {
        icon: <FontAwesomeIcon icon={faFastForward} />,
        text: 'Next',
        action: this.playNext,
      },
    ];

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

      // Add a button to remove the last podcast in the list
      this.controls.push({
          icon: 'RL',
          text: 'Remove last',
          action: () => this.setState({
            ...this.state,
            podcasts: [...this.state.podcasts.slice(0,-1)],
          }),
        });
    }

    // Disable key handler on mobile devices
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      this.keyHandlerFocus = () => {};
    }
    else {
      this.keyHandlerFocus = () => this._keyHandler.focus();
    }
  }

  componentDidMount() {
    this.keyHandlerFocus();
    this.rac1 = new Rac1({
      date: this.state.date,
      onListUpdate: this.handleListUpdate.bind(this),
    });
    this.setState({
      ...this.state,
      controls: this.controls,
    });
  }

  render() {
    const { podcasts, volume, completed } = this.state;

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
          { podcasts !== undefined && podcasts.length > 0 ?
              (
                <h3>{ 'audio' in podcasts[current] ?
                    podcasts[current].audio.title :
                    podcasts[current].uuid
                }</h3>
              ) : null
          }
          <input
            name="player-key-handler"
            style={{
              width: '0px',
              height: '0px',
              border: 0,
              margin: 0,
              padding: 0,
              position: 'absolute'
            }}
            ref={(element) => { this._keyHandler = element; }}
            onKeyUp={ this.handleKey.bind(this) }
            onBlur={ this.keyHandlerFocus.bind(this) }
          />
          <div>
            { this.state.controls.map((control, index) => {
              return (
                <button
                  key={ index }
                  onClick={ control.action.bind(this) }
                  style={{
                    borderRadius: "1em",
                    padding: "1em",
                    margin: "1em",
                  }}
                >
                  <div style={{
                    fontSize: 'calc(1em + 2.5vmin)',
                    fontWeight: 'bold',
                    minWidth: '1.5em',
                  }} >
                    { control.icon instanceof Function ? control.icon() : control.icon }
                  </div>
                  <span style={{ fontSize: 'calc(8px + 1vmin)', color: '#777' }}>
                    { control.text instanceof Function ? control.text() : control.text }
                  </span>
                </button>
              )
            })}
          </div>
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
          <div
            style={{
              color: "#777",
              backgroundColor: "white",
              padding: "2em",
              borderRadius: "1em",
              margin: "1em",
              textAlign: "left",
              position: "relative",
            }}>
            { podcasts.length === 1 && podcasts[0].uuid === '...' ? null :
              <button
                onClick={ this.handleClickReload.bind(this) }
                disabled={ !completed }
                style={{
                  borderRadius: ".5em",
                  padding: ".25em",
                  margin: "1.5em",
                  position: "absolute",
                  top: 0,
                  right: 0,
                }}
              >
                <div style={{
                  fontSize: 'calc(.5em + 2vmin)',
                  fontWeight: 'bold',
                  marginBottom: '-.25em'
                }}>
                  <FontAwesomeIcon icon={faRefresh} />
                </div>
                <span style={{ fontSize: 'calc(5px + 1vmin)', color: '#777' }}>
                  Reload
                </span>
              </button>
            }
            { podcasts !== undefined && podcasts.length > 0 ?
              (
                <ul style={{ listStyleType: "none", marginLeft: 0, paddingLeft: 0 }}>
                  { podcasts.map((podcast, index) =>
                    <li key={ podcast.uuid } style={{ position: "relative", marginLeft: "1em" }}>
                      { index === current && 'path' in podcast ? (
                        <span style={{ position: "absolute", left: "-1em" }}>⯈</span>
                      ) : null
                      }
                      { !('path' in podcast) ?
                          (
                            <span>{ podcast.uuid }</span>
                          ) :
                          (
                            <a
                              href={ podcast.path }
                              onClick={ this.handleClickPodcast.bind(this, index) }
                              style={{ textDecoration: "none" }}
                            >
                              { podcast.audio.hour }h: { podcast.audio.title }
                            </a>
                          )
                      }
                    </li>
                  )}
                </ul>
              ) : null
            }
          </div>
        </header>
      </div>
    );
  }

  handleListUpdate(newList, completed) {
    // Stop waiting if completed
    const { waitingUpdate } = this.state;
    const waitingUpdateNext = waitingUpdate && completed ? false : waitingUpdate;

    this.setState({
      ...this.state,
      podcasts: newList,
      completed,
      waitingUpdate: waitingUpdateNext,
    });

    // Play next podcast if stop waiting, but without retrying download
    if(waitingUpdate === true && waitingUpdateNext === false) {
      this.playNext(false);
    }
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
    this.setState({
      ...this.state,
      currentUUID: this.state.podcasts[index].uuid,
    });
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

  handleClickPodcast(index, e) {
    e.stopPropagation();
    e.preventDefault();
    this.playPodcast(index);
  }

  setVolume(volume) {
    this.player().volume = volume;
    this.setState({
      ...this.state,
      volume: volume,
    });
  }

  incrementVolume(increment) {
    const { volume } = this.state;
    let volumeNew = volume;

    // Increment
    if(increment > 0 && volume < 1) {
      volumeNew = volume <= (1 - increment) ? volume + increment : 1;
    }

    // Decrement
    if(increment < 0 && volume > 0) {
      volumeNew = volume >= (-increment) ? volume + increment : 0;
    }

    if(volumeNew !== volume) {
      this.setVolume(volumeNew);
    }
  }

  handleKey(e) {
    let stopPropagation = true;
    switch(e.key) {
      case 'Enter':
        this.playNext();
        break;
      case ' ':
      case 'p':
      case 'P':
        this.player().paused ? this.player().play() : this.player().pause();
        break;
      case 'ArrowLeft':
        this.player().currentTime -= 10;
        break;
      case 'ArrowRight':
        this.player().currentTime += 10;
        break;
      case 'ArrowUp':
        if(e.shiftKey) {
          this.incrementVolume(.05);
        }
        else {
          this.player().currentTime -= 60;
        }
        break;
      case 'ArrowDown':
        if(e.shiftKey) {
          this.incrementVolume(-.05);
        }
        else {
          this.player().currentTime += 60;
        }
        break;
      case 'PageUp':
        this.player().currentTime -= 600;
        break;
      case 'PageDown':
        this.player().currentTime += 600;
        break;
      case '*':
        this.incrementVolume(.05);
        break;
      case '/':
        this.incrementVolume(-.05);
        break;
      case 'm':
      case 'M':
        this.player().muted = !this.player().muted;
        break;
      case 'r':
      case 'R':
        this.handleClickReload();
        break;
      default:
        stopPropagation = false;
        break;
    }

    if(stopPropagation) {
      e.stopPropagation();
      e.preventDefault();
    }
  }
}

export default App;

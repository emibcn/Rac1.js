import React, { Component } from 'react';
import ReactAudioPlayer from 'react-audio-player';
import Rac1 from './rac1';
import './App.css';

class App extends Component {
  constructor(props) {
    super();
    this.state = {
      podcasts: [
      ],
      current: 0,
      date: new Date(), // Today
      volume: 1,
      controls: [],
    };

    this.controls = [
      {
        icon: '⏮',
        text: 'Prev',
        action: this.playPrev,
      },
      {
        icon: <span style={{ letterSpacing: -10, paddingRight: 11 }}>⯇⯇⯇</span>,
        text: '-10m',
        action: () => this.player().currentTime -= 600,
      },
      {
        icon: <span style={{ letterSpacing: -10, paddingRight: 11 }}>⯇⯇</span>,
        text: '-60s',
        action: () => this.player().currentTime -= 60,
      },
      {
        icon: '⯇',
        text: '-10s',
        action: () => this.player().currentTime -= 10,
      },
      {
        icon: '▮▶',
        text: 'Play/Pause',
        action: () => this.player().paused ? this.player().play() : this.player().pause(),
      },
      {
        icon: '⯈',
        text: '+10s',
        action: () => this.player().currentTime += 10,
      },
      {
        icon: <span style={{ letterSpacing: -10, paddingRight: 11 }}>⯈⯈</span>,
        text: '+60s',
        action: () => this.player().currentTime += 60,
      },
      {
        icon: <span style={{ letterSpacing: -10, paddingRight: 11 }}>⯈⯈⯈</span>,
        text: '+10m',
        action: () => this.player().currentTime += 600,
      },
      {
        icon: '⏭',
        text: 'Next',
        action: this.playNext,
      },
    ];
  }

  componentDidMount() {
    this.keyHandlerFocus();
    this.rac1 = new Rac1({
      date: this.state.date,
      onListUpdate: this.handleListUpdate.bind(this),
      onPodcastUpdate: this.handlePodcastUpdate.bind(this),
    });
    this.setState({
      ...this.state,
      controls: this.controls,
    });
  }

  render() {
    const { podcasts, current, volume } = this.state;
    const autoplay = current > 0;

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
                  <div style={{ fontSize: 30, fontWeight: 'bold', width: '2em' }}>
                    { control.icon instanceof Function ? control.icon() : control.icon }
                  </div>
                  <span style={{ fontSize: 9, color: '#777' }}>
                    { control.text instanceof Function ? control.text() : control.text }
                  </span>
                </button>
              )
            })}
          </div>
          <ReactAudioPlayer
            ref={(element) => { this._player = element; }}
            style={{ width: '100%' }}
            src={ podcasts !== undefined && podcasts.length > current && 'path' in podcasts[current] ? podcasts[current].path : '' }
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
            }}>
            { podcasts !== undefined && podcasts.length > 0 ?
              (
                <ul style={{ listStyleType: "none", marginLeft: 0, paddingLeft: 0 }}>
                  { podcasts.map((podcast, index) =>
                    <li key={ podcast.uuid } style={{ position: "relative", marginLeft: "1em" }}>
                      { index !== current ? null :
                        <span style={{ position: "absolute", left: "-1em" }}>⯈</span>
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

  keyHandlerFocus() {
    this._keyHandler.focus();
  }

  handleListUpdate(newList) {
    console.log({newList});
    this.setState({
      ...this.state,
      podcasts: newList
    });
  }

  handlePodcastUpdate(podcastNew) {
    let newList = this.state.podcasts;

    console.log({podcastNew});

    for(let index in this.state.podcasts) {
      const podcast = this.state.podcasts[index];
      if(podcastNew.uuid === podcast.uuid) {
        newList = [ ...newList ];
        newList[index] = podcastNew;
      }
    }
    this.setState({
      ...this.state,
      podcasts: newList
    });
  }

  playPodcast(index) {
    this.setState({
      ...this.state,
      current: index,
    });
  }

  playPrev() {
    if(this.state.current > 0) {
      this.playPodcast(this.state.current - 1);
    }
  }

  playNext() {
    if(this.state.current < (this.state.podcasts.length - 1)) {
      this.playPodcast(this.state.current + 1);
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

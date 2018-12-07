import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEject,
  faForward,
  faFastForward,
} from '@fortawesome/free-solid-svg-icons'

class Controls extends Component {
  constructor(props) {
    super();

    // Initial state
    this.state = {
      controls: [],
    };

    // Controls definitions
    this.controls = [
      {
        icon: <FontAwesomeIcon icon={faFastForward} flip="horizontal" />,
        text: 'Prev',
        action: () => this.props.onPlayPrev(),
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
            <FontAwesomeIcon
              icon={faForward}
              flip="horizontal"
              style={{ position: 'relative', left: '.25em' }} />
            <FontAwesomeIcon
              icon={faForward}
              flip="horizontal"
              style={{ position: 'relative', left: '-.25em' }} />
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
            <FontAwesomeIcon
              icon={faForward}
              style={{ position: 'relative', left: '.25em' }} />
            <FontAwesomeIcon
              icon={faForward}
              style={{ position: 'relative', left: '-.25em' }} />
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
        action: () => this.props.onPlayNext(),
      },
    ];

    // Debugging on development
    if(process.env.NODE_ENV === "development") {
      // Add a button to remove the last podcast in the list
      this.controls.push({
          icon: 'RL',
          text: 'Remove last',
          action: () => this.props.onPodcastsLastRemove(),
        });
    }
  }

  keyHandlerFocus = () => {};

  componentDidMount() {
    this.keyHandlerFocus();
    this.setState({
      ...this.state,
      controls: this.controls,
    });

    // Disable key handler on mobile devices
    if (!(/Mobi|Android/i.test(navigator.userAgent))) {
      this.keyHandlerFocus = (e) => {
        let doFocus = true;

        // Allow datepicker to get focus
        if(e && e.relatedTarget &&
          this.props.allowFocus(e.relatedTarget)) {
          doFocus = false;
        }

        if(doFocus) {
          setTimeout(() => this._keyHandler.focus(), 100);
        }
      };
    }
  }

  player = () => this.props.getPlayer();

  render() {
    const { controls } = this.state;

    return (
      <div onFocus={ (e) => this.keyHandlerFocus(e) } >
        { controls.map((control, index) => {
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
      </div>
    );
  }

  setVolume(volume) {
    this.player().volume = volume;
    this.props.onSetVolume(volume);
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
        this.props.onPlayNext();
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

Controls.defaultProps = {
  onSetVolume:          (e) => {},
  onPodcastsLastRemove: (e) => {},
  onPlayPrev:           (e) => {},
  onPlayNext:           (e) => {},
};

Controls.propTypes = {
  getPlayer: PropTypes.func.isRequired,
  volume: PropTypes.number.isRequired,
  allowFocus: PropTypes.func.isRequired,
  onSetVolume: PropTypes.func.isRequired,
  onPodcastsLastRemove: PropTypes.func.isRequired,
  onPlayPrev: PropTypes.func.isRequired,
  onPlayNext: PropTypes.func.isRequired,
};

export default Controls;


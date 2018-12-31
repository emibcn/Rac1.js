import React from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faEject,
  faForward,
  faFastForward,
} from '@fortawesome/free-solid-svg-icons'

class Controls extends React.PureComponent {

  // Controls definitions
  controls = [
    {
      icon: <FontAwesomeIcon icon={ faFastForward } flip="horizontal" />,
      text: 'Prev',
      help: 'Play previous podcast',
      action: () => this.props.onPlayPrev(),
    },
    {
      icon: (
        <span>
          <FontAwesomeIcon icon={ faForward } flip="horizontal" />
          <FontAwesomeIcon icon={ faForward } flip="horizontal" />
        </span>
      ),
      text: '-10m',
      help: 'Go backwards 10 minutes',
      action: () => this.player().currentTime -= 600,
      keys: [ 'PageUp' ],
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
      help: 'Go backwards 1 minute',
      action: () => this.player().currentTime -= 60,
      keys: [ 'ArrowUp' ],
    },
    {
      icon: <FontAwesomeIcon icon={ faForward } flip="horizontal" />,
      text: '-10s',
      help: 'Go backwards 10 seconds',
      action: () => this.player().currentTime -= 10,
      keys: [ 'ArrowLeft' ],
    },
    {
      icon: <FontAwesomeIcon icon={ faEject } rotation={90} />,
      text: 'Play/Pause',
      help: 'Toggle Play/Pause',
      action: () => this.player().paused ? this.player().play() : this.player().pause(),
      keys: [ ' ', 'p', 'P' ],
    },
    {
      icon: <FontAwesomeIcon icon={ faForward } />,
      text: '+10s',
      help: 'Go forward 10 seconds',
      action: () => this.player().currentTime += 10,
      keys: [ 'ArrowRight' ],
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
      help: 'Go forward 1 minute',
      action: () => this.player().currentTime += 60,
      keys: [ 'ArrowDown' ],
    },
    {
      icon: (
        <span>
          <FontAwesomeIcon icon={ faForward } />
          <FontAwesomeIcon icon={ faForward } />
        </span>
      ),
      text: '+10m',
      help: 'Go forward 10 minutes',
      action: () => this.player().currentTime += 600,
      keys: [ 'PageDown' ],
    },
    {
      icon: <FontAwesomeIcon icon={ faFastForward } />,
      text: 'Next',
      help: 'Play next podcast',
      action: () => this.props.onPlayNext(),
      keys: [ 'Enter' ],
    },
    {
      help: 'Decrement volume 5%',
      action: () => this.incrementVolume(-.05),
      keys: [
        '/',
        {key: 'ArrowDown', shiftKey: true}
      ],
    },
    {
      help: 'Increment volume 5%',
      action: () => this.incrementVolume(.05),
      keys: [
        '*',
        {key: 'ArrowUp', shiftKey: true}
      ],
    },
    {
      help: 'Toggle mute status',
      action: () => this.player().muted = !this.player().muted,
      keys: [ 'm', 'M' ],
    },
  ];

  constructor(props) {
    super();

    // Add extra controls
    if ( props.extraControls.length ) {
      this.controls = this.controls.concat( props.extraControls );
    }
  }

  keyHandlerFocus = () => {};
  _keyHandlerFocus = (e, force) => {
    let doFocus = true;

    // Allow datepicker to get focus
    if ( e && e.relatedTarget &&
          this.props.allowFocus( e.relatedTarget ) ) {
      doFocus = false;
    }

    if ( doFocus || force ) {
      this.timer = setTimeout(() => this._keyHandler.focus(), 100);
    }
  };

  componentDidMount() {
    // Disable key handler on mobile devices (enable on the rest)
    if ( !(/Mobi|Android/i.test(navigator.userAgent)) ) {
       this.keyHandlerFocus = this._keyHandlerFocus;
       this.keyHandlerFocus();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  render() {
    return (
      <div>
        { this.controls
            .filter( control => 'icon' in control && 'text' in control)
            .filter( control => !this.props.hideButtons.includes(control.text) )
            .map( (control, index) => {
          return (
            <button
              key={ index }
              onClick={ control.action.bind(this) }
              onMouseUp={ e => this.keyHandlerFocus(e, true) }
              aria-label={ control.help }
              title={ control.help }
              className='rac1-controls-button'
              style={{
                borderRadius: '1em',
                padding: '1em',
                margin: '1em',
              }}
            >
              <div style={{
                fontSize: 'calc(1em + 2.5vmin)',
                fontWeight: 'bold',
                minWidth: '1.5em',
              }} >
                { control.icon instanceof Function ? control.icon() : control.icon }
              </div>
              <span style={{
                fontSize: 'calc(8px + 1vmin)',
                color: '#333'
              }}>
                { control.text instanceof Function ? control.text() : control.text }
              </span>
            </button>
          )
        })}
        <input
          name='player-key-handler'
          style={{ // Almost invisible ;)
            width: '1px',
            height: '1px',
            border: 0,
            margin: 0,
            padding: 0,
            bottom: 0,
            right: 0,
            position: 'fixed',
            backgroundColor: 'transparent',
            color: 'transparent',
            cursor: 'default',
          }}
          ref={ element => { this._keyHandler = element } }
          onKeyUp={ this.handleKey.bind(this) }
          onBlur={ this.keyHandlerFocus.bind(this) }
          aria-label="Key input handler"
        />
      </div>
    );
  }

  player = () => this.props.getPlayer();

  setVolume(volume) {
    this.player().volume = volume;
    this.props.onSetVolume(volume);
  }

  incrementVolume(increment) {
    const { volume } = this.props;
    let volumeNew = volume;

    // Increment
    if ( increment > 0 && volume < 1 ) {
      volumeNew = volume <= (1 - increment) ? volume + increment : 1;
    }

    // Decrement
    if ( increment < 0 && volume > 0 ) {
      volumeNew = volume >= (-increment) ? volume + increment : 0;
    }

    // Prevent updating volume if limit reached
    if ( volumeNew !== volume ) {
      this.setVolume(volumeNew);
    }
  }

  handleKey(e) {
    let stopPropagation = false;

    // Handle controls keys
    this.controls.forEach( control => {
      (control.keys||[]).forEach( key_orig => {

        // Understand plain string or custom key object
        let key = typeof key_orig === 'string' ? {key: key_orig} : key_orig;

        // If it's exact key match
        if(e.key === key.key &&
          ['shiftKey', 'altKey', 'ctrlKey', 'metaKey']
            .every( (mod) => !!e[mod] === !!key[mod] )) {
          console.log(control.help);
          stopPropagation = true;
          control.action();
        }
      });
    });

    if ( stopPropagation ) {
      e.stopPropagation();
      e.preventDefault();
    }
  }
}

Controls.defaultProps = {
  onSetVolume:   e => {},
  onPlayPrev:    e => {},
  onPlayNext:    e => {},
  allowFocus:    e => {},
  extraControls: [],
  hideButtons:   [],
  volume:        1,
};

Controls.propTypes = {
  getPlayer: PropTypes.func.isRequired,
  volume: PropTypes.number.isRequired,
  allowFocus: PropTypes.func.isRequired,
  onSetVolume: PropTypes.func.isRequired,
  onPlayPrev: PropTypes.func.isRequired,
  onPlayNext: PropTypes.func.isRequired,
  hideButtons: PropTypes.arrayOf(
    PropTypes.oneOf(
      ['Prev', 'Next', '-10m', '-60s', '-10s', '+10m', '+60s', '+10s', 'Play/Pause']
  )).isRequired,
  extraControls: PropTypes.arrayOf( PropTypes.shape({
    help: PropTypes.string.isRequired,
    action: PropTypes.func.isRequired,
    text: PropTypes.string,
    icon: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.node,
    ]),
    keys: PropTypes.arrayOf( PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        shiftKey: PropTypes.bool,
        altKey: PropTypes.bool,
        ctrlKey: PropTypes.bool,
        metaKey: PropTypes.bool,
      }),
    ])),
  })),
};

export default Controls;


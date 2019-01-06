import React from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlay,
  faPause,
  faForward,
  faFastForward,
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons'

import { Button, ButtonsGroup } from './Button';
import Volume from './Volume';

class Controls extends React.Component {

  // Controls definitions:
  // - Only button
  // - Only key binding
  // - Both
  controls = [
    {
      icon: <FontAwesomeIcon icon={ faFastForward } flip="horizontal" />,
      text: 'Prev',
      help: 'Play previous podcast',
      action: () => this.props.onPlayPrev(),
      group: 'basic',
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
      group: 'advanced prev',
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
      group: 'advanced prev',
    },
    {
      icon: <FontAwesomeIcon icon={ faForward } flip="horizontal" />,
      text: '-10s',
      help: 'Go backwards 10 seconds',
      action: () => this.player().currentTime -= 10,
      keys: [ 'ArrowLeft' ],
      group: 'advanced prev',
    },
    {
      icon: () => this.props.isPlaying ?
         <FontAwesomeIcon icon={ faPause } /> :
         <FontAwesomeIcon icon={ faPlay } /> ,
      text: () => this.props.isPlaying ? 'Pause' : 'Play',
      help: 'Toggle Play/Pause',
      action: () => this.player().paused ? this.player().play() : this.player().pause(),
      keys: [ ' ', 'p', 'P' ],
      group: 'basic',
    },
    {
      icon: <FontAwesomeIcon icon={ faForward } />,
      text: '+10s',
      help: 'Go forward 10 seconds',
      action: () => this.player().currentTime += 10,
      keys: [ 'ArrowRight' ],
      group: 'advanced next',
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
      group: 'advanced next',
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
      group: 'advanced next',
    },
    {
      icon: <FontAwesomeIcon icon={ faFastForward } />,
      text: 'Next',
      help: 'Play next podcast',
      action: () => this.props.onPlayNext(),
      keys: [ 'Enter' ],
      group: 'basic',
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
      action: () => this.setMuted( !this.player().muted ),
      keys: [ 'm', 'M' ],
    },
  ];

  constructor(props) {
    super();

    // Keybindings disabled by default
    // Enable for anything but mobiles
    this.state = {
      noKeys: true,
    };

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

    let noKeys = true;

    // Disable key handler on mobile devices (enable on the rest)
    if ( !(/Mobi|Android/i.test(navigator.userAgent)) ) {
      noKeys = false;
      this.keyHandlerFocus = this._keyHandlerFocus;
      this.keyHandlerFocus();
    }

    this.setState({
      ...this.state,
      noKeys,
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  filterButtonsGroup(controls, group) {
    const { hideButtons } = this.props;
    const { noKeys } = this.state;

    return controls

      // Filter controls without button attributes
      .filter( control => 'icon' in control && 'text' in control )

      // Filter hidden buttons
      .filter( control => !hideButtons.includes(control.text) )

      // Filter buttons by group
      .filter( control => control.group.split(' ').includes(group) )

      // Remove keys info if keys are disabled
      .map( control => {
        if ( noKeys ) {
          const { keys, ...rest } = control;
          return rest
        }
        return control
      })
  }

  render() {
    const { showAdvanced, volumeAsAdvanced, volume, muted } = this.props;
    const { noKeys } = this.state;
    const buttons = ['basic','advanced'].reduce( (res, group) => {
      res[group] = this.filterButtonsGroup(this.controls, group);
      return res;
    }, {});

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}>
        { buttons['basic'].length ? (
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
          }}>
            <ButtonsGroup
              buttons={ buttons['basic'] }
              keyHandlerFocus={ this.keyHandlerFocus.bind(this) }
            >
              { buttons['advanced'].length ? (
                <Button
                  onMouseUp={ e => this.keyHandlerFocus(e, true) }
                  action={ this.handleShowAdvancedChange.bind(this, !showAdvanced) }
                  help={ `Show ${ showAdvanced ? 'less' : 'more' } controls` }
                  text={ showAdvanced ? 'Less' : 'More' }
                  icon={ <FontAwesomeIcon icon={ showAdvanced ? faEyeSlash : faEye } /> }
                />
              ) : null }
            </ButtonsGroup>
            { !volumeAsAdvanced ? (
              <Volume
                volume={ volume }
                muted={ muted }
                onSetVolume={ this.setVolume.bind(this) }
                onSetMuted={ this.setMuted.bind(this) }
                keyHandlerFocus={ this.keyHandlerFocus.bind(this) }
              />
            ) : null }
          </div>
        ) : null }
        <div style={{ display: 'flex' }}>
          { showAdvanced && buttons['advanced'].length ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
            }}>
              <ButtonsGroup
                buttons={ this.filterButtonsGroup(buttons['advanced'], 'prev') }
                keyHandlerFocus={ this.keyHandlerFocus.bind(this) }
              />
              <ButtonsGroup
                buttons={ this.filterButtonsGroup(buttons['advanced'], 'next') }
                keyHandlerFocus={ this.keyHandlerFocus.bind(this) }
              />
            </div>
          ) : null }
          { showAdvanced && volumeAsAdvanced ? (
            <Volume
              volume={ volume }
              muted={ muted }
              onSetVolume={ this.setVolume.bind(this) }
              onSetMuted={ this.setMuted.bind(this) }
              keyHandlerFocus={ this.keyHandlerFocus.bind(this) }
            />
          ) : null }
        </div>
        { noKeys ? null : (
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
        )}
      </div>
    );
  }

  player = () => this.props.getPlayer();

  setMuted(muted) {
    this.player().muted = muted;
    this.props.onSetMuted(muted);
  }

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

  handleShowAdvancedChange(showAdvanced, event) {
    event.preventDefault();
    this.props.onShowAdvancedChange(showAdvanced);
  }
}

Controls.defaultProps = {
  onSetVolume:   e => {},
  onSetMuted:    e => {},
  onPlayPrev:    e => {},
  onPlayNext:    e => {},
  allowFocus:    e => {},
  onShowAdvancedChange: e => {},
  extraControls: [],
  hideButtons:   [],
  volume:        1,
  muted:         false,
  isPlaying:     false,
  showAdvanced:  false,
  volumeAsAdvanced: false,
};

Controls.propTypes = {
  getPlayer: PropTypes.func.isRequired,
  volume: PropTypes.number.isRequired,
  muted: PropTypes.bool.isRequired,
  allowFocus: PropTypes.func.isRequired,
  onSetVolume: PropTypes.func.isRequired,
  onSetMuted: PropTypes.func.isRequired,
  onPlayPrev: PropTypes.func.isRequired,
  onPlayNext: PropTypes.func.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  volumeAsAdvanced: PropTypes.bool.isRequired,
  showAdvanced: PropTypes.bool.isRequired,
  onShowAdvancedChange: PropTypes.func.isRequired,
  hideButtons: PropTypes.arrayOf(
    PropTypes.oneOf(
      ['Prev', 'Next', '-10m', '-60s', '-10s', '+10m', '+60s', '+10s', 'Play/Pause']
  )).isRequired,
  extraControls: PropTypes.arrayOf(
    // As a button, but `text` and `icon` are not required
    PropTypes.shape({
      ...Button.propTypes,
      text: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.node,
      ]),
      icon: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.node,
      ]),
    }) ),
};

export default Controls;


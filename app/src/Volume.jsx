import React from 'react';
import PropTypes from 'prop-types';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faVolumeUp,
  faVolumeDown,
  faVolumeOff,
  faVolumeMute,
} from '@fortawesome/free-solid-svg-icons'

import { Button } from './Button';

class Volume extends React.Component {
  render() {
    const { volume, muted } = this.props;
    const title = "Volume handler | Keys: Shift + Arrow Up, Shift + Arrow Down";

    // Select volume icon
    const faVolume =
      muted        ? faVolumeMute :
      volume === 0 ? faVolumeOff  :
      volume < .5  ? faVolumeDown : faVolumeUp;

    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}>
        <div style={{
          width: '100%',
          minWidth: 40,
          height: 100,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          paddingTop: '.3em',
        }}>
          <Slider
            onAfterChange={ () => this.props.keyHandlerFocus() }
            onChange={ value => this.props.onSetVolume(value / 100) }
            value={ volume * 100 }
            vertical
            aria-label={ title }
            title={ title }
          />
        </div>
        <div>
          <Button
            onMouseUp={ e => this.props.keyHandlerFocus(e, true) }
            action={ () => this.props.onSetMuted( !muted ) }
            help={ 'Toggle mute status' }
            text={ muted ? 'Unmute' : 'Mute' }
            icon={ <FontAwesomeIcon icon={ faVolume } /> }
            keys={ [ 'M' ] }
          />
        </div>
      </div>
    )
  }
}

Volume.defaultProps = {
  keyHandlerFocus: () => {},
  onSetVolume:     volume => {},
  onSetMuted:      muted => {},
  volume:          1,
  muted:           false,
};

Volume.propTypes = {
  keyHandlerFocus: PropTypes.func.isRequired,
  onSetVolume: PropTypes.func.isRequired,
  onSetMuted: PropTypes.func.isRequired,
  volume: PropTypes.number.isRequired,
  muted: PropTypes.bool.isRequired,
};

export default Volume;
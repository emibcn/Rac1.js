import React, { Component } from 'react';

import { translate } from "react-translate"
import ReactAudioPlayer from 'react-audio-player';

import Controls from './Controls';

class Rac1Directe extends Component {
  // Initial state
  state = {
    volume: 1,
  };

  player() {
    return this._player.audioEl;
  }

  constructor(props, history) {
    super();

    this.history = props.history;

    // Initial state
    this.state = {
      volume: 1,
      muted: false,
      isPlaying: false,
    };
  }

  componentDidMount() {
    const { t } = this.props;
    this.initialTitle = document.title;
    document.title = `${ t(this.initialTitle) } - ${ t("Live") }`;
  }

  componentWillUnmount() {
    // Unregister player event listeners
    if ( this._player && this._player.removeEventListener ) {
      this._player.removeEventListener('onPlay', this.handlePlayStatusChange.bind(this, true));
      this._player.removeEventListener('onPause', this.handlePlayStatusChange.bind(this, false));
    }

    // Reset initial title
    document.title = this.initialTitle;
  }

  render() {
    const { volume, muted, isPlaying } = this.state;
    const { t } = this.props;
    const currentPath = 'http://rac1.radiocat.net/;*.nsv';
    const autoplay = true;
    const title = t('Rac1 live');

    return (
      <React.Fragment>
        <h3>{ title }</h3>
        <Controls
          getPlayer={ this.player.bind(this) }
          volume={ volume }
          muted={ muted }
          allowFocus={ (el) => el.className.match( /rc-slider-handle/ ) }
          isPlaying={ isPlaying }
          onSetVolume={ volume => this.setState({ ...this.state, volume }) }
          onSetMuted={ muted => this.setState({ ...this.state, muted }) }
          hideButtons={['Prev', 'Next', '-10m', '-60s', '-10s', '+10m', '+60s', '+10s']}
        />
        <ReactAudioPlayer
          ref={(element) => { this._player = element; }}
          style={{ width: '100%' }}
          src={ currentPath }
          autoPlay={ autoplay }
          title={ title }
          controls
          controlsList='nodownload'
          preload={ (autoplay ? 'auto' : 'metadata') }
          volume={ volume }
          muted={ muted }
          onPlay={ this.handlePlayStatusChange.bind(this, true) }
          onPause={ this.handlePlayStatusChange.bind(this, false) }
          onVolumeChanged={ e => this.setState({
            ...this.state,
            volume: e.currentTarget.volume,
            muted: e.currentTarget.muted,
          }) }
        />
      </React.Fragment>
    );
  }

  handlePlayStatusChange(isPlaying) {
    this.setState({
      ...this.state,
      isPlaying,
    });
  }
}

export default translate('Rac1Directe')(Rac1Directe);

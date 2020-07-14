import React, { Component } from 'react';

import { translate } from 'react-translate';
import { Helmet } from 'react-helmet';
import ReactAudioPlayer from 'react-audio-player';

import Controls from './Controls';

class Rac1Directe extends Component {

  player() {
    return this._player.audioEl;
  }

  constructor(props) {
    super();

    this.history = props.history;

    // Initial state
    this.state = {
      volume: 1,
      muted: false,
      isPlaying: true,
    };
  }

  componentWillUnmount() {
    // Unregister player event listeners
    if ( this._player && this._player.removeEventListener ) {
      this._player.removeEventListener('onPlay', this.handlePlayStatusChange.bind(this, true));
      this._player.removeEventListener('onPause', this.handlePlayStatusChange.bind(this, false));
    }
  }

  render() {
    const { volume, muted, isPlaying } = this.state;
    const { t } = this.props;
    const currentPath = 'https://streaming.rac1.cat/';
    const autoplay = true;
    const title = t('Rac1 live');

    return (
      <>
        <Helmet>
          <title>{ t("Live") }</title>
        </Helmet>
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
      </>
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

import React, { Component } from 'react';

import { translate } from 'react-translate';
import { Helmet } from 'react-helmet';
import ReactAudioPlayer from 'react-audio-player';

import { Rac1Live } from '../../Backends';
import Controls from '../Base/Controls';
import PodcastCover from '../Base/PodcastCover';
import MediaSession from '../Base/MediaSession';

class Rac1Directe extends Component {

  constructor(props) {
    super();

    this.rac1 = new Rac1Live({

      // Get data from backend
      onUpdate: this.handleUpdate.bind(this),

      // Get errors from backend
      onError: this.handleError.bind(this),

    });

    // Initial state
    this.state = {
      volume: 1,
      muted: false,
      isPlaying: false,
      podcast: false,
      hasError: false,
      error: {},
    };
  }

  handleUpdate(podcast) {
    this.setState({ podcast });
  }

  // Saves errors from backend into state so they
  // can be reraised into ReactDOM tree and catched correctly
  handleError(error) {
    error.message = `Rac1Directe: ${error.message}`;
    this.setState({
      hasError: true,
      error: error,
    });
  }

  componentWillUnmount() {
    // Unregister player event listeners
    const player = this.getPlayer().current;
    if ( player && player.removeEventListener ) {
      console.log("Remove audio event listeners");
      player.removeEventListener('play', this.handlePlayStatusChangeTrue);
      player.removeEventListener('pause', this.handlePlayStatusChangeFalse);
    }

    // Abort backend fetches
    this.rac1.abort();
  }

  render() {
    const { volume, muted, isPlaying, podcast, hasError, error } = this.state;
    const { t } = this.props;
    const currentPath = podcast !== undefined ? podcast.path : '';
    const autoplay = true;
    const title = t('Rac1 live');

    // If we have a backend error, reraise into ReactDOM tree
    if ( hasError ) {
      throw Error(error);
    }

    return (
      <>
        <Helmet>
          <title>{ t("Live") }</title>
        </Helmet>
        <MediaSession
           title={ `${podcast.title} | ${title}` }
           artist={ podcast.author }
           album={ podcast.schedule }
           image={ podcast.image }
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-evenly',
        }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '.5em',
          }}>
            <h3>{ title }</h3>
            <Controls
              getPlayer={ this.getPlayer }
              volume={ volume }
              muted={ muted }
              allowFocus={ this.allowFocus }
              isPlaying={ isPlaying }
              onSetVolume={ this.onSetVolume }
              onSetMuted={ this.onSetMuted }
              hideButtons={['Prev', 'Next', '-10m', '-60s', '-10s', '+10m', '+60s', '+10s']}
            />
            <ReactAudioPlayer
              ref={ this.refPlayer }
              style={{ width: '100%' }}
              src={ currentPath }
              autoPlay={ autoplay }
              title={ title }
              controls
              controlsList='nodownload'
              preload={ (autoplay ? 'auto' : 'metadata') }
              volume={ volume }
              muted={ muted }
              onPlay={ this.handlePlayStatusChangeTrue }
              onPause={ this.handlePlayStatusChangeFalse }
              onVolumeChanged={ this.onSetVolumeAndMuted }
            />
          </div>
          { podcast !== false ? (
              <PodcastCover
                minWidth={ 708 }
                image={ podcast.image }
                programUrl={ podcast.programUrl }
                title={ podcast.title }
                author={ podcast.author }
                schedule={ podcast.schedule }
              />
            ) : null
          }
        </div>
      </>
    );
  }

  handlePlayStatusChange(isPlaying) {
    this.setState({ isPlaying });
  }

  handlePlayStatusChangeTrue = this.handlePlayStatusChange.bind(this, true);
  handlePlayStatusChangeFalse = this.handlePlayStatusChange.bind(this, false);

  _refPlayer = el => { this._player = el }
  _getPlayer = () => this._player.audioEl

  refPlayer = this._refPlayer.bind(this)
  getPlayer = this._getPlayer.bind(this)

  allowFocus = el => el.className.match( /rc-slider-handle|ReactModal/ )
  _onSetVolume = volume => this.setState({ volume })
  _onSetMuted = muted => this.setState({ muted })
  _onSetVolumeAndMuted = e => {
    this.onSetVolume(e.currentTarget.volume);
    this.onSetMuted(e.currentTarget.muted);
  }
  onSetVolume          = this._onSetVolume.bind(this)
  onSetMuted           = this._onSetMuted.bind(this)
  onSetVolumeAndMuted  = this._onSetVolumeAndMuted.bind(this)

}

export default translate('Rac1Directe')(Rac1Directe);

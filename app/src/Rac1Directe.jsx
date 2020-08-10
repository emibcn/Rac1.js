import React, { Component } from 'react';

import { translate } from 'react-translate';
import { Helmet } from 'react-helmet';
import ReactAudioPlayer from 'react-audio-player';

import { Rac1Live } from './rac1';
import Controls from './Controls';
import PodcastCover from './PodcastCover';
import MediaSession from './MediaSession';

class Rac1Directe extends Component {

  player() {
    return this._player.audioEl;
  }

  constructor(props) {
    super();

    this.history = props.history;

    this.rac1 = new Rac1Live({
      onUpdate: this.onUpdate.bind(this),
    });

    // Initial state
    this.state = {
      volume: 1,
      muted: false,
      isPlaying: true,
      podcast: false,
    };
  }

  onUpdate(podcast) {
    this.setState({ podcast });
  }

  componentWillUnmount() {
    // Unregister player event listeners
    const player = this.player().current;
    if ( player && player.removeEventListener ) {
      console.log("Remove audio event listeners");
      player.removeEventListener('play', this.handlePlayStatusChangeTrue);
      player.removeEventListener('pause', this.handlePlayStatusChangeFalse);
    }

    // Abort backend fetches
    this.rac1.abort();
  }

  render() {
    const { volume, muted, isPlaying, podcast } = this.state;
    const { t } = this.props;
    const currentPath = podcast !== undefined ? podcast.path : '';
    const autoplay = true;
    const title = t('Rac1 live');

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
              onPlay={ this.handlePlayStatusChangeTrue }
              onPause={ this.handlePlayStatusChangeFalse }
              onVolumeChanged={ e => this.setState({
                ...this.state,
                volume: e.currentTarget.volume,
                muted: e.currentTarget.muted,
              }) }
            />
          </div>
          { podcast !== false ? (
              <PodcastCover
                minWidth={ 708 }
                imageUrl={ podcast.image }
                programUrl={ podcast.programURL }
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
    this.setState({
      isPlaying,
    });
  }
  
  handlePlayStatusChangeTrue = this.handlePlayStatusChange.bind(this, true);
  handlePlayStatusChangeFalse = this.handlePlayStatusChange.bind(this, false);
}

export default translate('Rac1Directe')(Rac1Directe);

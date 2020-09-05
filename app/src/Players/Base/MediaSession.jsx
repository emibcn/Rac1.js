import { Component } from 'react';
import PropTypes from 'prop-types';

class MediaSession extends Component {

  constructor(props) {
    super();
    this.setActions(props);
    this.setMetadata(props);
  }

  setActions(props) {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', props.onPlay);
      navigator.mediaSession.setActionHandler('pause', props.onPause);
      navigator.mediaSession.setActionHandler('seekbackward', props.onSeekBackward);
      navigator.mediaSession.setActionHandler('seekforward', props.onSeekForward);
      navigator.mediaSession.setActionHandler('previoustrack', props.onPlayPrev);
      navigator.mediaSession.setActionHandler('nexttrack', props.onPlayNext);
    }
  }

  setMetadata(props) {
    const { title, artist, album, image, artwork } = props;
    const artworkReal = artwork && artwork.length ? artwork :
      image && image.length ? [{
        src: image,
        sizes: '512x512',
        type: 'image/png',
      }] : undefined;
    navigator.mediaSession.metadata = new window.MediaMetadata({
      title,
      artist,
      album,
      artwork: artworkReal,
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.onSeekBackward !== prevProps.onSeekBackward ||
        this.props.onSeekForward  !== prevProps.onSeekForward  ||
        this.props.onPlayPrev     !== prevProps.onPlayPrev     ||
        this.props.onPlayNext     !== prevProps.onPlayNext     ) {
      this.setActions(this.props);
    }
    if (this.props.title  !== prevProps.title  ||
        this.props.artist !== prevProps.artist ||
        this.props.album  !== prevProps.album  ) {
      this.setMetadata(this.props);
    }
  }

  componentWillUnmount() {
    // Set all actions and metadata to undefined
    this.setActions({});
    this.setMetadata({});
  }

  render = () => null;
}

MediaSession.defaultProps = {
};

MediaSession.propTypes = {
  title: PropTypes.string,
  artist: PropTypes.string,
  album: PropTypes.string,
  image: PropTypes.string,
  artwork: PropTypes.array,
  onPlay: PropTypes.func,
  onPause: PropTypes.func,
  onPlayPrev: PropTypes.func,
  onPlayNext: PropTypes.func,
  onSeekBackward: PropTypes.func,
  onSeekForward: PropTypes.func,
};

export default MediaSession;

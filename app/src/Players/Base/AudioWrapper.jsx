import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import { Helmet } from "react-helmet-async";

import ReactAudioPlayer from "react-audio-player";
import Controls from "./Controls";
import MediaSession from "./MediaSession";

class AudioWrapper extends PureComponent {
  _player = React.createRef();

  constructor(props) {
    super();
    // Initial state
    this.state = {
      volume: 1,
      muted: false,
      isPlaying: false,
      showAdvancedControls: false,
      ...this.getHideButtons(),
    };
  }

  componentWillUnmount() {
    // Unregister player event listeners
    const player = this.getPlayer().current;
    if (player && player.removeEventListener) {
      player.removeEventListener("play", this.handlePlayStatusChangeTrue);
      player.removeEventListener("pause", this.handlePlayStatusChangeFalse);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.path !== this.props.path) {
      // Force status to pause. If it will autoplay,
      // it will change again to playing = true
      this.handlePlayStatusChangeFalse();
      this.setState(this.getHideButtons());
    }
  }

  /////////////////////////////
  // Actions for our Controls
  // Bound to this when needed
  /////////////////////////////
  getPlayer = () => this._player?.audioEl;

  // Actions activated through MediaSession
  // Call Controls.runAction to ensure all work coherently:
  // - Logs
  // - Tracking
  // - No duplicated code
  handleSeekBackward = () => this.controlsRunAction("-10s", "MediaSession");
  handleSeekForward = () => this.controlsRunAction("+10s", "MediaSession");
  handlePlay = () => this.controlsRunAction("Play", "MediaSession");
  handlePause = () => this.controlsRunAction("Pause", "MediaSession");
  handlePlayPrev = () => this.controlsRunAction("Prev", "MediaSession");
  handlePlayNext = () => this.controlsRunAction("Next", "MediaSession");

  // Play status may change from our Constrols button or from the <audio> tag
  // itself (or whatever associated, as from notifications screen controls)
  handlePlayStatusChange(isPlaying) {
    this.setState({ isPlaying });
  }

  onSetVolume = (volume) => this.setState({ volume });
  onSetMuted = (muted) => this.setState({ muted });

  onSetVolumeAndMuted = (e) => {
    this.onSetVolume(e.currentTarget.volume);
    this.onSetMuted(e.currentTarget.muted);
  };
  isSeekable = () => {
    const player = this.getPlayer();
    return player?.current?.duration !== Infinity;
  };
  getHideButtons = () => {
    return {
      hideButtons: [
        ...(this.isSeekable()
          ? []
          : ["-10m", "-60s", "-10s", "+10m", "+60s", "+10s"]),
        ...(!this.props || !this.props.onPlayNext ? ["Next"] : []),
        ...(!this.props || !this.props.onPlayPrev ? ["Prev"] : []),
      ],
    };
  };
  onLoadedMetadata = () => this.setState(this.getHideButtons());
  onShowAdvancedChange = (show) => {
    this.setState({ showAdvancedControls: show });
    return `${show ? "Show" : "Hide"} advanced buttons`;
  };

  // Create bound functions for setting specific playing status
  handlePlayStatusChangeTrue = this.handlePlayStatusChange.bind(this, true);
  handlePlayStatusChangeFalse = this.handlePlayStatusChange.bind(this, false);

  // Bound functions for getting refs from Controls and audio player
  refPlayer = (el) => {
    this._player = el;
  };
  refControls = (el) => {
    if (el) {
      this.controlsKeyHandlerFocus = el.keyHandlerFocus;
      this.controlsRunAction = el.runAction;
    }
  };

  render() {
    const { volume, muted, isPlaying, showAdvancedControls, hideButtons } =
      this.state;
    const {
      autoPlay,
      title,
      titleHead,
      path,
      allowFocus,
      onEnded,
      onPlayNext,
      onPlayPrev,
      extraControls,
      volumeAsAdvanced,
      artist,
      album,
      image,
    } = this.props;
    const isSeekable = this.isSeekable();

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: ".5em",
        }}
      >
        <Helmet>
          <title>{titleHead}</title>
        </Helmet>
        <MediaSession
          title={titleHead}
          artist={artist}
          album={album}
          image={image}
          /*
             Set actions for MediaSession (for controls on
             notification screen and similars).
             Undefined actions are not shown.
          */
          onPlay={this.handlePlay}
          onPause={this.handlePause}
          onPlayPrev={onPlayPrev ? this.handlePlayPrev : undefined}
          onPlayNext={onPlayNext ? this.handlePlayNext : undefined}
          onSeekBackward={isSeekable ? this.handleSeekBackward : undefined}
          onSeekForward={isSeekable ? this.handleSeekForward : undefined}
        />
        <h3>{title}</h3>
        <Controls
          getPlayer={this.getPlayer}
          volume={volume}
          muted={muted}
          allowFocus={allowFocus}
          onPlayNext={onPlayNext}
          onPlayPrev={onPlayPrev}
          onSetVolume={this.onSetVolume}
          onSetMuted={this.onSetMuted}
          showAdvanced={showAdvancedControls}
          volumeAsAdvanced={volumeAsAdvanced}
          onShowAdvancedChange={this.onShowAdvancedChange}
          isPlaying={isPlaying}
          ref={this.refControls}
          extraControls={extraControls}
          hideButtons={hideButtons}
        />
        <ReactAudioPlayer
          ref={this.refPlayer}
          style={{ width: "100%" }}
          src={path}
          autoPlay={autoPlay}
          title={title}
          controls
          controlsList="nodownload"
          preload={autoPlay ? "auto" : "metadata"}
          onEnded={onEnded}
          volume={volume}
          muted={muted}
          onPlay={this.handlePlayStatusChangeTrue}
          onPause={this.handlePlayStatusChangeFalse}
          onVolumeChanged={this.onSetVolumeAndMuted}
          onLoadedMetadata={this.onLoadedMetadata}
        />
      </div>
    );
  }
}

AudioWrapper.propTypes = {
  onPlayPrev: PropTypes.func,
  onPlayNext: PropTypes.func,
  allowFocus: PropTypes.func,
  extraControls: Controls.propTypes.extraControls,
  volumeAsAdvanced: PropTypes.bool,
  autoPlay: PropTypes.bool,
  path: PropTypes.string,
  title: PropTypes.string,
  titleHead: PropTypes.string,
  artist: PropTypes.string,
  album: PropTypes.string,
};

export default AudioWrapper;

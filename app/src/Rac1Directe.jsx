import React, { Component } from 'react';

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
  }

  componentDidMount() {
    this.initialTitle = document.title;
    document.title = `${this.initialTitle} - Directe`;
  }

  componentWillUnmount() {
    // Reset initial title
    document.title = this.initialTitle;
  }

  render() {
    const { volume } = this.state;
    const currentPath = 'http://rac1.radiocat.net/;*.nsv';
    const autoplay = true;
    const title = 'Rac1 en Directe';

    return (
      <React.Fragment>
        <h3>{ title }</h3>
        <Controls
          getPlayer={ this.player.bind(this) }
          volume={ volume }
          onSetVolume={ (v) => this.setState({ ...this.state, volume: v }) }
          hideButtons={['Prev', 'Next', '-10m', '-60s', '-10s', '+10m', '+60s', '+10s']}
        />
        <ReactAudioPlayer
          ref={(element) => { this._player = element; }}
          style={{ width: '100%' }}
          src={ currentPath }
          autoPlay={ autoplay }
          controls
          controlsList='nodownload'
          preload={ (autoplay ? 'auto' : 'metadata') }
          volume={ volume }
        />
      </React.Fragment>
    );
  }
}

export default Rac1Directe;
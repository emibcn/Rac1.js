import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Podcast extends Component {
  render() {
    const { path, uuid, audio, appTabletTitle} = this.props;

    return (
      <span>
        { !path ?
            (
              <span>{ uuid }</span>
            ) :
            (
              <a
                href={ path }
                onClick={ this.handleClick.bind(this) }
                style={{ textDecoration: "none" }}
              >
                { audio.hour }h: { appTabletTitle }
              </a>
            )
        }
      </span>
    )
  }

  handleClick = (e) => this.props.onClick(e);
}

Podcast.defaultProps = {
  onClick: (e) => {},
};

Podcast.propTypes = {
  uuid: PropTypes.string.isRequired,
  path: PropTypes.string,
  appTabletTitle: PropTypes.string,
  audio: PropTypes.shape(),
  onClick: PropTypes.func.isRequired,
};


export default Podcast;

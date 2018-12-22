import React from 'react';
import PropTypes from 'prop-types';

class Podcast extends React.PureComponent {
  render() {
    const { path, uuid, hour, minute, title} = this.props;
    const pad2 = num => ( num < 10 ? '0' : '' ) + num;

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
                { hour }h{ minute ? pad2(minute) : '' }: { title }
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
  title: PropTypes.string,
  hour: PropTypes.number,
  minute: PropTypes.number,
  onClick: PropTypes.func.isRequired,
};


export default Podcast;

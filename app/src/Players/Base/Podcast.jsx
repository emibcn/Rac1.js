import React from 'react';
import PropTypes from 'prop-types';

const pad2 = num => ( num < 10 ? '0' : '' ) + num;

class Podcast extends React.PureComponent {
  render() {
    const { path, uuid, hour, minute, title } = this.props;

    return (
      <span>
        { !path ?
            (
              <span>{ uuid }</span>
            ) :
            (
              <a
                href={ path }
                onClick={ this.handleClick }
                style={{ textDecoration: "none" }}
              >
                { hour }h{ minute ? pad2(minute) : '' }: { title }
              </a>
            )
        }
      </span>
    )
  }

  handleClick = (e) => this.props.onClick(this.props.uuid, e);
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

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'

class PodcastsList extends Component {
  render() {
    const { children, current } = this.props;

    return children === undefined || children.length === 0 ?
      null :
      (
        <ul style={{
          listStyleType: "none",
          marginLeft: 0,
          paddingLeft: 0,
          textAlign: 'left'
        }}>
          { children.map((child, index) =>
            <li
              key={ child.key }
              style={{ position: "relative", marginLeft: "1em" }}>
              { index === current ? (
                <FontAwesomeIcon
                  icon={faPlay}
                  style={{
                    position: 'absolute',
                    left: '-1.25em',
                    top: 'calc(.2vmin + .2em)',
                  }}/>
              ) : null
              }
              { child }
            </li>
          )}
        </ul>
      )
  }
}

PodcastsList.defaultProps = {
};

PodcastsList.propTypes = {
  children: PropTypes.arrayOf( PropTypes.element ),
  current: PropTypes.number.isRequired,
};


export default PodcastsList;

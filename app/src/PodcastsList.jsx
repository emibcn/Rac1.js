import React from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'

class PodcastsList extends React.PureComponent {
  render() {
    const { children, current } = this.props;

    return children === undefined || children.length === 0 ?
      null :
      (
        <ul style={{
          listStyleType: 'none',
          marginLeft: 0,
          paddingLeft: 0,
          textAlign: 'left'
        }}>
          { children.map( (child, index) =>
            <li
              key={ child.key }
              style={{
                position: 'relative',
                marginLeft: '2.5em',
                textIndent: '-1.5em',
                padding: '1pt 0',
              }}
            >
              { index === current ? (
                <FontAwesomeIcon
                  icon={ faPlay }
                  style={{
                    position: 'absolute',
                    left: '-2.75em',
                    padding: '1pt 0',
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

import React from 'react';
import { PropTypes } from 'prop-types';
import ReactGA from 'react-ga';

import GAEventContext from './GAEventContext';
import GAListenerActive from './GAListenerActive';

// Renders GA+children in production, only children for the rest
class GAListener extends React.Component {

  sendEvent(origin, help, status) {
    const event = {
      category: origin,
      action: help,
    };

    if ( typeof status === 'string' ) {
      console.log(status);
      event.label = status;
    }

    console.log(event);
    ReactGA.event(event);
  }

  render() {
    const { children, trackOptIn, ...props } = this.props;

    // Disable GA unless user has opt'ed in to tracking
    return trackOptIn ? (
      <GAEventContext.Provider value={ this.sendEvent.bind(this) }>
        <GAListenerActive { ...props } >
          { children }
        </GAListenerActive>
      </GAEventContext.Provider>
    ) : (
      <GAEventContext.Provider value={ () => {} }>
        { children }
      </GAEventContext.Provider>
    )
  }
}

GAListener.defaultProps = {
  ...GAListenerActive.defaultProps,
  trackOptIn: false,
};

GAListener.propTypes = {
  ...GAListenerActive.propTypes,
  trackOptIn: PropTypes.bool.isRequired,
};

export default GAListener;

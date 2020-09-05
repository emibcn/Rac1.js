import React from 'react';
import { PropTypes } from 'prop-types';
import ReactGA from 'react-ga';

import GAEventContext from './GAEventContext';
import GAListenerActive from './GAListenerActive';

// Renders GA+children in production, only children for the rest
class GAListener extends React.Component {

  createEvent = (origin, help, status) => {
    const event = {
      category: origin,
      action: help,
    };

    if ( typeof status === 'string' ) {
      console.log(status);
      event.label = status;
    }

    console.log(event);

    return event;
  }

  sendEvent = (...args) => ReactGA.event( this.createEvent(...args) );

  render() {
    const { children, trackOptIn, ...props } = this.props;

    // Disable GA unless user has opt'ed in to tracking
    return trackOptIn ? (
      <GAEventContext.Provider value={ this.sendEvent }>
        <GAListenerActive { ...props } >
          { children }
        </GAListenerActive>
      </GAEventContext.Provider>
    ) : (
      <GAEventContext.Provider value={ this.createEvent }>
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

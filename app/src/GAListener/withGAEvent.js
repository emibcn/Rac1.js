import React from 'react';

import GAEventContext from './GAEventContext';

export function withGAEvent(Component) {
  return class WrapperComponent extends React.Component {
    render() {
      const props = this.props;
      return (
        <GAEventContext.Consumer>
          { sendEvent => <Component { ...props } {...{ sendEvent }} /> }
        </GAEventContext.Consumer>
      );
    }
  }
}

export default withGAEvent;

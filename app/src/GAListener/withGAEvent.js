import React from 'react';

import GAEventContext from './GAEventContext';

// HOC to add `sendEvent` function respecting refs
export function withGAEvent(Component) {

  // Wrapper component
  class GAEvent extends React.Component {
    render() {
      const { forwardedRef, ...props } = this.props;

      // Get `sendEvent` from context and pass it to the wrapped
      // component, along with ref and the rest of props
      return (
        <GAEventContext.Consumer>
          { sendEvent => <Component ref={ forwardedRef } { ...props } {...{ sendEvent }} /> }
        </GAEventContext.Consumer>
      );
    }
  }

  // Return wrapper respecting ref
  const forwarded = React.forwardRef( (props, ref) => {
    return <GAEvent { ...props } forwardedRef={ ref } />
  });
  forwarded.propTypes = Component.propTypes;
  forwarded.defaultProps = Component.defaultProps;

  return forwarded;
}

export default withGAEvent;

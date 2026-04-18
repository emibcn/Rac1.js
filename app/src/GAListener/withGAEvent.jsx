import React from 'react'

import GAEventContext from './GAEventContext'

// HOC to add `sendEvent` function respecting refs
export function withGAEvent (Component) {
  // Wrapper component
  function GAEvent ({ ref, ...restProps }) {
    // Get `sendEvent` from context and pass it to the wrapped
    // component, along with ref and the rest of props
    return (
      <GAEventContext.Consumer>
        {(sendEvent) => (
          <Component ref={ref} {...restProps} sendEvent={ sendEvent } />
        )}
      </GAEventContext.Consumer>
    )
  }

  // React 19 compatible forwardRef
  // Return wrapper respecting ref
  const forwarded = function GAEventForward(props) {
    return <GAEvent {...props} />
  }

  // Set display name for debugging
  const componentName = Component.displayName || Component.name || 'Component'
  forwarded.displayName = `withGAEvent(${componentName})`

  // Copy over static properties
  if (Component.propTypes)
    forwarded.propTypes = Component.propTypes
  if (Component.defaultProps)
    forwarded.defaultProps = Component.defaultProps

  return forwarded
}

export default withGAEvent

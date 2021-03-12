import React from 'react';
import withGAEvent from './withGAEvent';

// Returns a function which uses `sendEvent`
// to send webVitals events to GA
// See `/index.js`
const handleWebVitals = (sendEvent) =>
  // Send webVitals to GA
  // Use `event.detail` to get webVitals details
  ({detail: { id, name, value }}) => {
    // https://create-react-app.dev/docs/measuring-performance/
    sendEvent({
      category: 'Web Vitals',
      action: name,
      value: Math.round(name === 'CLS' ? value * 1000 : value), // values must be integers
      label: id, // id unique to current page load
      nonInteraction: true, // avoids affecting bounce rate
    });
  }

// Simple functional component to (un)subscribe from document
// event listener `webVitals` (see `/index.js` )
const ReportWebVitals = ({sendEvent}) => {
  React.useEffect( () => {
    const listener = handleWebVitals(sendEvent);
    document.addEventListener('webVitals', listener);
    return () => document.removeEventListener('webVitals', listener);
  }, [sendEvent]);

  return null;
}

export default withGAEvent(ReportWebVitals);

import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// Creates a custom event and fires it on the document
// Internal components can listen to it
const dispatchCustomEvent = (name, detail) => {
  const event = new CustomEvent(name, { detail });
  document.dispatchEvent(event);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register({

  // When new ServiceWorker is available, trigger an event on `document`,
  // passing `registration` as extra data
  // Send message to internal components through document custom event
  onUpdate: (registration) => {
    dispatchCustomEvent('onNewServiceWorker', { registration });
  }

});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// Send message to internal components through document custom event
reportWebVitals( args => dispatchCustomEvent('webVitals', args ) );

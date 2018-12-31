import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register({
  onUpdate: (registration) => {
    //console.log("Forcing new update activation");
    //self.skipWaiting()
    console.log({ registration, scope: registration.scope })
    if( registration.waiting ) {
      console.log("We can force update!");

      // When the user asks to refresh the UI, we'll need to reload the window
      var preventDevToolsReloadLoop;
      navigator.serviceWorker.addEventListener('controllerchange', function(event) {
        // Ensure refresh is only called once.
        // This works around a bug in "force update on reload".
        if (preventDevToolsReloadLoop)
          return;
        preventDevToolsReloadLoop = true;
        console.log('Controller loaded');
        window.location.reload();
      });

      registration.waiting.postMessage('skipWaiting');
    }
  }
});

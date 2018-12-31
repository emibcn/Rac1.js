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
  onUpdate: (registration, self, win) => {
    //console.log("Forcing new update activation");
    //self.skipWaiting()
    console.log({ registration, self, win })
    if( self.skipWaiting ) {
      console.log("We can force update!");
      self.skipWaiting();
    }
  }
});

import React, { Component } from 'react';
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
  Link,
} from "react-router-dom";

import GAListener from './GAListener';

import Rac1Directe from './Rac1Directe';
import Rac1ByDate from './Rac1ByDate';

import './App.css';

class App extends Component {
  render() {
    const date = new Date();
    const todayStr = `/${date.getFullYear()}/${1 + date.getMonth()}/${date.getDate()}/0/0`;

    return (
      <Router>
        <div className="App">

          {/* Menu */}
          <ul style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              listStyleType: 'none',
              backgroundColor: '#282c34',
              paddingInlineStart: 0,
              margin: 0,
          }}>
            <li>
              <Link
                to="/"
                style={{
                  padding: '1em',
                  backgroundColor: '#ddd',
                  border: '1px solid #777',
                  display: 'block',
                }}>By date</Link>
            </li>
            <li>
              <Link
                to="/directe"
                style={{
                  padding: '1em',
                  backgroundColor: '#ddd',
                  border: '1px solid #777',
                  display: 'block',
                }}>En directe</Link>
            </li>
          </ul>

          {/* App Route */}
          <header className="App-header">
            <GAListener>
              <Switch>
                <Route
                  path="/directe"
                  render={props => <Rac1Directe { ...props } /> } />

                <Route
                  path="/:year/:month/:day/:hour/:minute"
                  render={props => <Rac1ByDate { ...props } /> } />

                {/* Set default date to today */}
                <Redirect to={{ pathname: todayStr }} />
              </Switch>
            </GAListener>
          </header>
        </div>
      </Router>
    )
  }
}

export default App;

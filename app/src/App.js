import React from 'react';
import PropTypes from 'prop-types';
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
  Link,
} from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBroadcastTower as faDirecte,
  faCalendarAlt as faByDate,
  faArrowAltCircleUp as faUpgrade,
} from '@fortawesome/free-solid-svg-icons'

import GAListener from './GAListener';
import Rac1Directe from './Rac1Directe';
import Rac1ByDate from './Rac1ByDate';

import './App.css';

class App extends React.Component {

  constructor() {
    super();
    this.registration = false;
    this.state = {
      newServiceWorkerDetected: false,
    };
  }

  componentDidMount() {
    document.addEventListener('onNewServiceWorker', this.handleNewServiceWorker.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener('onNewServiceWorker', this.handleNewServiceWorker.bind(this));
  }

  handleNewServiceWorker(event) {
    this.registration = event.detail.registration;
    this.setState({
      ...this.state,
      newServiceWorkerDetected: true,
    });
  }

  render() {
    const date = new Date();
    const todayStr = `/${date.getFullYear()}/${1 + date.getMonth()}/${date.getDate()}/0/0`;
    const { newServiceWorkerDetected } = this.state;
    const linkStyle = {
      padding: '1em',
      backgroundColor: '#ddd',
      border: '1px solid #777',
      display: 'block',
    };

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
                  ...linkStyle,
                  borderBottomLeftRadius: '.5em',
                }}>
                <FontAwesomeIcon icon={ faByDate } style={{ marginRight: '.5em' }} />
                By date
              </Link>
            </li>
            <li>
              <Link
                to="/directe"
                style={{
                  ...linkStyle,
                  borderBottomRightRadius: newServiceWorkerDetected ? null : '.5em',
                }}>
                <FontAwesomeIcon icon={ faDirecte } style={{ marginRight: '.5em' }} />
                En directe
              </Link>
            </li>
            { newServiceWorkerDetected ? (
                <li>
                  <a
                    href='/'
                    title="New version available!"
                    onClick={ e => {
                      e.preventDefault();
                      this.props.onLoadNewServiceWorkerAccept(this.registration)
                    }}
                    style={{
                      ...linkStyle,
                      color: 'green',
                      borderBottomRightRadius: '.5em',
                    }}>
                    <FontAwesomeIcon icon={ faUpgrade } style={{ marginRight: '.5em' }} />
                    Update!
                  </a>
                </li>
              ) : null
            }
          </ul>

          {/* App Route */}
          <header className="App-header">
            <GAListener>
              <Switch>
                <Route
                  path="/directe"
                  render={ props => <Rac1Directe { ...props } /> } />

                <Route
                  path="/:year/:month/:day/:hour/:minute"
                  render={ props => <Rac1ByDate { ...props } /> } />

                <Route
                  path="/:year/:month/:day/:hour"
                  render={ props => <Rac1ByDate { ...props } /> } />

                <Route
                  path="/:year/:month/:day"
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

App.defaultProps = {
  onLoadNewServiceWorkerAccept: e => {},
};

App.propTypes = {
  onLoadNewServiceWorkerAccept: PropTypes.func.isRequired,
};

export default App;

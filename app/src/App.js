import React from 'react';
import PropTypes from 'prop-types';
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import AppMenu from './AppMenu';
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

    return (
      <Router>
        <div className="App" id="router-container">

          {/* Menu */}
          <AppMenu
            newServiceWorkerDetected={ newServiceWorkerDetected }
            onLoadNewServiceWorkerAccept={ this.handleLoadNewServiceWorkerAccept.bind(this) }
          />

          {/* App Route */}
          <header className="App-header" id="page-wrap">
            <GAListener>
              <Switch>
                <Route
                  path="/live"
                  render={ props => <Rac1Directe { ...props } /> } />

                <Route path="/directe">
                  <Redirect to={{ pathname: "live" }} />
                </Route>

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

  handleLoadNewServiceWorkerAccept() {
    this.props.onLoadNewServiceWorkerAccept(this.registration);
  }
}

App.defaultProps = {
  onLoadNewServiceWorkerAccept: registration => {},
};

App.propTypes = {
  onLoadNewServiceWorkerAccept: PropTypes.func.isRequired,
};

export default App;

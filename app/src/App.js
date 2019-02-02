import React from 'react';
import PropTypes from 'prop-types';
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import Storage from "react-simple-storage";
import { TranslatorProvider } from "react-translate"
import available from "./i18n/available"

import AppMenu from './AppMenu';
import GAListener from './GAListener';
import ErrorCatcher from './ErrorCatcher';
import Rac1Directe from './Rac1Directe';
import Rac1ByDate from './Rac1ByDate';

import './App.css';

class App extends React.Component {

  constructor() {
    super();

    // Get DoNotTrack user preference
    // Deactivate tracking by default until legal modal is added to the app
    const dnt = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;
    this.dnt = process.env.NODE_ENV !== 'production' || dnt === "1" || dnt === "yes" || true;

    this.registration = false;
    this.state = {
      newServiceWorkerDetected: false,
      language: available.hasOwnProperty(navigator.language) ? navigator.language : 'en-en',
      trackOptIn: !this.dnt,
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
    const { newServiceWorkerDetected, language, trackOptIn } = this.state;
    const translations = available[language];
    const withErrorCatcher = (origin, component) => <ErrorCatcher {...{ origin , key: origin }}>{ component }</ErrorCatcher>;

    return (
      <TranslatorProvider translations={ translations }>
        <Router>
          <div className="App" id="router-container">

            {/* Persistent state saver into localStorage */}
            <Storage
              parent={ this }
              prefix="App"
              blacklist={ ['newServiceWorkerDetected'] }
            />

            {/* GoogleAnalytics event provider and route change detector */}
            <GAListener language={ language } trackOptIn={ trackOptIn } >

              {/* Menu */}
              <ErrorCatcher origin='AppMenu'>
                <AppMenu
                  newServiceWorkerDetected={ newServiceWorkerDetected }
                  onLoadNewServiceWorkerAccept={ this.handleLoadNewServiceWorkerAccept.bind(this) }
                  language={ language }
                  onLanguageChange={ this.handleLanguageChange.bind(this) }
                  onTrackOptIn={ trackOptIn => this.setState({...this.state, trackOptIn }) }
                  trackOptIn={ trackOptIn }
                />
              </ErrorCatcher>

              {/* App Route */}
              <header className="App-header" id="page-wrap">
                <Switch>
                  <Route
                    path="/live"
                    render={ props => withErrorCatcher('Rac1Live', <Rac1Directe { ...props } />) } />

                  <Route path="/directe">
                    <Redirect to={{ pathname: "live" }} />
                  </Route>

                  <Route
                    path="/:year/:month/:day/:hour/:minute"
                    render={ props => withErrorCatcher('Rac1ByDate 1', <Rac1ByDate { ...props } />) } />

                  <Route
                    path="/:year/:month/:day/:hour"
                    render={ props => withErrorCatcher('Rac1ByDate 2', <Rac1ByDate { ...props } />) } />

                  <Route
                    path="/:year/:month/:day"
                    render={ props => withErrorCatcher('Rac1ByDate 3', <Rac1ByDate { ...props } />) } />

                  {/* Set default date to today */}
                  <Redirect to={{ pathname: todayStr }} />
                </Switch>
              </header>
            </GAListener>
          </div>
        </Router>
      </TranslatorProvider>
    )
  }

  handleLoadNewServiceWorkerAccept() {
    this.props.onLoadNewServiceWorkerAccept(this.registration);
  }

  handleLanguageChange(language) {
    this.setState({
      ...this.state,
      language,
    });
  }
}

App.defaultProps = {
  onLoadNewServiceWorkerAccept: registration => {},
};

App.propTypes = {
  onLoadNewServiceWorkerAccept: PropTypes.func.isRequired,
};

export default App;

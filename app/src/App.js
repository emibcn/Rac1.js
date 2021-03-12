import React from 'react';
import PropTypes from 'prop-types';
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

import Storage from 'react-simple-storage';
import { TranslatorProvider, useTranslate } from 'react-translate';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import available from './i18n/available';

import AppMenu from './AppMenu';
import ModalRouter from './ModalRouter';
import GAListener, {ReportWebVitals} from './GAListener';
import ErrorCatcher from './ErrorCatcher';
import { Live, ByDate } from './Players';
import Cookies from './Cookies';
import About from './About';
import Help from './Help';
import botCheck from './botCheck';

import './App.css';

// GoogleAnalytics code taken from env
const GACode = process.env.REACT_APP_GA_CODE;

// Template function for catching errors from components
const withErrorCatcher = (origin, component) => <ErrorCatcher {...{ origin , key: origin }}>{ component }</ErrorCatcher>;

// App Helmet: Controls HTML <head> elements with SideEffect
// - Set a default title and title template, translated
const AppHelmet = function(props) {
  const t = useTranslate("App");
  const title = t("Rac1 Radio Podcasts Player");
  return (
    <Helmet
      titleTemplate={ `%s | ${ title }` }
      defaultTitle={ title }
    >
      <html lang={ props.language } />
    </Helmet>
  );
}

// Concentrate all providers (4) used in the app into a single component
const AppProviders = function(props) {
  return (
    <TranslatorProvider translations={ props.translations }>
      <HelmetProvider>
        <Router>
          {/* GoogleAnalytics event provider and route change detector */}
          <GAListener
            GACode={ props.GACode }
            language={ props.language }
            trackOptIn={ props.trackOptIn }
          >
            <ReportWebVitals/>
            <div className='App' id='router-container'>
              { props.children }
            </div>
          </GAListener>
        </Router>
      </HelmetProvider>
    </TranslatorProvider>
  );
};

class App extends React.Component {

  constructor() {
    super();

    // Get DoNotTrack user preference
    // Deactivate tracking by default to users with DNT and to all bots
    this.isBot = botCheck();
    const dnt = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;
    this.dnt = process.env.NODE_ENV === 'test' || dnt === '1' || dnt === 'yes' || this.isBot;

    // Fix bad browser encoding HASH
    const decoded = decodeURIComponent(global.location.hash);
    if ( decoded !==  '' && decoded !== global.location.hash ) {
      const hash = decoded.replace(/[^#]*(#.*)$/, '$1');
      global.location.replace(hash);
    }

    // Save App element to handle modal
    this.appElement = React.createRef();

    this.registration = false;
    this.state = {
      initializing: true,
      newServiceWorkerDetected: false,
      language: available.hasOwnProperty(navigator.language) ? navigator.language : 'en-en',
      trackingSeen: false,
      trackOptIn: !this.dnt,
      isBot: this.isBot,
      dnt: this.dnt,
    };
  }

  componentDidMount() {
    document.addEventListener('onNewServiceWorker', this.handleNewServiceWorker);
  }

  componentWillUnmount() {
    document.removeEventListener('onNewServiceWorker', this.handleNewServiceWorker);
  }

  handleNewServiceWorker = (event) => {
    this.registration = event.detail.registration;
    this.setState({
      newServiceWorkerDetected: true,
    });
  }


  render() {
    const date = new Date();
    const todayStr = `/${date.getFullYear()}/${1 + date.getMonth()}/${date.getDate()}/0/0`;
    const { newServiceWorkerDetected, language, trackOptIn, trackingSeen, initializing } = this.state;
    const translations = available[language];


    return (
      <AppProviders { ...{
          translations,
          language,
          trackOptIn,
          GACode,
        }}
      >

        {/* Persistent state saver into localStorage */}
        <Storage
          parent={ this }
          prefix='App'
          blacklist={ ['newServiceWorkerDetected', 'initializing'] }
          onParentStateHydrated={ () => this.setState({ initializing: false }) }
        />

        {/*
            Modal routes hash paths ;)
            Force initial modal to 'cookies' if all these conditions are true:
            - Cookies modal not seen yet
            - App completely initialized
            - User is not a Bot
            - User does not have DoNotTrack activated (consider bots as if they have DNT)
        */}
        <ModalRouter
          force={ !trackingSeen && !initializing && !this.isBot ? 'cookies' : false }
          appElement={ this.appElement.current }
        >
          <Route
            exact
            path='about'
            render={ props => withErrorCatcher('About', <About />) }
          />
          <Route
            exact
            path='help'
            render={ props => withErrorCatcher('Help', <Help />) }
          />
          <Route
            exact
            path='cookies'
            render={ props => withErrorCatcher('Cookies',
              <Cookies
                { ...{ trackOptIn, trackingSeen } }
                onTrackingSeen={ seen =>
                  this.setState({ trackingSeen: seen })
                }
                onTrackOptIn={ track =>
                  this.setState({ trackOptIn: track })
                } /> )}
          />

        </ModalRouter>

        {/* Menu */}
        <ErrorCatcher origin='AppMenu'>
          <AppMenu
            newServiceWorkerDetected={ newServiceWorkerDetected }
            onLoadNewServiceWorkerAccept={ this.handleLoadNewServiceWorkerAccept }
            language={ language }
            onLanguageChange={ this.handleLanguageChange }
            trackOptIn={ trackOptIn }
          />
        </ErrorCatcher>

        <AppHelmet language={ language } />

        <header
          ref={ this.appElement }
          className='App-header'
          id='page-wrap'>

          {/* App Route */}
          <Switch>
            <Route
              exact
              path={ '/live' }
              render={ props => withErrorCatcher('Live', <Live { ...props } />) } />

            <Route
              exact
              path={ '/(directe|directo)' }
            >
              <Redirect to={{ pathname: 'live' }} />
            </Route>

            <Route
              path={ '/:year(\\d{4})/:month(\\d{1,2})/:day(\\d{1,2})/:hour(\\d{1,2})/:minute(\\d{1,2})' }
              render={ props => withErrorCatcher('ByDate 1', <ByDate { ...props } />) } />

            <Route
              path={ '/:year(\\d{4})/:month(\\d{1,2})/:day(\\d{1,2})/:hour(\\d{1,2})' }
              render={ props => withErrorCatcher('ByDate 2', <ByDate { ...props } />) } />

            <Route
              path={ '/:year(\\d{4})/:month(\\d{1,2})/:day(\\d{1,2})' }
              render={ props => withErrorCatcher('ByDate 3', <ByDate { ...props } />) } />

            {/* Set default date to today */}
            <Route
              exact
              path={ ':all(.*)' }
              render={ ({ match, ...props }) => {
                return <Redirect
                  push
                  to={{
                    pathname: todayStr,
                    hash: props.location.hash.replace('#',''),
                  }}
                />
              }}
            />
          </Switch>
        </header>
      </AppProviders>
    )
  }

  handleLoadNewServiceWorkerAccept = () => this.props.onLoadNewServiceWorkerAccept(this.registration);

  handleLanguageChange = (language) => this.setState({ language });
}

App.defaultProps = {
  onLoadNewServiceWorkerAccept: registration => {},
};

App.propTypes = {
  onLoadNewServiceWorkerAccept: PropTypes.func.isRequired,
};

export default App;

import React, { useMemo, useState } from "react";
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
  useLocation,
} from "react-router-dom";

import Storage from "react-simple-storage";
import { TranslatorProvider, useTranslate } from "react-translate";
import { Helmet, HelmetProvider } from "react-helmet-async";
import available from "./i18n/available";

import AppMenu from "./AppMenu";
import ModalRouter from "./ModalRouter";
import GAListener, { ReportWebVitals } from "./GAListener";
import ErrorCatcher from "./ErrorCatcher";
import { Live, ByDate } from "./Players";
import Cookies from "./Cookies";
import About from "./About";
import Help from "./Help";
import botCheck from "./botCheck";

import "./App.css";

// GoogleAnalytics code taken from env
const GACode = process.env.REACT_APP_GA_CODE;

// Template function for catching errors from components
const withErrorCatcher = (origin, Component) => (props) => (
  <ErrorCatcher {...{ origin, key: origin }}>
    <Component {...props} />
  </ErrorCatcher>
);

const AboutWithErrorCatcher = withErrorCatcher("About", About);
const HelpWithErrorCatcher = withErrorCatcher("Help", Help);
const CookiesWithErrorCatcher = withErrorCatcher("Cookies", Cookies);
const LiveWithErrorCatcher = withErrorCatcher("Live", Live);
const ByDateWithErrorCatcher = withErrorCatcher("ByDate", ByDate);

// App Helmet: Controls HTML <head> elements with SideEffect
// - Set a default title and title template, translated
const AppHelmet = function (props) {
  const t = useTranslate("App");
  const title = t("Rac1 Radio Podcasts Player");
  return (
    <Helmet titleTemplate={`%s | ${title}`} defaultTitle={title}>
      <html lang={props.language} />
    </Helmet>
  );
};

// Concentrate all providers (4) used in the app into a single component
const AppProviders = function (props) {
  return (
    <TranslatorProvider translations={props.translations}>
      <HelmetProvider>
        <Router>
          {/* GoogleAnalytics event provider and route change detector */}
          <GAListener
            GACode={props.GACode}
            language={props.language}
            trackOptIn={props.trackOptIn}
          >
            <ReportWebVitals />
            <div className="App" id="router-container">
              {props.children}
            </div>
          </GAListener>
        </Router>
      </HelmetProvider>
    </TranslatorProvider>
  );
};

const RedirectToToday = function () {
  const location = useLocation();
  const date = new Date();
  const todayStr = `/${date.getFullYear()}/${
    1 + date.getMonth()
  }/${date.getDate()}/0/0`;

  return (
    <Redirect
      push
      to={{
        pathname: todayStr,
        hash: location.hash.replace("#", ""),
      }}
    />
  );
};

class App extends React.Component {
  constructor(props) {
    super();

    // Fix bad browser encoding HASH
    const decoded = decodeURIComponent(global.location.hash);
    if (decoded !== "" && decoded !== global.location.hash) {
      const hash = decoded.replace(/[^#]*(#.*)$/, "$1");
      global.location.replace(hash);
    }

    // Save App element to handle modal
    this.appElement = React.createRef();

    this.state = {
      initializing: true,
      trackingSeen: false,
      trackOptIn: !props.dnt,
    };
  }

  handleStopInitializing = () => {
    this.setState({ initializing: false });
  };

  render() {
    const { trackOptIn, trackingSeen, initializing } = this.state;
    const { language, handleLanguageChange, isBot } = this.props;
    const translations = available[language];

    return (
      <AppProviders
        {...{
          translations,
          language,
          trackOptIn,
          GACode,
        }}
      >
        {/* Persistent state saver into localStorage */}
        <Storage
          parent={this}
          prefix="App"
          blacklist={["initializing"]}
          onParentStateHydrated={this.handleStopInitializing}
        />

        {initializing ? null : (
          <>
            {/*
                Modal routes hash paths ;)
                Force initial modal to 'cookies' if all these conditions are true:
                - Cookies modal not seen yet
                - App completely initialized
                - User is not a Bot
                - User does not have DoNotTrack activated (consider bots as if they have DNT)
            */}
            <ModalRouter
              force={
                !trackingSeen && !initializing && !isBot ? "cookies" : false
              }
              appElement={this.appElement.current}
            >
              <Route exact path="about">
                <AboutWithErrorCatcher />
              </Route>
              <Route exact path="help">
                <HelpWithErrorCatcher />
              </Route>
              <Route exact path="cookies">
                <CookiesWithErrorCatcher
                  {...{ trackOptIn, trackingSeen }}
                  onTrackingSeen={(seen) =>
                    this.setState({ trackingSeen: seen })
                  }
                  onTrackOptIn={(track) => this.setState({ trackOptIn: track })}
                />
              </Route>
            </ModalRouter>

            {/* Menu */}
            <ErrorCatcher origin="AppMenu">
              <AppMenu
                language={language}
                onLanguageChange={handleLanguageChange}
                trackOptIn={trackOptIn}
              />
            </ErrorCatcher>

            <AppHelmet language={language} />

            <header ref={this.appElement} className="App-header" id="page-wrap">
              {/* App Route */}
              <Switch>
                <Route exact path="/live">
                  <LiveWithErrorCatcher />
                </Route>

                <Route exact path="/(directe|directo)">
                  <Redirect to={{ pathname: "live" }} />
                </Route>

                <Route
                  path={
                    "/:year(\\d{4})/:month(\\d{1,2})/:day(\\d{1,2})/:hour(\\d{1,2})/:minute(\\d{1,2})"
                  }
                >
                  <ByDateWithErrorCatcher />
                </Route>

                <Route
                  path={
                    "/:year(\\d{4})/:month(\\d{1,2})/:day(\\d{1,2})/:hour(\\d{1,2})"
                  }
                >
                  <ByDateWithErrorCatcher />
                </Route>

                <Route path={"/:year(\\d{4})/:month(\\d{1,2})/:day(\\d{1,2})"}>
                  <ByDateWithErrorCatcher />
                </Route>

                {/* Set default date to today */}
                <Route exact path=":all(.*)">
                  <RedirectToToday />
                </Route>
              </Switch>
            </header>
          </>
        )}
      </AppProviders>
    );
  }
}

// Get DoNotTrack user preference
// Deactivate tracking by default to users with DNT and to all bots
const AppWrapper = function () {
  const isBot = useMemo(botCheck);
  const dnt = useMemo(() => {
    const navDNT =
      navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;
    return (
      process.env.NODE_ENV === "test" ||
      navDNT === "1" ||
      navDNT === "yes" ||
      isBot
    );
  });
  const defaultLanguage = useMemo(() =>
    Object.prototype.hasOwnProperty.call(available, navigator.language)
      ? navigator.language
      : "en-en",
  );
  const [language, setLanguage] = useState(defaultLanguage);

  return (
    <App
      isBot={isBot}
      dnt={dnt}
      language={language}
      handleLanguageChange={setLanguage}
    />
  );
};

export default AppWrapper;

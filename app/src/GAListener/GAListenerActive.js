import React from 'react';
import { PropTypes } from 'prop-types';
import { withRouter } from "react-router-dom"
import ReactGA from 'react-ga';

class GAListenerActive extends React.Component {

  componentDidMount() {
    const {GACode} = this.props;

    this.loadGoogleTag(GACode);
    ReactGA.initialize(GACode, {
      titleCase: false,
    });
  }

  // Detect language change
  componentDidUpdate(prevProps) {
    if ( prevProps.language !== this.props.language ) {
      this.sendLanguage();
    }
  }

  manageHistory = () => {
    const {history} = this.props;
    this.sendPageView( history.location );
    history.listen( this.sendPageView );
  }

  // Fired on route change
  sendPageView = ({pathname, hash}) => {
    const page = `${pathname}${hash}`;
    console.log(`event: Navigated to '${page}'`);
    ReactGA.set({ page });
    ReactGA.pageview(page);
  }

  sendLanguage = () => {
    const {language} = this.props;
    console.log(`event: Change language to '${language}'`);
    ReactGA.set({ PageLanguage: language });
  }

  loadGoogleTag = (GACode) => {
    // Global site tag (gtag.js) - Google Analytics
    global.dataLayer = global.dataLayer || [];
    global.gtag = function(){ global.dataLayer.push(arguments) }

    global.gtag('js', new Date());
    global.gtag('config', GACode);

    // Load GTag script async
    const scriptTag = document.createElement('script');
    scriptTag.src = `https://www.googletagmanager.com/gtag/js?id=${GACode}`;
    scriptTag.async = true;
    scriptTag.onload = this.onScriptLoad;
    document.body.appendChild(scriptTag);
  }

  onScriptLoad = () => {
    this.sendLanguage();
    this.manageHistory();
    this.props.onLoad();
  }

  removeGA = () => {
    this._ga = ReactGA.ga;
    ReactGA.ga = null;
    global.gtag = [];
    global.dataLayer = [];
  }

  render() {
    return this.props.children;
  }
}

GAListenerActive.defaultProps = {
  language: 'en-en',
  onLoad: () => {},
};

GAListenerActive.propTypes = {
  language: PropTypes.string.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  onLoad: PropTypes.func.isRequired
};

export default withRouter( GAListenerActive );

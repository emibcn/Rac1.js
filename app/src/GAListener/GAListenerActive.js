import React from 'react';
import { PropTypes } from 'prop-types';
import ReactGA from 'react-ga';

class GAListenerActive extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  constructor(){
    super();

    const GACode = 'UA-129704402-1';
    this.loadGoogleTag(GACode);
    ReactGA.initialize(GACode, {
      titleCase: false,
    });
  }

  componentDidMount() {
    this.sendPageView(this.context.router.history.location);
    this.context.router.history.listen(this.sendPageView);
    ReactGA.set({ PageLanguage: this.props.language });
  }

  componentDidUpdate(prevProps) {
    if ( prevProps.language !== this.props.language ) {
      ReactGA.set({ PageLanguage: this.props.language });
    }
  }

  sendPageView(location) {
    ReactGA.set({ page: location.pathname });
    ReactGA.pageview(location.pathname);
  }

  loadGoogleTag(GACode) {
    // Global site tag (gtag.js) - Google Analytics
    global.dataLayer = global.dataLayer || [];
    global.gtag = function(){ global.dataLayer.push(arguments) }

    global.gtag('js', new Date());
    global.gtag('config', GACode);

    // Load GTag script async
    setTimeout(() => {
      let scriptTag = document.createElement('script');
      scriptTag.src = `https://www.googletagmanager.com/gtag/js?id=${GACode}`;
      document.body.appendChild(scriptTag);
    }, 1);
  }

  removeGA() {
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
};

GAListenerActive.propTypes = {
  language: PropTypes.string.isRequired,
};

export default GAListenerActive;
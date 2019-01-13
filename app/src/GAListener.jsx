import React from 'react';
import { PropTypes } from 'prop-types';
import ReactGA from 'react-ga';

class GAListenerProd extends React.Component {
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

  render() {
    return this.props.children;
  }
}

GAListenerProd.defaultProps = {
  language: 'en-en',
};

GAListenerProd.propTypes = {
  language: PropTypes.string.isRequired,
};


// Renders GA+children in production, only children for the rest
class GAListener extends React.Component {
  constructor(){
    super();

    // Get DoNotTrack user preference
    const dnt = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;
    this.dnt = process.env.NODE_ENV !== 'production' || dnt === "1" || dnt === "yes";
  }

  render() {
    const { children, trackOptIn, ...props } = this.props;

    // Disable GA in dev and for people with DoNotTrack HTTP header
    return this.dnt && trackOptIn ?
      children : (
      <GAListenerProd { ...props } >
        { children }
      </GAListenerProd>
    )
  }
}

GAListener.defaultProps = {
  ...GAListenerProd.defaultProps,
  trackOptIn: false,
};

GAListener.propTypes = {
  ...GAListenerProd.propTypes,
  trackOptIn: PropTypes.bool.isRequired,
};

export default GAListener;

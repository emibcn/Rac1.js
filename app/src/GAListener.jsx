import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import ReactGA from 'react-ga';

class GAListener extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };
  static GACode = 'UA-129704402-1';

  constructor(){
     super();
     ReactGA.initialize(this.GACode);
  }

  componentDidMount() {
    this.sendPageView(this.context.router.history.location);
    this.context.router.history.listen(this.sendPageView);
  }

  sendPageView(location) {
    ReactGA.set({ page: location.pathname });
    ReactGA.pageview(location.pathname);
  }

  loadGoogleTag() {
    // Global site tag (gtag.js) - Google Analytics
    global.dataLayer = global.dataLayer || [];
    global.gtag = function(){ global.dataLayer.push(arguments) }

    global.gtag('js', new Date());
    global.gtag('config', 'UA-129704402-1');

    // Load GTag script async
    setTimeout(() => {
      let scriptTag = document.createElement('script');
      scriptTag.src = `https://www.googletagmanager.com/gtag/js?id=${this.GACode}`;
      document.body.appendChild(scriptTag);
    }, 1);
  }


  render() {
    return this.props.children;
  }
}

export default GAListener;

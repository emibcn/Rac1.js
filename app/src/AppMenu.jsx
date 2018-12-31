import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBroadcastTower as faDirecte,
  faCalendarAlt as faByDate,
  faArrowAltCircleUp as faUpgrade,
} from '@fortawesome/free-solid-svg-icons'

import MediaQuery from 'react-responsive';
import {
  slide as SmallMenu,
  slide as BigMenu,
} from 'react-burger-menu'

import './AppMenu.css';

class AppMenu extends React.Component {
  renderLinks() {
    const { newServiceWorkerDetected, children } = this.props;
    const linkStyle = {
    };

    return (
      <div
        style={{
          padding: '3em 1em 1em',
          background: 'url(logo-rac1.png)',
          backgroundSize: 50,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center .5em',
        }}>
        <Link className="bm-item" style={ linkStyle } to="/">
          <FontAwesomeIcon icon={ faByDate } style={{ marginRight: '.5em' }} />
          <span>By date</span>
        </Link>
        <Link className="bm-item" style={ linkStyle } to="/directe">
          <FontAwesomeIcon icon={ faDirecte } style={{ marginRight: '.5em' }} />
          <span>En directe</span>
        </Link>
        { newServiceWorkerDetected ? (
            <a
              href='/'
              className="bm-item"
              style={{ ...linkStyle, color: 'green' }}
              title="New version available!"
              onClick={ this.handleClickUpdate.bind(this) }
              >
              <FontAwesomeIcon icon={ faUpgrade } style={{ marginRight: '.5em' }} />
              <span>Update!</span>
            </a>
          ) : null
        }
        { children }
      </div>
    )
  }

  render() {
    return (
      <MediaQuery minWidth={700}>
        { matches => {
          if ( matches ) {
            return (
              <div className="menu-big">
                <BigMenu
                  pageWrapId="page-wrap"
                  outerContainerId="outer-container"
                  disableCloseOnEsc
                >
                  { this.renderLinks() }
                </BigMenu>
              </div>
            );
          } else {
            return (
              <div className="menu-small">
                <SmallMenu
                  pageWrapId="page-wrap"
                  outerContainerId="outer-container"
                  disableCloseOnEsc
                >
                  { this.renderLinks() }
                </SmallMenu>
              </div>
            );
          }
        }}
      </MediaQuery>
    )
  }

  handleClickUpdate(e) {
    e.preventDefault();
    this.props.onLoadNewServiceWorkerAccept();
  }
}

AppMenu.defaultProps = {
  onLoadNewServiceWorkerAccept: () => {},
  newServiceWorkerDetected: false,
};

AppMenu.propTypes = {
  onLoadNewServiceWorkerAccept: PropTypes.func.isRequired,
  newServiceWorkerDetected: PropTypes.bool.isRequired,
};

export default AppMenu;

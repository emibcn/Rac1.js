import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalendarAlt as faByDate,
  faBroadcastTower as faLive,
  faArrowAltCircleUp as faUpgrade,
} from '@fortawesome/free-solid-svg-icons'

import MediaQuery from 'react-responsive';
import {
  slide as SmallMenu,
  scaleRotate as BigMenu,
} from 'react-burger-menu'

import './AppMenu.css';

class AppMenu extends React.Component {
  constructor() {
    super();
    this.state = {
      isOpen: false,
    };
  }

  renderLinks() {
    const { newServiceWorkerDetected, children } = this.props;

    return (
      <div
        style={{
          padding: '3em 1em 1em',
          background: `url(${ process.env.PUBLIC_URL }/logo-rac1.png)`,
          backgroundSize: 50,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center .5em',
        }}>
        <Link className='bm-item' onClick={ this.handleClick.bind(this) } to="/">
          <FontAwesomeIcon icon={ faByDate } style={{ marginRight: '.5em' }} />
          <span>By date</span>
        </Link>
        <Link className='bm-item' onClick={ this.handleClick.bind(this) } to="/live" >
          <FontAwesomeIcon icon={ faLive } style={{ marginRight: '.5em' }} />
          <span>Live</span>
        </Link>
        { newServiceWorkerDetected ? (
            <a
              href='/'
              className='bm-item'
              style={{ color: 'green' }}
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
    const { newServiceWorkerDetected } = this.props;
    const { isOpen } = this.state;
    const extraClass = newServiceWorkerDetected ? ' news' : '';

    return (
      <MediaQuery minWidth={ 1024 }>
        { matches => {
          const Menu = matches ? BigMenu : SmallMenu;

          return (
            <div className={ `menu-${matches ? 'big' : 'small'}${extraClass}` }>
              <Menu
                pageWrapId='page-wrap'
                outerContainerId='router-container'
                isOpen={ isOpen }
                onStateChange={ state => this.handleMenuStateChange(state.isOpen) }
                disableCloseOnEsc
              >
                { this.renderLinks() }
              </Menu>
            </div>
          )
        }}
      </MediaQuery>
    )
  }

  handleMenuStateChange(isOpen) {
    this.setState({
      isOpen,
    });
  }

  handleClick(e) {
    this.handleMenuStateChange(false);
  }

  handleClickUpdate(e) {
    e.preventDefault();
    this.handleMenuStateChange(false);
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

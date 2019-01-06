import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

import { translate } from "react-translate"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalendarAlt as faByDate,
  faBroadcastTower as faLive,
  faArrowAltCircleUp as faUpgrade,
  faLanguage,
  faCaretRight,
  faCaretDown,
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
      isLanguageOpen: false,
    };
  }

  renderLinks() {
    const { newServiceWorkerDetected, children, t } = this.props;
    const { isLanguageOpen } = this.state;

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
          <span>{ t("By date") }</span>
        </Link>
        <Link className='bm-item' onClick={ this.handleClick.bind(this) } to="/live" >
          <FontAwesomeIcon icon={ faLive } style={{ marginRight: '.5em' }} />
          <span>{ t("Live") }</span>
        </Link>
        { newServiceWorkerDetected ? (
            <a
              href='/'
              className='bm-item'
              style={{ color: 'green' }}
              title={ t("New version available!") }
              onClick={ this.handleClickUpdate.bind(this) }
              >
              <FontAwesomeIcon icon={ faUpgrade } style={{ marginRight: '.5em' }} />
              <span>{ t("Update!") }</span>
            </a>
          ) : null
        }
        <a
          href='/'
          className='bm-item'
          title={ t("Change application language") }
          onClick={ this.handleLanguageSectionClick.bind(this) }
          >
          <FontAwesomeIcon icon={ faLanguage } style={{ marginRight: '.5em' }} />
          <span>{ t("Language") }</span>
          <FontAwesomeIcon
            icon={ isLanguageOpen ? faCaretDown : faCaretRight }
            style={{ marginLeft: '.5em' }} />
        </a>
        { isLanguageOpen ? (
          <ul style={{
            listStyleType: 'none',
            marginTop: 0,
          }}>
            { [
                {code: 'ca', name: "Català"},
                {code: 'es', name: "Castellano"},
                {code: 'en', name: "English"},
              ].map( lang => (
                <li key={ lang.code } >
                  <a
                    href='/'
                    className='bm-item'
                    title={ t(`Change language to ${lang.name}`) }
                    onClick={ this.handleClickLanguage.bind(this, lang.code) }
                  >
                    <span>{ lang.name }</span>
                  </a>
                </li>
              ))
            }
          </ul>
        ) : null }
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

  handleLanguageSectionClick(e) {
    const { isLanguageOpen } = this.state;
    e.preventDefault();
    this.setState({
      ...this.state,
      isLanguageOpen: !isLanguageOpen
    });
  }

  handleClickLanguage(language, e) {
    e.preventDefault();
    this.handleMenuStateChange(false);
    this.props.onLanguageChange(language);
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
  onLanguageChange: (language) => {},
};

AppMenu.propTypes = {
  onLoadNewServiceWorkerAccept: PropTypes.func.isRequired,
  newServiceWorkerDetected: PropTypes.bool.isRequired,
  onLanguageChange: PropTypes.func.isRequired,
};

export default translate('AppMenu')(AppMenu);

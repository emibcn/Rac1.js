import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

import { translate } from "react-translate";
import Switch from "rc-switch";
import "rc-switch/assets/index.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt as faByDate,
  faBroadcastTower as faLive,
  faArrowAltCircleUp as faUpgrade,
  faInfoCircle as faAbout,
  faQuestionCircle as faHelp,
  faBalanceScale as faCookies,
  faLanguage,
  faCaretRight,
  faCaretDown,
} from "@fortawesome/free-solid-svg-icons";

import MediaQuery from "react-responsive";
import { slide as SmallMenu, scaleRotate as BigMenu } from "react-burger-menu";

import { withGAEvent } from "./GAListener";
import { withServiceWorkerUpdater } from "@3m1/service-worker-updater";
import "./AppMenu.css";

class AppMenu extends React.Component {
  constructor(props) {
    super();

    this.state = {
      isOpen: false,
      isLanguageOpen: false,
    };
  }

  renderLinks() {
    const { newServiceWorkerDetected, trackOptIn, children, t } = this.props;
    const { isLanguageOpen } = this.state;

    return (
      <div
        style={{
          padding: "3em 1em 1em",
          background: `url(${process.env.PUBLIC_URL}/logo-rac1.png)`,
          backgroundSize: 50,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center .5em",
        }}
      >
        <NavLink
          className="bm-item"
          onClick={this.handleClick}
          isActive={(match, location) =>
            location.pathname.match(/\/\d{4}(\/\d{1,2}){2,4}(#.*)?$/)
          }
          to="/"
          title={t(
            "Play podcasts filtered by date and ordered chronologically"
          )}
        >
          <FontAwesomeIcon icon={faByDate} style={{ marginRight: ".5em" }} />
          <span>{t("By date")}</span>
        </NavLink>
        <NavLink
          className="bm-item"
          onClick={this.handleClick}
          to="/live"
          title={t("Play live stream")}
        >
          <FontAwesomeIcon icon={faLive} style={{ marginRight: ".5em" }} />
          <span>{t("Live")}</span>
        </NavLink>
        <NavLink
          className="bm-item"
          onClick={this.handleClickModal}
          to="#about"
          isActive={(match, location) => location.hash === "#about"}
          title={t("Information about this app and its author")}
        >
          <FontAwesomeIcon icon={faAbout} style={{ marginRight: ".5em" }} />
          <span>{t("About")}</span>
        </NavLink>
        <NavLink
          className="bm-item"
          onClick={this.handleClickModal}
          to="#help"
          isActive={(match, location) => location.hash === "#help"}
          title={t("Help using this app")}
        >
          <FontAwesomeIcon icon={faHelp} style={{ marginRight: ".5em" }} />
          <span>{t("Help")}</span>
        </NavLink>
        <NavLink
          className="bm-item"
          onClick={this.handleClickModal}
          to="#cookies"
          isActive={(match, location) => location.hash === "#cookies"}
          title={t("Allow tracking user interactions for usage analysis")}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <FontAwesomeIcon icon={faCookies} style={{ marginRight: ".5em" }} />
            <span style={{ marginRight: ".5em" }}>{t("Privacy policy")}</span>
            <Switch
              onChange={() => {}}
              disabled={false}
              checkedChildren={t("Yes")}
              unCheckedChildren={t("No")}
              checked={trackOptIn}
              style={{ minWidth: "3.5em" }}
            />
          </span>
        </NavLink>
        {newServiceWorkerDetected ? (
          <a
            href="/"
            className="bm-item"
            style={{ color: "green" }}
            title={t("New version available!")}
            onClick={this.handleClickUpdate}
          >
            <FontAwesomeIcon icon={faUpgrade} style={{ marginRight: ".5em" }} />
            <span>{t("Update!")}</span>
          </a>
        ) : null}
        <a
          href="/"
          className="bm-item"
          title={t("Change application language")}
          onClick={this.handleLanguageSectionClick}
        >
          <FontAwesomeIcon icon={faLanguage} style={{ marginRight: ".5em" }} />
          <span>{t("Language")}</span>
          <FontAwesomeIcon
            icon={isLanguageOpen ? faCaretDown : faCaretRight}
            style={{ marginLeft: ".5em" }}
          />
        </a>
        {isLanguageOpen ? (
          <ul
            style={{
              listStyleType: "none",
              marginTop: 0,
            }}
          >
            {[
              { code: "ca", name: "Català" },
              { code: "es", name: "Castellano" },
              { code: "en", name: "English" },
            ].map((lang) => (
              <li key={lang.code}>
                <a
                  href="/"
                  className="bm-item"
                  title={t(`Change language to ${lang.name}`)}
                  onClick={this.handleClickLanguage.bind(this, lang.code)}
                >
                  <span>{lang.name}</span>
                </a>
              </li>
            ))}
          </ul>
        ) : null}
        {children}
      </div>
    );
  }

  render() {
    const { newServiceWorkerDetected } = this.props;
    const { isOpen } = this.state;
    const extraClass = newServiceWorkerDetected ? " news" : "";

    return (
      <MediaQuery minWidth={1024}>
        {(matches) => {
          const Menu = matches ? BigMenu : SmallMenu;

          return (
            <div className={`menu-${matches ? "big" : "small"}${extraClass}`}>
              <Menu
                pageWrapId="page-wrap"
                outerContainerId="router-container"
                isOpen={isOpen}
                onStateChange={this.handleMenuStateChange}
                disableCloseOnEsc
              >
                {this.renderLinks()}
              </Menu>
            </div>
          );
        }}
      </MediaQuery>
    );
  }

  handleMenuIsOpenChange = (isOpen) => {
    if (isOpen !== this.state.isOpen) {
      this.setState({
        isOpen,
      });
      this.props.sendEvent(
        "Menu",
        "Change open state",
        `Menu is open: ${isOpen}`
      );
    }
  };

  handleMenuStateChange = (state) => this.handleMenuIsOpenChange(state.isOpen);
  closeMenu = () => this.handleMenuIsOpenChange(false);

  handleClick = (e) => {
    this.closeMenu();
    this.props.sendEvent("Menu", "Click link", `${e.currentTarget.text}`);
  };

  handleClickModal = (e) => {
    this.closeMenu();
    this.props.sendEvent("Menu", "Click modal", `${e.currentTarget.text}`);
  };

  handleLanguageSectionClick = (e) => {
    const { isLanguageOpen } = this.state;
    e.preventDefault();
    this.setState({ isLanguageOpen: !isLanguageOpen });
  };

  handleClickLanguage = (language, e) => {
    e.preventDefault();
    this.closeMenu();
    this.props.onLanguageChange(language);
    this.props.sendEvent(
      "Menu",
      "Change language",
      `Current language: ${language}`
    );
  };

  handleClickUpdate = (e) => {
    e.preventDefault();
    this.closeMenu();
    this.props.onLoadNewServiceWorkerAccept();
    this.props.sendEvent("Menu", "Update!");
  };
}

AppMenu.defaultProps = {
  onLoadNewServiceWorkerAccept: () => {},
  newServiceWorkerDetected: false,
  onLanguageChange: (language) => {},
  trackOptIn: false,
  sendEvent: (origin, help, status) => {},
};

AppMenu.propTypes = {
  onLoadNewServiceWorkerAccept: PropTypes.func.isRequired,
  newServiceWorkerDetected: PropTypes.bool.isRequired,
  onLanguageChange: PropTypes.func.isRequired,
  trackOptIn: PropTypes.bool.isRequired,
  sendEvent: PropTypes.func.isRequired,
};

export default translate("AppMenu")(
  withGAEvent(withServiceWorkerUpdater(AppMenu))
);

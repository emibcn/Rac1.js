import React from "react";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";

import Modal from "react-modal";
import { translate } from "react-translate";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle as faClose } from "@fortawesome/free-solid-svg-icons";

import withLocationAndHistory from "./withLocationAndHistory";
import "./ModalRouter.css";

if (process.env.NODE_ENV !== "test") {
  Modal.setAppElement("#root");
}

const CloseModal = function () {
  const history = useHistory();

  React.useEffect(() => {
    if (history.location.hash !== "") {
      const timer = global.setTimeout(() => history.push("#"), 10);
      return () => global.cancelTimeout(timer);
    }
  }, [history]);

  return null;
};

class ModalRouterInner extends React.PureComponent {
  constructor(props) {
    super();

    // Set initial state
    this.history = props.history;
    this.state = {
      ...this.getPathState(props.location),
      autoForce: false,
      forced: props.force,
    };
  }

  componentDidMount() {
    // Register history change event listener
    this.unlisten = this.history.listen(this.handleHistoryChange);
  }

  getPathState(location) {
    const path = location.hash.replace(/[^#]*#(.*)$/, "$1");
    return {
      modalIsOpen: Boolean(path.length) && path !== "close",
      path,
      initialPath: this.state ? this.state.initialPath : path,
    };
  }

  componentWillUnmount() {
    // Unregister history change event listener
    this.unlisten();
    if (this.timer) {
      global.clearTimeout(this.timer);
    }
  }

  // Force user to different URLs
  componentDidUpdate(prevProps, prevState) {
    // Remember old URL when forcing
    if (
      this.props.force !== false &&
      this.props.force !== prevProps.force &&
      this.state.forced !== this.props.force
    ) {
      this.setState({ forced: this.props.force });
    }

    // Clear autoForce after it has been forced
    if (this.state.autoForce === this.state.path) {
      this.setState({ autoForce: false });
    }

    // Force old modal after forcing another (do auto force)
    if (
      prevState.path === this.state.forced &&
      prevState.path !== this.state.path &&
      this.state.initialPath !== false &&
      this.state.initialPath.length > 1 &&
      this.state.autoForce !== this.state.initialPath
    ) {
      this.setState({ autoForce: this.state.initialPath });
    }
  }

  openModal = () => this.setState({ modalIsOpen: true });

  closeModal = (propsClose = {}) => {
    if (!("history" in propsClose) || propsClose.history.location.hash !== "") {
      if (!this.timer) {
        this.timer = global.setTimeout(() => {
          this.history.push("#");
          this.timer = undefined;
        }, 10);
      }
    }
  };

  handleHistoryChange = (location, action) => {
    const state = this.getPathState(location);
    this.setState(state);
  };

  render() {
    const { children, initializing, force, appElement, t } = this.props;
    const { autoForce, path, forced } = this.state;

    if (initializing) {
      return null;
    }

    // Redirect to forced URL
    if (force !== false && force !== path) {
      return <Redirect push to={{ hash: force }} />;
    }

    // If previously have been forced when showing a modal,
    // force to go back there once the forced has been visited
    if (autoForce !== false && autoForce !== path && forced !== path) {
      return <Redirect push to={{ hash: autoForce }} />;
    }

    return (
      <Modal
        appElement={appElement}
        isOpen={this.state.modalIsOpen}
        onAfterOpen={this.openModal}
        onRequestClose={this.closeModal}
        contentLabel={t("Dialog")}
        closeTimeoutMS={200}
        aria={{
          labelledby: "modal_heading",
          describedby: "modal_description",
        }}
        style={{
          overlay: {
            zIndex: 2000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
          content: {
            top: "auto",
            left: "auto",
            right: "auto",
            bottom: "auto",
            borderRadius: "1em",
            padding: "1em 2em 2em 2em",
            margin: "0 -.25em 0 0",
            maxHeight: "80vh",
            minHeight: "50vh",
            maxWidth: "70vw",
            minWidth: "50vw",
            textAlign: "center",
          },
        }}
      >
        <button
          style={{
            position: "absolute",
            right: ".5em",
            background: "transparent",
            border: "0",
            color: "#c33",
            fontSize: "20px",
            cursor: "pointer",
          }}
          title={t("Close modal")}
          aria-label={t("Close modal")}
          onClick={this.closeModal}
        >
          <FontAwesomeIcon icon={faClose} />
        </button>
        <Switch location={{ pathname: path }}>
          {children}

          {/* Close modal if nothing is shown */}
          <Route>
            <CloseModal />
          </Route>
        </Switch>
      </Modal>
    );
  }
}

const ModalRouterHidrated = withLocationAndHistory(ModalRouterInner);

const ModalRouter = function (props) {
  const { children, ...rest } = props;
  return (
    <Route path=":path(.*)">
      <ModalRouterHidrated {...{ children, ...rest }} />
    </Route>
  );
};

export default translate("ModalRouter")(ModalRouter);

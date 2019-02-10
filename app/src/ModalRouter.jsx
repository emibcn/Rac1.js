import React from 'react';
import {
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import Modal from 'react-modal';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTimesCircle as faClose,
} from '@fortawesome/free-solid-svg-icons'

import './ModalRouter.css';

Modal.setAppElement('#root')

class CloseModal extends React.PureComponent {
  constructor(props) {
    super();

    if ( !('history' in props) ||
         props.history.location.hash !== '' ) {
      global.setTimeout( () => props.history.push('#'), 10);
    }
  }

  render() {
    return null;
  }
};

class ModalRouterInner extends React.PureComponent {

  constructor(props) {
    super();

    // Register history change event listener
    this.history = props.history;
    this.unlisten = this.history.listen(this.handleHistoryChange.bind(this));

    // Set initial state
    this.state = {
      ...this.getPathState(props.location),
      autoForce: false,
    };
  }

  getPathState(location) {
    const path = location.hash.replace(/#(.*)$/, '$1');
    return {
      modalIsOpen: !!path.length && path !== 'close',
      path,
      previous: this.state ? this.state.path : false,
    };
  }

  componentWillUnmount() {
    // Unregister history change event listener
    this.unlisten();
    if ( this.timer ) {
      global.clearTimeout( this.timer );
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // Clear autoForce after it has been forced
    if ( this.state.autoForce === this.state.path ) {
      this.setState({ autoForce: false });
    }

    // Remember current path when forcing to force after this
    if ( prevProps.force !== false &&
         this.state.path === this.props.force &&
         prevState.previous === false &&
         this.state.previous === prevState.path &&
         this.state.previous !== this.state.autoForce &&
         this.state.autoForce === false) {
      this.setState({ autoForce: this.state.previous });
    }
  }

  openModal() {
    this.setState({modalIsOpen: true})
  }

  closeModal(propsClose={}) {
    if ( !('history' in propsClose) ||
         propsClose.history.location.hash !== '' ) {

      if(!this.timer) {
        this.timer = global.setTimeout( () => {
          this.history.push('#');
          this.timer = undefined;
        }, 10);
      }
    }
  }

  handleHistoryChange(location, action) {
    const state = this.getPathState(location);
    this.setState(state);
  }

  render() {
    const { children, force } = this.props;
    const { autoForce } = this.state;

    // Redirect to forced URL
    if ( force !== false && force !== this.state.path ) {
      return <Redirect push to={{ hash: force }} />;
    }

    // If previously have been forced when showing a modal,
    // force to go back there once the forced has been visited
    if ( autoForce !== false && autoForce !== this.state.path && autoForce !== this.state.previous ) {
      return <Redirect push to={{ hash: autoForce }} />;
    }

    return (
      <Modal
        isOpen={ this.state.modalIsOpen }
        onAfterOpen={ this.openModal.bind(this) }
        onRequestClose={ this.closeModal.bind(this) }
        contentLabel='Dialog'
        closeTimeoutMS={ 200 }
        aria={{
          labelledby: 'modal_heading',
          describedby: 'modal_description',
        }}
        style={{
          overlay: {
            zIndex: 2000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          },
          content: {
            top: 'auto',
            left: 'auto',
            right: 'auto',
            bottom: 'auto',
            borderRadius: '1em',
            padding: '1em 2em 2em 2em',
            margin: '0 -.25em 0 0',
            maxHeight: '80vh',
            minHeight: '50vh',
            maxWidth: '70vw',
            minWidth: '50vw',
            textAlign: 'center',
          },
        }}
      >
        <button
          style={{
            position: 'absolute',
            right: '.5em',
            background: 'transparent',
            border: '0',
            color: '#c33',
            fontSize: '20px',
            cursor: 'pointer',
          }}
          title={ 'Close modal' }
          aeia-label={ 'Close modal' }
          onClick={ () => this.closeModal() }
        >
          <FontAwesomeIcon icon={ faClose } />
        </button>
        <Switch location={ { pathname: this.state.path } } >

          { children }

          {/* Close modal if nothing is shown */}
          <Route render={ props => <CloseModal { ...props } /> } />
        </Switch>
      </Modal>
    );
  }
}

class ModalRouter extends React.PureComponent {
  render() {
    const { children, ...rest } = this.props;
    return (
      <Route
        path=':path(.*)'
        render={ props => <ModalRouterInner { ...{ children, ...rest, ...props } } /> }
      />
    );
  }
}

export default ModalRouter;

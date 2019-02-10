import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';
import Modal from 'react-modal';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTimesCircle as faClose,
} from '@fortawesome/free-solid-svg-icons'

import './ModalRouter.css';

Modal.setAppElement('#root')

class CloseModal extends React.Component {
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

class ModalRouterInner extends React.Component {

  constructor(props) {
    super();

    // Register history change event listener
    this.history = props.history;
    this.unlisten = this.history.listen(this.handleHistoryChange.bind(this));

    // Set initial state
    this.state = this.getPathState(props.location);
  }

  getPathState(location) {
    const path = location.hash.replace(/#(.*)$/, '$1');
    return {
      modalIsOpen: !!path.length && path !== 'close',
      path,
    };
  }

  componentWillUnmount() {
    // Unregister history change event listener
    this.unlisten();
    if ( this.timer ) {
      global.clearTimeout( this.timer );
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
    const { children } = this.props;
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

          {/* Close modal */}
          <Route render={ props => <CloseModal { ...props } /> } />
        </Switch>
      </Modal>
    );
  }
}

class ModalRouter extends React.Component {
  render() {
    const { children } = this.props;
    return (
      <Route
        path=':path(.*)'
        render={ props => <ModalRouterInner { ...{ children, ...props } } /> }
      />
    );
  }
}

export default ModalRouter;

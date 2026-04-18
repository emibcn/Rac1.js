import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Route,
  Routes,
  Navigate,
  useLocation,
  useNavigate
} from 'react-router-dom'

import Modal from 'react-modal'
import { translate } from 'react-translate'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle as faClose } from '@fortawesome/free-solid-svg-icons'

import withLocationAndHistory from './withLocationAndHistory'
import './ModalRouter.css'

if (process.env.NODE_ENV !== 'test') {
  Modal.setAppElement('#root')
}

// Utility: Parse modal from hash
const parseModalFromHash = (hash) => {
  const modalPath = hash.split('#')[1] ?? ''
  const isValidModal = Boolean(modalPath && modalPath !== 'close')

  return {
    modalIsOpen: isValidModal,
    modalPath: isValidModal ? modalPath : ''
  }
}

const CloseModal = () => {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Only close if there's actually a modal open
    if (location.hash) {
      console.log('Closing modal via CloseModal')
      navigate('#', { replace: true })
    }
  }, [location.hash, navigate])

  return null
}

// Main Modal Router Component
const ModalRouterInner = ({
  children,
  initializing,
  force,
  appElement,
  t,
  navigate,
  location
}) => {
  // Initialize state from current hash
  const [modalState, setModalState] = useState(() => {
    const { modalIsOpen, modalPath } = parseModalFromHash(location.hash || '')
    console.log('ModalRouterInner: useState modalState', {
      modalIsOpen,
      modalPath
    })
    return {
      modalIsOpen,
      modalPath,
      autoForce: false,
      forced: force,
      pendingRestore: modalPath
    }
  })

  console.log('ModalRouterInner: modalState', modalState)

  // Memoize modal location to prevent unnecessary re-renders
  const modalLocation = useMemo(
    () => ({
      pathname: `/${modalState.modalPath}`,
      hash: '',
      search: '',
      state: null
    }),
    [modalState.modalPath]
  )

  // Handle force prop changes
  useEffect(() => {
    console.log('ModalRouterInner: Handle force prop changes')
    if (force !== false && force !== modalState.forced) {
      setModalState((prev) => ({ ...prev, forced: force }))
    }
  }, [force, modalState.forced])

  // Handle hash changes from navigation
  useEffect(() => {
    console.log('ModalRouterInner: Handle hash changes from navigation')
    const { modalIsOpen, modalPath } = parseModalFromHash(location.hash)
    setModalState((prev) => ({
      ...prev,
      modalIsOpen,
      modalPath,
      // Clear autoForce when user manually changes modal
      autoForce: prev.autoForce && modalPath ? prev.autoForce : false
    }))
  }, [location.hash])

  // Handle auto-force logic (restore original modal after forced modal closes)
  useEffect(() => {
    console.log('ModalRouterInner: Handle auto-force logic')
    // Clear autoForce after it's been applied
    if (modalState.autoForce === modalState.modalPath) {
      setModalState((prev) => ({
        ...prev,
        autoForce: false,
        pendingRestore: null
      }))
    }

    // Restore original modal after forced modal closes
    const shouldRestore =
      modalState.forced !== false && // We had a forced modal
      modalState.forced !== modalState.modalPath && // It's now different
      modalState.pendingRestore && // We have something to restore
      modalState.autoForce !== modalState.pendingRestore && // Not already restoring
      modalState.modalPath === '' // Modal just closed

    if (shouldRestore) {
      console.log(
        'ModalRouterInner: Restoring original modal:',
        modalState.pendingRestore
      )
      setModalState((prev) => ({
        ...prev,
        autoForce: prev.pendingRestore,
        pendingRestore: null
      }))
    }
  }, [
    modalState.modalPath,
    modalState.forced,
    modalState.pendingRestore,
    modalState.autoForce
  ])

  const openModal = useCallback(() => {
    console.log('ModalRouterInner: openModal useCallback')
    setModalState((prev) => ({ ...prev, modalIsOpen: true }))
  }, [])

  const closeModal = useCallback(() => {
    if (modalState.modalPath !== '') {
      console.log('Closing modal via button')
      navigate('#', { replace: true })
      setModalState((prev) => ({ ...prev, modalIsOpen: false, modalPath: '' }))
    }
  }, [modalState.modalPath, navigate])

  // If wrapper app is initializing, do nothing or we'll mess up things
  if (initializing) {
    return null
  }

  // Redirect to forced URL (e.g., show cookie modal)
  if (force !== false && force !== modalState.modalPath) {
    const newHash = `#${force}`
    console.log('ModalRouterInner: Force redirect to:', newHash)
    return <Navigate to={newHash} replace />
  }

  // Auto-force redirect (restore original modal after closing the forced one)
  if (
    modalState.autoForce !== false &&
    modalState.autoForce !== modalState.modalPath &&
    modalState.forced !== modalState.modalPath
  ) {
    console.log(
      'ModalRouterInner: AutoForce redirect to autoforce: modalState:',
      modalState
    )
    const newHash = `#${modalState.autoForce}`
    console.log('ModalRouterInner: AutoForce redirect to:', newHash)
    return <Navigate to={newHash} replace />
  }

  return (
    <Modal
      appElement={appElement}
      isOpen={modalState.modalIsOpen}
      onAfterOpen={openModal}
      onRequestClose={closeModal}
      contentLabel={t('Dialog')}
      closeTimeoutMS={200}
      aria={{
        labelledby: 'modal_heading',
        describedby: 'modal_description'
      }}
      style={{
        overlay: {
          zIndex: 2000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
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
          textAlign: 'center'
        }
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
          cursor: 'pointer'
        }}
        title={t('Close modal')}
        aria-label={t('Close modal')}
        onClick={closeModal}
      >
        <FontAwesomeIcon icon={faClose} />
      </button>

      <Routes location={modalLocation}>
        {children}

        {/* Close modal if nothing matches */}
        <Route path='*' element={<CloseModal />} />
      </Routes>
    </Modal>
  )
}

// Wrap with HOC
const ModalRouterInnerHidrated = withLocationAndHistory(ModalRouterInner)

// Main ModalRouter component
const ModalRouter = function ({ children, ...rest }) {
  const { hash } = useLocation()

  console.log('ModalRouter:', { props: { children, ...rest }, hash })

  return (
    <Routes>
      <Route
        path='*'
        element={<ModalRouterInnerHidrated {...{ children, hash, ...rest }} />}
      />
    </Routes>
  )
}

export default translate('ModalRouter')(ModalRouter)

import React from 'react'
import PropTypes from 'prop-types'

import { translate } from 'react-translate'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faQuestionCircle as faHelp,
  faPlay as faArrow
} from '@fortawesome/free-solid-svg-icons'

function Key ({ k }) {
  return (
    <pre style={{ display: 'inline' }} title={k}>
      {k}
    </pre>
  )
}

Key.propTypes = {
  k: PropTypes.string.isRequired
}

function Arrow (props) {
  return (
    <FontAwesomeIcon icon={faArrow} {...props} style={{ marginRight: '1em' }} />
  )
}

function Help ({ t }) {
  return (
    <>
      <h1 id='modal_heading'>
        <FontAwesomeIcon icon={faHelp} style={{ marginRight: '.5em' }} />
        {t('Help')}
      </h1>
      <div id='modal_description' style={{ textAlign: 'left' }}>
        <h3>{t('Key bindings:')}</h3>
        <ul>
          <li>
            <Arrow flip='horizontal' />
            <Key k={t('ArrowLeft')} />: {t('Go backwards 10 seconds')}
          </li>
          <li>
            <Arrow className='fa-rotate-270' />
            <Key k={t('ArrowUp')} />: {t('Go backwards 1 minute')}
          </li>
          <li>
            <Key k={t('PageUp')} />: {t('Go backwards 10 minutes')}
          </li>
          <li>
            <Arrow />
            <Key k={t('ArrowRight')} />: {t('Go forward 10 seconds')}
          </li>
          <li>
            <Arrow className='fa-rotate-90' />
            <Key k={t('ArrowDown')} />: {t('Go forward 1 minute')}
          </li>
          <li>
            <Key k={t('PageDown')} />: {t('Go forward 10 minutes')}
          </li>
          <li>
            <Key k={t('SHIFT')} /> + <Key k={t('ArrowUp')} /> /{' '}
            <Key k={t('ArrowDown')} /> {t('or')} <Key k='*' /> / <Key k='/' />:{' '}
            {t('Adjust volume')}
          </li>
          <li>
            <Key k={t('Space')} /> / <Key k='P' />: {t('Toggle Play/Pause')}
          </li>
          <li>
            <Key k='M' />: {t('Mute')} / {t('Unmute')}
          </li>
          <li>
            <Key k={t('Enter')} />: {t('Play next podcast')}
          </li>
          <li>
            <Key k={t('SHIFT')} /> + <Key k={t('Enter')} />:{' '}
            {t('Play previous podcast')}
          </li>
          <li>
            <Key k='R' />: {t('Update the list of podcasts')}
          </li>
        </ul>
        <p>
          {t(
            'Good UI controls for use with mobile devices: big buttons, disabled key bindings.'
          )}
        </p>
      </div>
    </>
  )
}

Help.propTypes = {
  t: PropTypes.func.isRequired
}

export default translate('Help')(Help)

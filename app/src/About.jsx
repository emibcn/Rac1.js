import React from 'react'

import { translate } from 'react-translate'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle as faAbout } from '@fortawesome/free-solid-svg-icons'

class About extends React.Component {
  render () {
    const { t } = this.props
    return (
      <>
        <h1 id='modal_heading'>
          <FontAwesomeIcon icon={faAbout} style={{ marginRight: '.5em' }} />
          {t('About')}
        </h1>
        <div id='modal_description' style={{ textAlign: 'left' }}>
          <p>
            {t('Play Rac1 catalan radio station podcasts or live emission.')}
          </p>
          <p>
            <span>
              {t(
                'I made this app for fun and for learning how to use the React library.'
              )}{' '}
            </span>
            {t('This app is served using GitHub Pages.')}
          </p>
          <h3>{t('Want more information?')}</h3>
          <p>
            <a
              target='_blank'
              rel='noopener noreferrer'
              href='https://github.com/emibcn/Rac1.js'
            >
              {t('The source code is publicly available.')}
            </a>{' '}
            {t(
              'There, you can find more information about how it has been done, licence and credits.'
            )}
          </p>
          <h3>{t('Found a bug? Have a petition?')}</h3>
          <p>
            <a
              target='_blank'
              rel='noopener noreferrer'
              href='https://github.com/emibcn/Rac1.js/issues'
            >
              {t('Create an issue at GitHub.')}
            </a>
          </p>
        </div>
      </>
    )
  }
}

export default translate('About')(About)

import React from 'react';
import PropTypes from 'prop-types';

import { translate } from 'react-translate'
import Switch from 'rc-switch';
import 'rc-switch/assets/index.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBalanceScale as faCookies
} from '@fortawesome/free-solid-svg-icons'

import { withGAEvent } from './GAListener';

import raw from "raw.macro";
const legal = raw("./legal.html");

class Cookies extends React.Component {
  render() {
    const { t, trackOptIn } = this.props;
    return (
      <React.Fragment>
        <h1 id='modal_heading'>
          <FontAwesomeIcon icon={ faCookies } style={{ marginRight: '.5em' }} />
          { t("Privacy policy") }
        </h1>
        <div id='modal_description' style={{ textAlign: 'left' }}>
          <p>
            { t("This site uses cookies and other tracking technologies to assist with navigation and your ability to provide feedback, analyse your use of our products and services, assist with our promotional and marketing efforts, and provide content from third parties.") }
          </p>
          <details>
            <div dangerouslySetInnerHTML={{ __html: legal }} />
          </details>
        </div>
        <p><span style={{
          display: 'inline-flex',
          alignItems: 'center',
        }}>
          <Switch
            onChange={ this.handleClickTrackOptIn.bind(this) }
            disabled={ false }
            checkedChildren={ t('Yes') }
            unCheckedChildren={ t('No') }
            checked={ trackOptIn }
          />
          <a
            href='/'
            className='bm-item'
            title={ t("Allow tracking user interactions for usage analysis") }
            onClick={ this.handleClickTrackOptIn.bind(this) }
            >
            { t('Allow tracking') }
          </a>
        </span></p>
        <p><i>
          { t("We need to reload the page when you change this option in order to ensure it is taken completely into account.") }
        </i></p>
      </React.Fragment>
    )
  }

  handleClickTrackOptIn(e) {
    if ( typeof e !== 'boolean' && 'preventDefault' in e ) {
      e.preventDefault();
    }
    this.props.onTrackOptIn(!this.props.trackOptIn)
    this.props.sendEvent('Menu', 'Change tracking preference', `Current tracking preference: ${!this.props.trackOptIn}`);
    window.location.reload();
  }
}

Cookies.defaultProps = {
  onTrackOptIn: optIn => {},
};

Cookies.propTypes = {
  onTrackOptIn: PropTypes.func.isRequired,
  trackOptIn: PropTypes.bool.isRequired,
};

export default translate('Cookies')(withGAEvent(Cookies));
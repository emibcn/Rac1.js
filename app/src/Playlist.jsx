import React, { Component } from 'react';
import PropTypes from 'prop-types';

import DatePicker from 'react-date-picker'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSyncAlt as faRefresh,
  faCalendarAlt as faCalendar,
} from '@fortawesome/free-solid-svg-icons'

class Playlist extends Component {
  render() {
    const { completedDownload, date, children, maxDate } = this.props;

    return (
      <div
        style={{
          color: "#777",
          backgroundColor: "white",
          padding: "2em",
          borderRadius: "1em",
          margin: "1em",
          textAlign: "left",
          position: "relative",
        }}>
        <button
          onClick={ this.props.onClickReload.bind(this) }
          disabled={ !completedDownload }
          style={{
            borderRadius: ".5em",
            padding: ".25em",
            margin: "1.5em",
            position: "absolute",
            top: 0,
            right: 0,
          }}
        >
          <div style={{
            fontSize: 'calc(.5em + 2vmin)',
            fontWeight: 'bold',
            marginBottom: '-.25em'
          }}>
            <FontAwesomeIcon icon={faRefresh} />
          </div>
          <span style={{
            fontSize: 'calc(5px + 1vmin)',
            color: '#777'
          }}>
            Reload
          </span>
        </button>
        <div style={{ textAlign: 'center', fontSize: 'large' }}>
          <DatePicker
            onChange={ this.handleDateChange.bind(this) }
            onBlur={ this.handleDateBlur.bind(this) }
            minDate={ new Date(2015, 5, 1) /* 1st date with HOUR podcasts */ }
            maxDate={ maxDate }
            required={ true }
            value={ date }
            clearIcon={ null }
            calendarIcon={ <FontAwesomeIcon icon={faCalendar} /> }
          />
          { children }
        </div>
      </div>
    );
  }

  handleDateChange(date) {
    date.setHours(0);
    date.setMinutes(0);
    this.props.onDateChange(date);
  }

  handleDateBlur(e) {
    let focus = true;
    if(e && e.relatedTarget &&
      e.relatedTarget.className.match(/(calendar|date-?picker)/)) {
      focus = false;
    }

    if(focus) {
      this.props.onDateBlur(e);
    }
  }
}


Playlist.defaultProps = {
  onClickReload: (e) => {},
  onDateBlur: (e) => {},
  onDateChange: (e) => {},
  completedDownload: true,
  date: new Date(),
  maxDate: new Date(),
};

Playlist.propTypes = {
  onClickReload: PropTypes.func.isRequired,
  onDateBlur: PropTypes.func.isRequired,
  onDateChange: PropTypes.func.isRequired,
  completedDownload: PropTypes.bool.isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
  maxDate: PropTypes.instanceOf(Date).isRequired,
};

export default Playlist;

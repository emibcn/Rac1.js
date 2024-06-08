import React from "react";
import PropTypes from "prop-types";

import { translate } from "react-translate";
import DatePicker from "react-date-picker";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSyncAlt as faRefresh,
  faCalendarAlt as faCalendar,
} from "@fortawesome/free-solid-svg-icons";

import PodcastsList from "./PodcastsList";
import Podcast from "./Podcast";

import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";

const UpdateButton = translate("UpdateButton")((props) => {
  const { t, ...restProps } = props;
  const text = t("Update");
  return (
    <button
      {...restProps}
      aria-label={text}
      style={{
        borderRadius: ".5em",
        padding: ".25em",
        margin: "0 0 0 1em",
      }}
    >
      <div
        style={{
          fontSize: "calc(.5em + 2vmin)",
          fontWeight: "bold",
          marginBottom: "-.25em",
        }}
      >
        <FontAwesomeIcon icon={faRefresh} />
      </div>
      <span
        style={{
          fontSize: "calc(5px + 1vmin)",
          color: "#333",
        }}
      >
        {text}
      </span>
    </button>
  );
});

class Playlist extends React.PureComponent {
  render() {
    const { completedDownload, date, podcasts, current, minDate, maxDate } =
      this.props;

    return (
      <div
        role="list"
        style={{
          color: "#333",
          backgroundColor: "white",
          padding: "2em",
          borderRadius: "10px",
          textAlign: "left",
          fontSize: "large",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <DatePicker
            onChange={this.handleDateChange}
            onBlur={this.handleDateBlur}
            minDate={minDate}
            maxDate={maxDate}
            required
            value={date}
            clearIcon={null}
            calendarIcon={<FontAwesomeIcon icon={faCalendar} />}
          />
          <UpdateButton
            onClick={this.props.onClickUpdate}
            disabled={!completedDownload}
          />
        </div>
        <div
          style={{
            textAlign: "center",
          }}
        >
          <PodcastsList current={current}>
            {podcasts.map((podcast, index) => (
              <Podcast
                key={podcast.uuid !== "..." ? podcast.uuid : `..._${index}`}
                {...podcast}
                onClick={this.props.onClickPodcast}
              />
            ))}
          </PodcastsList>
        </div>
      </div>
    );
  }

  handleDateChange = (date) => {
    date.setHours(0);
    date.setMinutes(0);
    this.props.onDateChange(date);
  };

  // Trigger onDateBlur only if not originated by an element with one of those classNames:
  // - calendar, date, date-picker
  //
  // Those are used to navigate within the date picker, so date picker is
  // still beeing used and needing the focus
  handleDateBlur = (e) => {
    if (
      !(
        e?.relatedTarget &&
        e.relatedTarget.className.match(/(calendar|date-?picker)/)
      )
    ) {
      this.props.onDateBlur(e);
    }
  };
}

Playlist.defaultProps = {
  onClickUpdate: (e) => {},
  onDateBlur: (e) => {},
  onDateChange: (e) => {},
  completedDownload: true,
  date: new Date(),
  maxDate: new Date(),
  podcasts: [],
};

Playlist.propTypes = {
  onClickUpdate: PropTypes.func.isRequired,
  onClickPodcast: PropTypes.func.isRequired,
  onDateBlur: PropTypes.func.isRequired,
  onDateChange: PropTypes.func.isRequired,
  completedDownload: PropTypes.bool.isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
  minDate: PropTypes.instanceOf(Date).isRequired,
  maxDate: PropTypes.instanceOf(Date).isRequired,
  podcasts: PropTypes.array.isRequired,
  current: PropTypes.number.isRequired,
};

export default Playlist;

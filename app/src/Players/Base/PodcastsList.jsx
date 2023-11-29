import React from "react";
import PropTypes from "prop-types";

import MediaQuery from "react-responsive";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

class PodcastsList extends React.PureComponent {
  renderChildren() {
    const { children, current } = this.props;
    return children.length === 0
      ? null
      : children.map((child, index) => (
          <li
            key={child.key}
            style={{
              position: "relative",
              marginLeft: "2.5em",
              textIndent: "-1.5em",
              padding: "1pt 0",
            }}
          >
            {index === current ? (
              <FontAwesomeIcon
                icon={faPlay}
                style={{
                  position: "absolute",
                  left: "-2.75em",
                  padding: "1pt 0",
                }}
              />
            ) : null}
            {child}
          </li>
        ));
  }

  render() {
    const { children } = this.props;
    const styles = {
      listStyleType: "none",
      marginLeft: 0,
      paddingLeft: 0,
      textAlign: "left",
    };

    return children.length === 0 ? null : (
      <MediaQuery minWidth={1024}>
        {(matches) => {
          return (
            <ul
              style={{
                ...styles,
                columnCount: matches
                  ? Math.floor(children.length / 10) || 1
                  : 1,
              }}
            >
              {this.renderChildren()}
            </ul>
          );
        }}
      </MediaQuery>
    );
  }
}

PodcastsList.defaultProps = {
  children: [],
};

PodcastsList.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element),
  current: PropTypes.number.isRequired,
};

export default PodcastsList;

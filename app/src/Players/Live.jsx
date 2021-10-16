import React, { Component } from "react";

import { translate } from "react-translate";

import { Rac1Live } from "../Backends";

import AudioWrapper from "./Base/AudioWrapper";
import PodcastCover from "./Base/PodcastCover";

class Live extends Component {
  extraControls = [];

  // Initial state
  state = {
    podcast: false,
    hasError: false,
    error: {},
  };

  constructor(props) {
    super();

    this.backend = new Rac1Live({
      // Get data from backend
      onUpdate: this.handleUpdate,

      // Get errors from backend
      onError: this.handleError,
    });
  }

  componentDidMount() {
    this.backend.launchTimer();
  }

  componentWillUnmount() {
    // Abort backend fetches
    this.backend.abort();
  }

  handleUpdate = (podcast) => {
    this.setState({ podcast });
  };

  // Saves errors from backend into state so they
  // can be reraised into ReactDOM tree and catched correctly
  handleError = (error) => {
    error.message = `Live: ${error.message}`;
    this.setState({
      hasError: true,
      error: error,
    });
  };

  render() {
    const { podcast, hasError, error } = this.state;

    // If we have a backend error, reraise into ReactDOM tree
    if (hasError) {
      throw Error(error);
    }

    const { t } = this.props;
    const currentPath = podcast !== undefined ? podcast.path : "";
    const titleHead =
      (!podcast || !podcast.title ? "" : `${podcast.title} | `) +
      t(this.backend.name);
    const title =
      t(this.backend.name) +
      (!podcast || !podcast.title ? "" : `: ${podcast.title}`);

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-evenly",
        }}
      >
        <AudioWrapper
          autoPlay={true}
          title={title}
          path={currentPath}
          allowFocus={this.allowFocus}
          extraControls={this.extraControls}
          volumeAsAdvanced={false}
          titleHead={titleHead}
          artist={podcast.author}
          album={podcast.schedule}
          image={podcast.image}
        />
        {podcast !== false ? (
          <>
            <div style={{ width: ".5em", height: ".5em" }} />
            <PodcastCover
              minWidth={708}
              image={podcast.image}
              programUrl={podcast.programUrl}
              title={podcast.title}
              author={podcast.author}
              schedule={podcast.schedule}
            />
          </>
        ) : null}
      </div>
    );
  }

  allowFocus = (el) => el.className.match(/rc-slider-handle|ReactModal/);
}

export default translate("Live")(Live);

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";

// Mock MediaSession & MediaMetadata
global.MediaSession = class {};
global.MediaMetadata = class {};
navigator.mediaSession = {
  metadata: null,
  setActionHandler: () => {},
};

it("renders without crashing", async () => {
  render(<App />);
  await waitFor(() => screen.getByRole("toolbar"));
});

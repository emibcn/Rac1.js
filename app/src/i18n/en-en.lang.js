const actions = {
  Key: "Key",
  Keys: "Keys",
  SHIFT: "SHIFT",
  PageUp: "Page up",
  PageDown: "Page down",
  ArrowUp: "Arrow up",
  ArrowDown: "Arrow down",
  ArrowRight: "Arrow right",
  ArrowLeft: "Arrow left",
  Space: "Espace",
  Enter: "Enter",
  Prev: "Prev",
  Next: "Next",
  More: "More",
  Less: "Less",
  Play: "Play",
  Pause: "Pause",
  Mute: "Mute",
  Unmute: "Unmute",
  "Remove last": "Remove last",
  "Remove last podcast from playlist": "Remove last podcast from playlist",
  "Play previous podcast": "Play previous podcast",
  "Play next podcast": "Play next podcast",
  "Toggle mute status": "Toggle mute status",
  "Toggle Play/Pause": "Toggle Play/Pause",
  "Update the list of podcasts": "Update the list of podcasts",
  "Show more controls": "Show more controls",
  "Show less controls": "Show less controls",
  ...[
    { symbol: "10s", orig: "10 seconds" },
    { symbol: "60s", orig: "1 minute" },
    { symbol: "10m", orig: "10 minutes" },
  ].reduce((res, item) => {
    return {
      ...res,
      [`-${item.symbol}`]: `-${item.symbol}`,
      [`+${item.symbol}`]: `+${item.symbol}`,
      [`Go backwards ${item.orig}`]: `Go backwards ${item.orig}`,
      [`Go forward ${item.orig}`]: `Go forward ${item.orig}`,
    };
  }, {}),
};

const common = {
  "Rac1 Radio Podcasts Player": "Rac1 Radio Podcasts Player",
  Live: "Live",
  About: "About",
  Help: "Help",
  "Privacy policy": "Privacy policy",
  Yes: "Yes",
  No: "No",
  or: "or",
};

const tracking = {
  "Allow tracking": "Allow tracking",
  "Allow tracking user interactions for usage analysis":
    "Allow tracking user interactions for usage analysis",
};

const translations = {
  locale: "en-en",

  App: {
    ...common,
  },

  AppMenu: {
    ...common,
    ...tracking,
    "By date": "By date",
    "Update!": "Update!",
    "New version available!": "New version available!",
    Language: "Language",
    "Change application language": "Change application language",
    ...["Català", "Castellano", "English"].reduce((res, lang) => {
      return {
        ...res,
        [`Change language to ${lang}`]: `Change language to ${lang}`,
      };
    }, {}),
  },

  ErrorCatcher: {
    "Something went wrong :(": "Something went wrong :(",
    "Try reloading the app to recover from it":
      "Try reloading the app to recover from it",
  },

  ByDate: {
    ...common,
  },

  Live: {
    ...common,
    "Rac1 live": "Rac1 Live",
  },

  UpdateButton: {
    Update: "Update",
  },

  Button: {
    ...actions,
  },

  ModalRouter: {
    "Close modal": "Close modal",
    Dialog: "Dialog",
  },

  About: {
    ...common,
    "Play Rac1 catalan radio station podcasts or live emission.":
      "Play Rac1 catalan radio station podcasts or live emission.",
    "I made this app for fun and for learning how to use the React library.":
      "I made this app for fun and for learning how to use the React library.",
    "This app is served using GitHub Pages.":
      "This app is served using GitHub Pages.",
    "Want more information?": "Want more information?",
    "The source code is publicly available.":
      "The source code is publicly available.",
    "There, you can find more information about how it has been done, licence and credits.":
      "There, you can find more information about how it has been done, licence and credits.",
    "Found a bug? Have a petition?": "Found a bug? Have a petition?",
    "Create an issue at GitHub.": "Create an issue at GitHub.",
  },

  Help: {
    ...common,
    ...actions,
    "Key bindings:": "Key bindings:",
    "Good UI controls for use with mobile devices: big buttons, disabled key bindings.":
      "Good UI controls for use with mobile devices: big buttons, disabled key bindings.",
  },

  PodcastCover: {
    Author: "Author",
  },

  Cookies: {
    ...common,
    ...tracking,
    "This site uses cookies and other tracking technologies to assist with navigation and your ability to provide feedback, analyse your use of our products and services, assist with our promotional and marketing efforts, and provide content from third parties.":
      "This site uses cookies and other tracking technologies to assist with navigation and your ability to provide feedback, analyse your use of our products and services, assist with our promotional and marketing efforts, and provide content from third parties.",
    "We need to reload the page when you change this option in order to ensure it is taken completely into account.":
      "We need to reload the page when you change this option in order to ensure it is taken completely into account.",
  },
};

export default translations;

export default {
  locale: "en-en",

  AppMenu: {
    "By date": "By date",
    "Live": "Live",
    "Update!": "Update!",
    "New version available!": "New version available!",
    "Language": "Language",
    "Change application language": "Change application language",
    ...['Català', 'Castellano', 'English']
      .reduce( (res, lang) => {
        return {
          ...res,
          [`Change language to ${lang}`]: `Change language to ${lang}`,
        }
      }, {}),
    "Allow tracking": "Allow tracking",
    "Allow tracking user interactions for usage analysis": "Allow tracking user interactions for usage analysis",
    "Yes": "Yes",
    "No": "No",
  },

  ErrorCatcher: {
    "Something went wrong :(": "Something went wrong :(",
    "Try reloading the app to recover from it": "Try reloading the app to recover from it",
  },

  Rac1ByDate: {
    "Rac1 Radio Podcasts Player": "Rac1 Radio Podcasts Player",
  },

  Rac1Directe: {
    "Live": "Live",
    "Rac1 live": "Rac1 Live",
    "Rac1 Radio Podcasts Player": "Rac1 Radio Podcasts Player",
  },

  ReloadButton: {
    "Reload": "Reload",
  },

  Button: {
    "Key": "Key",
    "Keys": "Keys",
    "Prev": "Prev",
    "Next": "Next",
    "More": "More",
    "Less": "Less",
    "Play": "Play",
    "Pause": "Pause",
    "Mute": "Mute",
    "Unmute": "Unmute",
    "Remove last": "Remove last",
    "Remove last podcast from playlist": "Remove last podcast from playlist",
    "Play previous podcast": "Play previous podcast",
    "Play next podcast": "Play next podcast",
    "Toggle mute status": "Toggle mute status",
    "Toggle Play/Pause": "Toggle Play/Pause",
    "Show more controls": "Show more controls",
    "Show less controls": "Show less controls",
    ...[
        { symbol: '10s', orig: '10 seconds'},
        { symbol: '60s', orig: '1 minute'  },
        { symbol: '10m', orig: '10 minutes'},
      ].reduce( (res, item) => {
        return {
          ...res,
          [`-${ item.symbol }`]: `-${ item.symbol }`,
          [`+${ item.symbol }`]: `+${ item.symbol }`,
          [`Go backwards ${ item.orig }`]: `Go backwards ${ item.orig }`,
          [`Go forward ${ item.orig }`  ]: `Go forward ${ item.orig }`,
        }
      }, {}),
  },
}

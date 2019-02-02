export default {
  locale: "fr", // :(

  AppMenu: {
    "By date": "Per data",
    "Live": "En directe",
    "Update!": "Actualitza!",
    "New version available!": "Nova versió disponible!",
    "Language": "Idioma",
    "Change application language": "Canvia l'idioma de l'aplicació",
    ...['Català', 'Castellano', 'English']
      .reduce( (res, lang) => {
        return {
          ...res,
          [`Change language to ${lang}`]: `Canvia l'idioma a ${lang}`,
        }
      }, {}),
    "Allow tracking": "Seguiment",
    "Allow tracking user interactions for usage analysis": "Permet el seguiment de les accions de l'usuari amb fins d'anàlisi d'ús",
    "Yes": "Si",
    "No": "No",
  },

  ErrorCatcher: {
    "Something went wrong :(": "Alguna cosa ha anat malament :(",
    "Try reloading the app to recover from it": "Intenta recarregar l'aplicació per a continuar",
  },

  Rac1ByDate: {
    "Rac1 Radio Podcasts Player": "Reproductor de podcasts de Rac1",
  },

  Rac1Directe: {
    "Live": "En directe",
    "Rac1 live": "Rac1 en Directe",
    "Rac1 Radio Podcasts Player": "Reproductor de podcasts de Rac1",
  },

  ReloadButton: {
    "Reload": "Recarrega",
  },

  Button: {
    "Key": "Tecla",
    "Keys": "Tecles",
    "Prev": "Ant.",
    "Next": "Seg.",
    "More": "Més",
    "Less": "Menys",
    "Play": "Play",
    "Pause": "Pausa",
    "Mute": "Silenciar",
    "Unmute": "Act. so",
    "Remove last": "Elimina últ",
    "Remove last podcast from playlist": "Elimina l'últim podcast de la llista de reproducció",
    "Play previous podcast": "Reprodueix el podcast anterior",
    "Play next podcast": "Reprodueix el podcast següent",
    "Toggle mute status": "Canvia l'estat del silenci",
    "Toggle Play/Pause": "Canvia Reprodueix/Pausa",
    "Show more controls": "Mostra més controls",
    "Show less controls": "Mostra menys controls",
    ...[
        { symbol: '10s', orig: '10 seconds', trans: '10 segons'},
        { symbol: '60s', orig: '1 minute'  , trans: '1 minut'},
        { symbol: '10m', orig: '10 minutes', trans: '10 minuts'},
      ].reduce( (res, item) => {
        return {
          ...res,
          [`-${ item.symbol }`]: `-${ item.symbol }`,
          [`+${ item.symbol }`]: `+${ item.symbol }`,
          [`Go backwards ${ item.orig }`]: `Retrocedir ${ item.trans }`,
          [`Go forward ${ item.orig }`  ]: `Avançar ${ item.trans }`,
        }
      }, {}),
  },
}

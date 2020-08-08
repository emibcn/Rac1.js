const actions = {
    "Key": "Tecla",
    "Keys": "Tecles",
    "SHIFT": "MAJÚS",
    "PageUp": "Pàgina amunt",
    "PageDown": "Pàgina avall",
    "ArrowUp": "Fletxa amunt",
    "ArrowDown": "Fletxa avall",
    "ArrowRight": "Fletxa dreta",
    "ArrowLeft": "Fletxa esquerra",
    "Space": "Espai",
    "Enter": "Enter",
    "Prev": "Ant.",
    "Next": "Seg.",
    "More": "Més",
    "Less": "Menys",
    "Play": "Play",
    "Pause": "Pausa",
    "Mute": "Silenciar",
    "Unmute": "Act. so",
    "Adjust volume": "Adjusta el volum",
    "Remove last": "Elimina últ",
    "Remove last podcast from playlist": "Elimina l'últim podcast de la llista de reproducció",
    "Play previous podcast": "Reprodueix el podcast anterior",
    "Play next podcast": "Reprodueix el podcast següent",
    "Toggle mute status": "Canvia l'estat del silenci",
    "Toggle Play/Pause": "Canvia Reprodueix/Pausa",
    "Update the list of podcasts": "Actualitza la llista de podcasts",
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
};

const common = {
    "Rac1 Radio Podcasts Player": "Reproductor de podcasts de Rac1",
    "Live": "En directe",
    "About": "Quant a...",
    "Help": "Ajuda",
    "Privacy policy": "Política de privacitat",
    "Yes": "Si",
    "No": "No",
    "or": "o",
};

const tracking = {
    "Allow tracking": "Seguiment",
    "Allow tracking user interactions for usage analysis": "Permet el seguiment de les accions de l'usuari amb fins d'anàlisi d'ús",
};

export default {
  locale: "fr", // :(

  App: {
    ...common,
  },

  AppMenu: {
    ...common,
    ...tracking,
    "By date": "Per data",
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
  },

  ErrorCatcher: {
    "Something went wrong :(": "Alguna cosa ha anat malament :(",
    "Try reloading the app to recover from it": "Intenta recarregar l'aplicació per a continuar",
  },

  Rac1ByDate: {
    ...common,
  },

  Rac1Directe: {
    ...common,
    "Rac1 live": "Rac1 en Directe",
  },

  ReloadButton: {
    "Reload": "Recarrega",
  },

  Button: {
    ...actions,
  },

  About: {
    ...common,
    "Play Rac1 catalan radio station podcasts or live emission.": "Reprodueix els podcasts o l'emissió en directe de l'estació de ràdio Rac1",
    "I made this app for fun and for learning how to use the React library.": "He fet aquesta aplicació per diversió i per a aprendre a usar la llibreria React.",
    "This app is served using GitHub Pages.": "Aquesta pàgina es serveix usant GitHub Pages.",
    "Want more information?": "Vols més informació?",
    "The source code is publicly available.": "El codi font està disponible públicament.",
    "There, you can find more information about how it has been done, licence and credits.": "Allà trobaràs més informació sobre com s'ha fet, llicències i crèdits.",
    "Found a bug? Have a petition?": "Has trobat un error? Tens una petició?",
    "Create an issue at GitHub.": "Crea una incidència a GitHub",
  },

  Help: {
    ...common,
    ...actions,
    "Key bindings:": "Associacions del teclat:",
    "Good UI controls for use with mobile devices: big buttons, disabled key bindings.": "Bons controls d'interfície per a ús amb dispositius mòbils: grans butons, associacions de teclat deshabilitades.",
  },

  PodcastCover: {
    'Author': "Autor"
  },

  Cookies: {
    ...common,
    ...tracking,
    "This site uses cookies and other tracking technologies to assist with navigation and your ability to provide feedback, analyse your use of our products and services, assist with our promotional and marketing efforts, and provide content from third parties.": "Aquest lloc utilitza cookies i altres tecnologies de seguiment per ajudar-vos amb la navegació i la vostra capacitat de proporcionar comentaris, analitzar l'ús dels nostres productes i serveis, ajudar-vos amb els nostres esforços promocionals i de màrqueting i proporcionar continguts de tercers.",
    "We need to reload the page when you change this option in order to ensure it is taken completely into account.": "Hem de tornar a carregar la pàgina quan canvieu aquesta opció per assegurar-se que es tingui en compte completament.",
  },
}

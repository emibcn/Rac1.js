const actions = {
    "Key": "Tecla",
    "Keys": "Tecles",
    "SHIFT": "MAYÚS",
    "PageUp": "Página arriba",
    "PageDown": "Página abajo",
    "ArrowUp": "Flecha arriba",
    "ArrowDown": "Flecha abajo",
    "ArrowRight": "Flecha derecha",
    "ArrowLeft": "Flecha izquierda",
    "Space": "Espacio",
    "Enter": "Enter",
    "Prev": "Ant.",
    "Next": "Sig.",
    "More": "Más",
    "Less": "Menos",
    "Play": "Play",
    "Pause": "Pausa",
    "Mute": "Silenciar",
    "Unmute": "Act. sonido",
    "Adjust volume": "Ajustar el volumen",
    "Remove last": "Eliminar últ",
    "Remove last podcast from playlist": "Eliminar el último podcast de la lista de reproducción",
    "Play previous podcast": "Reproducir el podcast anterior",
    "Play next podcast": "Reproducir el podcast seguinte",
    "Toggle mute status": "Canviar el estado del silencio",
    "Toggle Play/Pause": "Canviar Reproducir/Pausa",
    "Update the list of podcasts": "Actualizar la lista de podcasts",
    "Show more controls": "Mostrar más controles",
    "Show less controls": "Mostrar menos controles",
    ...[
        { symbol: '10s', orig: '10 seconds', trans: '10 segundos'},
        { symbol: '60s', orig: '1 minute'  , trans: '1 minuto'},
        { symbol: '10m', orig: '10 minutes', trans: '10 minutos'},
      ].reduce( (res, item) => {
        return {
          ...res,
          [`-${ item.symbol }`]: `-${ item.symbol }`,
          [`+${ item.symbol }`]: `+${ item.symbol }`,
          [`Go backwards ${ item.orig }`]: `Retroceder ${ item.trans }`,
          [`Go forward ${ item.orig }`  ]: `Avanzar ${ item.trans }`,
        }
      }, {}),
};

const common = {
    "Rac1 Radio Podcasts Player": "Reproductor de podcasts de Rac1",
    "Live": "En directo",
    "About": "Acerca de...",
    "Help": "Ayuda",
    "Privacy policy": "Política de privacidad",
    "Yes": "Sí",
    "No": "No",
    "or": "o",
};

const tracking = {
  "Allow tracking": "Seguimiento",
  "Allow tracking user interactions for usage analysis": "Permitir el seguimiento de las acciones del usuario con fines de análisis de uso",
};

export default {
  locale: "es-es",

  App: {
    ...common,
  },

  AppMenu: {
    ...common,
    ...actions,
    ...tracking,
    "By date": "Por fecha",
    "Update!": "¡Actualiza!",
    "New version available!": "¡Nueva versión disponible!",
    "Language": "Idioma",
    "Change application language": "Cambiar el idioma de la aplicación",
    ...['Català', 'Castellano', 'English']
      .reduce( (res, lang) => {
        return {
          ...res,
          [`Change language to ${lang}`]: `Cambiar idioma a ${lang}`,
        }
      }, {}),
  },

  ErrorCatcher: {
    "Something went wrong :(": "Algo ha fallado :(",
    "Try reloading the app to recover from it": "Intenta recargar la aplicación para continuar",
  },

  ByDate: {
    ...common,
  },

  Live: {
    ...common,
    "Rac1 live": "Rac1 en Directo",
  },

  UpdateButton: {
    "Update": "Actualizar",
  },

  Button: {
    ...actions,
  },

  ModalRouter: {
    "Close modal": "Cerrar emergente",
    "Dialog": "Emergente",
  },

  About: {
    ...common,
    "Play Rac1 catalan radio station podcasts or live emission.": "Reproducir los podcasts o la emisión en directo de la estación de radio Rac1",
    "I made this app for fun and for learning how to use the React library.": "He hecho esta aplicación por diversión y para aprender a usar la libreria React.",
    "This app is served using GitHub Pages.": "Esta página se sirve usando GitHub Pages.",
    "Want more information?": "¿Quieres más información?",
    "The source code is publicly available.": "El código fuente está disponible públicamente.",
    "There, you can find more information about how it has been done, licence and credits.": "Allí encontrarás más información sobre como se ha hecho, licències y créditos.",
    "Found a bug? Have a petition?": "¿Has encontrado un error? ¿Tienes una petición?",
    "Create an issue at GitHub.": "Crea una incidencia en GitHub",
  },

  Help: {
    ...common,
    ...actions,
    "Key bindings:": "Asociaciones del teclado:",
    "Good UI controls for use with mobile devices: big buttons, disabled key bindings.": "Buenos controles de interfaz para usar con dispositivos móviles: grandes botones, asociacions de teclado deshabilitadas.",
  },

  PodcastCover: {
    'Author': "Autor"
  },

  Cookies: {
    ...common,
    ...tracking,
    "This site uses cookies and other tracking technologies to assist with navigation and your ability to provide feedback, analyse your use of our products and services, assist with our promotional and marketing efforts, and provide content from third parties.": "Este sitio utiliza cookies y otras tecnologías de seguimiento para ayudar con la navegación y su capacidad de proporcionar comentarios, analizar el uso de nuestros productos y servicios, ayudar con nuestros esfuerzos de promoción y marketing, y proporcionar contenido de terceros.",
    "We need to reload the page when you change this option in order to ensure it is taken completely into account.": "Necesitamos volver a cargar la página cuando cambie esta opción para garantizar que se tenga en cuenta por completo.",
  },
}

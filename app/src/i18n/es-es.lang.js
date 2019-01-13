export default {
  locale: "es-es",

  AppMenu: {
    "By date": "Por fecha",
    "Live": "En directo",
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
    "Allow tracking": "Seguimiento",
    "Allow tracking user interactions for usage analysis": "Permitir el seguimiento de las acciones del usuario con fines de análisis de uso",
    "Yes": "Sí",
    "No": "No",
  },

  Rac1ByDate: {
    "Rac1 Radio Podcasts Player": "Reproductor de podcasts de Rac1",
  },

  Rac1Directe: {
    "Live": "En directo",
    "Rac1 live": "Rac1 en Directo",
    "Rac1 Radio Podcasts Player": "Reproductor de podcasts de Rac1",
  },

  ReloadButton: {
    "Reload": "Recarga",
  },

  Button: {
    "Key": "Tecla",
    "Keys": "Teclas",
    "Prev": "Ant.",
    "Next": "Sig.",
    "More": "Más",
    "Less": "Menos",
    "Play": "Play",
    "Pause": "Pausa",
    "Mute": "Silenciar",
    "Unmute": "Act. sonido",
    "Remove last": "Eliminar últ",
    "Remove last podcast from playlist": "Eliminar el último podcast de la lista de reproducción",
    "Play previous podcast": "Reproducir el podcast anterior",
    "Play next podcast": "Reproducir el podcast seguinte",
    "Toggle mute status": "Canviar el estado del silencio",
    "Toggle Play/Pause": "Canviar Reproducir/Pausa",
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
  },
}

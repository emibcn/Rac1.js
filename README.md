[![Build Status](https://travis-ci.com/emibcn/Rac1.js.svg?branch=master)](https://travis-ci.com/emibcn/Rac1.js)

React app to listen to Rac1 radio station podcasts. Uses GitHub pages to publish it at
https://emibcn.github.io/Rac1.js/ (publishes this repo's `docs/` contents). The podcasts
lister is a pure JS app, which does not depends on any other library, so you can re-use
for other JS projects.

Uses https://cors-anywhere.herokuapp.com/ to allow downloading 3rd party webs. In this
case, the app downloads the page with podcasts list, which is served as `text/html`,
which violates CORS specifications.

Inspired by my command line Python app https://github.com/emibcn/Rac1.py .

## Specifications
- `<audio>` HTML tag, via [react-audio-player](https://github.com/justinmc/react-audio-player)
- KeyPress event handling, via a non-visible `<input>` element which focus itself everytime `onBlur` is detected. You can use some of the `mplayer` keybindings:
  - `LEFT`: seek backwards 10s
  - `UP`: seek backwards 1m
  - `PAGE UP`: seek backwards 10m
  - `RIGHT`: seek forward 10s
  - `DOWN`: seek forward 1m
  - `PAGE DOWN`: seek forward 10m
  - `SHIFT`+`UP`/`DOWN` or `*`/`/`: Adjust volume
  - `SPACE`/`P`: (Un)Pause
  - `M`: (Un)Mute
  - `ENTER`: Jump to next podcast
- Good UI controls for use with mobile devices
- Asynchronuosly `fetch` podcast list and pages list HTML page, parse it with RegExp and download remaining pages
- Asynchronuosly `fetch` podcasts JSON data
- Always with a coherently time ordered list of available podcasts
- Docker with DockerCompose to open a development instance, with all the [Create React App](https://github.com/facebook/create-react-app) goodies

# TODO
- Split React component into different components. For example: `Player`, `PodcastList`, `Controls`
- Add a DatePicker to allow listening to other days podcasts, not just today
- Add Browser Router to allow managing the selected date via PATH
- Filters via `localStorage`, to easily jump unwanted podcasts
- Redownload podcasts list once finished playing known podcasts (update list)
- Better internal state handling for player status: `pause`, `volume`, ...
- Consider using Redux

# Install
```
git clone https://github.com/emibcn/Rac1.js.git
cd Rac1.js
```

# All in one
```
docker-compose up -d
docker-compose logs -f
```

# Build
```
docker-compose build
```

# Run
## Background
```
docker-compose up -d
```

## Foreground
```
docker-compose up
```

# Logs (with follow)
```
docker-compose logs -f
```

# Stop
```
docker-compose down
```

# Access the app
Open your browser and point it to http://127.0.0.1:3000 , or visit the public version
at https://emibcn.github.io/Rac1.js/ .

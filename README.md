[![Build Status](https://travis-ci.com/emibcn/Rac1.js.svg?branch=master)](https://travis-ci.com/emibcn/Rac1.js)

React app to listen to [Rac1 radio station](https://www.rac1.cat/) podcasts. Uses GitHub pages to publish it at **[Rac1 podcast player at Github Pages](https://emibcn.github.io/Rac1.js/)**. There you will find [this repo's `docs/`](https://github.com/emibcn/Rac1.js/tree/master/docs) contents, which are the results of executing `yarn build` on [this project's container](#development-container) using [this project's source application](https://github.com/emibcn/Rac1.js/tree/master/app).

The [podcasts lister](https://github.com/emibcn/Rac1.js/blob/master/app/src/rac1.js) is a pure JS app, which does not depends on any other library, so you can re-use for other JS projects. It uses https://cors-anywhere.herokuapp.com/ to allow downloading 3rd party webs. In this case, the app downloads the [page with podcasts list](https://api.audioteca.rac1.cat/a-la-carta/cerca), which is served as `text/html` and violates [CORS specifications](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing).

Inspired by [my command line Python app Rac1.py](https://github.com/emibcn/Rac1.py).

## Features
- [ReactJS](https://reactjs.org/) based browser [Single Page Application](https://en.wikipedia.org/wiki/Single-page_application)
- `<audio>` HTML tag, via [react-audio-player](https://github.com/justinmc/react-audio-player)
- Nice [DatePicker](https://www.npmjs.com/package/react-date-picker) to allow listening to any day's podcasts
- Use [Fontawesome free icons](https://fontawesome.com/)
- Use [react-burger-menu](https://github.com/negomi/react-burger-menu) to display off-canvas menu
- Use [react-responsive](https://github.com/contra/react-responsive) to differentiate display depending on media sizes (design still in construction)
- Use [react-component/slider](https://github.com/react-component/slider) for volume control (and possibly others in the future!)
- Use [react-translate](https://www.npmjs.com/package/react-translate) to translate components
- Use [react-simple-storage](https://github.com/ryanjyost/react-simple-storage) to save and retrieve state to and from `localStorage`
- Use [\<HashRouter\>](https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/docs/api/HashRouter.md) to handle date and podcast selection, linking and history ([Github Pages doesn't allows](https://itnext.io/so-you-want-to-host-your-single-age-react-app-on-github-pages-a826ab01e48) [\<BrowserRouter\>](https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/docs/api/BrowserRouter.md))
- [Docker](https://docs.docker.com/) with [DockerCompose](https://docs.docker.com/compose/) to start a development container, with all the [Create React App](https://github.com/facebook/create-react-app) goodies
- Use GoogleAnalytics ([integrated as a React component](https://github.com/emibcn/Rac1.js/blob/master/app/src/GAListener.jsx)) for usage statistics, but respect user's [DNT](https://en.wikipedia.org/wiki/Do_Not_Track) and don't even load it if user agent reports DNT header
- KeyPress event handling, via a non-visible `<input>` element which focus itself everytime `onBlur` is detected. You can use some of the `mplayer` default key bindings:
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
  - `R`: Update the list of podcasts
- Good UI controls for use with mobile devices (big buttons, disabled key bindings)
- Almost [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/) accessible
- Very fast:
  - Use `<meta rel="preconnect">` to pre-initiate external HTTPS connections early
  - Use `<meta rel="prefetch">` to begin early download of external very slow server
  - Use [ServiceWorker](https://github.com/emibcn/Rac1.js/blob/master/app/src/index.js) (SW) to predownload and maintain the assets in cache
  - Included [manifest](https://github.com/emibcn/Rac1.js/blob/master/app/public/manifest.json) and SW to allow adding the app icon to mobile desktop with splash screen
  - Very fast [backend HTML parser](https://github.com/emibcn/Rac1.js/blob/master/app/src/rac1.js)
  - Use [React.PureComponent](https://reactjs.org/docs/react-api.html) where possible
- Asynchronuosly `fetch` podcast list and pages list HTML page, parse it with RegExp and download remaining pages
- Asynchronuosly `fetch` podcasts JSON data
- Always with a coherently time ordered list of available podcasts
- Auto play next podcast when currently played finishes (as a normal playlist)
- Ability to update podcasts list
- Autoupdate podcasts list when trying to play next podcast after last one, and play the next one (if there is any) after the update finishes

# TODO
- Improve UX: layout, styles, info shown, responsible, controls, ¿bootstrap4?
- Add info/help/about section
- Filters via `localStorage`, to easily jump unwanted podcasts
- Better internal state handling for player status: `currentPosition`, ...
- Consider using Redux
- Add tests

# Install

## Download
```
git clone https://github.com/emibcn/Rac1.js.git
cd Rac1.js
```

## Development container
Using the provided `docker-compose.yml` file, it is possible to build and execute a live environment which can host the application in development mode using [WebpackDevServer](https://webpack.js.org/configuration/dev-server/) configured by [Create React App](https://github.com/facebook/create-react-app) (CRA), what helps a lot while actively modifying the files.

Of course, you can opt-out and install [NodeJS](https://nodejs.org/en/), [NPM](https://www.npmjs.com/) and [`yarn`](https://yarnpkg.com/lang/en/) by yourself. Also, you can [eject](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#npm-run-eject) CRA.

### Install Docker
It depends on which system you use. Go to [Docker documentation](https://docs.docker.com/) to get help adapted to your use case.

### Install DockerCompose
Go to [Docker Compose](https://docs.docker.com/compose/install/) and follow instructions, depending on your use case.

### Build + Run
```
docker-compose up -d
```

### Build
```
docker-compose build
```

### Run
#### Background
```
docker-compose up -d
```

#### Foreground (following `WebpackDevServer` logs)
```
docker-compose up
```

(If you stop this with CTRL+C, container will stop too)

### Logs (with follow)
Once the container is started, you can view WebpackDevServer logs executing:
```
docker-compose logs -f
```

(You can stop this with CTRL+C)

### Stop
```
docker-compose down
```

## Application
By default, the container installs all [NPM](https://www.npmjs.com/) dependencies using [`yarn` dependency manager](https://yarnpkg.com/lang/en/). If you use the provided `docker-compose.yml`, the `app` directory will be mounted inside the container. This automatically helps maintaining the cache of the installed npm modules and auto refreshing the browser when any file is modified or module added/removed/updated.

Once the container has been started, you can enter inside it to execute commands needing [NodeJS](https://nodejs.org/en/). For example:
```
me@mypc:~/Rac1.js$ docker-compose exec rac1 bash
node@8cf780c7b2bb:~/app$ yarn add react-dom-router
[...]
node@8cf780c7b2bb:~/app$ exit
me@mypc:~/Rac1.js$
```

Or, in one line:
```
me@mypc:~/Rac1.js$ docker-compose exec rac1 yarn add react-dom-router
[...]
me@mypc:~/Rac1.js$ 
```

If you need root permisions:
```
me@mypc:~/Rac1.js$ docker-compose exec -u root rac1 bash
root@8cf780c7b2bb:~/app$ apt-get update; apt-get install git
```

Or:
```
docker-compose exec -u root rac1 bash -c 'apt-get update; apt-get install git'
```

# Access the app
Open your browser and point it to http://127.0.0.1:3000 , or visit the public version
at https://emibcn.github.io/Rac1.js/ .

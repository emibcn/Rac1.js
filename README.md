![Node.js CI](https://github.com/emibcn/Rac1.js/workflows/Node.js%20CI/badge.svg)
[![Build Status](https://travis-ci.com/emibcn/Rac1.js.svg?branch=master)](https://travis-ci.com/emibcn/Rac1.js)
[![coverage](https://raw.githubusercontent.com/emibcn/Rac1.js/badges/master/test-coverage.svg)](https://raw.githubusercontent.com/emibcn/Rac1.js/badges/master/test-coverage.svg)

Web APP to listen to [Rac1 radio station](https://www.rac1.cat/) podcasts. Uses React as JS frontend library and GitHub pages to publish it at **[Rac1 podcast player at Github Pages](https://emibcn.github.io/Rac1.js/)**. There, you will find [this repo's `gh-pages` branch](https://github.com/emibcn/Rac1.js/tree/gh-pages) contents, which are the results of executing `yarn build` on [this project's GitHub workflow/Actions](https://github.com/emibcn/Rac1.js/actions) using [this project's source application](https://github.com/emibcn/Rac1.js/tree/master/app) (See more in the [Install](https://github.com/emibcn/Rac1.js#install) section).

The [podcasts lister](https://github.com/emibcn/Rac1.js/blob/master/app/src/Backends/) is a pure JS lib, which only depends on [abortcontroller-polyfill](https://github.com/mo/abortcontroller-polyfill) to help GoogleBot execute modern JS, so you can easily re-use it for other JS projects.

## Motivation
I made this app for 3 reasons:
 - I needed a better way to listen to those podcasts (because the [official app](https://play.google.com/store/apps/details?id=com.grupogodo.rac1) is not useful to me) and I wanted it to be easily compatible with all my devices.
 - Learn modern JavaScript (and some other modern stuff): I've been using JavaScript (mostly with JQuery) since a long time ago. Doing an app on my free time is a good way to me to learn a new language or refreshing it.
 - This is an [open and free](https://github.com/emibcn/Rac1.js/blob/master/LICENSE) (open, _gratis_ and _libre_) app. It can serve as:
   - Learning material (as I did). You may want to learn some of the libs and APIs used here.
   - Share and re-use. You may want to use it as a starting point for your own app, or you may want to add parts of the code to your own app. Please, follow GPLv3.
   - This source code and the working APP also serve as presentational card for my '20s frontend abilities. If you want to hire me, [send me a PM](https://twitter.com/emibcn).

Inspired by [my command line Python app Rac1.py](https://github.com/emibcn/Rac1.py), which was not enough for my Android phone ;P

## See also
- [Joan Domingo's](https://github.com/joan-domingo) [Podcasts-RAC1-Android](https://github.com/joan-domingo/Podcasts-RAC1-Android) android app
- [emibcn's](https://github.com/emibcn) (me) [Rac1.py](https://github.com/emibcn/Rac1.py) command line app
- [emibcn's](https://github.com/emibcn) (me) [Covid Data `Refactored`](https://github.com/emibcn/covid) web application, using [Material UI](https://material-ui.com/) (a still better example of what I can do).

## Dependencies
- [ReactJS](https://reactjs.org/) based browser [Single Page Application (SPA)](https://en.wikipedia.org/wiki/Single-page_application) and [Progressive Web Application (PWA)](https://en.wikipedia.org/wiki/Progressive_web_application)
- `<audio>` HTML tag, via [react-audio-player](https://github.com/justinmc/react-audio-player)
- Nice [DatePicker](https://github.com/wojtekmaj/react-date-picker) to allow listening to any day's podcasts
- Use [Fontawesome free icons](https://fontawesome.com/)
- Use [react-burger-menu](https://github.com/negomi/react-burger-menu) to display off-canvas menu
- Use [react-responsive](https://github.com/contra/react-responsive) to differentiate display depending on media sizes (design still in construction)
- Use [react-translate](https://github.com/bloodyowl/react-translate) to translate components
- Use [react-helmet](https://github.com/nfl/react-helmet) to handle changes to HTML document title (in the future, others, like `meta` tags)
- Use [react-simple-storage](https://github.com/ryanjyost/react-simple-storage) to save and retrieve state to and from `localStorage`
- Use [\<HashRouter\>](https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/docs/api/HashRouter.md) to handle date and podcast selection, linking and history ([Github Pages doesn't -easily- allows](https://itnext.io/so-you-want-to-host-your-single-age-react-app-on-github-pages-a826ab01e48) [\<BrowserRouter\>](https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/docs/api/BrowserRouter.md))
- Use and register the [Service Worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) provided by [Create React App](https://github.com/facebook/create-react-app), adding an [epilog](https://github.com/emibcn/Rac1.js/blob/master/app/src/service-worker.js#L64) to allow communicating with it to [force an update from within the app](https://github.com/emibcn/Rac1.js/blob/master/app/src/index.js).
- Use [react-modal](https://github.com/reactjs/react-modal) for showing some pages inside a modal (using [React Portals](https://reactjs.org/docs/portals.html)), while player may still be playing in the background.
- Use [raw.macro](https://github.com/pveyes/raw.macro) to load raw HTML into bundle (for the [Privacy Policy](https://github.com/emibcn/Rac1.js/blob/master/app/src/legal.html)).
- Use [react-component/slider](https://github.com/react-component/slider) for volume control (and possibly others in the future!)
- Use [react-component/switch](https://github.com/react-component/switch) for user tracking opt-in/opt-out, with user's `DoNotTrack` value as default.
- Use GoogleAnalytics with [React GA](https://github.com/react-ga/react-ga) ([integrated as a React component and a HOC](https://github.com/emibcn/Rac1.js/blob/master/app/src/GAListener/)) for usage statistics. Respect user's [DNT](https://en.wikipedia.org/wiki/Do_Not_Track) and don't even load it if user agent reports DNT header or a bot user agent is detected, unless the user explicitly opts in to tracking. Show modal with privacy policy on first visit. Also allow users without DNT to explicitly opt out from tracking.
- Send events to GoogleAnalytics (when active) combinig [React HOC](https://reactjs.org/docs/higher-order-components.html) and [React Context](https://reactjs.org/docs/context.html) at [GAListener](https://github.com/emibcn/Rac1.js/blob/master/app/src/GAListener/withGAEvent.js) submodule.
- Use [React's Error Boundaries](https://reactjs.org/docs/error-boundaries.html) in [`ErrorCatcher` component](https://github.com/emibcn/Rac1.js/blob/master/app/src/ErrorCatcher.jsx) to:
  - Catch errors created during ReactDOM rendering
  - Send them to GoogleAnalytics (when active) to help improve the app
  - Allow the user a possible option to recover from the error, which includes a possible app update
  - Catch backend errors and route them into ReactDOM, where they will be handled by the [`ErrorCatcher` component](https://github.com/emibcn/Rac1.js/blob/master/app/src/ErrorCatcher.jsx)
- [Docker](https://docs.docker.com/) with [DockerCompose](https://docs.docker.com/compose/) to start a development container, with all the [Create React App](https://github.com/facebook/create-react-app) goodies

## Features
- Always with a coherently time ordered list of available podcasts
- Auto play next podcast when currently played one finishes (as a normal playlist)
- Ability to update podcasts list
- Autoupdate podcasts list when trying to play next podcast after last one, and play the next one (if there is any) after the update finishes
- Show currently playing program metadata: Name, author, schedule, image
- `keyPress` event handling, via a non-visible `<input>` element which focus itself everytime `onBlur` is detected. You can use some of the `mplayer` default key bindings:
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
  - `SHIFT` + `ENTER`: Jump to previous podcast
  - `R`: Update the list of podcasts
- Good UI controls for use with mobile devices (big buttons, disabled key bindings).
- Use [MediaSession](https://developers.google.com/web/updates/2017/02/media-session) to [show podcast data and more controls](https://github.com/emibcn/Rac1.js/blob/master/app/src/Players/Base/MediaSession.jsx) on mobile (and some desktops) notifications and lock screens.
- Almost [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/) accessible.
- Very fast:
  - Use `<meta rel="preconnect">` to pre-initiate external HTTPS connections early
  - Use `<meta rel="prefetch">` to begin early download of external very slow server
  - Use [ServiceWorker](https://github.com/emibcn/Rac1.js/blob/master/app/src/index.js) (SW) to predownload and maintain the assets in cache
  - Included [manifest](https://github.com/emibcn/Rac1.js/blob/master/app/public/manifest.json) and SW to allow adding the app icon to mobile desktop with splash screen
  - Very fast [backend HTML parser](https://github.com/emibcn/Rac1.js/blob/master/app/src/Backends/)
  - Use [React.PureComponent](https://reactjs.org/docs/react-api.html) where possible
- Asynchronuosly `fetch` podcast list and pages list HTML page, parse it with RegExp and download remaining pages
- Asynchronuosly `fetch` podcasts JSON data
- Asynchronuosly `fetch` live podcast data (in HTML) and parse it

## TODO
- Improve UX: layout, styles, info shown, responsible, controls, ¿bootstrap4?
- Use [Streams API](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) to control audio downloading and playing (and editing?)
- Add a section to allow easily play podcasts filtered by program
- Filters via `localStorage`, to easily jump unwanted podcasts
- Save volume to `localStorage` and use in all players.
- Better internal state handling for player status: `currentPosition`, [`play`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play)...
- Consider using Redux
- There is some issue with memory: 300MB+ for each extra date visited (leak, fragmentation or just JS?). Try to debug and fix it.
- Add tests

# Install
You can already use the app on it's [public location](https://emibcn.github.io/Rac1.js/). But you would like to run a local copy of it, or start the development local server to start developing some changes. Whatever is your case, you need to download the code and its dependencies, build it and serve it somehow. Here, I use `git` to download the code, `docker` and `docker-compose` to contain all the boilerplate out of my system and ensuring a consistent CI/CD, `npm` and `yarn` to manage the JS dependencies (and building and testing), the `create-react-app` (CRA) development server and NGinx for serving the static/built version.

## Download
```
git clone https://github.com/emibcn/Rac1.js.git
cd Rac1.js
```

## Development container
Using the provided `docker-compose.yml` file, it is possible to build and execute a live environment which can host the application in development mode using [WebpackDevServer](https://webpack.js.org/configuration/dev-server/) configured by [Create React App](https://github.com/facebook/create-react-app) (CRA), what helps a lot while actively modifying the files. It is also possible to serve the static version of the app using vanilla NGinx locally.

Of course, you can opt-out and install [NodeJS](https://nodejs.org/en/), [NPM](https://www.npmjs.com/) and [`yarn`](https://yarnpkg.com/lang/en/) by yourself. Also, you can [eject](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#npm-run-eject) CRA.

### Install Docker
It depends on which system you use. Go to [Docker documentation](https://docs.docker.com/) to get help adapted to your use case.

### Install DockerCompose
Go to [Docker Compose](https://docs.docker.com/compose/install/) and follow instructions, depending on your use case.

### Build + Run
This will build the containers images, download system and NodeJS dependencies and launch NodeJS development server at port 3000 and NGinx static server at port 4000:
```
docker-compose up -d
```

### Build
This will build the containers images:
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
root@8cf780c7b2bb:~/app$ apt-get update; apt-get install git; apt-get clean
```

Or:
```
docker-compose exec -u root rac1 bash -c 'apt-get update; apt-get install git; apt-get clean'
```

### Build static app
In order to publish the app, it's needed to build it. This will do some modern JS magic ([Babel, WebPack, ...](https://github.com/facebook/create-react-app#user-content-whats-included)) and create a static version of the app, which can be served as static assets. To do so, it's needed to execute `yarn build` on the app's dir:
```
me@mypc:~/Rac1.js$ docker-compose exec rac1 yarn build
yarn run v1.9.4
$ react-scripts build && yarn sw-epilog && yarn pubgh
Creating an optimized production build...
[...]
Done in 58.15s.
me@mypc:~/Rac1.js$
```

# Access the app
Open your browser and point it to the development version at [http://127.0.0.1:3000](http://127.0.0.1:3000) or the static version at [http://127.0.0.1:4000/Rac1.js/](http://127.0.0.1:4000/Rac1.js/), or visit the public version at https://emibcn.github.io/Rac1.js/ .

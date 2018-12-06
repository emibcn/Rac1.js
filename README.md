[![Build Status](https://travis-ci.com/emibcn/Rac1.js.svg?branch=master)](https://travis-ci.com/emibcn/Rac1.js)

React app to listen to Rac1 radio station podcasts. Uses GitHub pages to publish it at
https://emibcn.github.io/Rac1.js/ (publishes this repo's `docs/` contents). The podcasts
lister is a pure JS app, which does not depends on any other library, so you can re-use
for other JS projects.

Uses https://cors-anywhere.herokuapp.com/ to allow downloading 3rd party webs. In this
case, the app downloads the page with podcasts list, which is served as `text/html`,
which violates CORS specifications.

Inspired by [my command line Python app Rac1.py](https://github.com/emibcn/Rac1.py).

## Features
- [ReactJS](https://reactjs.org/) based browser application
- `<audio>` HTML tag, via [react-audio-player](https://github.com/justinmc/react-audio-player)
- Nice [DatePicker](https://www.npmjs.com/package/react-date-picker) to allow listening to any day's podcasts
- Use [Fontawesome free icons](https://fontawesome.com/)
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
- Good UI controls for use with mobile devices (big buttons, no key bindings)
- Asynchronuosly `fetch` podcast list and pages list HTML page, parse it with RegExp and download remaining pages
- Asynchronuosly `fetch` podcasts JSON data
- Always with a coherently time ordered list of available podcasts
- Auto play next podcast when currently played finishes (as a normal playlist)
- Ability to update podcasts list
- Autoupdate podcasts list when trying to play next podcast after last one, and play the next one (if there is any) after the update finishes
- [Docker](https://docs.docker.com/) with [DockerCompose](https://docs.docker.com/compose/) to open a development instance, with all the [Create React App](https://github.com/facebook/create-react-app) goodies

# TODO
- Split React component into different components. For example: `Player`, `PodcastList`, `Controls`
- Add Browser Router to allow managing the selected date via PATH
- Filters via `localStorage`, to easily jump unwanted podcasts
- Better internal state handling for player status: `pause`, `volume`, ...
- Consider using Redux
- Improve UX: layout, styles, info shown, responsible, controls, ¿bootstrap4?
- Add info/help/about section
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

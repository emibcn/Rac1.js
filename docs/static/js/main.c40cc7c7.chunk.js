(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{41:function(t,e,a){"use strict";(function(t){var n=a(7),i=a(6),r=a(11),o=a(10),s=a(12),c=a(0),u=a(1),l=a(25),d=function(e){function a(){var t;Object(n.a)(this,a);return(t=Object(r.a)(this,Object(o.a)(a).call(this))).loadGoogleTag("UA-129704402-1"),l.a.initialize("UA-129704402-1"),t}return Object(s.a)(a,e),Object(i.a)(a,[{key:"componentDidMount",value:function(){this.sendPageView(this.context.router.history.location),this.context.router.history.listen(this.sendPageView)}},{key:"sendPageView",value:function(t){l.a.set({page:t.pathname}),l.a.pageview(t.pathname)}},{key:"loadGoogleTag",value:function(e){t.dataLayer=t.dataLayer||[],t.gtag=function(){t.dataLayer.push(arguments)},t.gtag("js",new Date),t.gtag("config",e),setTimeout(function(){var t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=".concat(e),document.body.appendChild(t)},1)}},{key:"render",value:function(){return this.props.children}}]),a}(c.Component);d.contextTypes={router:u.PropTypes.object},e.a=d}).call(this,a(32))},42:function(t,e,a){t.exports=a(83)},47:function(t,e,a){},80:function(t,e,a){},83:function(t,e,a){"use strict";a.r(e);var n=a(0),i=a.n(n),r=a(38),o=a.n(r),s=(a(47),a(24)),c=a(14),u=a(7),l=a(11),d=a(10),h=a(6),p=a(12),m=a(86),f=a(88),y=a(87),g=a(85),v=a(39),b=a.n(v),k=a(3),P=a(4),D=function(t){function e(t){var a;return Object(u.a)(this,e),(a=Object(l.a)(this,Object(d.a)(e).call(this))).keyHandlerFocus=function(){},a.player=function(){return a.props.getPlayer()},a.state={controls:[]},a.controls=[{icon:i.a.createElement(k.a,{icon:P.c,flip:"horizontal"}),text:"Prev",action:function(){return a.props.onPlayPrev()}},{icon:i.a.createElement("span",null,i.a.createElement(k.a,{icon:P.d,flip:"horizontal"}),i.a.createElement(k.a,{icon:P.d,flip:"horizontal"})),text:"-10m",action:function(){return a.player().currentTime-=600}},{icon:i.a.createElement("span",null,i.a.createElement(k.a,{icon:P.d,flip:"horizontal",style:{position:"relative",left:".25em"}}),i.a.createElement(k.a,{icon:P.d,flip:"horizontal",style:{position:"relative",left:"-.25em"}})),text:"-60s",action:function(){return a.player().currentTime-=60}},{icon:i.a.createElement(k.a,{icon:P.d,flip:"horizontal"}),text:"-10s",action:function(){return a.player().currentTime-=10}},{icon:i.a.createElement(k.a,{icon:P.b,rotation:90}),text:"Play/Pause",action:function(){return a.player().paused?a.player().play():a.player().pause()}},{icon:i.a.createElement(k.a,{icon:P.d}),text:"+10s",action:function(){return a.player().currentTime+=10}},{icon:i.a.createElement("span",null,i.a.createElement(k.a,{icon:P.d,style:{position:"relative",left:".25em"}}),i.a.createElement(k.a,{icon:P.d,style:{position:"relative",left:"-.25em"}})),text:"+60s",action:function(){return a.player().currentTime+=60}},{icon:i.a.createElement("span",null,i.a.createElement(k.a,{icon:P.d}),i.a.createElement(k.a,{icon:P.d})),text:"+10m",action:function(){return a.player().currentTime+=600}},{icon:i.a.createElement(k.a,{icon:P.c}),text:"Next",action:function(){return a.props.onPlayNext()}}],a}return Object(p.a)(e,t),Object(h.a)(e,[{key:"componentDidMount",value:function(){var t=this;this.keyHandlerFocus(),this.setState(Object(c.a)({},this.state,{controls:this.controls})),/Mobi|Android/i.test(navigator.userAgent)||(this.keyHandlerFocus=function(e){var a=!0;e&&e.relatedTarget&&t.props.allowFocus(e.relatedTarget)&&(a=!1),a&&setTimeout(function(){return t._keyHandler.focus()},100)})}},{key:"render",value:function(){var t=this,e=this.state.controls;return i.a.createElement("div",{onFocus:function(e){return t.keyHandlerFocus(e)}},e.map(function(e,a){return i.a.createElement("button",{key:a,onClick:e.action.bind(t),style:{borderRadius:"1em",padding:"1em",margin:"1em"}},i.a.createElement("div",{style:{fontSize:"calc(1em + 2.5vmin)",fontWeight:"bold",minWidth:"1.5em"}},e.icon instanceof Function?e.icon():e.icon),i.a.createElement("span",{style:{fontSize:"calc(8px + 1vmin)",color:"#777"}},e.text instanceof Function?e.text():e.text))}),i.a.createElement("input",{name:"player-key-handler",style:{width:"1px",height:"1px",border:0,margin:0,padding:0,position:"fixed",backgroundColor:"transparent",color:"transparent",cursor:"default"},ref:function(e){t._keyHandler=e},onKeyUp:this.handleKey.bind(this),onBlur:this.keyHandlerFocus.bind(this)}))}},{key:"setVolume",value:function(t){this.player().volume=t,this.props.onSetVolume(t)}},{key:"incrementVolume",value:function(t){var e=this.state.volume,a=e;t>0&&e<1&&(a=e<=1-t?e+t:1),t<0&&e>0&&(a=e>=-t?e+t:0),a!==e&&this.setVolume(a)}},{key:"handleKey",value:function(t){var e=!0;switch(t.key){case"Enter":this.props.onPlayNext();break;case" ":case"p":case"P":this.player().paused?this.player().play():this.player().pause();break;case"ArrowLeft":this.player().currentTime-=10;break;case"ArrowRight":this.player().currentTime+=10;break;case"ArrowUp":t.shiftKey?this.incrementVolume(.05):this.player().currentTime-=60;break;case"ArrowDown":t.shiftKey?this.incrementVolume(-.05):this.player().currentTime+=60;break;case"PageUp":this.player().currentTime-=600;break;case"PageDown":this.player().currentTime+=600;break;case"*":this.incrementVolume(.05);break;case"/":this.incrementVolume(-.05);break;case"m":case"M":this.player().muted=!this.player().muted;break;case"r":case"R":this.handleClickReload();break;default:e=!1}e&&(t.stopPropagation(),t.preventDefault())}}]),e}(n.Component);D.defaultProps={onSetVolume:function(t){},onPodcastsLastRemove:function(t){},onPlayPrev:function(t){},onPlayNext:function(t){}};var E=D,j=a(40),w=a.n(j),O=function(t){function e(){return Object(u.a)(this,e),Object(l.a)(this,Object(d.a)(e).apply(this,arguments))}return Object(p.a)(e,t),Object(h.a)(e,[{key:"render",value:function(){var t=this.props,e=t.completedDownload,a=t.date,n=t.children,r=t.maxDate;return i.a.createElement("div",{style:{color:"#777",backgroundColor:"white",padding:"2em",borderRadius:"1em",margin:"1em",textAlign:"left",position:"relative"}},i.a.createElement("button",{onClick:this.props.onClickReload.bind(this),disabled:!e,style:{borderRadius:".5em",padding:".25em",margin:"1.5em",position:"absolute",top:0,right:0}},i.a.createElement("div",{style:{fontSize:"calc(.5em + 2vmin)",fontWeight:"bold",marginBottom:"-.25em"}},i.a.createElement(k.a,{icon:P.f})),i.a.createElement("span",{style:{fontSize:"calc(5px + 1vmin)",color:"#777"}},"Reload")),i.a.createElement("div",{style:{textAlign:"center",fontSize:"large"}},i.a.createElement(w.a,{onChange:this.handleDateChange.bind(this),onBlur:this.handleDateBlur.bind(this),minDate:new Date(2015,5,1),maxDate:r,required:!0,value:a,clearIcon:null,calendarIcon:i.a.createElement(k.a,{icon:P.a})}),n))}},{key:"handleDateChange",value:function(t){t.setHours(0),t.setMinutes(0),this.props.onDateChange(t)}},{key:"handleDateBlur",value:function(t){var e=!0;t&&t.relatedTarget&&t.relatedTarget.className.match(/(calendar|date-?picker)/)&&(e=!1),e&&this.props.onDateBlur(t)}}]),e}(n.Component);O.defaultProps={onClickReload:function(t){},onDateBlur:function(t){},onDateChange:function(t){},completedDownload:!0,date:new Date,maxDate:new Date};var U=O,x=function(t){function e(){return Object(u.a)(this,e),Object(l.a)(this,Object(d.a)(e).apply(this,arguments))}return Object(p.a)(e,t),Object(h.a)(e,[{key:"render",value:function(){var t=this.props,e=t.children,a=t.current;return void 0===e||0===e.length?null:i.a.createElement("ul",{style:{listStyleType:"none",marginLeft:0,paddingLeft:0,textAlign:"left"}},e.map(function(t,e){return i.a.createElement("li",{key:t.key,style:{position:"relative",marginLeft:"1em"}},e===a?i.a.createElement(k.a,{icon:P.e,style:{position:"absolute",left:"-1.25em",top:"calc(.2vmin + .2em)"}}):null,t)}))}}]),e}(n.Component);x.defaultProps={};var C=x,_=function(t){function e(){var t,a;Object(u.a)(this,e);for(var n=arguments.length,i=new Array(n),r=0;r<n;r++)i[r]=arguments[r];return(a=Object(l.a)(this,(t=Object(d.a)(e)).call.apply(t,[this].concat(i)))).handleClick=function(t){return a.props.onClick(t)},a}return Object(p.a)(e,t),Object(h.a)(e,[{key:"render",value:function(){var t,e=this.props,a=e.path,n=e.uuid,r=e.hour,o=e.minute,s=e.title;return i.a.createElement("span",null,a?i.a.createElement("a",{href:a,onClick:this.handleClick.bind(this),style:{textDecoration:"none"}},r,"h",o?((t=o)<10?"0":"")+t:"",": ",s):i.a.createElement("span",null,n))}}]),e}(n.Component);_.defaultProps={onClick:function(t){}};var T=_,L=a(41);function F(t){if(!t.ok)throw Error(t.statusText);return t}function H(t){console.error(t)}var N=/ class="(audioteca-item|pagination-link)" /,M=/.* (data-[^=]*)="([^"]*)".*/,R=function(){function t(e){Object(u.a)(this,t),this._podcastsData={},this._pages_uuids=[],this._previous_uuids=[];this.date=e.date,this.onListUpdate=e.onListUpdate||function(){},this.updateList()}return Object(h.a)(t,[{key:"setDate",value:function(t){this.date!==t&&(this._previous_uuids=[]),this.date=t,this.updateList()}},{key:"updateList",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;return 0===t&&(this._pages_uuids=[],this.pages=[0],this.handleListUpdate()),this.getPodcastsUUIDs(t).then(this.getPodcasts.bind(this,t)).then(this.handleListUpdate.bind(this,t))}},{key:"getPodcasts",value:function(t,e){var a=this;return e.map(function(e){return"..."===e.uuid||e.uuid in a._podcastsData||a.getPodcastData(e.uuid).then(a.handlePodcastUpdate.bind(a,t)),e})}},{key:"handleListUpdate",value:function(){var t=this,e=Object(s.a)(this._previous_uuids.filter(function(t){return"..."!==t.uuid})),a=!0;this.pages.forEach(function(n){var i=t._pages_uuids[n];void 0===i?(e.push({uuid:"..."}),a=!1):i.filter(function(t){return 0===e.filter(function(e){return e.uuid===t.uuid}).length}).forEach(function(t){return e.push(t)})}),e=e.map(function(e){return t._podcastsData[e.uuid]||e}),a&&(this._previous_uuids=e);var n=a&&e.every(function(t){return"path"in t});return this.onListUpdate(e,n),e}},{key:"handlePodcastUpdate",value:function(t,e){var a=this;e.page=t,this._pages_uuids[t].forEach(function(n,i){n.uuid===e.uuid&&(a._pages_uuids[t][i]=e)}),this.handleListUpdate(e)}},{key:"getPodcastsUUIDs",value:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;return this.getPage(e).then(function(a){var n=t.parsePage(a),i=n.uuidsPage,r=n.pages;return 0===e&&(t.pages=r.length>0?r.reverse():[0],t.pages.forEach(function(e){return 0!==e&&t.updateList(e)})),t._pages_uuids[e]=i.reverse().map(function(t){return{uuid:t,page:e}}),t._pages_uuids[e]})}},{key:"getPage",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,e=function(t){return(t<10?"0":"")+t},a=e(this.date.getDate())+"/"+e(1+this.date.getMonth())+"/"+this.date.getFullYear();return fetch("https://cors-anywhere.herokuapp.com/https://api.audioteca.rac1.cat/a-la-carta/cerca?"+"text=&programId=&sectionId=HOUR&from=".concat(a,"&to=").concat(a,"&pageNumber=").concat(t),{credentials:"same-origin"}).then(F).then(function(t){return t.text()}).catch(H)}},{key:"parsePage",value:function(t){var e=["data-audio-id","data-audioteca-search-page"],a=t.split("\n").filter(function(t){return N.test(t)}).map(function(t){return t.replace(M,"$1=$2")}).map(function(t){return t.split("=")}).filter(function(t){return e.includes(t[0])});return{uuidsPage:a.filter(function(t){return"data-audio-id"===t[0]}).map(function(t){return t[1]}),pages:a.filter(function(t){return"data-audioteca-search-page"===t[0]}).map(function(t){return Number(t[1])})}}},{key:"getPodcastData",value:function(t){var e=this;return t in this._podcastsData?new Promise(function(a){return a(e._podcastsData[t])}):fetch("https://api.audioteca.rac1.cat/piece/audio?id=".concat(t)).then(F).then(function(t){return t.json()}).then(function(a){return a.uuid=t,a.hour=Number(a.audio.time.split(":")[0]),a.minute=Number(a.audio.time.split(":")[1]),a.title=a.appTabletTitle.replace(/ \d\d\/.*/,""),a.titleFull=a.appTabletTitle,e._podcastsData[t]=a,a}).catch(H)}}]),t}(),S=(a(80),function(t){function e(t,a){var n;return Object(u.a)(this,e),(n=Object(l.a)(this,Object(d.a)(e).call(this))).history=t.history,n.initialTitle=document.title,n.state={podcasts:[{uuid:"..."}],currentUUID:"",date:n.getDateFromParams(t),maxDate:new Date,volume:1,completed:!1,waitingUpdate:!1},n}return Object(p.a)(e,t),Object(h.a)(e,[{key:"getDateFromParams",value:function(t){var e=t.match.params;return new Date(e.year,e.month-1,e.day,e.hour,e.minute)}}]),Object(h.a)(e,[{key:"componentWillMount",value:function(){this.unlisten=this.history.listen(this.handleHistoryChange.bind(this)),this.rac1=new R({date:this.state.date,onListUpdate:this.handleListUpdate.bind(this)})}},{key:"componentWillUnmount",value:function(){this.unlisten()}},{key:"render",value:function(){var t=this,e=this.state,a=e.podcasts,n=e.volume,r=e.completed,o=e.date,s=e.maxDate,u=o instanceof Date?"".concat(o.getDate(),"/").concat(1+o.getMonth(),"/").concat(o.getFullYear()):"...",l=this.findCurrentPodcast(),d=l>0,h=void 0!==a&&a.length>l&&"path"in a[l]?a[l].path:"";return i.a.createElement("div",{className:"App"},i.a.createElement("header",{className:"App-header"},i.a.createElement("h3",null,void 0!==a&&a.length>0&&"audio"in a[l]?"".concat(a[l].titleFull):u),i.a.createElement(E,{getPlayer:this.player.bind(this),volume:n,allowFocus:function(t){return t.className.match(/date-?picker/)},onPlayNext:this.playNext.bind(this),onPlayPrev:this.playPrev.bind(this),onSetVolume:function(e){return t.setState(Object(c.a)({},t.state,{volume:e}))},onPodcastsLastRemove:this.handlePodcastsLastRemove.bind(this),ref:function(e){e&&(t.keyHandlerFocus=e.keyHandlerFocus)}}),i.a.createElement(b.a,{ref:function(e){t._player=e},style:{width:"100%"},src:h,autoPlay:d,controls:!0,preload:d?"auto":"metadata",onEnded:this.playNext.bind(this),volume:n}),i.a.createElement(U,{date:o,maxDate:s,completedDownload:r,onClickReload:this.handleClickReload.bind(this),onDateBlur:function(){return t.keyHandlerFocus()},onDateChange:this.handleDateChange.bind(this)},i.a.createElement(C,{current:l},a.map(function(e,a){return i.a.createElement(T,Object.assign({key:"..."!==e.uuid?e.uuid:"..._".concat(a)},e,{onClick:t.handlePodcastClick.bind(t,a)}))})))))}},{key:"handleHistoryChange",value:function(t,e){var a=this.getDateFromParams(this.props),n=this.state.date;"POP"===e&&(n.getFullYear()!==a.getFullYear()||n.getMonth()!==a.getMonth()||n.getDate()!==a.getDate()?this.handleDateChange(a):n.getHours()===a.getHours()&&n.getMinutes()===a.getMinutes()||(this.setState(Object(c.a)({},this.state,{currentUUID:"",dateNew:a})),this.selectPodcastByDate(a,!1)))}},{key:"historyPush",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1],a="/".concat(t.getFullYear(),"/").concat(1+t.getMonth(),"/").concat(t.getDate(),"/").concat(t.getHours(),"/").concat(t.getMinutes());this.history.location.pathname!==a&&(e?this.history.replace(a):this.history.push(a))}},{key:"handleListUpdate",value:function(t,e){var a=this.state,n=a.waitingUpdate,i=a.currentUUID,r=a.date,o=(!n||!e)&&n;this.setState(Object(c.a)({},this.state,{podcasts:t,completed:e,waitingUpdate:o,maxDate:new Date})),e&&""===i&&this.selectPodcastByDate(r),!0===n&&!1===o&&this.playNext(!1)}},{key:"handleDateChange",value:function(t){var e=this;t!==this.state.date&&(this.setState(Object(c.a)({},this.state,{currentUUID:"",date:t})),null!==t&&(this.historyPush(t),setTimeout(function(){return e.rac1.setDate(t)},50)))}},{key:"handlePodcastsLastRemove",value:function(){this.setState(Object(c.a)({},this.state,{podcasts:Object(s.a)(this.state.podcasts).slice(0,-1)}))}},{key:"handleClickReload",value:function(){if(this.state.completed)return this.setState(Object(c.a)({},this.state,{completed:!1})),this.rac1.updateList()}},{key:"selectPodcastByDate",value:function(t){var e=this.state.podcasts.filter(function(e){return e.hour>=t.getHours()&&(e.hour>t.getHours()||e.minute>=t.getMinutes())});e.length>0&&this.playPodcast(this.findPodcastByUUID(e[0].uuid))}},{key:"findPodcastByUUID",value:function(t){var e=0;return this.state.podcasts.forEach(function(a,n){a.uuid===t&&(e=n)}),e}},{key:"findCurrentPodcast",value:function(){return this.findPodcastByUUID(this.state.currentUUID)}},{key:"playPodcast",value:function(t){var e,a=this.state,n=a.date,i=a.currentUUID,r=this.state.podcasts[t];r.hour===n.getHours()&&r.minute===n.getMinutes()||(n.setHours(Number(r.hour)),n.setMinutes(Number(r.minute))),e=""===i,document.title="".concat(this.initialTitle,": ").concat(r.titleFull),this.setState(Object(c.a)({},this.state,{currentUUID:r.uuid,date:n})),this.historyPush(n,e)}},{key:"playPrev",value:function(){var t=this.findCurrentPodcast();t>0&&this.playPodcast(t-1)}},{key:"playNext",value:function(){var t=!(arguments.length>0&&void 0!==arguments[0])||arguments[0],e=this.findCurrentPodcast();e<this.state.podcasts.length-1&&"path"in this.state.podcasts[e]?this.playPodcast(e+1):t&&(this.state.waitingUpdate||(this.handleClickReload(),this.setState(Object(c.a)({},this.state,{waitingUpdate:!0}))))}},{key:"player",value:function(){return this._player.audioEl}},{key:"handlePodcastClick",value:function(t,e){e.stopPropagation(),e.preventDefault(),this.playPodcast(t)}}]),e}(n.Component)),I=function(t){function e(){return Object(u.a)(this,e),Object(l.a)(this,Object(d.a)(e).apply(this,arguments))}return Object(p.a)(e,t),Object(h.a)(e,[{key:"render",value:function(){var t=new Date,e="/".concat(t.getFullYear(),"/").concat(1+t.getMonth(),"/").concat(t.getDate(),"/0/0");return i.a.createElement(m.a,null,i.a.createElement(L.a,null,i.a.createElement(f.a,null,i.a.createElement(y.a,{path:"/:year/:month/:day/:hour/:minute",render:function(t){return i.a.createElement(S,t)}}),i.a.createElement(g.a,{to:{pathname:e}}))))}}]),e}(n.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(i.a.createElement(I,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(t){t.unregister()})}},[[42,2,1]]]);
//# sourceMappingURL=main.c40cc7c7.chunk.js.map
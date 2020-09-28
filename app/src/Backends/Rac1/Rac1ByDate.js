import { ByDate } from '../Base';

const baseURL = 'https://api.audioteca.rac1.cat';

class Rac1 extends ByDate {

  name = 'Rac1 by date';

  pageUrl(pageNumber) {
    // Format day and month to 2 digits 0 padded strings
    const pad2 = num => ( num < 10 ? '0' : '' ) + num;
    const date =
      pad2( this.date.getDate() ) + '/' +
      pad2( 1 + this.date.getMonth() ) + '/' +
      this.date.getFullYear();

    // Set next day's date and string
    let next = new Date(this.date.getTime());
    next.setDate(next.getDate() + 1);
    let dateNext = '';

    // Don't use next day date if it's 2018's last day
    if ( !(next.getFullYear() === 2019 && next.getMonth() === 0 && next.getDate() === 1) ) {
      dateNext =
        pad2( next.getDate() ) + '/' +
        pad2( 1 + next.getMonth() ) + '/' +
        next.getFullYear();
    }

    return `${baseURL}/a-la-carta/cerca?`
      + "text=&programId=&sectionId=HOUR&"
      + `from=${date}&to=${dateNext}&pageNumber=${pageNumber}`;
  }

  // Cached/compiled regexps & strings for parsing HTML
  dataAttrsFind  = / class="(audioteca-item|pagination-link)" /;
  dataAttrsClean = /.* (data-(audio-id|audioteca-search-page))="([^"]*)".*/;
  searchData = ['data-audio-id','data-audioteca-search-page'];
  dataScheduleFixScheduleHour = /(\d)\s+h\b/g;

  // Parses a page raw HTML to obtain audio UUIDs and the list of pages
  // (dataRawHTML) => {uuidsPage: Array(String), pages: Array(Number)}
  parsePage(dataRaw) {
    const data = dataRaw
      .split('\n')

      // Filter by class, eliminating sidebar unwanted info
      .filter( line => this.dataAttrsFind.test(line) )

      // Get relevant data-* attributes
      .map( v => v.replace(this.dataAttrsClean, '$1=$3') )

      // Convert to an array of 2 strings separating attr name and it's value
      .map( line => line.split('=') );

    return {

      // Filter audio UUID's
      uuidsPage: data
        .filter( v => v[0] === this.searchData[0] )
        .map( v => v[1].trim(' \n\r\t') ),

      // Filter page numbers
      pages: data
        .filter( v => v[0] === this.searchData[1] )
        .map( v => Number(v[1]) ),
    };
  }

  podcastUrl = (uuid) => `${baseURL}/piece/audio?id=${uuid}`;

  parsePodcast(uuid, podcast) {
    // Fix server bug on year's last day, in which gives dates in the future
    if ( podcast.dateTime.startsWith(
      `${this.date.getFullYear() + 1}-${this.date.getMonth() + 1}`
    )) {
      podcast.dateTime = podcast.dateTime
        .replace(`${this.date.getFullYear() + 1}`, `${this.date.getFullYear()}`);
      console.log("Podcast date in future. Fixing to: " + podcast.dateTime);
    }

    // Add some processed data to the podcast
    podcast.uuid      = uuid;
    podcast.date      = new Date(podcast.dateTime);
    podcast.hour      = Number(podcast.audio.time.split(':')[0]);
    podcast.minute    = Number(podcast.audio.time.split(':')[1]);
    podcast.title     = podcast.appTabletTitle.replace(/ \d\d\/.*/, '');
    podcast.titleFull = podcast.appTabletTitle;
    podcast.programUrl= podcast.audio.section.program.url;
    podcast.author    = (podcast.audio.section.program.subtitle||'').replace(/^amb /, '');
    podcast.schedule  = (podcast.audio.section.program.schedule||'').replace(this.dataScheduleFixScheduleHour, '$1h');

    Object.keys( podcast.audio.section.program.images )
      .forEach( kind =>
        podcast.audio.section.program.images[kind] =
          `${baseURL}/`
          + podcast.audio.section.program.images[kind]
          + `?v${podcast.audio.section.program.imageVersion}`
       );
    podcast.image = podcast.audio.section.program.images.person;

    // Prevent a redirect of 400ms :/
    podcast.path = podcast.path
      .replace(/\/get\//, '/file/')
      .replace(/\/(\d)\//, '/$1/-/');

    return podcast;
  }
}

export default Rac1;

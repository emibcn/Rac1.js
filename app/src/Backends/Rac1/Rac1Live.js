import { Live } from '../Base';

class Rac1Live extends Live {

  name = 'Rac1 live';
  updateUrl = 'https://api.audioteca.rac1.cat/directe';
  podcastUrl = 'https://streaming.rac1.cat/;*.nsv';

  dataAttrsFind  = /\s(data-ajax-href=|class="(program-header-title-link|program-listed-author|story-image))/;
  dataAttrsClean = /.*\s(src|alt|href|data-ajax-href)="([^"]*)".*/;
  dataTagContent = /<?[^<>]*>([^<]*)<\/[^>]*>/;
  dataTagContents = /\s*<?[^<>]*>(?:amb )?([^<]*?)<\/[^>]*>\s*<?[^<>]*>([^<]*?)<\/[^>]*>/g;
  dataFilenameClean = /^.*[^/.].png$/;
  dataScheduleFixScheduleHour = /(\d)\s+h\b/g;

  parseData(dataRaw) {
    const data = dataRaw
        .split('\n')

        // Get only interesting lines
        .filter( line => this.dataAttrsFind.test(line) );

    // Compute data
    const programUrl = data
        .find( line => line.includes('program-header-title-link') )
        .replace(this.dataAttrsClean, '$2')
        .replace(/a-la-carta/, 'programes');
    const title = data
        .filter( line => !line.includes('program-next-link') )
        .find( line => line.includes('data-ajax-href') )
        .replace(this.dataTagContent, '$1')
        .trim(" \n\t\r");
    const [ author, schedule ] =
      data
        .find( line => line.includes('program-listed-author') )
        .replace(this.dataTagContents, (match, author, schedule) => `${author}\n${schedule.replace(this.dataScheduleFixScheduleHour, '$1h')}`)
        .split('\n');
    const image = data
        .find( line => line.includes('thumbnail') )
        .replace(this.dataAttrsClean, '$2');

    return {

      // Constant ;)
      path: this.podcastUrl,

      // Get previously computed values
      programUrl,
      title,
      author,
      schedule,
      image,
    };
  }
}

export default Rac1Live;

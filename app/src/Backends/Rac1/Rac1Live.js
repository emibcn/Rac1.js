import { Live } from '../Base'

const DEBUG = false
function debug (...args) {
  if (DEBUG === true) {
    console.log(...args)
  }
}

class Rac1Live extends Live {
  name = 'Rac1 live'
  updateUrl = 'https://api.audioteca.rac1.cat/piece/live'
  podcastUrl =
    'https://playerservices.streamtheworld.com/api/livestream-redirect/RAC_1.mp3'

  dataAttrsFind =
    /\s(data-ajax-href=|<img loading="lazy"|class="(c-card--claim__(epigraph|title|subtitle)))/

  dataAttrsClean = /.*\s(src|href|data-ajax-href)="([^"]*)".*/g
  dataTagContent = /<?[^<>]*>([^<]*)<\/[^>]*>/
  dataTagContents =
    /\s*<?[^<>]*>(?:amb )?([^<]*?)<\/[^>]*>\s*<?[^<>]*>([^<]*?)<\/[^>]*>/g

  dataFilenameClean = /^.*[^/.].png$/
  dataScheduleFixScheduleHour = /(\d)\s+h\b/g

  parseData (dataRaw) {
    const data = dataRaw
      .split('\n')

      // Get only interesting lines
      .filter((line) => this.dataAttrsFind.test(line))

      // Cleanup trailing whitespaces and tabs
      .map((line) => line.trim())

    debug('parseData: data', data)

    // Compute data
    const image = data
      .find((line) => line.includes('<img loading="lazy"'))
      .replace(this.dataAttrsClean, '$2')

    debug('parseData: image', image)

    const programUrl = image.replace(
      /.*\/([^/.]*)\.png.*/,
      'https://www.rac1.cat/a-la-carta/programes/$1'
    )

    debug('parseData: programUrl', programUrl)

    const title = data
      .find((line) => line.includes('__title'))
      .replace(this.dataTagContent, '$1')

    debug('parseData: title', title)

    const author = data
      .find((line) => line.includes('__subtitle'))
      .replace(this.dataTagContent, '$1')

    debug('parseData: author', author)

    const schedule = data
      .find((line) => line.includes('__epigraph'))
      .replace(this.dataTagContent, '$1')

    debug('parseData: schedule', schedule)

    return {
      // Constant ;)
      path: this.podcastUrl,

      // Get previously computed values
      programUrl,
      title,
      author,
      schedule,
      image
    }
  }
}

export default Rac1Live

import { AxiosService, FSService, DomService } from '../services/index.js'
import { createNameFromUrl } from '../utils/index.js'

export default (url, { output = process.cwd() }) => {
  const nameFromUrl = createNameFromUrl(url)
  const workDir = output + '/' + nameFromUrl
  const htmlFileName = nameFromUrl + '.html'

  if (!workDir) {
    return process.exit(1)
  }

  console.log('Download from: ' + url + ' save to directory: ' + output)

  let Dom = ''

  AxiosService.requestGet(url)
    .then((response) => {
      Dom = new DomService(response.data)
    })
    .then(() => FSService.mkdir(workDir))
    .then(() => FSService.save(workDir + '/' + htmlFileName, Dom.getHtmlString()))
    .then(() => Dom.extractResources())
    .then(({ images, scripts, links }) => [...images, ...scripts, ...links].map(item => URL.parse(item) ? null : url + item))
    .then(src => src.filter(item => item !== null))
    .then(src => src.map(item => AxiosService.downloadFile(item, nameFromUrl + '/')))
    .then(promises => Promise.all(promises))
    .catch(({ config = { url: null }, message }) => console.error(message + '; From URL: ' + config.url))
}

import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { AxiosService, FSService, DomService } from '../services/index.js'
import { createNameFromUrl } from '../utils/index.js'
import { AxiosError } from 'axios'

export default (url, { output = process.cwd() }) => {
  const __dirname = dirname(fileURLToPath(import.meta.url))
  // Generate name from URL
  const nameFromUrl = createNameFromUrl(url)
  // Define workdir
  const workDir = output === process.cwd() ? output + '/' + nameFromUrl : join(__dirname, '../../', output, nameFromUrl)
  // Define index filename
  const distMainHtmlFile = workDir + '/' + nameFromUrl + '.html'

  if (!workDir) {
    return process.exit(1)
  }

  console.log('Download from: ' + url + ' save to directory: ' + workDir)

  let Dom = ''

  AxiosService.requestGet(url)
    .then((response) => {
      Dom = new DomService(response.data)
    })
    .then(() => FSService.mkdir(workDir))
    .then(() => FSService.save(distMainHtmlFile, Dom.getHtmlString()))
    .then(() => Dom.extractResources())
    .then(({ images, scripts, links }) => [...images, ...scripts, ...links].map(item => URL.parse(item) ? null : item))
    .then(src => src.filter(item => item !== null))
    .then(src => src.map(item => AxiosService.downloadFile(url + item, workDir + '/' + item)))
    .then(promises => Promise.all(promises))
    .catch((err) => {
      if (err instanceof AxiosError) {
        const { config, message } = err
        console.error('Failed to download file: ' + config.url + '. Message: ' + message)
      }
    })
}

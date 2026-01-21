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
    .then(resources => console.log(resources))
    .catch(err => console.error(err.message))
}

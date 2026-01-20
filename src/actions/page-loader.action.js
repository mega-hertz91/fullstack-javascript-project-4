import { AxiosService } from '../services/index.js'
import { FSService } from '../services/index.js'
import { createNameFromUrl } from '../utils/index.js'

export default (url, { output = process.cwd() }) => {
  const nameFromUrl = createNameFromUrl(url)
  const workDir = output + '/' + nameFromUrl
  const htmlFileName = nameFromUrl + '.html'

  if (!workDir) {
    return process.exit(1)
  }

  console.log('Download from: ' + url + ' save to directory: ' + output)

  FSService.mkdir(workDir)
    .then(() => AxiosService.requestGet(url))
    .then(response => response.data)
    .then(data => FSService.save(workDir + '/' + htmlFileName, data))
    .catch(err => console.error(err.message))
}

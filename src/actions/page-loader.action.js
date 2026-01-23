import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import Listr from 'listr'
import { AxiosError } from 'axios'
import { ProcessCode } from '../constants/index.js'
import { AxiosService, FSService, DomService, ListrService } from '../services/index.js'
import { createNameFromUrl } from '../utils/index.js'
import { normalizePath } from '../facades/resources.facade.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default (url, { output = process.cwd() }) => {
  /**
     * Url for download resources
     * @type {URL}
   * */
  let targetUrl = null
  /**
     * Virtual DOM
     * @type {DomService}
   * */
  let DOM = null

  try {
    targetUrl = new URL(url)
  }
  catch (e) {
    console.error(e.message)
    process.exit(ProcessCode.ERROR)
  }

  // Generate name from URL
  const SRC_DIR_NAME = createNameFromUrl(targetUrl)
  // Define workdir
  const WORK_DIR = output === process.cwd() ? output + '/' + SRC_DIR_NAME : join(__dirname, '../../', output, SRC_DIR_NAME)
  // Parse host
  const { href: TARGET_HREF, origin: TARGET_ORIGIN, pathname: TARGET_PATH_NAME } = targetUrl

  /**
     * Main pipeline
   */
  AxiosService.requestGet(TARGET_HREF)
    .then(response => DOM = new DomService(response.data))
    .then(() => FSService.mkdir(WORK_DIR))
    .then(() => FSService.save(WORK_DIR + '/' + SRC_DIR_NAME + '.html', DOM.getHtmlString()))
    .then(() => DOM.extractResources())
    .then(resources => resources.map(item => normalizePath(item, TARGET_ORIGIN, TARGET_PATH_NAME)))
    .then(resources => resources.filter(item => item && item !== '/'))
    .then(
      src => new Listr(
        src.map(
          item => ListrService.createTask(
            'Download source: ' + join(TARGET_ORIGIN, item),
            AxiosService.downloadFile(join(TARGET_ORIGIN, item), join(WORK_DIR, item.replace(/\?.+/g, ''))),
          ),
        ),
      ),
    )
    .then(tasks => tasks.run())
    .catch(err => Promise.reject(err))
}

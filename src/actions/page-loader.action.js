import { join } from 'node:path'
import Listr from 'listr'
import { AxiosService, FSService, DomService, ListrService } from '../services/index.js'
import { createNameFromUrl } from '../utils/index.js'
import { normalizePath } from '../facades/resources.facade.js'

/**
 * @param {String} url
 * @param {String|Object} outputDir
 * @return {Promise<unknown>}
 */
export default (url, outputDir = '') => {
  let output = process.cwd()

  if (typeof outputDir === 'string' && outputDir.length > 0) {
    output = outputDir
  }

  if (typeof outputDir === 'object' && Object.hasOwn(outputDir, 'output')) {
    const { output: outputArgv } = outputDir

    output = outputArgv
  }

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
    throw e
  }

  // Generate name from URL
  const SRC_DIR_NAME = createNameFromUrl(targetUrl)
  // Define workdir
  const WORK_DIR = join(output, SRC_DIR_NAME)
  // Parse host
  const { href: TARGET_HREF, origin: TARGET_ORIGIN, pathname: TARGET_PATH_NAME } = targetUrl

  return new Promise((resolve, reject) => {
    AxiosService.requestGet(TARGET_HREF)
      .catch(reject)
      .then(response => DOM = new DomService(response.data))
      .then(() => FSService.mkdir(WORK_DIR))
      .catch(reject)
      .then(() => FSService.save(WORK_DIR + '/' + SRC_DIR_NAME + '.html', DOM.getHtmlString()))
      .then(() => DOM.extractResources())
      .then(resources => resources.map(item => normalizePath(item, TARGET_ORIGIN, TARGET_PATH_NAME)))
      .then(resources => resources.filter(item => item && item !== '/'))
      .then(
        src => new Listr(
          src.map(
            item => ListrService.createTask(
              'Download source: ' + join(TARGET_ORIGIN, item),
              AxiosService.downloadFile(join(TARGET_ORIGIN, item), join(WORK_DIR, SRC_DIR_NAME + '_files', SRC_DIR_NAME + item.replace(/\?.+/g, '').replaceAll('/', '-'))),
            ),
          ),
        ),
      )
      .then(tasks => tasks.run())
      .then(resolve)
      .catch(reject)
  })
}

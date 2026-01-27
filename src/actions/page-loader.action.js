import { join } from 'node:path'
import Listr from 'listr'
import { AxiosService, FSService, DomService, ListrService } from '../services/index.js'
import { createNameFromUrl } from '../utils/index.js'
import { normalizePath } from '../facades/resources.facade.js'

/**
 * @param {String} url
 * @param {String} output
 * @return {Promise<unknown>}
 */
export default (url, output = process.cwd()) => {
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
  const WORK_DIR = join(output)
  // Parse host
  const { href: TARGET_HREF, origin: TARGET_ORIGIN, pathname: TARGET_PATH_NAME } = targetUrl

  /**
   * Run main pipeline
  */
  return FSService.mkdir(join(WORK_DIR, SRC_DIR_NAME + '_files'))
  // Request get to TARGET_URL
    .then(() => AxiosService.requestGet(TARGET_HREF))
  // Generate HTML DOM
    .then(response => DOM = new DomService(response.data))
    // Save index page to WORK_DIR
    .then(() => FSService.save(join(WORK_DIR, SRC_DIR_NAME + '.html'), DOM.getHtmlString()))
    // Extract Resources
    .then(() => DOM.extractResources())
    // Generate links to download
    .then(src => src.map(item => normalizePath(item, TARGET_ORIGIN, TARGET_PATH_NAME)))
    .then(resources => resources.filter(item => item))
    // Create tasks with Listr
    .then(
      src => new Listr(
        src.map(
          item => ListrService.createTask(
            'Download source: ' + join(TARGET_ORIGIN, item.newPath),
            AxiosService.downloadFile(
              join(TARGET_ORIGIN, item.newPath),
              join(WORK_DIR, SRC_DIR_NAME + '_files',
                (item.newPath === TARGET_PATH_NAME ? SRC_DIR_NAME + '.html' : createNameFromUrl(TARGET_ORIGIN) + item.newPath)
                  .replace(/\?.+/g, '')
                  .replaceAll('/', '-'),
              ),
            ),
          ),
        ),
      ),
    )
  // Run tasks
    .then(tasks => tasks.run())
  // Create message to success
    .then(() => 'Page was successfully downloaded')
}

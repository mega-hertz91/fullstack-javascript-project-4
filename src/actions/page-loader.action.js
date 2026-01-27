import { join } from 'node:path'
import Listr from 'listr'
import { AxiosService, FSService, DomService, ListrService } from '../services/index.js'
import { createNameFromUrl } from '../utils/index.js'
import { createMainProperties } from '../facades/resources.facade.js'

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
    // Extract Resources
    .then(() => DOM.extractResources())
    // Generate links to download
    .then(src => src.map(item => createMainProperties(item, TARGET_ORIGIN, TARGET_PATH_NAME)))
    // Filter define src
    .then(src => src.filter(item => item))
    // Replace DOM element to local links
    .then((src) => {
      src.forEach(({ query, targetAttr, distName }) => {
        DOM.replaceAttributeSelector(query, targetAttr, SRC_DIR_NAME + '_files/' + distName
          .replaceAll('/', '-'))
      })

      return src
    })
    // Create tasks with Listr
    .then(src => new Listr(src.map(
      item => ListrService.createTask(
        'Download source: ' + item.downloadUrl,
        AxiosService.downloadFile(item.downloadUrl, join(WORK_DIR, SRC_DIR_NAME + '_files', item.distName),
        ),
      ),
    ),
    ),
    )
  // Run Listr tasks
    .then(tasks => tasks.run())
  // Save index page to WORK_DIR
    .then(() => FSService.save(join(WORK_DIR, SRC_DIR_NAME + '.html'), DOM.getHtmlString()))
  // Create message to success
    .then(() => 'Page was successfully downloaded')
}

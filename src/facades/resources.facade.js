import { createNameFromUrl, urlUtil } from '../utils/index.js'
import { join } from 'node:path'

export const createMainProperties = ({ path, ...other }, hostname, pathname) => {
  if (path && path.length === 0) {
    return null
  }

  const isUrl = urlUtil.isUrl(path)
  const isAbsolutePath = urlUtil.isAbsolutePath(path)

  if (isUrl && !urlUtil.isEqualHostNames(hostname, path)) {
    return null
  }

  const downloadUrl = isUrl ? new URL(path) : new URL(isAbsolutePath ? join(hostname, path) : join(hostname, pathname, path))

  return {
    path,
    ...other,
    downloadUrl: downloadUrl.href,
    distName: createNameFromUrl(hostname) + downloadUrl.pathname.replace(/\?.+/g, '')
      .replaceAll('/', '-') + (urlUtil.isEqualPathNames(downloadUrl.pathname, pathname) ? '.html' : ''),
  }
}

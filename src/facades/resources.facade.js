import { urlUtil } from '../utils/index.js'
import { join } from 'node:path'

export const normalizePath = ({ path, ...other }, hostname, pathname) => {
  if (path && path.length === 0) {
    return null
  }

  if (urlUtil.isUrl(path) && !urlUtil.isEqualHostNames(hostname, path)) {
    return null
  }

  const itemNew = urlUtil.isUrl(path) ? { path, ...other, newPath: urlUtil.getPathname(path) } : { path, ...other, newPath: path }

  if (urlUtil.isEqualPathNames(pathname, itemNew.newPath)) {
    return itemNew
  }

  if (urlUtil.isAbsolutePath(itemNew.newPath)) {
    return itemNew
  }

  return { path, ...other, newPath: join(pathname, path) }
}

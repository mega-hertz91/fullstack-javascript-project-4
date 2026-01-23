import { urlUtil } from '../utils/index.js'
import { join } from 'node:path'

export const normalizePath = (item, hostname, pathname) => {
  if (item.length === 0) {
    return null
  }

  if (urlUtil.isUrl(item)) {
    return urlUtil.isEqualHostNames(hostname, item) && urlUtil.isEqualPathNames(pathname, item) ? urlUtil.getPathname(item) : null
  }

  if (urlUtil.isAbsolutePath(item)) {
    return item
  }

  return join(pathname, item)
}

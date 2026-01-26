import { urlUtil } from '../utils/index.js'
import { join } from 'node:path'

export const normalizePath = (item, hostname, pathname) => {
  if (item.length === 0) {
    return null
  }

  if (urlUtil.isUrl(item) && !urlUtil.isEqualHostNames(hostname, item)) {
    return null
  }

  const itemNew = urlUtil.isUrl(item) ? urlUtil.getPathname(item) : item

  if (urlUtil.isEqualPathNames(pathname, itemNew)) {
    return itemNew + '.html'
  }

  if (urlUtil.isAbsolutePath(itemNew)) {
    return itemNew
  }

  return join(pathname, item)
}

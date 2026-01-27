export const isUrl = (string) => {
  const url = URL.parse(string)
  return url !== null
}

export const isAbsolutePath = (path) => {
  return path.at(0) === '/' && path.length > 1
}

export const absoluteToRelativePath = (path) => {
  return path.slice(1, path.length)
}

export const isEqualHostNames = (url1, url2) => {
  const [a, b] = [isUrl(url1), isUrl(url2)]

  if (!a || !b) {
    return false
  }

  return URL.parse(url1).hostname === URL.parse(url2).hostname
}

export const getPathname = (url) => {
  if (!isUrl(url)) {
    return null
  }

  return URL.parse(url).pathname
}

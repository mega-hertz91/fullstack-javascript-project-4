export const isUrl = (string) => {
  return !!URL.parse(string)
}

export const isAbsolutePath = (path) => {
  return false
}

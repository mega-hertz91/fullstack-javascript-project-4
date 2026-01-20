import { URL } from 'url'

const regex = /[/ .]/g

export default (url, replaceSymbol = '-') => {
  // Create URL class
  const Url = URL.parse(url)
  // Check defined URL
  if (!Url) {
    return null
  }

  // Replace if last symbol "/"
  const replacePath = Url.pathname.at(-1) === '/'
    ? Url.pathname.slice(0, Url.pathname.length - 1)
    : Url.pathname

  // Return create name on url
  return (Url.hostname + replacePath).replaceAll(regex, replaceSymbol)
}

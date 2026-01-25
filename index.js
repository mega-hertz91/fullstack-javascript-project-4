import { pageLoaderAction } from './src/actions/index.js'

export default pageLoaderAction

pageLoaderAction('https:/site.com/blog/about/assets/styles.css', '/sys')
  .then(res => console.log(res))
  .catch(error => console.error(error.message))

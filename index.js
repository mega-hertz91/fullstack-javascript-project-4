import { pageLoaderAction } from './src/actions/index.js'

pageLoaderAction('https://site.com/blog/about/')
  .then(res => console.log(res))
  .catch(error => console.error(error.message))

export default pageLoaderAction

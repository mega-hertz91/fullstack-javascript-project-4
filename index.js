import { pageLoaderAction } from './src/actions/index.js'

export default pageLoaderAction

pageLoaderAction('https:/test.com/')
  .then(res => console.log(res))
  .catch(error => console.error(error))

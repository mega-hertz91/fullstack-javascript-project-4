import { pageLoaderAction } from './src/actions/index.js'

export default pageLoaderAction

pageLoaderAction('https://elma365')
  .then(msg => console.log(msg))
  .catch(err => console.log(err))

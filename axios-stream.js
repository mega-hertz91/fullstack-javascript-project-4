import { AxiosService } from './src/services/index.js'
import fs from 'fs'

AxiosService
  .requestGetStream('https://cms.elma365.com/assets/db0b63ff-aa87-44e7-82d5-cef52781bc80')
  .then(response => response.data)
  .then((data) => {
    const writer = fs.createWriteStream(process.cwd() + '/assets/test.png', 'utf8')

    data.pipe(writer)

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve)
      writer.on('error', reject)
    })
  })
  .then(() => console.log('Finished stream'))
  .catch(err => console.log(err))

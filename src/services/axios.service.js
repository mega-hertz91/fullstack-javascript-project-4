import axios from 'axios'
import { createWriteStream } from 'fs'

const API = axios.create({
  // For powerful file
  timeout: 10000,
  // // http to https, without slash to with slash
  // maxRedirects: 4,
})

export default class AxiosService {
  static requestGet(url, config) {
    return API.get(url, config)
  }

  static requestGetStream(url, config) {
    return API.get(url, {
      responseType: 'stream',
      ...config,
    })
  }

  static downloadFile(url, dist) {
    console.log(dist)
    const writer = createWriteStream(dist)

    return AxiosService.requestGetStream(url)
      .then((response) => {
        response.data.pipe(writer)

        return new Promise((resolve, reject) => {
          writer.on('finish', resolve)
          writer.on('error', reject)
        })
      })
  }
}

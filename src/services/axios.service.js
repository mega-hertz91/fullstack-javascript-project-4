import axios from 'axios'
import { mkdir } from 'fs/promises'
import { createWriteStream } from 'fs'

const API = axios.create({
  timeout: 10000,
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
    const Url = new URL(url)
    const pathName = Url.pathname.match(/\/.+\//g).at(0)
    const fileName = Url.pathname.split(pathName).at(-1)
    let writer = {}

    return mkdir(dist + pathName, { recursive: true })
      .then(() => {
        writer = createWriteStream(dist + pathName + fileName)
      })
      .then(() => AxiosService.requestGetStream(url))
      .then((response) => {
        response.data.pipe(writer)

        return new Promise((resolve, reject) => {
          writer.on('finish', resolve)
          writer.on('error', reject)
        })
      })
  }
}

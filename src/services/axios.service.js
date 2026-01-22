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
    const saveDir = dist.match(/\/.+\//g).at(0)
    const saveFullPath = saveDir + dist.split(saveDir).at(-1)
    let writer = {}

    console.log(dist)

    return mkdir(saveDir, { recursive: true })
      .then(() => {
        writer = createWriteStream(saveFullPath)
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

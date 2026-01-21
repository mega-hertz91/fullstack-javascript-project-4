import axios from 'axios'

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
}

import {AxiosService} from "../services/index.js";
import {STATUS_CODE} from "../constants/index.js";
import {save as saveFile} from "../services/fs.service.js";

export default (url, output) => {
  console.log('Download from: ' + url + ' save to directory: ' + output)

  AxiosService.requestGet(url)
    .then(response => {
      if (response.status === STATUS_CODE.OK) {
        return response.data
      }
    })
    .then(data => saveFile(data, output + '/test.html'))
    .catch()
}
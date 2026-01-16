import {AxiosService} from "../services/index.js";
import {STATUS_CODE} from "../constants/index.js";
import {FSService} from "../services/index.js";

export default (url, output) => {
  console.log('Download from: ' + url + ' save to directory: ' + output)

  AxiosService.requestGet(url)
    .then(response => {
      if (response.status === STATUS_CODE.OK) {
        return response.data
      }
    })
    .then(data => FSService.save(output + '/test.html', data))
    .catch()
}
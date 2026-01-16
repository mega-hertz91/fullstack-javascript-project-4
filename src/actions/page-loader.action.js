import {AxiosService} from "../services/index.js";
import {STATUS_CODE} from "../constants/index.js";
import {FSService} from "../services/index.js";
import {createNameFromUrl} from "../utils/index.js";

export default (url, {output = process.cwd()}) => {
    const filename = createNameFromUrl(url);

    if (!filename) {
        console.error('invalid url');
        return process.exit(1);
    }

    console.log('Download from: ' + url + ' save to directory: ' + output)

    AxiosService.requestGet(url)
        .then(response => {
            if (response.status === STATUS_CODE.OK) {
                return response.data
            }
        })
        .then(data => FSService.save(output + '/' + filename, data))
        .catch(err => console.error(err.message));
}
import axios, {AxiosError} from 'axios';

const API = axios.create({
    timeout: 1000,
})

export class AxiosService {
    static requestGet(url, config) {
        return API.get(url, config).catch(err => err);
    }
}

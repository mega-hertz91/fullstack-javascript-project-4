import axios from 'axios';

export default () => {
  return axios.create({
    timeout: 1000,
  })
}

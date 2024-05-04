import axios from 'axios'
import { getCsrfToken } from './Utils'

const request = axios.create({
  baseURL: 'http://127.0.0.1:8000/'
})

request.interceptors.request.use(config => {
  let csrftoken = getCsrfToken();
  if (csrftoken) {
    config.headers['x-csrftoken'] = csrftoken
  }

  return config
}, error => {
  console.log(error)
  return Promise.reject(error)
})

request.interceptors.response.use(res => {
  if (res.data.code !== undefined && res.data.code !== 200) {
    alert(res.data.msg)
  }
  return res
}, function (error) {
  console.log(error)
  return Promise.reject(error)
})

export default request
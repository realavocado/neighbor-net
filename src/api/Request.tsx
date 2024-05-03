import axios from 'axios'

const Request = axios.create({
  baseURL: 'http://127.0.0.1:8000/'
})

Request.interceptors.response.use(res => {
  if (res.data.code !== undefined && res.data.code !== 200) {
    alert(res.data.msg)
  }
  return res
}, function (error) {
  console.log(error)
  return Promise.reject(error)
})

export default Request
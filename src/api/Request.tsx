import axios from 'axios'

export const baseURL = 'http://127.0.0.1:8000/'

const request = axios.create({
  baseURL: baseURL
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

export function fetchAndStoreCsrfToken() {
  return fetch(baseURL + 'users/set_csrf_token/', {
    method: 'GET',
    credentials: 'include'
  })
  .then(response => {
    console.log('CSRF token fetched and stored');
  })
  .catch(error => {
    console.error('Error in fetching CSRF token:', error);
  });
}

export function getCsrfToken() {
  const cookies = document.cookie.split(';');
  //console.log(cookies);
  
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    const cookieParts = cookie.split('=');
    //console.log(cookies[i]);
    if (cookieParts[0] === 'csrftoken') {
      return cookieParts[1];
    }
  }

  return null;
}


export default request
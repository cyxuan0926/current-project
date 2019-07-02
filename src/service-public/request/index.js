import qs from 'qs'
import axios from 'axios'
import store from '@/store'
import config from './config'
import handleResponse from './handleResponse'

const instance = axios.create(config)

instance.interceptors.request.use(
  config => {
    /* eslint-disable camelcase */
    const { access_token, token_type } = store.state.account.accountInfo
    store.commit('showLoading')

    if (access_token) {
      config.headers.Authorization = `${ token_type } ${ access_token }`
    }
    else {
      config.auth = {
        username: 'visit.admin',
        password: '3cceca7160774a40b01c7fdadfb37da0'
      }
    }

    return config
  },
  error => Promise.reject(error)
)

instance.interceptors.response.use(
  response => {
    store.commit('hideLoading')
    handleResponse(response)
    return response
  },
  error => {
    // store.commit('setLoginState')
    store.commit('hideLoading')
    error.response && handleResponse(error.response)
    return Promise.reject(error)
  }
)

export function get(url = '', params = {}) {
  return instance.request({ url, method: 'GET', params })
}

export function postForm(url = '', data = {}) {
  return instance.request({
    url,
    method: 'POST',
    data: qs.stringify(data),
    headers: { 'content-type': 'application/x-www-form-urlencoded' }
  })
}


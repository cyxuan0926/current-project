import base from './base'
import axios from 'axios'
import store from '@/store'
import handleResponse from './handleResponse'
import qs from 'qs'
import urls from '../urls'
const instance = axios.create(base)

let state = ''

export const agency = urls.apiPath

// 获取异步请求的url
const getUrl = (url) => `${ agency }${ url }`
// http request 拦截器
instance.interceptors.request.use(
  config => {
    store.commit('showLoading')
    state = history.state
    return config
  },
  error => Promise.reject(error)
)
// http response 拦截器
instance.interceptors.response.use(
  response => {
    store.commit('hideLoading')
    if (state && history.state.key !== state.key) return
    return handleResponse(response)
  },
  error => {
    store.commit('hideLoading')
    if (error.response) {
      if (state && history.state.key !== state.key) return
      return handleResponse(error.response)
    }
    return handleResponse(error)
  }
)
/**
 * 封装get方法
 * @param url
 * @param params
 * @returns {Promise}
 */
export const get = (url, params = {}, config = {}) => {
  params.t = new Date().getTime()
  return instance.get(getUrl(url), { params: params, config }).then(res => res)
}
/**
 * 封装post请求
 * @param url
 * @param data
 * @param config
 * @returns {Promise}
 */
export const post = (url, data = {}, config = {}) =>
  // instance.post(getUrl(url), data, config).then(res => res)
  instance.post(getUrl(url), qs.stringify(data), config).then(res => res)
// instance.post(url, qs.stringify(data), config).then(res => res)

export const postObj = (url, data = {}, config = {}) => {
  config.headers = { 'Content-Type': 'application/json' }
  return instance.post(getUrl(url), data, config).then(res => res)
}
/**
 * 封装post文件请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export const postFile = (url, data = {}) => {
  // data.toString() !== {}.toString() && data.append('jail_id', localStorage['jail_id'])
  return instance.post(agency + url, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(res => res)
}
/**
 * 封装patch文件请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export const patchFile = (url, data = {}) => {
  // data.toString() !== {}.toString() && data.append('jail_id', localStorage['jail_id'])
  return instance.patch(agency + url, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then(res => res)
}
/**
 * 封装patch请求
 * @param url
 * @param data
 * @param config
 * @returns {Promise}
 */
export const patch = (url, data = {}, config = {}) =>
  instance.patch(getUrl(url), qs.stringify(data), config).then(res => res)
// instance.patch(url, qs.stringify(data), config).then(res => res)
/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export const put = (url, data = {}) =>
  instance.put(getUrl(url), qs.stringify(data)).then(res => res)
/**
 * 封装delete请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export const remove = (url, data = {}) =>
  instance.delete(getUrl(url), qs.stringify(data)).then(res => res)
/**
 * 封装all请求
 * @param urls
 * @returns {Promise}
 */
export const all = (urls = []) =>
  axios.all(urls.map(url => instance.get(getUrl(url)))).then(axios.spread((...res) => res.map(res => res)))

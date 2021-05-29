import base from './base'
import axios from 'axios'
import store from '@/store'
import handleResponse from './handleResponse'
import publicHandleResponse from '@/service-public/request/handleResponse'
import qs from 'qs'
import urls from '../urls'
export const instance = axios.create(base)

let state = ''

export const agency = urls.apiPath

// 获取异步请求的url 默认ygfw互联网
export const getUrl = (url, path) => /^(http|https).*/.test(url) ? url : `${ !path ? agency : urls[path] }${ url }`
// 公共服务
export const getPublicUrl = url => getUrl(url, 'publicApiHost')
// bpmn
export const getBpmnUrl = url => getUrl(url, 'bpmnApiHost')
// 阳光监狱
export const getYgUrl = url => getUrl(url, 'ygApiHost')
// 河源监狱
export const getHyUrl = url => getUrl(url, 'jailApiHost')

// http request 拦截器
instance.interceptors.request.use(
  config => {
    /* eslint-disable camelcase */
    const { access_token, token_type } = store.state.account.accountInfo

    config.headers['appVersion'] = '3'

    if (config.url && !config.url.includes('/prisoners/processing') && !config.url.includes('/prisoners/validate') && !config.url.includes('/upload/uploadfile') && !config.url.includes('/ywgk/homepage/queryjailstatus') && !config.url.includes('/ywgk/homepage/queryTerminalList')) store.commit('showLoading')
    state = history.state

    if (access_token) {
      config.headers.Authorization = `${ token_type } ${ access_token }`
    }

    return config
  },
  error => Promise.reject(error)
)
// instance.interceptors.request.use(
//   config => {
//     store.commit('showLoading')
//     state = history.state
//     return config
//   },
//   error => Promise.reject(error)
// )
// http response 拦截器
instance.interceptors.response.use(
  response => {
    store.commit('hideLoading')
    if (state && history.state.key !== state.key) return
    // 这是公共服务的请求 做特别的响应处理
    if (
      response.config &&
      response.config.baseURL &&
      (response.config.baseURL === urls.publicApiHost || response.config.baseURL === urls.financeApiHost)
    ) {
      return publicHandleResponse(response)
    }
    return handleResponse(response)
  },
  error => {
    // store.commit('setLoginState')
    store.commit('hideLoading')
    if (error.response) {
      if (state && history.state.key !== state.key) return
      // 公共服务错误码处理 不一定是错误
      if (
        error.response.config &&
        error.response.config.baseURL &&
        (error.response.config.baseURL === urls.publicApiHost || error.response.config.baseURL === urls.financeApiHost)
      ) {
        return publicHandleResponse(error.response)
      }
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
  return instance.get(getUrl(url), { params, ...config }).then(res => res)
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
export function postFormData(url = '', data = {}, config = {}) {
  const formData = new FormData()
    Object.keys(data).forEach(key => {
      if (data[key]) {
          if (key === 'file' && Array.isArray(data.file)) {
              data.file.forEach(f => formData.append('file', f))
          }
          else {
              formData.append(key, data[key])
          }
      }
    })
  return instance.request({
    url,
    data: formData,
    method: 'POST',
    headers: { 'content-type': 'multipart/form-data' },
    ...config
  })
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
export const put = (url, data = {}, config = {}) =>
  instance.put(getUrl(url), qs.stringify(data), config).then(res => res)

export const putObj = (url, data = {}) => instance.put(getUrl(url), data, {
  headers: {
    'Content-Type': 'application/json'
  }
})
/**
 * 封装delete请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export const remove = (url, config = {}) =>
  instance.delete(getUrl(url), config).then(res => res)
/**
 * 封装all请求
 * @param urls
 * @returns {Promise}
 */
export const all = (urls = []) =>
  axios.all(urls.map(url => instance.get(getUrl(url)))).then(axios.spread((...res) => res.map(res => res)))

import qs from 'qs'
import { instance } from '@/service/config/service'
import urls from '@/service/urls'

const basicConfig = {
  baseURL: urls.publicApiHost
}

const financeBasicConfig = {
  baseURL: urls.financeApiHost
}

export function get(url = '', params = {}, config = {}) {
 config = Object.assign({}, basicConfig, config)
  return instance.request({ url, method: 'GET', params, ...config })
}

export function strike(url = '', params = {}, config = {}) {
  Object.assign(config, basicConfig)
  return instance.request({ url, method: 'DELETE', params, ...config })
}

export function postForm(url = '', data = {}, config = {}) {
  Object.assign(config, basicConfig)
  return instance.request({
    url,
    method: 'POST',
    data: qs.stringify(data),
    ...config
  })
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
  Object.assign(config, basicConfig)
  return instance.request({
    url,
    data: formData,
    method: 'POST',
    headers: { 'content-type': 'multipart/form-data' },
    ...config
  })
}

export function put(url = '', data = {}, config = {}) {
  Object.assign(config, basicConfig)
  return instance.request({
    url,
    method: 'PUT',
    data,
    headers: { 'Content-Type': 'application/json' },
    ...config
  })
}

export function post(url = '', data = {}, config = {}) {
  config = Object.assign({}, basicConfig, config)
  return instance.request({
    url,
    data,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    ...config
  })
}

export function getFinance(url = '', params = {}, config = {}) {
  Object.assign(config, financeBasicConfig)
  return instance.request({ url, method: 'GET', params, ...config })
}

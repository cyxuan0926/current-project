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
  Object.assign(config, basicConfig)
  return instance.request({ url, method: 'GET', params, ...config })
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
  Object.assign(config, basicConfig)
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

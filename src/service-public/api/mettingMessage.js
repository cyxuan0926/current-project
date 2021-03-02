import { get, post } from '../request'
import urls from '@/service/urls'
// 短信列表
export function getMessagelist(params) {
  return get('/msg/terminal/selectMessage', params, { baseURL: urls.messageHost }).then(res => res && res.data)
}
// 短信授权
export function dealMessage(params) {
  return post('/msg/terminal/dealMessage', params, { baseURL: urls.messageHost }).then(res => res && res.data)
}
// 短信导出列表
export function exportMessage(params) {
  return get('/export/exportSmsManage', params, { baseURL: urls.messageHost, responseType: 'blob' }).then(res => res && res.data)
}

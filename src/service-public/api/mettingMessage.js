import { get, post } from '../request'
import urls from '@/service/urls'
// 短信列表
export function getMessagelist(params) {
  return get('/msg/terminal/selectMessage', params, { baseURL: urls.jailApiHost }).then(res => res && res.data)
}
// 短信授权
export function dealMessage(params) {
  return post('/msg/terminal/dealMessage', params, { baseURL: urls.jailApiHost }).then(res => res && res.data)
}
// 短信导出列表
export function exportMessage(params) {
  return get('/export/exportSmsManage', params, { baseURL: urls.jailApiHost, responseType: 'blob' }).then(res => res && res.data)
}
// 查询亲情电话申请列表
export function familyPhoneList(params) {
  return get('/parse/familyphone/apply/page', params, { baseURL: urls.jailApiHost }).then(res => res && res.data)
}
// 查询亲情电话申请详情
export function familyPhoneDetail(params) {
  return get('/parse/familyphone/apply/detail', params, { baseURL: urls.jailApiHost }).then(res => res && res.data)
}
// 获取当前任务的下一任务
export function getSubtaskPhone(params) {
  return get('/task/get-subtask', params, { baseURL: urls.apiHost }).then(res => res && res.data)
}
// 新增亲情电话申请
export function familyPhoneAdd(params) {
  return post('/parse/familyphone/apply/save', params, { baseURL: urls.jailApiHost }).then(res => res && res.data)
}

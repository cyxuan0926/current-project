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
  return get('/task/get-subtask', params, { baseURL: urls.bpmnApiHost }).then(res => res && res.data)
}
// 通过审核
export function authPhone(params) {
  return post('/parse/familyphone/apply/auth', params, { baseURL: urls.jailApiHost }).then(res => res && res.data)
}
  // 获取驳回编辑列表 家属注册管理
export function getRejectEdit(params) {
    return get('/meetingsReviewWord/get', params, { baseURL: urls.jailApiHost }).then(res => res && res.data)
  }
  // 保存修改驳回编辑列表 家属注册管理
  export function setRejectEdit(params) {
    return post('/meetingsReviewWord/edit', params, { baseURL: urls.jailApiHost }).then(res => res && res.data)
  }
// 新增亲情电话申请
export function familyPhoneAdd(data) {
  return post('/parse/familyphone/apply/save', data, { baseURL: urls.jailApiHost }).then(res => res && res.data)
}
// 亲情电话通话统计表
export function phoneRecordList(data) {
  return get('/tel/summary/phoneRecordList', data, { baseURL: urls.jailApiHost }).then(res => res && res.data)
}
// 亲情电话通话统计表详情
export function phoneRecordDetail(data) {
  return get('/tel/summary/getPhoneRecord', data, { baseURL: urls.jailApiHost }).then(res => res && res.data)
}
// 亲情电话通话费用结算表列表查询
export function phoneSettleAccountsList(data) {
  return get('/settleAccounts/findPage', data, { baseURL: urls.jailApiHost }).then(res => res && res.data)
}
// 数据导入uploadFile
export function validateDataFpna(params) {
  return post('/parse/familyphone/apply/validateFpna', params).then(res => res && res.data)
}

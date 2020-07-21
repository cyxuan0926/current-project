import * as service from '../config/service'

export default {
  // 获取囚犯账户信息列表
  getAccounts: pagination =>
    service.get('/accounts/page', pagination).then(res => res),
  // 获取囚犯账户详情信息
  getAccountDetail: id =>
    service.get('/accounts/details', id).then(res => res),
  // 广东可视亲情电话申请详情
  getFamilyMeetingDetail: params => {
    return service.get('/meetings/page/by-province', params)
  },
  // 广东可视亲情电话统计报表
  getFamilyStatistics: params => {
    return service.get('/report/province/meetings', params)
  }
}

import * as service from '../config/service'
import axios from 'axios'

export default {
  getMapJson: code => axios.get(`/static/dist/map/${ code }_full.json`),
  // 获取囚犯账户信息列表
  getAccounts: pagination =>
    service.get('/accounts/page', pagination).then(res => res),
  // 获取囚犯账户详情信息
  getAccountDetail: id =>
    service.get('/accounts/details', id).then(res => res),
  // 广东可视电话申请详情
  getFamilyMeetingDetail: params => {
    return service.get('/meetings/page/by-province', params)
  },
  // 广东可视电话统计报表
  getFamilyStatistics: params => {
    return service.get('/report/province/meetings', params)
  },

  // 广东监狱管理局首页 申请通话次数 完成通话次数 top8
  getHometop: params => service.get('/homepage/querytop', params).then(res => res.data),

  // 广东监狱管理局首页 监狱查询
  getJailstatus: () => service.get('/homepage/queryjailstatus').then(res => res.data),

  // 广东监狱管理局首页 设备状态查询
  getTerminalList: params => service.get('/homepage/queryTerminalList', params).then(res => res.data),

  // 广东监狱管理局首页 查询
  getTotalMonthReport: params => service.get('/homepage/queryTotalMonthReport', params).then(res => res.data)
}

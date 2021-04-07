import config from '@/service/urls'
import { get, post, postObj, put, putObj, remove, postFormData } from '@/service/config/service'

const qaApis = {
  get,
  post,
  postObj,
  put,
  putObj,
  remove,
  postFormData
}
Object.keys(qaApis).forEach(m => {
  let _fn = qaApis[m]
  qaApis[m] = (...args) => {
      args[0] = `${ config.apiHost }${ config.apiPath }${ args[0] }`
      return _fn(...args)
  }
})

export default {
// 短信列表ywt-admin
 getMessagelist: params => {
  return qaApis.get('/familyMessage/findpage', params).then(res => res && res.data)
},
getMessageDetail: params => {
  return qaApis.get('/familyMessage/getDetail', params).then(res => res && res.data)
},
// 短信导出列表
 exportMessage: params => {
  return qaApis.get('/export/exportSmsManage', params, { responseType: 'blob' }).then(res => res && res.data)
},
// 查询亲情电话申请列表ywt-admin
 familyPhoneList: params => {
  return qaApis.get('/parse/familyphone/apply/page', params).then(res => res && res.data)
},
// 查询亲情电话申请详情ywt-admin
familyPhoneDetail: params => {
  return qaApis.get('/parse/familyphone/apply/detail', params).then(res => res && res.data)
},
// 查询亲情电话申请统计ywt-admin
familyPhoneAccountList: params => {
  return qaApis.get('/report/familyPhone/call-account', params).then(res => res && res.data)
},
// 查询亲情电话申请统计ywt-admin
familyPhoneAccountDetail: params => {
  return qaApis.get('/report/familyPhone/call/detail', params).then(res => res && res.data)
},
// 查询亲情电话统计ywt-admin
familyPhoneSettleAccount: params => {
  return qaApis.get('/report/familyPhone/settle-account', params).then(res => res && res.data)
}
}

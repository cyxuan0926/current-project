import * as service from '../config/service'

export default {
// 短信列表
 getMessagelist: params => {
  return service.get('/familyMessage/findpage', params).then(res => res && res.data)
},
getMessageDetail: params => {
  return service.get('/familyMessage/getDetail', params).then(res => res && res.data)
},

// 短信导出列表
 exportMessage: params => {
  return service.get('/export/exportSmsManage', params, { responseType: 'blob' }).then(res => res && res.data)
}
}

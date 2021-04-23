import * as service from '@/service/config/service'

export default {
// 短信列表ywt-admin
 getMessagelist: params => {
  return service.get('/familyMessage/findpage', params).then(res => res && res.data)
},
getMessageDetail: params => {
  return service.get('/familyMessage/getDetail', params).then(res => res && res.data)
}
}

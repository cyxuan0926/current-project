import * as service from '@/service/config/service'

export default {
  // 短信列表ywt-admin
  getMessagelist: params => service.
    get('/familyMessage/findpage', params).
    then(res => res && res.data),

  getMessageDetail: params => service.
    get('/familyMessage/getDetail', params).
    then(res => res && res.data)
}

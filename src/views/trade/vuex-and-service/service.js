import * as service from '@/service/config/service'

export default {
  getAccountList: params => {
    return service.get('/familyaccounts/getLedger', params).then(res => res && res.data)
  },
  getAccountDetail: params => {
    return service.get('/familyaccounts/familyAccountsDetail', params).then(res => res && res.data)
  },
  getRechargeList: params => {
    return service.get('/familyaccounts/chargeRecords', params).then(res => res && res.data)
  },
  getConsumptionList: params => {
    return service.get('/familyaccounts/consumeRecords', params).then(res => res && res.data)
  },
  getRefundList: params => {
    return service.get('/familyaccounts/refundRecords', params).then(res => res && res.data)
  }
}

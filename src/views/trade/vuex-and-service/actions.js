import api from './service'

export default {
  getAccountList: ({ commit }, params) => {
    return api.getAccountList(params).then(res => {
      if (!res) return
      res.accountLedgers.forEach(item => {
        item.remark = (parseInt(100 * item.recharge) - parseInt(100 * item.consume) - parseInt(100 * item.preConsume) - parseInt(100 * item.refund) - parseInt(100 * item.balance)) / 100
      })
      commit('getAccountList', res)
      return true
    })
  },
  getAccountDetail: ({ commit }, params) => {
    return api.getAccountDetail(params).then(res => {
      if (!res) return
      return res.detail
    })
  },
  getRechargeList: ({ commit }, params) => {
    return api.getRechargeList(params).then(res => {
      if (!res) return
      commit('getRechargeList', res)
      return true
    })
  },
  getConsumptionList: ({ commit }, params) => {
    return api.getConsumptionList(params).then(res => {
      if (!res) return
      commit('getConsumptionList', res)
      return true
    })
  },
  getRefundList: ({ commit }, params) => {
    return api.getRefundList(params).then(res => {
      if (!res) return
      commit('getRefundList', res)
      return true
    })
  }
}

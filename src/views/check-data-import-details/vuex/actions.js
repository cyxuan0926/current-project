import http from '@/service'
export default {
  getPrisonersPocketMoney({ commit }, params) {
    http.getPrisonersPocketMoney(params).then(res => commit('getPrisonersPocketMoney', res))
  },
  getPrisonersInsideJailsCosts({ commit }, params) {
    http.getPrisonersInsideJailsCosts(params).then(res => commit('getPrisonersInsideJailsCosts', res))
  },
  getPrisonTerms({ commit }, params) {
    http.getPrisonTerms(params).then(res => commit('getPrisonTerms', res))
  },
  getPrisonerRewardPunishments({ commit }, params) {
    http.getPrisonerRewardPunishments(params).then(res => commit('getPrisonerRewardPunishments', res))
  }
}

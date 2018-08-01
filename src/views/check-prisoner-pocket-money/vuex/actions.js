import http from '@/service'
export default {
  getPrisonersPocketMoney({ commit }, params) {
    http.getPrisonersPocketMoney(params).then(res => commit('getPrisonersPocketMoney', res))
  }
}

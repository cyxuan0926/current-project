import http from '@/service'
export default {
  getPrisonersInsideJailsCosts({ commit }, params) {
    http.getPrisonersInsideJailsCosts(params).then(res => commit('getPrisonersInsideJailsCosts', res))
  }
}

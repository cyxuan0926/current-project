import http from '@/service'

export default {
  getJailAll: ({ commit }) => {
    return http.getJailAll().then(res => res)
  },
  getFamilyRemittance: ({ commit }, parmas) => {
    http.getFamilyRemittance(parmas).then(res => res && commit('getFamilyRemittance', res))
  }
}

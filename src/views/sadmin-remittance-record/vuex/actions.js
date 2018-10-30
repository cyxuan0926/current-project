import http from '@/service'

export default {
  getFamilyRemittance: ({ commit }, parmas) => {
    http.getFamilyRemittance(parmas).then(res => res && commit('getFamilyRemittance', res))
  }
}

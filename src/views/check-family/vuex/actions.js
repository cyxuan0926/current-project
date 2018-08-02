import http from '@/service'

export default {
  getFamilies({ commit }, params) {
    http.getFamilies(params).then(res => res && commit('getFamilies', res))
  },
  getFamilyDetail({ commit }, params) {
    http.getFamilyDetail(params).then(res => res && commit('getFamilyDetail', res))
  }
}

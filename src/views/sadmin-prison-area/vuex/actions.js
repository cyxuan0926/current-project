import http from '@/service'

export default {
  getPrisonAreas({ commit }, params) {
    http.getPrisonAreas(params).then(res => res && commit('getPrisonAreas', res))
  },
  updatePrisonArea({ commit }, params) {
    return http.updatePrisonArea(params).then(res => res)
  // },
  // withdrawMeeting({ commit }, params) {
  //   return http.withdrawMeeting(params).then(res => res)
  },
  deletePrisonArea({ commit }, params) {
    return http.deletePrisonArea(params).then(res => res)
  }
}

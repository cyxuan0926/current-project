import http from '@/service'

export default {
  getPrisonAreas({ commit }, { params, defaultMode = 'page' }) {
    return http.getPrisonAreas(params).then(res => {
      if (res && res.prisonConfigs && res.prisonConfigs.length) {
        if (defaultMode === 'page') return commit('getPrisonAreas', res)
        else if (defaultMode === 'all') return res.prisonConfigs
      }
    })
  },
  updatePrisonArea({ commit }, params) {
    return http.updatePrisonArea(params).then(res => res)
  // },
  // withdrawMeeting({ commit }, params) {
  //   return http.withdrawMeeting(params).then(res => res)
  },
  deletePrisonArea({ commit }, params) {
    return http.deletePrisonArea(params).then(res => res)
  },
  addPrisonArea({ commit }, params) {
    return http.addPrisonArea(params).then(res => res)
  }
}

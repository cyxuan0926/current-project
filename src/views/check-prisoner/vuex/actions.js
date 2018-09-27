import http from '@/service'

export default {
  getPrisoners({ commit }, params) {
    http.getPrisoners(params).then(res => res && commit('getPrisoners', res))
  },
  updateAccessTime({ commit }, params) {
    return http.updateAccessTime(params).then(res => res)
  },
  addPrisonerBlacklist({ commit }, params) {
    return http.addPrisonerBlacklist(params).then(res => res)
  },
  getNotification({ commit }, params) {
    return http.getNotification(params).then(res => {
      if (!res) return
      commit('getNotification', res)
      return true
    })
  },
  updateNotification({ commit }, params) {
    return http.updateNotification(params).then(res => res)
  },
  addNotification({ commit }, params) {
    return http.addNotification(params).then(res => res)
  },
  getNotificationFamilies({ commit }, params) {
    return http.getNotificationFamilies(params).then(res => {
      if (!res) return
      commit('getNotificationFamilies', res)
      return true
    })
  },
  getPrisonConfigs({ commit }, params) {
    return http.getPrisonConfigs(params).then(res => res)
  }
}

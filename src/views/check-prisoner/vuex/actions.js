import http from '@/service'

export default {
  getPrisoners({ commit }, params) {
    return http.getPrisoners(params).then(res => res && commit('getPrisoners', res))
  },
  getPrisonersAll({ commit }, params) {
    http.getPrisonersAll(params).then(res => res && commit('getPrisoners', res))
  },
  updatePrisonerTime({ commit }, params) {
    return http.updatePrisonerTime(params).then(res => res)
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
    return http.getPrisonConfigs(params).then(res => {
      if (!res) return
      commit('getPrisonConfigs', res)
      return true
    })
  },
  changePrisonArea({ commit }, params) {
    return http.changePrisonArea(params).then(res => res)
  },
  removePrisonerBlacklist({ commit }, params) {
    return http.removePrisonerBlacklist(params).then(res => res)
  },
  deletePrisonerData({ commit }, params) {
    return http.deletePrisoners(params).then(res => res)
  },
  addPrionser({ commit }, params) {
    return http.addPrionser(params).then(res => res)
  },

  // 批量更换监区
  async changePrisonAreaBatch({ commit }, params) {
    try {
      const { code } = await http.changePrisonAreaBatch(params)

      return code === 200
    }
    catch (err) {
      Promise.reject(err)
    }
  }
}

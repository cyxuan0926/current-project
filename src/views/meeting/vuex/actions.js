import http from '@/service'

export default {
  getRemoteUsualConfig({ commit }, params) {
    return http.getRemoteUsualConfig(params).then(res => {
      if (!res) return
      res.queue = []
      res.settings.forEach(queue => {
        res.queue.push(queue.split('-'))
      })
      commit('getRemoteUsualConfig', res)
      return true
    })
  },
  updateRemoteUsualConfig: ({ commit }, params) => {
    return http.updateRemoteUsualConfig(params).then(res => res)
  },
  getRemoteWeekendConfig({ commit }, params) {
    return http.getRemoteWeekendConfig(params).then(res => {
      if (!res) return
      res.queue = [null]
      if (res.settings) {
        res.queue = []
        res.settings.forEach(queue => {
          res.queue.push(queue.split('-'))
        })
      }
      commit('getRemoteWeekendConfig', res)
      return true
    })
  },
  updateRemoteWeekendConfig: ({ commit }, params) => {
    return http.updateRemoteWeekendConfig(params).then(res => res)
  },
  getRemoteSpecialConfig({ commit }, params) {
    return http.getRemoteSpecialConfig(params).then(res => {
      if (!res) return
      if (res.specialConfigs) {
        res.specialConfigs.forEach(config => {
          let queue = []
          config.settings.forEach(setting => {
            queue.push(setting.split('-'))
          })
          config.canAddQueue = true
          config.loading = false
          config.update = false
          config.deleting = false
          config.queue = queue
          config.originQueue = queue.toString()
          config.originDate = config.effectDate
        })
      }
      commit('getRemoteSpecialConfig', res.specialConfigs)
      return true
    })
  },
  addRemoteSpecialConfig: ({ commit }, params) => {
    return http.addRemoteSpecialConfig(params).then(res => res)
  },
  updateRemoteSpecialConfig: ({ commit }, params) => {
    return http.updateRemoteSpecialConfig(params).then(res => res)
  },
  deleteRemoteSpecialConfig: ({ commit }, params) => {
    return http.deleteRemoteSpecialConfig(params).then(res => res)
  },
  getPrisonVisitConfigDetail({ commit }, params) {
    return http.getPrisonVisitConfigDetail(params).then(res => {
      if (!res) return
      res.usual = [null]
      if (res.batchQueue) {
        res.usual = []
        res.batchQueue.forEach(queue => {
          res.usual.push(queue.split('-'))
        })
        res.canNotChange = true
      }
      commit('getPrisonVisitConfigDetail', res)
      return true
    })
  },
  updatePrisonVisitConfig: ({ commit }, params) => {
    return http.updatePrisonVisitConfig(params).then(res => res)
  }
}

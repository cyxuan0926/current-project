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
      console.log(Object.assign({}, res))
      res.queue = [null]
      if (res.settings) {
        res.queue = []
        res.settings.forEach(queue => {
          res.queue.push(queue.split('-'))
        })
      }
      commit('getRemoteSpecialConfig', res)
      return true
    })
  },
  updateRemoteSpecialConfig: ({ commit }, params) => {
    return http.updateRemoteSpecialConfig(params).then(res => res)
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

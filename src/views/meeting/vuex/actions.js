import http from '@/service'

export default {
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

import http from '@/service'

export default {
  getPrisons: ({ commit }, params) => {
    http.getPrisons(params).then(res => res && commit('getPrisons', res))
  },
  addPrison: ({ dispatch }, params) => {
    return http.addPrison(params).then(res => {
      if (!res) return
      dispatch('deleteUrls', { urls: [params.imageUrl, params.audioPath, params.videoPath], contents: params.description, save: true })
      return res
    })
  },
  getPrisonDetail: ({ commit }, params) => {
    return http.getPrisonDetail(params).then(res => {
      if (!res) return
      let regs = res.jails || {}
      commit('getPrisonDetail', regs)
      return true
    })
  },
  updatePrison: ({ commit, dispatch }, params) => {
    return http.updatePrison(params).then(res => {
      let excpt = []
      params.imageUrl && excpt.push(params.imageUrl)
      params.audioPath && excpt.push(params.audioPath)
      params.videoPath && excpt.push(params.videoPath)
      dispatch('deleteUrls', { urls: [params.imageUrl, params.audioPath, params.videoPath], contents: params.description, save: true })
      return res
    })
  }
}

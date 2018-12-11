import http from '@/service'

export default {
  getPrisons: ({ commit }, params) => {
    http.getPrisons(params).then(res => res && commit('getPrisons', res))
  },
  addPrison: ({ commit }, params) => {
    return http.addPrison(params).then(res => res)
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
      dispatch('handleDeleteImage', [excpt, params.description])
      return res
    })
  }
}

import http from '@/service'

export default {
  getPrisons: ({ commit }, params) => {
    return http.getPrisons(params).then(res => {
      if (!res) return
      commit('getPrisons', res)
      return true
    })
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
      const regs = res.jails || {}
      commit('getPrisonDetail', regs)
      commit('getBranchStatus', res.branchStatus)
      return true
    })
  },
  updatePrison: ({ commit, dispatch }, params) => {
    commit('setUrlStorage', true)
    return http.updatePrison(params).then(res => {
      let excpt = []
      params.imageUrl && excpt.push(params.imageUrl)
      params.audioPath && excpt.push(params.audioPath)
      params.videoPath && excpt.push(params.videoPath)
      if (res) dispatch('deleteUrls', { urls: [params.imageUrl, params.audioPath, params.videoPath], contents: params.description, save: true })
      return res
    })
  },
  getTenants: ({ commit }, params) => {
    return http.getTenants(params).then(res => {
      if (!res) return
      commit('getTenants', res)
      return true
    })
  },
  createJailByBindTenant: ({ commit }, params) => {
    return http.createJailByBindTenant(params).then(res => res)
  }
  // getBranchStatus: async({ commit }, params) => {
  //   try {
  //     const res = await http.getBranchStatus(params)
  //     return res.data
  //   }
  //   catch (err) {
  //     throw err
  //   }
  // }
}

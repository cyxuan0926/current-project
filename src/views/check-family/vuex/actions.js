import http from '@/service'

export default {
  getFamilies({ commit }, params) {
    http.getFamilies(params).then(res => res && commit('getFamilies', { contents: res.families, total: res.familiesSize }))
  },
  getFamilyDetail({ commit }, params) {
    http.getFamilyDetail(params).then(res => res && commit('getFamilyDetail', res))
  },
  addFamilyBlacklist({ commit }, params) {
    return http.addFamilyBlacklist(params).then(res => res)
  },
  removeFamilyBlacklist({ commit }, params) {
    return http.removeFamilyBlacklist(params).then(res => res)
  },

  async getPoliceFamilies({ commit }, params) {
    try {
      const policeFamilies = await http.getPoliceFamilies(params)
      const { familiesSize, families } = policeFamilies.data
      commit('getFamilies', { contents: families, total: familiesSize })
      return true
    }
    catch (err) {
      throw err
    }
  }
}

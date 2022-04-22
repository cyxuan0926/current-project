import http from '@/service'

export default {
  getFamilies({ commit }, params) {
    http.getFamilies(params).then(res => res && commit('getFamilies', { contents: res.families, total: res.familiesSize }))
  },

  getFamilyDetail({ commit }, params) {
    return http.getFamilyDetail(params).then(res => res && commit('getFamilyDetail', res))
  },

  addFamilyBlacklist(_, params) {
    return http.addFamilyBlacklist(params).then(res => res)
  },

  removeFamilyBlacklist(_, params) {
    return http.removeFamilyBlacklist(params).then(res => res)
  },

  async getPoliceFamilies(_, params) {
    try {
      const policeFamilies = await http.getPoliceFamilies(params)
      const { familiesSize = 0, families = [] } = policeFamilies ? policeFamilies.data : {}

      commit('getFamilies', { contents: families, total: familiesSize })

      return true
    } catch (err) {
      Promise.reject(err)
    }
  },

  // 删除警员家属信息
  async deletePoliceFamily(_, phoneNumber) {
    try {
      const response = await http.deletePoliceFamily(phoneNumber)
      const isSucess = response && response['code'] === 200

      return isSucess
    } catch (err) {
      Promise.reject(err)
    }
  }
}

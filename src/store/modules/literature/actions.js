import literatureApi from '@/service/modules/literature'

export default {
  async getFamilyLiteratures({ commit }, params) {
    try {
      const res = await literatureApi.getFamilyLiteratures(params)
      commit('setLiteratures', res.data.articles)
      return res
    }
    catch (err) {
      throw err
    }
  },
  async getLiteratureDetail({ commit }, params) {
    try {
      const res = await literatureApi.getLiteratureDetail(params)
      commit('setLiteratureDetail', res.data)
      return res
    }
    catch (err) {
      throw err
    }
  },
  async passLiterature({ dispatch }, params) {
    try {
      const isSuccess = await literatureApi.passLiterature(params)

      return isSuccess
    }
    catch (err) {
      throw err
    }
  },
  async rejectLiterature({ dispatch }, params) {
    try {
      const isSuccess = await literatureApi.rejectLiterature(params)

      return isSuccess
    }
    catch (err) {
      throw err
    }
  },
  async offlineLiterature({ dispatch }, params) {
    try {
      const isSuccess = await literatureApi.offlineLiterature(params)

      return isSuccess
    }
    catch (err) {
      throw err
    }
  }
}

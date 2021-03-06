import literatureApi from '@/service/modules/literature'

const setCurrentOperateRows = (literatureIds, commit) => {
  const count = String(literatureIds).split(',').length

  commit('setCurrentOperateRows', count)
}

export default {
  async getFamilyLiteratures({ commit }, params) {
    try {
      const res = await literatureApi.getFamilyLiteratures(params)
      commit('setLiteratures', res.data.articles)
      commit('setCurrentOperateRows', 0)
      return res
    }
    catch (err) {
      throw err
    }
  },
  async getPoliceLiteratures({ commit }, params) {
    try {
      const res = await literatureApi.getPoliceLiteratures(params)
      commit('setLiteratures', res.data.articles)
      commit('setCurrentOperateRows', 0)
      return res
    }
    catch (err) {
      throw err
    }
  },
  async getMyLiteratures({ commit }, params) {
    try {
      const res = await literatureApi.getMyLiteratures(params)
      commit('setLiteratures', res.data.articles)
      commit('setCurrentOperateRows', 0)
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
  async publishLiterature({ commit }, params) {
    try {
      const isSuccess = await literatureApi.publishLiterature(params)
      isSuccess && params.id && setCurrentOperateRows(params.id, commit)

      return isSuccess
    }
    catch (err) {
      throw err
    }
  },
  async passLiterature({ commit }, params) {
    try {
      const isSuccess = await literatureApi.passLiterature(params)
      isSuccess && setCurrentOperateRows(params.id, commit)

      return isSuccess
    }
    catch (err) {
      throw err
    }
  },
  async rejectLiterature({ commit }, params) {
    try {
      const isSuccess = await literatureApi.rejectLiterature(params)
      isSuccess && setCurrentOperateRows(params.id, commit)

      return isSuccess
    }
    catch (err) {
      throw err
    }
  },
  async offlineLiterature({ commit }, params) {
    try {
      const isSuccess = await literatureApi.offlineLiterature(params)
      isSuccess && setCurrentOperateRows(params.id, commit)

      return isSuccess
    }
    catch (err) {
      throw err
    }
  },
  async onlineLiterature({ commit }, params) {
    try {
      const isSuccess = await literatureApi.onlineLiterature(params)
      isSuccess && setCurrentOperateRows(params.id, commit)

      return isSuccess
    }
    catch (err) {
      throw err
    }
  },
  async getSensitivewords({ commit }, params) {
    try {
      const res = await literatureApi.getSensitivewords(params)
      commit('setSensitivewords', res.data.words)
      return res
    }
    catch (err) {
      throw err
    }
  },
  async addSensitiveword({ commit }, params) {
    try {
      const res = await literatureApi.addSensitiveword(params)
      return res
    }
    catch (err) {
      throw err
    }
  },
  async delSensitiveword({ commit }, params) {
    try {
      const res = await literatureApi.delSensitiveword(params)
      return res
    }
    catch (err) {
      throw err
    }
  },
  async editSensitiveword({ commit }, params) {
    try {
      const res = await literatureApi.editSensitiveword(params)
      return res
    }
    catch (err) {
      throw err
    }
  },
  async exportAuthorFamily({ commit }) {
    try {
      const res = await literatureApi.exportAuthorFamily()
      return res.data
    }
    catch (err) {
      throw err
    }
  },
  async addAuthorPolice({ commit }, params) {
    try {
      const res = await literatureApi.addAuthorPolice(params)
      return res
    }
    catch (err) {
      throw err
    }
  },
  async getAuthors({ commit }, data) {
    const { url, params } = data
    try {
      const res = await literatureApi.getAuthors(url, params)
      commit('setAuthors', res.data.authors)
      return res
    }
    catch (err) {
      throw err
    }
  },
  async enableAuthor({ commit }, data) {
    const { url, params } = data
    try {
      const res = await literatureApi.enableAuthor(url, params)
      return res
    }
    catch (err) {
      throw err
    }
  },
  async getReportLiteratures({ commit }, data) {
    const { url, params, type } = data
    try {
      const res = await literatureApi.getReportLiteratures(url, params)
      if (!type) {
        // 分页的列表
        commit('setLiteratures', res.data.articleReports)
        commit('setCurrentOperateRows', 0)
        return res
      }
      // 详情
      return res.data.articleReports
    }
    catch (err) {
      throw err
    }
  },
  async ignoreReportArticles({ commit }, data) {
    const { url, params } = data
    try {
      const isSuccess = await literatureApi.ignoreReportArticles(url, params)
      isSuccess && setCurrentOperateRows(params.id, commit)
      return isSuccess
    }
    catch (err) {
      throw err
    }
  }
}

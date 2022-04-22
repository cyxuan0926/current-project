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
    } catch (err) {
      Promise.reject(err)
    }
  },

  async getPoliceLiteratures({ commit }, params) {
    try {
      const res = await literatureApi.getPoliceLiteratures(params)

      commit('setLiteratures', res.data.articles)
      commit('setCurrentOperateRows', 0)

      return res
    } catch (err) {
      Promise.reject(err)
    }
  },

  async getMyLiteratures({ commit }, params) {
    try {
      const res = await literatureApi.getMyLiteratures(params)

      commit('setLiteratures', res.data.articles)
      commit('setCurrentOperateRows', 0)

      return res
    } catch (err) {
      Promise.reject(err)
    }
  },

  async getLiteratureDetail({ commit }, params) {
    try {
      const res = await literatureApi.getLiteratureDetail(params)
      commit('setLiteratureDetail', res.data)

      return res
    } catch (err) {
      Promise.reject(err)
    }
  },

  async publishLiterature({ commit }, params) {
    try {
      const isSuccess = await literatureApi.publishLiterature(params)
      isSuccess && params.id && setCurrentOperateRows(params.id, commit)

      return isSuccess
    } catch (err) {
      Promise.reject(err)
    }
  },

  async passLiterature({ commit }, params) {
    try {
      const isSuccess = await literatureApi.passLiterature(params)
      isSuccess && setCurrentOperateRows(params.id, commit)

      return isSuccess
    } catch (err) {
      Promise.reject(err)
    }
  },

  async rejectLiterature({ commit }, params) {
    try {
      const isSuccess = await literatureApi.rejectLiterature(params)
      isSuccess && setCurrentOperateRows(params.id, commit)

      return isSuccess
    } catch (err) {
      Promise.reject(err)
    }
  },

  async offlineLiterature({ commit }, params) {
    try {
      const isSuccess = await literatureApi.offlineLiterature(params)
      isSuccess && setCurrentOperateRows(params.id, commit)

      return isSuccess
    } catch (err) {
      Promise.reject(err)
    }
  },

  async onlineLiterature({ commit }, params) {
    try {
      const isSuccess = await literatureApi.onlineLiterature(params)
      isSuccess && setCurrentOperateRows(params.id, commit)

      return isSuccess
    } catch (err) {
      Promise.reject(err)
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
  async addSensitiveword(_, params) {
    try {
      const res = await literatureApi.addSensitiveword(params)
      return res
    } catch (err) {
      Promise.reject(err)
    }
  },

  async delSensitiveword(_, params) {
    try {
      const res = await literatureApi.delSensitiveword(params)
      return res
    } catch (err) {
      Promise.reject(err)
    }
  },

  async editSensitiveword(_, params) {
    try {
      const res = await literatureApi.editSensitiveword(params)
      return res
    } catch (err) {
      Promise.reject(err)
    }
  },

  async exportAuthorFamily() {
    try {
      const res = await literatureApi.exportAuthorFamily()
      return res.data
    } catch (err) {
      Promise.reject(err)
    }
  },

  async addAuthorPolice(_, params) {
    try {
      const res = await literatureApi.addAuthorPolice(params)
      return res
    } catch (err) {
      Promise.reject(err)
    }
  },

  async getAuthors({ commit }, data) {
    const { url, params } = data
    try {
      const res = await literatureApi.getAuthors(url, params)
      commit('setAuthors', res.data.authors)

      return res
    } catch (err) {
      Promise.reject(err)
    }
  },

  async enableAuthor(_, data) {
    try {
      const { url, params } = data
      const res = await literatureApi.enableAuthor(url, params)

      return res
    } catch (err) {
      Promise.reject(err)
    }
  },

  async getReportLiteratures({ commit }, data) {
    try {
      const { url, params, type } = data
      const res = await literatureApi.getReportLiteratures(url, params)

      if (!type) {
        // 分页的列表
        commit('setLiteratures', res.data.articleReports)
        commit('setCurrentOperateRows', 0)
        return res
      }
      // 详情
      return res.data.articleReports
    } catch (err) {
      Promise.reject(err)
    }
  },

  async ignoreReportArticles({ commit }, data) {
    try {
      const { url, params } = data
      const isSuccess = await literatureApi.ignoreReportArticles(url, params)
      isSuccess && setCurrentOperateRows(params.id, commit)

      return isSuccess
    } catch (err) {
      Promise.reject(err)
    }
  }
}

import api from '@/service/modules/v3-component'

export default {
  async commonUploadFile({ commit }, inputs) {
    try {
      const response = await api.commonUploadFile(inputs)

      if (!response || !response.data) {
        return
      }

      const filesResult = response.data
      commit('setUploadFile', filesResult)

      return true
    } catch (err) {
      Promise.reject(err)
    }
  },

  async commonValidateUpload({ commit }, inputs) {
    try {
      const response = await api.commonValidateUpload(inputs)

      if (!response || !response.data) {
        return
      }

      const validateResult = response.data
      commit('setValidateExcelResult', validateResult)

      return true
    } catch (err) {
      Promise.reject(err)
    }
  },

  async getPagedBasis({ commit }, inputs) {
    try {
      const { responseParams = {}, ...serviceParams } = inputs
      const response = await api.getPaged(serviceParams)

      if (!response || !response.data) {
        return
      }

      const content = responseParams['content'] || 'list'
      const total = responseParams['total'] || 'totalCount'
      const isSucess = response.data[content] && Array.isArray(response.data[content])
      const list = isSucess ? response.data[content] : []
      const totalCount = isSucess ? response.data[total] : 0

      commit('setPagedBasis', { list, totalCount })

      return true
    } catch (err) {
      Promise.reject(err)
    }
  },

  async exportBasicExcel(_, inputs) {
    try {
      const response = await api.exportBasicExcel(inputs)

      if (!response || !response.data) {
        return
      }

      return response.data
    } catch (err) {
      Promise.reject(err)
    }
  }
}

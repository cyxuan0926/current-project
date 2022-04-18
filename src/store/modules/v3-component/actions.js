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
  }
}

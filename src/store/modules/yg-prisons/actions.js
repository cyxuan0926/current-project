import api from '@/service/modules/prison-yangguang/yangguang-api'

export default {
  async ygUploadFile({ commit }, file) {
    try {
      let formData = new FormData()

      file && formData.append('file', file)

      const filesResult = await api.ygUploadFile(formData)

      if (!filesResult) return

      commit('ygUploadFile', filesResult)

      return true
    }
    catch (err) {
      Promise.reject(err)
    }
  },

  async validateUploadYgCommon({ commit }, inputs) {
    try {
      const response = await api.validateUploadYgCommon(inputs)

      if (!response) return

      commit('setValidateExcelResult', response)

      return true
    }
    catch (err) {
      Promise.reject(err)
    }
  },

  async getPagedYgPrisonsDataCommon({ commit }, inputs) {
    try {
      const response = await api.getPaged(inputs)

      if (!response || !response.data) return

      const list = response.data['list'] && Array.isArray(response.data['list']) ? response.data['list'] : []

      const totalCount = response.data['list'] && Array.isArray(response.data['list']) ? response.data['totalCount'] : 0

      commit('setPagedYgPrisonsDataCommon', {
        list,
        totalCount
      })

      return true
    }
    catch (err) {
      Promise.reject(err)
    }
  },

  async exportYgPrisonExcel(_, inputs) {
    try {
      const response = await api.exportYgPrisonExcel(inputs)

      if (!response) return

      return response
    }
    catch (err) {
      Promise.reject(err)
    }
  }
}

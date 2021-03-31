import familyPhoneApi from '@/service/modules/family-phone'

export default {
  async getFamiliesPaged({ commit }, inputs) {
    try {
      // 这里具体要根据ywt_admin 接口的响应体来兼容
      const response = await familyPhoneApi.getFamilyPhoneFamilies(inputs)

      const list = response ? response['list'] : []

      const size = response ? response['size'] : 0

      commit('setFamiliesPaged', { content: list, totalCount: size })

      return true
    }
    catch (err) {
      Promise.reject(err)
    }
  },

  async operateFamilyPhoneFamilies(_, params) {
    try {
      const response = await familyPhoneApi.operateFamilyPhoneFamilies(params)

      const isSucess = response ? response['code'] === 200 : response

      return isSucess
    }
    catch (err) {
      Promise.reject(err)
    }
  },

  async validateUploadFamilies({ commit }, filepath) {
    try {
      const response = await familyPhoneApi.validateUploadFamilies(filepath)

      if (!response) return

      commit('setValidateFamiliesResult', response)

      return true
    }
    catch (err) {
      Promise.reject(err)
    }
  },

  async exportFamilyPhone(_, inputs) {
    try {
      const { data } = await familyPhoneApi.exportFamilyPhone(inputs)

      return data
    }
    catch (err) {
      Promise.reject(err)
    }
  },

  async getFamilyPhoneFamiliesDetail({ commit }, inputs) {
    try {
      const data = await familyPhoneApi.getFamilyPhoneFamiliesDetail(inputs)

      commit('setFamilyPhoneFamiliesDetail', data || { logs: [] })

      return true
    }
    catch (err) {
      Promise.reject(err)
    }
  }
}

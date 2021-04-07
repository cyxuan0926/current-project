import familyPhoneApi from '@/service/modules/family-phone'

export default {
  async getFamiliesPaged({ commit }, inputs) {
    try {
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
  async validateUploadPhone({ commit }, filepath) {
    try {
      const response = await familyPhoneApi.validateUploaPhone(filepath)

      if (!response) return

      commit('setValidatePhoneResult', response)

      return true
    }
    catch (err) {
      Promise.reject(err)
    }
  },

  async exportFamilyPhone(_, inputs) {
    try {
      const response = await familyPhoneApi.exportFamilyPhone(inputs)

      if (!response) return

      return response
    }
    catch (err) {
      Promise.reject(err)
    }
  },

  async getFamilyPhoneFamiliesDetail({ commit }, inputs) {
    try {
      const data = await familyPhoneApi.getFamilyPhoneFamiliesDetail(inputs)

      commit('setFamilyPhoneFamiliesDetail', (data['data'] ? (data['data'] || { logs: [] }) : data) || { logs: [] })

      return true
    }
    catch (err) {
      Promise.reject(err)
    }
  },

  async authFamilyPhoneFamilies(_, params) {
    try {
      const response = await familyPhoneApi.authFamilyPhoneFamilies(params)

      const isSucess = response ? response['code'] === 200 : response

      return isSucess
    }
    catch (err) {
      Promise.reject(err)
    }
  },

  async getFamilyPhoneSettleAccounts({ commit }, inputs) {
    try {
      const response = await familyPhoneApi.getFamilyPhoneSettleAccounts(inputs)

      const list = response ? response['list'] : []

      const size = response ? response['size'] : 0

      const configs = response ? {
        number: response['number'],
        expenseAll: response['expenseAll'],
        releaseExpense: response['releaseExpense'],
        settleIds: response['settleIds'],
        expense: response['expense'],
        releaseNumber: response['releaseNumber']
      } : {}

      commit('setSettleAccountsPaged', { list, size, configs })

      return true
    }
    catch (err) {
      Promise.reject(err)
    }
  },

  async getFamilyPhoneSettleAccountsDetail({ commit }, inputs) {
    try {
      const data = await familyPhoneApi.getFamilyPhoneSettleAccountsDetail(inputs)

      commit('setFamilyPhoneSettleAccountsDetail', data || [])

      return true
    }
    catch (err) {
      Promise.reject(err)
    }
  },

  async editFamilyPhoneSettleAccountsRelease(_, params) {
    try {
      const response = await familyPhoneApi.editFamilyPhoneSettleAccountsRelease(params)

      const isSucess = response ? response['code'] === 200 : response

      return isSucess
    }
    catch (err) {
      Promise.reject(err)
    }
  },

  async settleFamilyPhoneSettleAccounts(_, params) {
    try {
      const response = await familyPhoneApi.settleFamilyPhoneSettleAccounts(params)

      const isSucess = response ? response['code'] === 200 : response

      return isSucess
    }
    catch (err) {
      Promise.reject(err)
    }
  }
}

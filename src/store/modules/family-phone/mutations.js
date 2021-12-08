export default {
  setFamiliesPaged: (state, paged) => {
    const {
      content,
      totalCount,
      isCancel
    } = paged

    state.familiesPaged.content = content

    state.familiesPaged.totalCount = totalCount

    state.familiesPaged.isCancel = isCancel
  },

  setValidateFamiliesResult: (state, result) => {
    state.validateFamiliesResult = Object.assign({}, result)
  },
  setImportFamilyInformationResult: (state, result) => {
    state.validateInformationResult = Object.assign({}, result)
  },


  setValidatePhoneResult: (state, result) => {
    state.validatePhoneResult = Object.assign({}, result)
  },

  setFamilyPhoneFamiliesDetail: (state, familyPhoneFamiliesDetail) => {
    state.familyPhoneFamiliesDetail = familyPhoneFamiliesDetail
  },

  setSettleAccountsPaged: (state, paged) => {
    const {
      content,
      totalCount,
      configs = {}
    } = paged

    state.settleAccountsPaged.content = content

    state.settleAccountsPaged.totalCount = totalCount

    state.settleAccountsPaged.configs = configs
  },

  setFamilyPhoneSettleAccountsDetail: (state, familyPhoneSettleAccountsDetail) => {
    state.familyPhoneSettleAccountsDetail = familyPhoneSettleAccountsDetail
  }
}

export default {
  setFamiliesPaged: (state, paged) => {
    const { content, totalCount } = paged

    state.familiesPaged.content = content

    state.familiesPaged.totalCount = totalCount
  },

  setValidateFamiliesResult: (state, result) => {
    state.validateFamiliesResult = Object.assign({}, result)
  },
  setValidatePhoneResult: (state, result) => {
    state.validatePhoneResult = Object.assign({}, result)
    console.log(state.validatePhoneResult)
  },

  setFamilyPhoneFamiliesDetail: (state, familyPhoneFamiliesDetail) => {
    state.familyPhoneFamiliesDetail = familyPhoneFamiliesDetail
  }
}

export default {
  getFamilies(state, params) {
    state.families = params
  },

  getFamilyDetail(state, params) {
    if (params.families) {
      state.familyInformationDetails = params.families
    } else {
      state.familyInformationDetails = {}
    }
  }
}

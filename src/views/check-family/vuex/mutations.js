export default {
  getFamilies(state, params) {
    state.families.contents = params.families
    state.families.total = params.familiesSize
  },
  getFamilyDetail(state, params) {
    if (params.families) {
      state.family = params.families
    }
    else {
      state.family = {}
    }
  }
}

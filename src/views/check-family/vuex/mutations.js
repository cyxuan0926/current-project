export default {
  getFamilies(state, params) {
    state.families = params
  },
  getFamilyDetail(state, params) {
    if (params.families) state.family = params.families
    else state.family = {}
  }
}

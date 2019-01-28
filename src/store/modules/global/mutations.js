export default {
  handleCollapse(state, params) {
    if (params === true) {
      state.isCollapsed = true
    }
    else {
      state.isCollapsed = !state.isCollapsed
    }
  },
  setUser(state, params) {
    state.user = params || {}
  }
}

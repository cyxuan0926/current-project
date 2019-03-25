export default {
  handleCollapse(state, params) {
    if (params === true) {
      state.isCollapsed = true
    }
    else {
      state.isCollapsed = !state.isCollapsed
    }
  },
  showLoading: state => {
    state.loading = true
  },
  hideLoading: state => {
    state.loading = false
  }
}

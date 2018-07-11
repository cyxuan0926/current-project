export default {
  getPrisonVisitConfigDetail(state, params) {
    state.prisonVisitConfigDetail = Object.assign({}, params)
  },
  getRemoteUsualConfig(state, params) {
    state.remoteUsualConfig = Object.assign({}, params)
  },
  getRemoteWeekendConfig(state, params) {
    state.remoteWeekendConfig = Object.assign({}, params)
  },
  getRemoteSpecialConfig(state, params) {
    state.remoteSpecialConfig = Object.assign({}, params)
  }
}

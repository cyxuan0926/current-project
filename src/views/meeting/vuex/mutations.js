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
    if (params) {
      state.remoteSpecialConfig = params
    }
    else {
      state.remoteSpecialConfig = [{ effectDate: '', queue: [null], originQueue: '', originDate: '', canAddQueue: false, loading: false }]
    }
  }
}

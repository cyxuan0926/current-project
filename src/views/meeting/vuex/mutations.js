export default {
  setAdvanceDayLimit(state, dayLimit) {
    state.dayLimit = dayLimit
  },
  getRemoteNormalConfig(state, params) {
    state.normalConfig = params
  },
  // 远程特殊日期配置
  getRemoteSpecialConfig(state, params) {
    state.specialConfig = params
  },
  getPrisonVisitConfigDetail(state, params) {
    state.prisonVisitConfigDetail = Object.assign({}, params)
  },
  resetPrisonVisitConfigDetail(state) {
    state.prisonVisitConfigDetail = { queue: [] }
  },
  getRemoteUsualConfig(state, params) {
    state.remoteUsualConfig = Object.assign({}, params)
  },
  getRemoteWeekendConfig(state, params) {
    state.remoteWeekendConfig = Object.assign({}, params)
  },
  getRemoteSpecialConfigOld(state, params) {
    if (params) {
      state.remoteSpecialConfig = params
    }
    else {
      state.remoteSpecialConfig = [{ effectDate: '', queue: [null], originQueue: '', originDate: '', canAddQueue: false, loading: false }]
    }
  }
}

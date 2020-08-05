export default {
  setAdvanceDayLimit(state, advanceDayLimit) {
    state.advanceDayLimit = advanceDayLimit
  },
  getRemoteNormalConfig(state, params) {
    state.normalConfig = params
  },
  // 设置远程常规配置
  setRemoteNormalConfigs(state, params) {
    state.normalCongigs = { ...params }
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

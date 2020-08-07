import actions from './actions'
import mutations from './mutations'

let state = {
  // 远程探视申请需提前天数
  dayLimit: {
    advanceDayLimit: 2,
    dayInLimit: 15
  },
  normalConfig: [{ days: [], config: [] }], // new
  specialConfig: [], // new
  prisonVisitConfigDetail: { queue: [] }, // new
  remoteUsualConfig: { queue: [null] },
  remoteWeekendConfig: { queue: [null] },
  originSpecial: { effectDate: '', queue: [null], originQueue: '', originDate: '', canAddQueue: false, loading: false },
  remoteSpecialConfig: [{ effectDate: '', queue: [null], originQueue: '', originDate: '', canAddQueue: false, loading: false }]
}

export default {
  actions,
  mutations,
  state
}

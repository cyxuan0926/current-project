import actions from './actions'
import mutations from './mutations'

let state = {
  normalConfig: [{ days: [], config: [] }], // new
  specialConfig: [], // new
  prisonVisitConfigDetail: { queue: [null] }, // new
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

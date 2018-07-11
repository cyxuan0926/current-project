import actions from './actions'
import mutations from './mutations'

let state = {
  prisonVisitConfigDetail: { usual: [null] },
  remoteUsualConfig: { queue: [null] },
  remoteWeekendConfig: { queue: [null] },
  remoteSpecialConfig: { queue: [null] }
}

export default {
  actions,
  mutations,
  state
}

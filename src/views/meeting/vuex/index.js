import actions from './actions'
import mutations from './mutations'

let state = {
  // 远程探视申请需提前天数(hb)
  dayLimit: {
    advanceDayLimit: 2,
    dayInLimit: 15
  },
  advanceDayLimit: [2, 15], // 远程探视申请需提前天数(cy)
  normalConfig: [{ days: [], config: [] }], // new
  normalCongigs: {},
  specialConfig: [], // new
  specialConfigs: [],
  prisonVisitConfigDetail: { queue: [] }, // new
  remoteUsualConfig: { queue: [null] },
  remoteWeekendConfig: { queue: [null] },
  originSpecial: { effectDate: '', queue: [null], originQueue: '', originDate: '', canAddQueue: false, loading: false },
  remoteSpecialConfig: [{ effectDate: '', queue: [null], originQueue: '', originDate: '', canAddQueue: false, loading: false }],

  // 会见楼配置
  meetingRoomConfigs: {},

  // 实地会见常规配置
  visitNormalConfigs: {},

  // 实地会见须知
  visitNotice: {
    notice: ''
  },

  visitTimeSwitch: 0
}

export default {
  actions,
  mutations,
  state
}

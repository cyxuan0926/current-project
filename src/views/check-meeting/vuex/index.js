import actions from './actions'
import mutations from './mutations'

let state = {
  meetings: { contents: [], total: 0 },
  meetingAdjustment: { meetingQueue: [], terminals: [], meetings: [], config: {} },
  freeMeetings: { contents: [], total: 0 },
  meetingRefresh: false,
  meetingAdjustRefresh: false,
  visits: { contents: [], total: 0 },
  meetingCostSaving: { total: 0, meetingDistances: [] }
}

export default {
  actions,
  mutations,
  state
}

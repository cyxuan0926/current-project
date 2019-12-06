import actions from './actions'
import mutations from './mutations'

let state = {
  meetings: { contents: [], total: 0 },
  meetingAdjustment: { meetingQueue: [], terminals: [], meetings: [], config: {} },
  freeMeetings: { contents: [], total: 0 },
  meetingRefresh: false,
  meetingAdjustRefresh: false,
  visits: { contents: [], total: 0 },
  // 会见统计数据
  meetingStatistics: [],
  // 总计项数据
  meetingStatisticTotalItem: {}
}

export default {
  actions,
  mutations,
  state
}

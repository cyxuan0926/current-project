import actions from './actions'
import mutations from './mutations'

let state = {
  meetings: { contents: [], total: 0 },
  meetingsDiplomats: { contents: [], total: 0 },
  meetingAdjustment: { meetingQueue: [], terminals: [], meetings: [], config: {} },
  freeMeetings: { contents: [], total: 0 },
  meetingRefresh: false,
  meetingAdjustRefresh: false,
  visits: { contents: [], total: 0 },
  meetingCostSaving: { total: 0, meetingDistances: [] },
  // 会见统计数据
  meetingStatistics: [],
  // 总计项数据
  meetingStatisticTotalItem: {},
  // 远程会见对账
  meetingCallRecords: { total: 0, contents: [] },
  // 会见时间段
  meetingTimes: []
}

export default {
  actions,
  mutations,
  state
}

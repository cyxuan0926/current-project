import actions from './actions'
import mutations from './mutations'

let state
state = {
  meetings: { contents: [], total: 0 },
  meetingsDiplomats: { contents: [], total: 0 },
  // 这里贼坑 会关联到 views/check-visit/vuex/index.js (by hubi的注释 2020-09-27)
  meetingAdjustment: { meetingQueue: [], specialQueue: [], terminals: [], meetings: [], config: {} },
  freeMeetings: { contents: [], total: 0 },
  meetingRefresh: false,
  meetingAdjustRefresh: false,
  visits: { contents: [], total: 0 },
  meetingCostSaving: { total: 0, meetingDistances: [] },
  // 会见统计数据
  meetingStatistics: [],
  // 广东亲情申请表
  getFamilyMeetingDetail: [],
  // 总计项数据
  meetingStatisticTotalItem: {},
  // 总计项数据
  gdmeetingStatisticTotalItem: {},
  // 远程会见对账
  meetingCallRecords: { total: 0, contents: [] },
  // 会见时间段
  meetingTimes: [],

  isSuccessFirstLevelSubmitMeeting: false
}

export default {
  actions,
  mutations,
  state
}

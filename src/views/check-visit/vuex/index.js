import actions from './actions'
import mutations from './mutations'

let state = {
  visits: { contents: [], total: 0 },
  // 这里贼坑 会关联到 views/check-meeting/vuex/index.js (by hubi的注释 2020-09-27)
  meetingAdjustment: { meetingQueue: [], specialQueue: [], terminals: [], meetings: [] }
}

export default {
  actions,
  mutations,
  state
}

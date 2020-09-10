import actions from './actions'
import mutations from './mutations'

let state = {
  isCollapsed: false,
  loading: false,

  // 多级审批数目配置
  multistageExamineCountConfigs: {
    // 总数目
    total: 0,

    // 家属注册管理数目
    regTotal: 0,

    // 可视电话申请列表数目
    regDiplomatsTotal: 0,

    // 外交领事官员注册管理数目
    meetingTotal: 0,

    // 外交领事官员可视电话申请列表数目
    meetingDiplomatsTotal: 0
  }
}

export default {
  actions,
  mutations,
  state
}

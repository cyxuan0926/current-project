import actions from './actions'
import mutations from './mutations'

let state = {
  prisonUsers: { contents: [], total: 0 },
  prisonUser: { prisonConfigIds: [] }
  // 监区层级关系
  // multiPrisonConfigs: []
}

export default {
  actions,
  mutations,
  state
}

import actions from './actions'
import mutations from './mutations'

let state = {
  families: { contents: [], total: 0 },
  family: {}
}

export default {
  actions,
  mutations,
  state
}

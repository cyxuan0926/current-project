import actions from './actions'
import mutations from './mutations'

let state = {
  account: { contents: [], total: 0 },
  recharge: { contents: [], total: 0 },
  consumption: { contents: [], total: 0 },
  refund: { contents: [], total: 0 }
}

export default {
  actions,
  mutations,
  state
}

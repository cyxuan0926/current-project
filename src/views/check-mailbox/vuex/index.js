import actions from './actions'
import mutations from './mutations'

let state = {
  mailboxes: { contents: [], total: 0 },
  mailboxTypes: []
}

export default {
  actions,
  mutations,
  state
}

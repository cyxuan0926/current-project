import actions from './actions'
import mutations from './mutations'

let state = {
  families: { contents: [], total: 0 },
  familyInformationDetails: {}
}

export default {
  actions,
  mutations,
  state
}

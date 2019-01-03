import actions from './actions'
import mutations from './mutations'

let state = {
  feedbacks: { contents: [], total: 0 },
  feedbackTypes: []
}

export default {
  actions,
  mutations,
  state
}

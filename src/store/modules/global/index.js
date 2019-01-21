import actions from './actions'
import mutations from './mutations'

let state = {
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {}
}

export default {
  actions,
  mutations,
  state
}

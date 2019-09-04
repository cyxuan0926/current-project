import api from './service'
// import { resetRouter } from '@/router/index'

export default {
  handleCollapse({ commit }, params) {
    commit('handleCollapse', params)
  },
  logout: ({ commit }) => {
    return api.logout().then(res => {
      // resetRouter()
      return res
    })
  }
}

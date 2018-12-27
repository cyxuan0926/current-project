import api from './service'

export default {
  handleCollapse({ commit }, params) {
    commit('handleCollapse', params)
  },
  logout: ({ commit }) => {
    return api.logout().then(res => res)
  }
}

// import api from './service'

export default {
  setUser({ commit }, params) {
    commit('setUser', params)
  },
  resetState: ({ commit }, params) => {
    if (!params) return
    commit('resetState', params)
  }
}

import http from '@/service'

export default {
  addTerminal: ({ commit }, params) => {
    return http.addTerminal(params).then(res => res)
  },
  getTerminals: ({ commit }, params) => {
    http.getTerminals(params).then(res => res && commit('getTerminals', res))
  },
  getTerminalDetail: ({ commit }, params) => {
    return http.getTerminalDetail(params).then(res => {
      if (!res) return
      commit('getTerminalDetail', res)
      return true
    })
  },
  updateTerminal: ({ commit }, params) => {
    return http.updateTerminal(params).then(res => res)
  },
  enableTerminal: ({ commit }, params) => {
    return http.enableTerminal(params).then(res => res)
  }
}

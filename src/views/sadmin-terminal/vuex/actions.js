import http from '@/service'

export default {
  addTerminal: (_, params) => {
    return http.addTerminal(params).then(res => res)
  },

  getTerminals: ({ commit }, params) => {
    http.getTerminals(params).then(res => res && commit('getTerminals', res))
  },

  getTerminalDetail: ({ commit }, params) => {
    return http.getTerminalDetail(params).then(res => {
      if (!res) return
      const { roomNumber } = res.terminals
      const terminals = Object.assign({}, res.terminals, { roomNumber: +roomNumber })
      commit('getTerminalDetail', { terminals })
      return true
    })
  },

  updateTerminal: (_, params) => {
    return http.updateTerminal(params).then(res => res)
  },

  enableTerminal: (_, params) => {
    return http.enableTerminal(params).then(res => res)
  },

  async getTerminalUsersByPrisonConfigId({ commit }, params) {
    try {
      const response = await http.getTerminalUsersByPrisonConfigId(params)

      commit('setTerminalUsersByPrisonConfigId', response.data || [])

      return true
    }
    catch (err) {
      Promise.reject(err)
    }
  }
}

export default {
  getTerminals(state, params) {
    state.terminals.contents = params.terminals
    state.terminals.total = params.total
  },

  getTerminalDetail(state, params) {
    state.terminal = params.terminals
  },

  setTerminalUsersByPrisonConfigId(state, terminalUserListsByPrisonConfigId) {
    state.terminalUserListsByPrisonConfigId = terminalUserListsByPrisonConfigId
  }
}

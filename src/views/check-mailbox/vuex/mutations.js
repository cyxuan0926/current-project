export default {
  getMailboxes(state, params) {
    state.mailboxes.contents = params.mailBoxes
    state.mailboxes.total = params.total
  },

  getMailboxTypes(state, params) {
    state.mailboxTypes = (params.types && params.types.length) ? params.types : []
  }
}

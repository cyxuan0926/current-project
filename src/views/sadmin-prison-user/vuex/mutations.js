export default {
  getPrisonUsers: (state, params) => {
    state.prisonUsers.contents = params.users
    state.prisonUsers.total = params.total
  },
  getPrisonUserDetail: (state, params) => {
    state.prisonUser = Object.assign({}, { prisonConfigIds: [] }, params)
  }
}

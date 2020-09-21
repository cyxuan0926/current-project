export default {
  getPrisonUsers: (state, params) => {
    state.prisonUsers.contents = params.users
    state.prisonUsers.total = params.total
  },
  getPrisonUserDetail: (state, params) => {
    state.prisonUser = Object.assign({}, { prisonConfigIds: [] }, params)
  }
  // 设置监区层级
  // setMultiPrisonConfigs: (state, multiPrisonConfigs) => {
  //   state.multiPrisonConfigs = multiPrisonConfigs.slice(0)
  // }
}

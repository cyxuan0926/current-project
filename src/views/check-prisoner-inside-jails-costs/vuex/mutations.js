export default {
  getPrisonersInsideJailsCosts(state, params) {
    state.prisonersInsideJailsCosts.total = params.total
    state.prisonersInsideJailsCosts.contents = params.consumes
  }
}

export default {
  getPrisonersInsideJailsCosts(state, params) {
    state.prisonersInsideJailsCosts.total = params.total
    state.prisonersInsideJailsCosts.contents = params.consumes
  },

  getPrisonersPocketMoney(state, params) {
    state.prisonersPocketMoney.total = params.total
    state.prisonersPocketMoney.contents = params.pocketMoney
  },

  getPrisonerRewardPunishments(state, params) {
    state.prisonerRewardPunishments.total = params.total
    state.prisonerRewardPunishments.contents = params.prisonerRewardPunishments
  },

  getPrisonTerms(state, params) {
    state.prisonTerms.total = params.total
    state.prisonTerms.contents = params.prisonTerms
  }
}

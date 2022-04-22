import actions from './actions'
import mutations from './mutations'

const state = {
  prisonersPocketMoney: { contents: [], total: 0 },
  prisonersInsideJailsCosts: { contents: [], total: 0 },
  prisonerRewardPunishments: { contents: [], total: 0 },
  prisonTerms: { contents: [], total: 0 }
}

export default {
  state,
  actions,
  mutations
}

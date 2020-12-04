import actions from './actions'
import mutations from './mutations'

let state = {
  prisonAll: [],

  prisonAllWithBranchPrison: [],

  provincesAll: [],

  cities: [],

  jailPrisonAreas: [],

  organizationNames: [],

  prisonConfigsMaxLevel: 1,

  allChildPrisonConfigs: [],

  detailManyConfigs: {}
}

export default {
  actions,
  mutations,
  state
}

import actions from './actions'
import mutations from './mutations'

const state = {
  prisonAll: [],

  prisonAllWithBranchPrison: [],

  provincesAll: [],

  cities: [],

  jailPrisonAreas: [],

  organizationNames: [],

  prisonConfigsMaxLevel: 1,

  allChildPrisonConfigs: [],

  detailManyConfigs: {},

  haveMeetingFloorTerminals: false
}

export default {
  actions,
  mutations,
  state
}

export default {
  getPrisonAll(state, params) {
    state.prisonAll = params.jails
  },
  getPrisonAllWithBranchPrison(state, params) {
    state.prisonAllWithBranchPrison = params.jails
  },
  getProvincesAll(state, params) {
    console.log('getProvincesAll===', params.provinces)
    state.provincesAll = params.provinces
  },
  getCities(state, params) {
    state.cities = params.citys
  },
  getJailPrisonAreas(state, params) {
    state.jailPrisonAreas = params.prisonConfigs || []
  },

  getOrgName(state, organization = []) {
    state.organizationNames = organization
  },

  setPrisonConfigsMaxLevel(state, prisonConfigsMaxLevel) {
    state.prisonConfigsMaxLevel = prisonConfigsMaxLevel
  },

  setAllChildPrisonConfigs(state, allChildPrisonConfigs) {
    state.allChildPrisonConfigs = allChildPrisonConfigs.slice(0)
  },

  setDetailManyConfigs(state, detailManyConfigs) {
    state.detailManyConfigs = Object.assign({}, detailManyConfigs)
  },

  setIsHaveMeetingFloorTerminals(state, haveMeetingFloorTerminals) {
    state.haveMeetingFloorTerminals = haveMeetingFloorTerminals
  }
}

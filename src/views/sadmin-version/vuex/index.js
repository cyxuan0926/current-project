import actions from './actions'
import mutations from './mutations'

let state = {
  // prisonVersions: [],
  // familyVersions: [],
  versionsTotal: 0,
  versions: {},
  versionTypes: [
    {
      typeId: 1,
      label: '监狱端'
    },
    {
      typeId: 2,
      label: '家属端Android版'
    },
    {
      typeId: 3,
      label: '家属端iOS版'
    }
  ]
}

export default {
  actions,
  mutations,
  state
}

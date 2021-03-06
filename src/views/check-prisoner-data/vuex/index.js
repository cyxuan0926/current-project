import actions from './actions'
import mutations from './mutations'

let state = {
  prisonerDataResult: {}, // 罪犯模板导入结果
  prisonerYZKDataResult: {}, // 狱政科模板导入结果
  prisonTermResult: {}, // 刑期变动模板导入结果
  prisonerRewardPunishmentResult: {}, // 罪犯奖惩模板导入结果
  uploadPocketMoneyExcelResult: {},
  importPocketMoneyResult: {},
  validatePrisonerResult: {},
  uploadInsideJailsCostsExcelResult: {},
  importInsideJailsCostsResult: {}
}

export default {
  actions,
  mutations,
  state
}

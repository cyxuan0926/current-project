export default {
  // 罪犯数据模板上传成功后将罪犯数据模板导入到服务端
  importPrisoner: (state, prisonerDataResult) => {
    state.prisonerDataResult = prisonerDataResult
  },
  validatePrisoner: (state, params) => {
    state.validatePrisonerResult = params
  },
  // 狱政科罪犯数据模板上传成功后将罪犯数据模板导入到服务端
  importPrisonerYZK: (state, params) => {
    state.prisonerYZKDataResult = params
  },
  // 刑期变动模板上传成功后将刑期变动模板导入到服务端
  importPrisonTerm: (state, prisonTermResult) => {
    prisonTermResult.prisonTerms.forEach(pt => {
      pt.changedate = ''
      pt.changeyear && (pt.changedate += `${ pt.changeyear }年`)
      pt.changemonth && (pt.changedate += `${ pt.changemonth }月`)
      pt.changeday && (pt.changedate += `${ pt.changeday }日`)
    })
    prisonTermResult.errors.forEach(pt => {
      pt.changedate = ''
      pt.changeyear && (pt.changedate += `${ pt.changeyear }年`)
      pt.changemonth && (pt.changedate += `${ pt.changemonth }月`)
      pt.changeday && (pt.changedate += `${ pt.changeday }日`)
    })

    state.prisonTermResult = prisonTermResult
  },

  // 罪犯奖惩模板上传成功后将罪犯奖惩模板导入到服务端
  importPrisonerRewardPunishment: (state, prisonerRewardPunishmentResult) => {
    state.prisonerRewardPunishmentResult = prisonerRewardPunishmentResult
  },
  uploadAnalyticExcel: (state, params) => {
    switch (params.type) {
      case 0:
        state.uploadPocketMoneyExcelResult = params
        break
      case 1:
        state.uploadInsideJailsCostsExcelResult = params
        break
      default:
        state.uploadPocketMoneyExcelResult = {}
        state.uploadInsideJailsCostsExcelResult = {}
    }
  },
  importSuccessfulAnalysisExcel: (state, params) => {
    switch (params.type) {
      case 0:
        state.importPocketMoneyResult = params
        break
      case 1:
        state.importInsideJailsCostsResult = params
        break
      default:
        state.importPocketMoneyResult = {}
        state.importInsideJailsCostsResult = {}
    }
  }
}

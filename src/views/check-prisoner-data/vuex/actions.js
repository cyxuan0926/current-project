import http from '@/service'
import { importPrisonerRewardPunishmentlist } from '@/service-yangguang/api/prisonerList'
import api from './service'

export default {
  // 罪犯数据模板上传成功后将罪犯数据模板导入到服务端
  importPrisoner: ({ commit }, params) => {
    return http.importPrisoner(params).then(res => {
      if (!res) return
      commit('importPrisoner', res)
      return true
    })
  },
  // 罪犯数据导入-验证
  validatePrisoner: ({ commit }, params) => {
    return api.validate(params).then(res => {
      if (!res) return
      commit('validatePrisoner', res)
      return true
    })
  },
  validatePrisonerYZK: ({ commit }, params) => {
    return api.validateYZK(params).then(res => {
      if (!res) return
      commit('validatePrisoner', res)
      return true
    })
  },
  // 狱政科罪犯数据模板上传成功后将罪犯数据模板导入到服务端
  importPrisonerYZK: ({ commit }, params) => {
    return http.importPrisonerYZK(params).then(res => {
      if (!res) return
      commit('importPrisonerYZK', res)
      return true
    })
  },
  // 刑期变动模板上传成功后将刑期变动模板导入到服务端
  importPrisonTerm: ({ commit }, params) => {
    return http.importPrisonTerm(params).then(res => {
      if (!res) return
      commit('importPrisonTerm', res)
      return true
    })
  },
  // 罪犯奖惩模板上传成功后将罪犯奖惩模板导入到服务端
  importPrisonerRewardPunishment: ({ commit }, params) => {
    return importPrisonerRewardPunishmentlist(params).then(res => {
      if (!res) return
      commit('importPrisonerRewardPunishment', res)
      return true
    })
  },
  uploadAnalyticExcel: ({ commit }, params) => {
    let formData = new FormData()
    params && formData.append('file', params.values)
    params.values = formData
    return http.uploadAnalyticExcel(params).then(res => {
      if (!res) return
      if (res.error_arrays && res.error_arrays.length) {
        res.error_arrays.forEach(error => {
          if (error.errors.length === 1) error.err = error.errors[0]
          else {
            error.err = `1. ${ error.errors[0] }`
            error.errors.forEach((msg, index) => {
              if (index === 0) return
              error.err = `${ error.err }</br>${ index + 1 }. ${ msg }`
            })
          }
        })
      }
      commit('uploadAnalyticExcel', res)
      return true
    })
  },
  importSuccessfulAnalysisExcel: ({ commit }, params) => {
    return http.importSuccessfulAnalysisExcel(params).then(res => {
      if (!res) return
      commit('importSuccessfulAnalysisExcel', res)
      return true
    })
  }
}

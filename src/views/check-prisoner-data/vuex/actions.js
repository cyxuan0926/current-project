import http from '@/service'
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
    return http.importPrisonerRewardPunishment(params).then(res => {
      if (!res) return
      commit('importPrisonerRewardPunishment', res)
      return true
    })
  },
  uploadPocketMoneyExcel: ({ commit }, params) => {
    let formData = new FormData()
    params && formData.append('file', params)
    return http.uploadPocketMoneyExcel(formData).then(res => {
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
          console.log(error.err)
        })
      }
      commit('uploadPocketMoneyExcel', res)
      return true
    })
  },
  importPocketMoney: ({ commit }, params) => {
    return http.importPocketMoney(params).then(res => {
      if (!res) return
      commit('importPocketMoney', res)
      return true
    })
  }
}

import http from '@/service'

export default {
  getPrisons: ({ commit }, params) => {
    return http.getPrisons(params).then(res => {
      if (!res) return
      commit('getPrisons', res)
      return true
    })
  },
  addPrison: ({ dispatch }, params) => {
    return http.addPrison(params).then(res => {
      if (!res) return
      dispatch('deleteUrls', { urls: [params.imageUrl, params.audioPath, params.videoPath], contents: params.description, save: true })
      return res
    })
  },
  getPrisonDetail: ({ commit }, params) => {
    return http.getPrisonDetail(params).then(res => {
      if (!res) return

      const regs = res.jails || {}

      if (!regs.familyPhoneScope) regs.familyPhoneScope = [2]

      else {
        const _temp = {
          0: [2],
          1: [1],
          2: [1, 2]
        }

        regs.familyPhoneScope = _temp[(+regs.familyPhoneScope)]
      }

      commit('getPrisonDetail', regs)

      commit('getBranchStatus', res.branchStatus)

      return true
    })
  },
  updatePrison: ({ commit, dispatch }, params) => {
    commit('setUrlStorage', true)
    return http.updatePrison(params).then(res => {
      let excpt = []
      params.imageUrl && excpt.push(params.imageUrl)
      params.audioPath && excpt.push(params.audioPath)
      params.videoPath && excpt.push(params.videoPath)
      if (res) dispatch('deleteUrls', { urls: [params.imageUrl, params.audioPath, params.videoPath], contents: params.description, save: true })
      return res
    })
  },
  getTenants: ({ commit }, params) => {
    return http.getTenants(params).then(res => {
      if (!res) return
      commit('getTenants', res)
      return true
    })
  },
  createJailByBindTenant: ({ commit }, params) => {
    return http.createJailByBindTenant(params).then(res => res)
  },
  // getBranchStatus: async({ commit }, params) => {
  //   try {
  //     const res = await http.getBranchStatus(params)
  //     return res.data
  //   }
  //   catch (err) {
  //     throw err
  //   }
  // }

  // 获取人脸识别配置
  getFaceRecognitionConfigs: async({ commit }, params) => {
    try {
      const response = await http.getFaceRecognitionConfigs(params)

      const afrIOSSetValue = response ? (response['afrIOSSetValue'] || '0.2') : '0.2'

      const afrAndroidSetValue = response ? (response['afrAndroidSetValue'] || '0.4') : '0.4'

      const afrInterval = response ? (response['afrInterval'] || '1500') : '1500'

      commit('setFaceRecognitionConfigs', {
        afrIOSSetValue,
        afrAndroidSetValue,
        afrInterval
      })

      return true
    }
    catch (err) {
      throw err
    }
  },

  // 更新人脸配置
  updateFaceRecognitionConfigs: async({ commit }, params) => {
    try {
      await http.updateFaceRecognitionConfigs(params)

      return true
    }
    catch (err) {
      throw err
    }
  },

  // 监狱配置 - 获取收费配置
  getMeetingChargeTemplate: async({ commit }, params) => {
    try {
      const { data } = await http.getMeetingChargeTemplate(params)

      commit('setPrisonChargeConfigs', data)

      return true
    }
    catch (err) {
      Promise.reject(err)
    }
  },

  // 监狱配置 - 设置收费配置
  setMeetingChargeTemplate: async({ commit }, params) => {
    try {
      const { code } = await http.setMeetingChargeTemplate(params)

      return code === 200
    }
    catch (err) {
      Promise.reject(err)
    }
  }
}

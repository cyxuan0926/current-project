import http from '@/service'

export default {
  getPrisoners({ commit }, params) {
    return http.getPrisoners(params).then(res => res && commit('getPrisoners', res))
  },

  getPrisonersAll({ commit }, params) {
    http.getPrisonersAll(params).then(res => res && commit('getPrisoners', res))
  },

  updatePrisonerTime(_, params) {
    return http.updatePrisonerTime(params).then(res => res)
  },

  addPrisonerBlacklist(_, params) {
    return http.addPrisonerBlacklist(params).then(res => res)
  },

  getNotification({ commit, dispatch }, params) {
    return http.getNotification(params).then(async res => {
      if (!res) return

      const { notify } = res
      const { meetingNotificationUrl } = notify

      if (meetingNotificationUrl) res['notify']['meetingNotificationUrl'] = await dispatch('files/downloadPublicServiceFile', { url: meetingNotificationUrl })

      commit('getNotification', res)

      return true
    })
  },

  updateNotification(_, params) {
    return http.updateNotification(params).then(res => res)
  },

  addNotification(_, params) {
    return http.addNotification(params).then(res => res)
  },

  getNotificationFamilies({ commit }, params) {
    return http.getNotificationFamilies(params).then(res => {
      if (!res) return

      commit('getNotificationFamilies', res)

      return true
    })
  },

  getPrisonConfigs({ commit }, params) {
    return http.getPrisonConfigs(params).then(res => {
      if (!res) return

      commit('getPrisonConfigs', res)

      return true
    })
  },

  changePrisonArea(_, params) {
    return http.changePrisonArea(params).then(res => res)
  },

  removePrisonerBlacklist(_, params) {
    return http.removePrisonerBlacklist(params).then(res => res)
  },

  deletePrisonerData(_, params) {
    return http.deletePrisoners(params).then(res => res)
  },

  addPrionser(_, params) {
    return http.addPrionser(params).then(res => res)
  },

  // 批量更换监区
  async changePrisonAreaBatch(_, params) {
    try {
      const { code } = await http.changePrisonAreaBatch(params)

      return code === 200
    }
    catch (err) {
      Promise.reject(err)
    }
  },

  // 调换监狱 - 接收
  async acceptPrisoners(_, params) {
    try {
      const response = await http.acceptPrisoners(params)
      const isSucess = response ? response['code'] === 200 : response

      return isSucess
    }
    catch (err) {
      Promise.reject(err)
    }
  },

  // 调换监狱 - 取消
  async abortChangePrisoners(_, params) {
    try {
      const response = await http.abortChangePrisoners(params)
      const isSucess = response ? response['code'] === 200 : response

      return isSucess
    }
    catch (err) {
      Promise.reject(err)
    }
  },

  // 服刑人员 - 转监标签页列表
  async getTransferOutPrisonersPagedData({ commit }, args) {
    try {
      const { data } = await http.getTransferOutPrisonersPagedData(args)

      data['prisoners'].forEach(element => {
        if (!element.families || !Array.isArray(element.families)) element.families = []
      })

      commit('getPrisoners', data)

      return true
    }
    catch (err) {
      Promise.reject(err)
    }
  },

  // 服刑人员 - 驳回人脸
  async rejectPrisonerFaceUrl(_, prisonerId) {
    try {
      const response = await http.rejectPrisonerFaceUrl(prisonerId)
      const isSucess = response ? response['code'] === 200 : response

      return isSucess
    }
    catch (err) {
      Promise.reject(err)
    }
  }
}

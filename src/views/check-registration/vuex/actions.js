import http from '@/service'

export default {
  getRegistrations: ({ commit }, params) => {
    http.getRegistrations(params).then(res => res && commit('getRegistrations', res))
  },
  getRegistrationsAll: ({ commit }, params) => {
    http.getRegistrationsAll(params).then(res => res && commit('getRegistrations', res))
  },
  authorizeRegistrations: (_, params) => {
    return http.authorizeRegistrations(params).then(res => res)
  },
  getRegistrationNotificationDetail: ({ commit, dispatch }, params) => {
    return http.getRegistrationNotificationDetail(params).then(async res => {
      if (!res) return

      const { notify } = res

      const { meetingNotificationUrl } = notify

      if (meetingNotificationUrl) res['notify']['meetingNotificationUrl'] = await dispatch('files/downloadPublicServiceFile', { url: meetingNotificationUrl })

      commit('getNotification', res)

      return true
    })
  },


  // 下载电子关系证明
  downloadRelationshipFile: async(_, params) => {
    try {
      const { data } = await http.downloadRelationshipFile(params)

      // 后端暴露了文件名字段 然后自己拿到直接使用
      //  headers decodeURIComponent(headers['content-disposition'].replace(/^attachment;filename=/g, ''))
      return data
    }
    catch (err) {
      throw err
    }
  }
}

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
  getRegistrationNotificationDetail: ({ commit }, params) => {
    return http.getRegistrationNotificationDetail(params).then(res => {
      if (!res) return
      commit('getNotification', res)
      return true
    })
  },


  // 下载电子关系证明
  downloadRelationshipFile: async({ commit }, params) => {
    try {
      const { data } = await http.downloadRelationshipFile(params)

      // 后端暴露了文件名字段 然后自己拿到直接使用
      //  headers console.log(decodeURIComponent(headers['content-disposition'].replace(/^attachment;filename=/g, '')))
      return data
    }
    catch (err) {
      throw err
    }
  }
}

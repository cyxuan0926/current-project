import api from './service'

export default {
  getMailboxes: ({ commit }, params) => {
    return api.getMailboxes(params).then(res => {
      if (!res) return
      res.mailBoxes.forEach(mail => {
        if (mail.imageUrls) {
          mail.imageUrls = mail.imageUrls.split(';')
          if (!mail.imageUrls[mail.imageUrls.length - 1]) mail.imageUrls.pop()
        }
        else {
          mail.imageUrls = []
        }
      })
      commit('getMailboxes', res)
      return true
    })
  },
  getMailboxDetail: ({ commit }, params) => {
    return api.getMailboxDetail(params).then(res => {
      if (!res) return
      if (res.detail.imageUrls) {
        res.detail.imageUrls = res.detail.imageUrls.split(';')
        if (!res.detail.imageUrls[res.detail.imageUrls.length - 1]) res.detail.imageUrls.pop()
      }
      else {
        res.detail.imageUrls = []
      }
      return res.detail
    })
  },
  getMailboxTypes: ({ commit }, params) => {
    return api.getMailboxTypes(params).then(res => {
      if (!res) return
      commit('getMailboxTypes', res)
      return true
    })
  },
  deleteMailbox: ({ commit }, params) => {
    return api.deleteMailbox(params).then(res => res)
  },
  replyMailbox: ({ commit }, params) => {
    return api.replyMailbox(params).then(res => res)
  }
}

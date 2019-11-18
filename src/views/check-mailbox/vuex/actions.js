import api from './service'
import urls from '@/service/urls'

export default {
  getMailboxes: ({ commit }, params) => {
    return api.getMailboxes(params).then(res => {
      if (!res) return
      res.mailBoxes.forEach(mail => {
        if (mail.imageUrls) {
          const imageUrls = new Set(mail.imageUrls.split(';'))
          if (imageUrls.has('')) imageUrls.delete('')
          mail.imageUrls = [ ...imageUrls ].map(url => {
            if (url.includes('https://') || url.includes('http://')) return url
            else return `${ urls.publicApiHost }/files/${ url }`
          })
        }
        else mail.imageUrls = []
      })
      commit('getMailboxes', res)
      return true
    })
  },
  getMailboxDetail: ({ commit }, params) => {
    return api.getMailboxDetail(params).then(res => {
      if (!res) return
      if (res.detail.imageUrls) {
        const imageUrls = new Set(res.detail.imageUrls.split(';'))
        if (imageUrls.has('')) imageUrls.delete('')
        res.detail.imageUrls = [ ...imageUrls ].map(url => {
          if (url.includes('https://') || url.includes('http://')) return url
          else return `${ urls.publicApiHost }/files/${ url }`
        })
      }
      else res.detail.imageUrls = []
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

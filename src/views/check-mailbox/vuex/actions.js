import api from './service'
import { filterImages } from '@/utils/helper'

export default {
  getMailboxes: ({ commit }, params) => {
    return api.getMailboxes(params).then(res => {
      if (!res) return
      res.mailBoxes.forEach(mail => {
        if (mail.imageUrls) mail.imageUrls = filterImages({ images: mail.imageUrls })
        else mail.imageUrls = []
      })
      commit('getMailboxes', res)
      return true
    })
  },
  getMailboxDetail: ({ commit }, params) => {
    return api.getMailboxDetail(params).then(res => {
      if (!res) return
      if (res.detail.imageUrls) res.detail.imageUrls = filterImages({ images: res.detail.imageUrls })
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

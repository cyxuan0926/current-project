import api from './service'
import { filterImages } from '@/utils/helper'
import dateHelp from '@/filters/modules/date'

export default {
  getMailboxes: ({ commit }, params) => {
    return api.getMailboxes(params).then(res => {
      if (!res) {
        return
      }

      res.mailBoxes.forEach(mail => {
        if (mail.imageUrls) {
          mail.imageUrls = filterImages({ images: mail.imageUrls })
        } else {
          mail.imageUrls = []
        }
      })

      commit('getMailboxes', res)
      return true
    })
  },

  getMailboxDetail: ({ commit }, params) => {
    return api.getMailboxDetail(params).then(res => {
      if (!res) {
        return
      }

      res.detail.createdAt = dateHelp.Date(res.detail.createdAt)

      if (res.detail.imageUrls) {
        res.detail.imageUrls = filterImages({ images: res.detail.imageUrls })
      } else {
        res.detail.imageUrls = []
      }

      return res.detail
    })
  },

  getMailboxTypes: ({ commit }, params) => {
    return api.getMailboxTypes(params).then(res => {
      if (!res) {
        return
      }

      commit('getMailboxTypes', res)
      return true
    })
  },

  deleteMailbox: (_, params) => api.deleteMailbox(params).then(res => res),

  replyMailbox: (_, params) => api.replyMailbox(params).then(res => res)
}

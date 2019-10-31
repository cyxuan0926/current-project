import http from '@/service'
import api from './service'
import urls from '@/service/urls'

export default {
  getFeedbacks: ({ commit }, params) => {
    return http.getFeedbacks(params).then(res => {
      if (!res) return
      res.feedbacks.forEach(feedback => {
        if (Object.prototype.toString.call(feedback.imageUrls) === '[object String]') {
          if (feedback.imageUrls) {
            const imageUrls = new Set(feedback.imageUrls.split(';'))
            if (imageUrls.has('')) imageUrls.delete('')
            if (!feedback.isCo) feedback.imageUrls = [ ...imageUrls ].map(item => `${ urls.publicApiHost }/files/${ item }`)
            else feedback.imageUrls = [ ...imageUrls ]
          }
          else feedback.imageUrls = []
        }
      })
      commit('getFeedbacks', res)
      return true
    })
  },
  getFeedbackDetail: ({ commit }, params) => {
    return api.getFeedbackDetail(params).then(res => {
      if (!res) return
      if (Object.prototype.toString.call(res.detail.imageUrls) === '[object String]') {
        if (res.detail.imageUrls) {
          const imageUrls = new Set(res.detail.imageUrls.split(';'))
          if (imageUrls.has('')) imageUrls.delete('')
          if (!res.detail.isCo) res.detail.imageUrls = [ ...imageUrls ].map(item => `${ urls.publicApiHost }/files/${ item }`)
          else res.detail.imageUrls = [ ...imageUrls ]
        }
        else res.detail.imageUrls = []
      }
      return res.detail
    })
  },
  getFeedbackTypes: ({ commit }, params) => {
    return api.getFeedbackTypes(params).then(res => {
      if (!res) return
      commit('getFeedbackTypes', res)
      return true
    })
  },
  deleteFeedback: ({ commit }, params) => {
    return api.deleteFeedback(params).then(res => res)
  },
  replyFeedback: ({ commit }, params) => {
    return api.replyFeedback(params).then(res => res)
  },
  downloadFeedbacks: ({ commit }, params) => {
    return http.downloadFeedbacks(params).then(res => res.data)
  }
}

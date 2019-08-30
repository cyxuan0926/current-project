import http from '@/service'
import api from './service'

export default {
  getFeedbacks: ({ commit }, params) => {
    return http.getFeedbacks(params).then(res => {
      if (!res) return
      res.feedbacks.forEach(feedback => {
        if (feedback.imageUrls) {
          feedback.imageUrls = feedback.imageUrls.split(';')
          if (!feedback.imageUrls[feedback.imageUrls.length - 1]) feedback.imageUrls.pop()
        }
        else {
          feedback.imageUrls = []
        }
      })
      commit('getFeedbacks', res)
      return true
    })
  },
  getFeedbackDetail: ({ commit }, params) => {
    return api.getFeedbackDetail(params).then(res => {
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

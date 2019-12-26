import http from '@/service'
import api from './service'
import { filterImages } from '@/utils/helper'

export default {
  getFeedbacks: ({ commit }, params) => {
    return http.getFeedbacks(params).then(res => {
      if (!res) return
      res.feedbacks.forEach(feedback => {
        if (feedback.imageUrls) feedback.imageUrls = filterImages({ images: feedback.imageUrls, isIdentify: true, isPublic: !feedback.isCo })
        else feedback.imageUrls = []
      })
      commit('getFeedbacks', res)
      return true
    })
  },
  getFeedbackDetail: ({ commit }, params) => {
    return api.getFeedbackDetail(params).then(res => {
      if (!res) return
      if (res.detail.imageUrls) res.detail.imageUrls = filterImages({ images: res.detail.imageUrls, isIdentify: true, isPublic: !res.detail.isCo })
      else res.detail.imageUrls = []
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

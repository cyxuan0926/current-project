import http from '@/service'
import api from './service'

export default {
  getFeedbacks: ({ commit }, params) => {
    return http.getFeedbacks(params).then(res => {
      if (!res) return
      console.log(res.feedbacks)
      res.feedbacks.forEach(feedback => {
        if (feedback.imageUrls) {
          feedback.imageUrls = feedback.imageUrls.split(';')
        }
        else {
          feedback.imageUrls = []
        }
      })
      commit('getFeedbacks', res)
      return true
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
  }
}

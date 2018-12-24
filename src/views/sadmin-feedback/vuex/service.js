import * as service from '@/service/config/service'

export default {
  // 意见反馈类别
  getFeedbackTypes: () => {
    return service.get('/feedbacks/types').then(res => res && res.data)
  },
  deleteFeedback: params => {
    return service.post('/feedbacks/delete', params).then(res => res && res.code === 200)
  }
}

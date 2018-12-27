import * as service from '@/service/config/service'

export default {
  // 意见反馈类别
  logout: () => {
    return service.get('/users/logout').then(res => res && res.code === 200)
  }
}

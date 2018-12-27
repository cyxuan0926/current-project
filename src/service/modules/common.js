import * as service from '../config/service'

export default {
  // 用户登录
  login: params => {
    return service.post('/users/login', params).then(res => res && res.data)
  }
}

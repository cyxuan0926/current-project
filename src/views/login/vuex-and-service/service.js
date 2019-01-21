import * as service from '@/service/config/service'

export default {
  login: params => {
    return service.post('/users/login', params).then(res => res && res.data)
  }
}

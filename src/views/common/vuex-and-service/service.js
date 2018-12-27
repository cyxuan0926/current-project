import * as service from '@/service/config/service'

export default {
  logout: () => {
    return service.get('/users/logout').then(res => res && res.code === 200)
  }
}

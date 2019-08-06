import * as service from '@/service/config/service'

export default {
  login: params => {
    return service.post('/users/login', params).then(res => res && res.data)
  },
  // 狱务通获取登陆用户信息接口 branch_prison 是否分监区 0是不分监区 1是分监区
  getBaseInfo: () => service.get('/users/baseinfo').then(res => res && res.data)
}

import * as service from '@/service/config/service'

export default {
  // 监狱基本信息管理-详情
  getJailInformation: () => {
    return service.get('/jails/getJailsDetail').then(res => res && res.data)
  }
}

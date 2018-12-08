import * as service from '@/service/config/service'

export default {
  // 获取监狱常规配置
  getRemoteNormalConfig: (params) => {
    return service.get('/complex_config/getNormalConfig', params).then(res => res && res.data)
  }
}

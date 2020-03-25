import * as service from '../config/service'

export default {
  // 监狱
  getPrisonAll: params => {
    return service.get('/jails/getJailAll', params).then(res => res && res.data)
  },
  // 监狱-含分监区参数
  getPrisonAllWithBranchPrison: params => {
    return service.get('/jails/getAllJailsAndBranchPrison', params).then(res => res && res.data)
  },
  // 省份
  getProvincesAll: () => {
    return service.get('/provinces/list').then(res => res && res.data)
  },
  // 城市
  getCities: params => {
    return service.get(`/cities/list?provicesId=${ params }`).then(res => res && res.data)
  },
  // 监区-根据监狱id查询
  getJailPrisonAreas: params => {
    return service.get(`/prison_config/getPrisonConfigs`, params).then(res => res && res.data)
  }
}

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
  // 会见楼需求：监区里面需要加上 会见楼和非会见楼虚拟概念 /getTerminalsPrisonConfigs
  // 普通查询监区： /prison_config/getPrisonConfigs
  getJailPrisonAreas: args => {
    const { url, params } = args

    return service.get(url, params).then(res => res && res.data)
  },
  // 监区-根据上一级id 查询 分监区 楼栋 楼层
  getJailPrisonSubs: params => {
    return service.get(`/prison_config/getChildPrisonConfigs`, params).then(res => res && res.data)
  },
  // 监区-根据上一级id 查询 分监区 楼栋 楼层 动态展示
  getJailPrisonSubsAuth: params => {
    return service.get(`/prison_config/getAuthChildPrisonConfigs`, params).then(res => res && res.data)
  },
  // 外交领事官员-外交官员组织机构
  getOrgName: params => {
    return service.get('/diplomats/registrations/getOrgName', params)
  },

  getAllChildPrisonConfigs: () => {
    return service.get('/prison_config/getAllChildPrisonConfigs')
  },

  // 获取监狱是否有会见楼终端设备
  getMeetingFloorTerminals: jailId => {
    return service.get('/terminals/getMeetingFloorTerminals', { jailId })
  }
}

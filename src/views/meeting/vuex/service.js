import * as service from '@/service/config/service'

export default {
  // 监狱常规配置-获取
  getRemoteNormalConfig: (params) => {
    return service.get('/complex_config/getNormalConfig', params).then(res => res && res.data)
  },
  // 监狱常规配置-更新
  updateRemoteNormalConfig: (params) => {
    return service.postObj('/complex_config/updateNormalConfig', params).then(res => res && res.code === 200)
  },
  // 监狱特殊日期配置-获取
  getRemoteSpecialConfig: (params) => {
    return service.get('/complex_config/page', params).then(res => res && res.data)
  },
  // 监狱特殊日期配置-删除
  deleteSpecialConfig: (params) => {
    return service.post('/complex_config/deleteComplexSpecialConfig', params).then(res => res && res.code === 200)
  },
  // 监狱特殊日期配置-新增
  addSpecialConfig: (params) => {
    return service.postObj('/complex_config/addComplexSpecialConfig', params).then(res => res && res.data)
  },
  // 监狱特殊日期配置-更新
  updateSpecialConfig: (params) => {
    return service.postObj('/complex_config/updateComplexSpecialConfig', params).then(res => res && res.code === 200)
  },
  // 远程会见-特殊配置-删除
  deleteRemoteSpecialConfig: params => {
    return service.post('/jails/special_configs/delete', params).then(res => res && res.code === 200)
  },
  // 远程会见-常规配置-详情
  getRemoteUsualConfig: params => {
    return service.get('/jails/normal_config', params).then(res => res && res.data)
  },
  // 远程会见-常规配置-编辑
  updateRemoteUsualConfig: params => {
    return service.postObj('/jails/normal_config/update', params).then(res => res && res.code === 200)
  },
  // 实地探监-编辑
  updatePrisonVisitConfig: params => {
    return service.postObj('/prisoner_visits/updateConfig', params).then(res => res && res.code === 200)
  },
  // 远程会见-特殊配置-新增
  addRemoteSpecialConfig: params => {
    return service.postObj('/jails/special_configs/add', params).then(res => res && res.data)
  },
  // 远程会见-周末配置-编辑
  updateRemoteWeekendConfig: params => {
    return service.postObj('/jails/weekend_config/update', params).then(res => res && res.code === 200)
  },
  // 远程会见-周末配置-详情
  getRemoteWeekendConfig: params => {
    return service.get('/jails/weekend_config', params).then(res => res && res.data)
  },
  // 远程会见-特殊配置-编辑
  updateRemoteSpecialConfig: params => {
    return service.postObj('/jails/special_configs/update', params).then(res => res && res.code === 200)
  },
  // 实地探监-详情
  getPrisonVisitConfigDetail: params => {
    return service.get('/prisoner_visits/configDetail', params).then(res => res && res.data)
  }
}

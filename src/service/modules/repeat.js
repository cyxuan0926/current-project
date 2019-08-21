import * as service from '../config/service'

export default {
  // 远程会见-常规配置-详情
  getRemoteUsualConfig: params => {
    return service.get('/jails/normal_config', params).then(res => res && res.data)
  },
  // 远程会见-常规配置-编辑
  updateRemoteUsualConfig: params => {
    return service.postObj('/jails/normal_config/update', params).then(res => res && res.code === 200)
  },
  // 远程会见-周末配置-详情
  getRemoteWeekendConfig: params => {
    return service.get('/jails/weekend_config', params).then(res => res && res.data)
  },
  // 远程会见-周末配置-编辑
  updateRemoteWeekendConfig: params => {
    return service.postObj('/jails/weekend_config/update', params).then(res => res && res.code === 200)
  },
  // 远程会见-特殊配置-详情
  getRemoteSpecialConfigOld: params => {
    return service.get('/jails/special_configs/list', params).then(res => res && res.data)
  },
  // 远程会见-特殊配置-新增
  addRemoteSpecialConfig: params => {
    return service.postObj('/jails/special_configs/add', params).then(res => res && res.data)
  },
  // 远程会见-特殊配置-编辑
  updateRemoteSpecialConfig: params => {
    return service.postObj('/jails/special_configs/update', params).then(res => res && res.code === 200)
  },
  // 远程会见-特殊配置-删除
  deleteRemoteSpecialConfig: params => {
    return service.post('/jails/special_configs/delete', params).then(res => res && res.code === 200)
  },
  // 会见统计-监狱会见
  getPrisonReportList: params => {
    return service.get('/report/prisonReportPage', params).then(res => res && res.data)
  },
  // 会见统计-监狱会见-所有监狱
  getPrisonReportListAll: params => {
    return service.get('/report/findPage', params).then(res => res && res.data)
  },
  // 会见统计-监狱会见详情
  getPrisonReportDetail: params => {
    return service.get('/report/findDetailPage', params).then(res => res && res.data)
  },
  // 会见统计-监狱会见详情-所有监狱
  getPrisonReportDetailAll: params => {
    return service.get('/report/findJailDetailPage', params).then(res => res && res.data)
  },
  // 会见统计-监区会见
  getPrisonAreaReportList: params => {
    return service.get('/report/prisonareaReportPage', params).then(res => res && res.data)
  }
}

import * as service from '@/service/config/service'

export default {
  // 远程/实地探视提前申请天数配置-获取
  getRemoteAdvanceDayLimit: inupts => {
    const { params, url = '/jails/getAdvanceDayLimit' } = inupts

    const defaultParams = {
      jailId: '' // 监狱id
    }

    return service.get(url, { ...defaultParams, ...params }).then(res => res && res.data)
  },

  // 远程探视提前申请天数配置-修改
  updateRemoteAdvanceDayLimit: inputs => {
    const {
      params,
      url = '/jails/updateAdvanceDayLimit',
      methods = 'post'
    } = inputs

    return service[methods](url, params).then(res => res && res.code === 200)
  },
  // 监狱常规配置-获取
  getRemoteNormalConfig: params => {
    return service.get('/complex_config/getNormalConfig', params).then(res => res && res.data)
  },
  // 监狱常规配置-更新
  updateRemoteNormalConfig: params => {
    return service.postObj('/complex_config/updateNormalConfig', params).then(res => res && res.code === 200)
  },
  // 监狱特殊日期配置-获取
  getRemoteSpecialConfig: params => {
    return service.get('/complex_config/page', params).then(res => res && res.data)
  },
  // 监狱特殊日期配置-删除
  deleteSpecialConfig: params => {
    return service.post('/complex_config/deleteComplexSpecialConfig', params).then(res => res && res.code === 200)
  },
  // 监狱特殊日期配置-新增
  addSpecialConfig: params => {
    return service.postObj('/complex_config/addComplexSpecialConfig', params).then(res => res && res.data)
  },
  // 监狱特殊日期配置-更新
  updateSpecialConfig: params => {
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
  },
   getTerminalsByArea: params => {
    return service.get('/complex_config/getTerminalsByArea', params).then(res => res && res.data)
  }, // 监狱特殊日期配置-删除
  deleteSpecialConfigById: (params) => {
    return service.post('/complex_config/deleteComplexSpecialConfigById', params).then(res => res && res.code === 200)
  },

  // 查询会见楼配置
  getComplexConfigFloorDetail: jailId => {
    return service.get('/complex_config/getFloorConfig', { jailId }).then(res => res.data)
  },

  // 保存会见楼配置
  saveComplexConfigFloorDetail: params => {
    return service.postObj('/complex_config/saveFloorConfig', params)
  },

  // 实地会见 - 获取常规配置
  getVisitNormalConfigs: jailId => {
    return service.get('/visit/config/getNormalConfig', { jailId }).then(res => res && res.code === 200 && res.data)
  },

  // 实地会见 - 更新常规配置
  updateVisitNormalConfigs: params => {
    return service.postObj('/visit/config/saveNormalConfig', params).then(res => res && res.code === 200)
  },

  // 实地会见 - 获取实地会见须知
  getVisitNotice: jailId => {
    return service.get('/visit/config/getNotice', { jailId }).then(res => res && res.data)
  },

  // 实地会见 - 更新周期配置开关
  updateTimeSwitch: params => {
    return service.get('/visit/config/updateTimeSwitch', params)
  },

  // 实地会见 - 获取特殊日期配置
  getVisitSpecialConfigs: jailId => {
    return service.get('/visit/config/getSpecialConfig', { jailId }).then(res => res && res.data)
  },

  // 实地会见 - 新增特殊日期配置
  addVisitSpecialConfig: params => {
    return service.postObj('/visit/config/addSpecialConfig', params)
  },

  // 实地会见 - 删除特殊日期配置
  delVisitSpecialConfig: params => {
    return service.postObj('/visit/config/deleteSpecialConfig', params)
  },

  // 实地会见 - 更新特殊日期配置
  updateVisitSpecialConfig: params => {
    return service.postObj('/visit/config/updateSpecialConfig', params)
  },

  // 实地会见 - 获取常规周期配置开关
  getVisitTimeSwitch: jailId => {
    return service.get('/visit/config/getTimeSwitch', { jailId })
  },

  // 实地会见 - 更新会见须知
  updateVisitNotice: params => {
    return service.get('/visit/config/updateNotice', params)
  }
}

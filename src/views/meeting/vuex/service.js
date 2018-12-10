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
  }
}

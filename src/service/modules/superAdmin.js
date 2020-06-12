import * as service from '../config/service'

export default {
  // 所有监狱
  getJails: () =>
    service.get('/jails/all').then(res => res).catch(err => err),
  // 日志-列表
  getAppLogs: params => {
    return service.get('/app_logs/page', params).then(res => res && res.data)
  },
  // 监狱用户管理-列表 需要修改page初始值为0
  getPrisonUsers: params => {
    return service.get('/users/page', params).then(res => res && res.data)
  },
  // 监狱用户管理-删除 租户管理员
  deletePrisonUser: params => {
    return service.remove(`/users/delete?id=${ params.id }`).then(res => res && res.code === 200)
  },
  // 监狱用户管理-新增 租户管理员
  addPrisonUser: params => {
    return service.postObj('/users/add', params).then(res => res && res.code === 200)
  },
  // 监狱用户管理-详情 租户管理员
  getPrisonUserDetail: params => {
    return service.get(`/users/edit?id=${ params }`).then(res => res && res.data)
  },
  // 监狱用户管理-启用禁用 租户管理员
  enableOrDisablePrisonUser: params => {
    return service.put(`/users/enableOrDisable?id=${ params.id }&status=${ params.status }`).then(res => res && res.code === 200)
  },
  // 家属汇款记录-列表
  getFamilyRemittance: params => {
    return service.get('/family_remit/list', params).then(res => res && res.data)
  },
  // 监狱用户管理-编辑
  updatePrisonUser: params => {
    return service.putObj('/users/update', params).then(res => res && res.code === 200)
  },
  // 监狱管理-监狱列表
  getPrisons: params => {
    return service.get('/jails/page', params).then(res => res && res.data)
  },
  // 监狱管理-租户列表
  getTenants: params => {
    return service.get('/jails/tenants', params).then(res => res && res.data)
  },
  // 监狱管理-租户列表-绑定监狱
  createJailByBindTenant: params => {
    return service.postObj('/jails/createJailByBindTenant', params).then(res => res && res.code === 200)
  },
  // 监狱管理-新增
  addPrison: params => {
    return service.postObj('/jails/addJails', params).then(res => res && res.code === 200)
  },
  // 监狱管理-编辑
  updatePrison: params => {
    return service.postObj('/jails/updateJails', params).then(res => res && res.code === 200)
  },
  // 监狱管理-详情
  getPrisonDetail: params => {
    return service.get('/jails/getJailsDetail', params).then(res => res && res.data)
  },
  // 意见反馈-列表
  getFeedbacks: params => {
    return service.get('/feedbacks/page', params).then(res => res && res.data)
  },
  // 意见反馈-下载
  downloadFeedbacks: params => {
    return service.get('/feedbacks/download', params, { responseType: 'blob' }).then(res => res)
  },
  // 广告管理-列表
  getAdvertisements: params => {
    return service.get('/advertisements/page', params).then(res => res && res.data)
  },
  // 广告管理-广告类型列表
  getAdvertisementTypes: () => {
    return service.get('/advertisements/getAdtypes').then(res => res && res.data)
  },
  // 广告管理-新增
  addAdvertisement: params => {
    return service.postObj('/advertisements/addAdvertisements', params).then(res => res && res.code === 200)
  },
  // 广告管理-上架/下架广告
  updateAdvertisementStatus: params => {
    return service.post('/advertisements/updateAdvertisementStatus', params).then(res => res && res.code === 200)
  },
  // 广告管理-删除
  deleteAdvertisement: params => {
    return service.post('/advertisements/deleteAdvertisement', params).then(res => res && res.code === 200)
  },
  // 广告管理-详情
  getAdvertisementDetail: params => {
    return service.get('/advertisements/getAdvertisementsDetail', params).then(res => res && res.data)
  },
  // 广告管理-编辑
  updateAdvertisement: params => {
    return service.postObj('/advertisements/updateAdvertisements', params).then(res => res && res.code === 200)
  },
  // 终端管理-新增
  addTerminal: params => {
    return service.postObj('/terminals/add', params).then(res => res && res.code === 200)
  },
  // 终端管理-列表
  getTerminals: params => {
    return service.get('/terminals/page', params).then(res => res && res.data)
  },
  // 终端管理-详情
  getTerminalDetail: params => {
    return service.get('/terminals/getTerminalsDetail', params).then(res => res && res.data)
  },
  // 终端管理-编辑
  updateTerminal: params => {
    return service.postObj('/terminals/edit', params).then(res => res && res.code === 200)
  },
  // 终端管理-启用/禁用
  enableTerminal: params => {
    return service.postObj('/terminals/enabled', params).then(res => res && res.code === 200)
  },
  // 版本管理-列表
  getVersions: params => {
    return service.get('/versions/page', params).then(res => res && res.data)
  },
  // 版本管理-编辑
  updateVersion: params => {
    return service.post('/versions/update', params).then(res => res && res.code === 200)
  },
  // 白名单管理-列表
  getWhitemembers: params => {
    return service.get('/whitenumbers/page', params).then(res => res && res.data)
  },
  // 白名单管理-检验手机号
  checkPhoneWhitemember: params => {
    return service.get(`/whitenumbers/checkPhone?phone=${ params }`).then(res => res && res.code === 200)
  },
  // 白名单管理-新增
  addWhitemember: params => {
    return service.post('/whitenumbers/insert', params).then(res => res && res.code === 200)
  },
  // 白名单管理-删除
  deleteWhitemember: params => {
    return service.post('/whitenumbers/delete', params).then(res => res && res.code === 200)
  },
  // 监区管理-列表
  getPrisonAreas: params => {
    return service.get('/prison_config/page', params).then(res => res && res.data)
  },
  // 监区管理-编辑
  updatePrisonArea: params => {
    return service.post('/prison_config/update', params).then(res => res)
  },
  // 监区管理-删除
  deletePrisonArea: params => {
    return service.post('/prison_config/delete', params).then(res => res && res.code === 200)
  },
  // 监区管理-新增
  addPrisonArea: params => {
    return service.post('/prison_config/add', params).then(res => res && res.code === 200)
  },
  // 监狱数据查询-监狱会见数据统计表-列表
  getMeetingStatics: params => {
    return service.get('/report/meetings', params)
  },
  // 监狱数据查询-外交官会见统计数据
  getDiplomatistDetail: params => {
    return service.get('/report/diplomats-meeting/details', params)
  }
  // 监狱管理-监狱基本信息-监狱是否可以修改监狱是否分监区状态
  // getBranchStatus: params => {
  //   return service.postObj('/jails/getBranchStatus', params)
  // }
}


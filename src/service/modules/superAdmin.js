import * as service from '../config/service'

export default {
  // 所有监狱
  getJails: () =>
    service.get('/jails/all').then(res => res).catch(err => err),

  // 日志-列表
  getAppLogs: params => service.
    get('/app_logs/page', params).
    then(res => res && res.data),

  // 监狱用户管理-列表 需要修改page初始值为0
  getPrisonUsers: params => service.
    get('/users/page', params).
    then(res => res && res.data),

  // 监狱用户管理-删除 租户管理员
  deletePrisonUser: params => service.
    remove(`/users/delete?id=${ params.id }`).
    then(res => res && res.code === 200),

  // 监狱用户管理-新增 租户管理员
  addPrisonUser: params => service.
    postObj('/users/add', params).
    then(res => res && res.code === 200),

  // 监狱用户管理-详情 租户管理员
  getPrisonUserDetail: params => service.
    get(`/users/edit?id=${ params }`).
    then(res => res && res.data),

  // 监狱用户管理-启用禁用 租户管理员
  enableOrDisablePrisonUser: params => service.
    put(`/users/enableOrDisable?id=${ params.id }&status=${ params.status }`).
    then(res => res && res.code === 200),

  // 家属汇款记录-列表
  getFamilyRemittance: params => service.
    get('/family_remit/list', params).
    then(res => res && res.data),

  // 监狱用户管理-编辑
  updatePrisonUser: params => service.
    putObj('/users/update', params).
    then(res => res && res.code === 200),

  // 监狱用户绑定手机号
  updatePrisonUserPhone: data => service.putObj('/users/updatephone', data),

  // 监狱管理-监狱列表
  getPrisons: params => service.
    get('/jails/page', params).
    then(res => res && res.data),

  // 监狱管理-租户列表
  getTenants: params => service.
    get('/jails/tenants', params).
    then(res => res && res.data),

  // 监狱管理-租户列表-绑定监狱
  createJailByBindTenant: params => service.
    postObj('/jails/createJailByBindTenant', params).
    then(res => res && res.code === 200),

  // 监狱管理-新增
  addPrison: params => service.
    postObj('/jails/addJails', params).
    then(res => res && res.code === 200),

  // 监狱管理-编辑
  updatePrison: params => service.
    postObj('/jails/updateJails', params).
    then(res => res && res.code === 200),

  // 监狱管理-详情
  getPrisonDetail: params => service.
    get('/jails/getJailsDetail', params).
    then(res => res && res.data),

  // 其他单位管理-列表
  getOtherOrgs: params => service.get('/other/org/page', params),

  // 意见反馈-列表
  getFeedbacks: params => service.
    get('/feedbacks/page', params).
    then(res => res && res.data),

  // 意见反馈-下载
  downloadFeedbacks: params => service.
    get('/feedbacks/download', params, { responseType: 'blob' }).
    then(res => res),

  // 广告管理-列表
  getAdvertisements: params => service.
    get('/advertisements/page', params).
    then(res => res && res.data),

  // 广告管理-广告类型列表
  getAdvertisementTypes: () => service.
    get('/advertisements/getAdtypes').
    then(res => res && res.data),

  // 广告管理-新增
  addAdvertisement: params => service.
    postObj('/advertisements/addAdvertisements', params).
    then(res => res && res.code === 200),

  // 广告管理-上架/下架广告
  updateAdvertisementStatus: params => service.
    post('/advertisements/updateAdvertisementStatus', params).
    then(res => res && res.code === 200),

  // 广告管理-删除
  deleteAdvertisement: params => service.
    post('/advertisements/deleteAdvertisement', params).
    then(res => res && res.code === 200),

  // 广告管理-详情
  getAdvertisementDetail: params => service.
    get('/advertisements/getAdvertisementsDetail', params).
    then(res => res && res.data),

  // 广告管理-编辑
  updateAdvertisement: params => service.
    postObj('/advertisements/updateAdvertisements', params).
    then(res => res && res.code === 200),

  // 终端管理-新增
  addTerminal: params => service.
    postObj('/terminals/add', params).
    then(res => res && res.code === 200),

  // 终端管理-列表
  getTerminals: params => service.
    get('/terminals/page', params).
    then(res => res && res.data),

  // 终端管理-详情
  getTerminalDetail: params => service.
    get('/terminals/getTerminalsDetail', params).
    then(res => res && res.data),

  // 终端管理-编辑
  updateTerminal: params => service.
    postObj('/terminals/edit', params).
    then(res => res && res.code === 200),

  // 终端管理-启用/禁用
  enableTerminal: params => service.
    postObj('/terminals/enabled', params).
    then(res => res && res.code === 200),

  // 终端管理-编辑终端别名
  updateTerminalName: params => service.
    postObj('/terminals/edit/terminalName', params).
    then(res => res),

  // 其他单位终端管理-列表
  getOtherTerminal: params => service.get('/otherTerminals/page', params),

  // 其他单位终端管理-详情
  getOtherTerminalDetail: id => service.get(`/otherTerminals/getTerminalsDetail?id=${ id }`),

  // 其他单位终端管理-新增 编辑
  addOtherTerminal: data => service.postObj('/otherTerminals/addOrEdit', data),

  // 其他单位终端管理-启用 停用
  enableOtherTerminal: data => service.postObj('/otherTerminals/enabled', data),

  // 终端呼叫终端详情-列表
  getTerminalCallTerminal: params => service.get('/terminalCallTerminal/page', params),

  // 根据单位类型查询单位名称
  // 0-监狱、1-司法局、2-司法所、3-律师事务所、4-心理咨询机构
  // 0-启用、1-禁用
  getOrgNames: (type, status) => service.get(`/terminalCallTerminal/orgNames?orgType=${ type }${ typeof status === 'undefined' ? '' : '&orgStatus=0' }`),

  // 查询分配的终端
  getTerminal: params => service.
    get('/terminals/getUsableTerminals', params).
    then(res => res && res.data),

  // 版本管理-列表
  getVersions: params => service.
    get('/versions/page', params).
    then(res => res && res.data),

  // 版本管理-编辑
  updateVersion: params => service.
    post('/versions/update', params).
    then(res => res && res.code === 200),

  // 家属白名单管理-列表
  getWhitemembers: params => service.
    get('/familyWhiteList/page', params).
    then(res => res && res.data),

  // 白名单管理-检验手机号
  checkPhoneWhitemember: params => service.
    get(`/whitenumbers/checkPhone?phone=${ params }`).
    then(res => res && res.code === 200),

  // 家属白名单管理-新增
  addWhitemember: params => service.
    post('/familyWhiteList/add', params).
    then(res => res && res.code === 200),

  // 家属白名单管理-删除
  deleteWhitemember: params => service.
    post('/familyWhiteList/delete', params).
    then(res => res && res.code === 200),

  // 家属白名单管理-编辑
  updateWhitemember: params => service.
    post('/familyWhiteList/update', params).
    then(res => res && res.code === 200),

  // 监区管理-列表
  getPrisonAreas: params => service.
    get('/prison_config/page', params).
    then(res => res && res.data),

  // 监区管理-编辑
  updatePrisonArea: params => service.
    post('/prison_config/update', params).
    then(res => res),

  // 监区管理-删除
  deletePrisonArea: params => service.
    post('/prison_config/delete', params).
    then(res => res && res.code === 200),

  // 监区管理-新增
  addPrisonArea: params => service.
    post('/prison_config/add', params).
    then(res => res && res.code === 200),

  // 监区管理-查询 分监区-楼栋-楼层
  queryPrisonArea: params => service.
    get('/prison_config/detailMany', params).
    then(res => res),

  // 监区管理-查询监区最大层级
  queryPrisonAreaMaxlevel: params => service.
    get('/prison_config/getMaxLevel').
    then(res => res),

  // 监狱数据查询-监狱会见数据统计表-列表
  getMeetingStatics: params => service.get('/report/prisonCallData', params),

  // 监狱数据查询-外交官会见统计数据
  getDiplomatistDetail: params => service.
    get('/report/diplomats-meeting/details', params).
    then(res => res.data),

  getDiplomatist: params => service.get('/diplomats/org-list', params),

  // 监狱管理-监狱基本信息-监狱是否可以修改监狱是否分监区状态
  // getBranchStatus: params => {
  //   return service.postObj('/jails/getBranchStatus', params)
  // }

  // 监狱管理-人脸识别配置-获取
  getFaceRecognitionConfigs: params => service.
    get('/dict', params).
    then(response => response && response.data),

  // 监狱管理-人脸识别配置-更新
  updateFaceRecognitionConfigs: params => service.putObj('/dict', params),

  // 监狱操作指引存草稿
  addBusGuide: params => service.postObj('/business/guide', params),

  // 监狱操作指引编辑
  updateBusGuide: params => service.putObj('/business/guide', params),

  // 监狱操作指引查询列表
  businessList: params => service.
    get('/business/guide/findPage', params).
    then(res => res.data),

  // 监狱操作指引上线
  businessOnLine: id => service.
    post(`/business/guide/online/${ id }`).
    then(res => res.data),

  // 监狱操作指引下线
  businessOffLine: id => service.
    post(`/business/guide/offline/${ id }`).
    then(res => res.data)
}


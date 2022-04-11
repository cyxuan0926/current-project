import * as service from '../config/service'

export default {
  // 远程会见-常规配置-详情
  getRemoteUsualConfig: params => service.get('/jails/normal_config', params).then(res => res && res.data),

  // 远程会见-常规配置-编辑
  updateRemoteUsualConfig: params => service.postObj('/jails/normal_config/update', params).then(res => res && res.code === 200),

  // 远程会见-周末配置-详情
  getRemoteWeekendConfig: params => service.get('/jails/weekend_config', params).then(res => res && res.data),

  // 远程会见-周末配置-编辑
  updateRemoteWeekendConfig: params => service.postObj('/jails/weekend_config/update', params).then(res => res && res.code === 200),

  // 远程会见-特殊配置-详情
  getRemoteSpecialConfigOld: params => service.get('/jails/special_configs/list', params).then(res => res && res.data),

  // 远程会见-特殊配置-新增
  addRemoteSpecialConfig: params => service.postObj('/jails/special_configs/add', params).then(res => res && res.data),

  // 远程会见-特殊配置-编辑
  updateRemoteSpecialConfig: params => service.postObj('/jails/special_configs/update', params).then(res => res && res.code === 200),

  // 远程会见-特殊配置-删除
  deleteRemoteSpecialConfig: params => service.post('/jails/special_configs/delete', params).then(res => res && res.code === 200),

  // 会见统计-sh监区统计
  getPrisonReportList: params => service.get('/report/newPrisonAreaReportPage', params).then(res => res && res.data),

  getNewPrisonReportList: params => service.get('/report/newPrisonReportPage', params).then(res => res && res.data),

  // 查询监区会见统计-监狱会见
  getPrisonReportListJails: params => service.get('/report/prisonReport/findPage', params).then(res => res && res.data),

  // 查询会见非大陆统计表-监狱会见
  getIslandList: params => service.get('/report/meetings/non-mainland', params).then(res => res && res.data),

  // 会见统计-监狱会见-所有监狱
  getPrisonReportListAll: params => service.get('/report/findPage', params).then(res => res && res.data),

  // 会见统计-监狱会见详情
  getPrisonReportDetail: params => service.get('/report/findDetailPage', params).then(res => res && res.data),

  // 会见统计-监狱会见详情-所有监狱
  getPrisonReportDetailAll: params => service.get('/report/findPages', params).then(res => res && res.data),

  // 会见统计-监区会见
  getPrisonAreaReportList: params => service.get('/report/newPrisonAreaReportPage', params).then(res => res && res.data),

  // 会见统计-监区会见-所有监狱
  getPrisonAreaReportListAll: params => service.get('/report/newFindReportPage', params).then(res => res && res.data),

  // 会见节约成本统计-个人维度
  getMeetingCostSavingIndividual: params => service.get('/meetings/cost-saving/statistics/personal-dimension', params).then(res => res && res.data),

  // 会见节约成本统计-监区维度
  getMeetingCostSavingPrisonArea: params => service.get('/meetings/cost-saving/statistics/prisonarea-dimension', params).then(res => res && res.data),

  // 会见节约成本统计-监狱维度
  getMeetingCostSavingPrison: params => service.get('/meetings/cost-saving/statistics/jail-dimension', params).then(res => res && res.data),

  // 监狱数据查询-远程会见对账报表
  getMeetingCallRecords: params => service.get('/meetingCallRecords/page', params).then(res => res && res.data),

  // 会见统计-狱警家属免费会见纪录
  getPoliceFamilyFreeMeetings: params => service.get('/freeMeetings/page-police', params),

  // 可视电话统计报表-导出excel
  exportMeetingStatistics: params => service.get('/download/province/export', params, { responseType: 'blob' }).then(res => res && res.data),

  // 初级授权
  firstLevelAuthorize: inputs => {
    const { url, params } = inputs

    return service.post(url, params)
  },

  // 监狱配置 - 获取收费配置
  getMeetingChargeTemplate: params => service.get('/jails/getMeetingChargeTemplate', params),

  // 监狱配置 - 设置收费配置
  setMeetingChargeTemplate: params => service.postObj('/jails/setMeetingChargeTemplate', params),

  // 监狱配置 - 亲情电话收费配置
  getConfiguractionAndtemplate: params => service.get('/familyPhoneCharge/getConfigurationsAndTemplate', params),

  // 监狱配置 - 亲情电话收费配置 - 修改收费配置模板
  editTemplate: params => service.postObj('/familyPhoneCharge/editTemplate', params),

  // 监狱配置 - 亲情电话收费配置 - 新增收费配置模板
  addTemplate: params => service.postObj('/familyPhoneCharge/addTemplate', params),

  // 监狱配置 - 亲情电话收费配置 - 修改参数配置
  editConfigurations: params => service.postObj('/familyPhoneCharge/editConfigurations', params),

  // 监区管理 - 获取监狱最大层级数
  getPrisonAreaMaxLevel: () => service.get('/prison_config/getMaxLevel'),

  // 监区管理 - 获取监区层级结构
  getDetailMany: params => service.get('/prison_config/detailMany', params),

  // 可视电话统计 - 亲情电话统计
  getPagedFreeMeetingsFamilyPhone: params => service.get('/freeMeetings/page-familyPhone', params),

  // 可视电话申请 - 通话异常统计(ywt_admin/xxx_sh/xxx_sadmin)
  getUnusualMeetingPage: args => {
    const { url, params } = args

    return service.get(url, params)
  },

  // 服刑人员信息管理 - 更换监狱
  changePrisonJailOrBatch: args => {
    const { url, params } = args

    return service.post(url, params)
  },

  // 判断监狱是否开启了会见楼接口
  getJailsMeetingFloorStatus: jailId => service.get('/jails/checkOpenMeetingFloor', { jailId }),

  // 服刑人员信息管理-修改会见/短信/亲情电话次数
  updatePrisonerTime: input => {
    const { url, params } = input

    return service.post(url, params).then(res => res && res.code === 200)
  },

  // 调换监狱 - 接收
  acceptPrisoners: params => service.post('/prisoners/prisonersAccept', params),

  // 调换监狱 - 取消
  abortChangePrisoners: params => service.post('/prisoners/prisonersChangeCancle', params),

  // 服刑人员 - 转监标签页列表
  getTransferOutPrisonersPagedData: args => {
    const { url, params } = args

    return service.get(url, params)
  },

  // 家属信息管理 - 删除警员家属信息
  deletePoliceFamily: phoneNumber => service.get(`/police/delete/${ phoneNumber }`),

  // 实地探视 - 导出excel
  exportVisitExcel: inputs => {
    const {
      methods = 'post',
      params,
      url
    } = inputs
    return service[methods](url, params, { responseType: 'blob' }).then(response => response && response.data)
  },

  // 根据监狱/监区/权限 查询终端用户
  getTerminalUsersByPrisonConfigId: params => service.get('/jails/getUserListByPrisonConfigId', params),

  // 亲情短信收费配置
  getConfigMessageList: params => service.get('/configurationsFamilyMessage/messageList', params).then(res => res && res.data),

  //  亲情短信收费配置更新
  editMessageList: params => service.postObj('/configurationsFamilyMessage/editMessage', params),

  // 监狱配置 - 会见次数配置
  getConfigurationsFamilyMeeting: params => service.get('/configurationsFamilyMeeting/jailId', params),

   // 监狱配置-亲情电话会见配置
   setConfigurationsFamilyMeeting: data => service.
    putObj(`/configurationsFamilyMeeting/jailId/level?jailId=${ data.jailId }&level=${ data.level }&accessTime=${ data.accessTime }`).
    then(res => res && res.code === 200)
,
}

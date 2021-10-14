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
  // 会见统计-sh监区统计
  getPrisonReportList: params => {
    return service.get('/report/newPrisonAreaReportPage', params).then(res => res && res.data)
  },
  getNewPrisonReportList: params => {
    return service.get('/report/newPrisonReportPage', params).then(res => res && res.data)
  },
  // 查询监区会见统计-监狱会见
  getPrisonReportListJails: params => {
    return service.get('/report/prisonReport/findPage', params).then(res => res && res.data)
  },
  // 查询会见非大陆统计表-监狱会见
  getIslandList: params => {
    return service.get('/report/meetings/non-mainland', params).then(res => res && res.data)
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
    return service.get('/report/findPages', params).then(res => res && res.data)
  },
  // 会见统计-监区会见
  getPrisonAreaReportList: params => {
    return service.get('/report/newPrisonAreaReportPage', params).then(res => res && res.data)
  },
  // 会见统计-监区会见-所有监狱
  getPrisonAreaReportListAll: params => {
    return service.get('/report/newFindReportPage', params).then(res => res && res.data)
  },
  // 会见节约成本统计-个人维度
  getMeetingCostSavingIndividual: params => {
    return service.get('/meetings/cost-saving/statistics/personal-dimension', params).then(res => res && res.data)
  },
  // 会见节约成本统计-监区维度
  getMeetingCostSavingPrisonArea: params => {
    return service.get('/meetings/cost-saving/statistics/prisonarea-dimension', params).then(res => res && res.data)
  },
  // 会见节约成本统计-监狱维度
  getMeetingCostSavingPrison: params => {
    return service.get('/meetings/cost-saving/statistics/jail-dimension', params).then(res => res && res.data)
  },
  // 监狱数据查询-远程会见对账报表
  getMeetingCallRecords: params => {
    return service.get('/meetingCallRecords/page', params).then(res => res && res.data)
  },

  // 会见统计-狱警家属免费会见纪录
  getPoliceFamilyFreeMeetings: params => {
    return service.get('/freeMeetings/page-police', params)
  },

  // 可视电话统计报表-导出excel
  exportMeetingStatistics: params => {
    return service.get('/download/province/export', params, { responseType: 'blob' }).then(res => res && res.data)
  },

  // 初级授权
  firstLevelAuthorize: inputs => {
    const { url, params } = inputs

    return service.post(url, params)
  },

  // 监狱配置 - 获取收费配置
  getMeetingChargeTemplate: params => {
    return service.get('/jails/getMeetingChargeTemplate', params)
  },

  // 监狱配置 - 设置收费配置
  setMeetingChargeTemplate: params => {
    return service.postObj('/jails/setMeetingChargeTemplate', params)
  },

  // 监狱配置 - 亲情电话收费配置
  getConfiguractionAndtemplate: params => {
    return service.get('/familyPhoneCharge/getConfigurationsAndTemplate', params)
  },
  // 监狱配置 - 亲情电话收费配置 - 修改收费配置模板
  editTemplate: params => {
    return service.postObj('/familyPhoneCharge/editTemplate', params)
  },
  // 监狱配置 - 亲情电话收费配置 - 新增收费配置模板
  addTemplate: params => {
    return service.postObj('/familyPhoneCharge/addTemplate', params)
  },
  // 监狱配置 - 亲情电话收费配置 - 修改参数配置
  editConfigurations: params => service.postObj('/familyPhoneCharge/editConfigurations', params),

  // 监区管理 - 获取监狱最大层级数
  getPrisonAreaMaxLevel: () => {
    return service.get('/prison_config/getMaxLevel')
  },

  // 监区管理 - 获取监区层级结构
  getDetailMany: params => {
    return service.get('/prison_config/detailMany', params)
  },

  // 可视电话统计 - 亲情电话统计
  getPagedFreeMeetingsFamilyPhone: params => {
    return service.get('/freeMeetings/page-familyPhone', params)
  },

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
  getJailsMeetingFloorStatus: jailId => {
    return service.get('/jails/checkOpenMeetingFloor', { jailId })
  },

  // 服刑人员信息管理-修改会见/短信/亲情电话次数
  updatePrisonerTime: input => {
    const { url, params } = input

    return service.post(url, params).then(res => res && res.code === 200)
  },

  // 调换监狱 - 接收
  acceptPrisoners: params => {
    return service.post('/prisoners/prisonersAccept', params)
  },

  // 调换监狱 - 取消
  abortChangePrisoners: params => {
    return service.post('/prisoners/prisonersChangeCancle', params)
  },

  // 服刑人员 - 转监标签页列表
  getTransferOutPrisonersPagedData: args => {
    const { url, params } = args

    return service.get(url, params)
  },

  // 家属信息管理 - 删除警员家属信息
  deletePoliceFamily: phoneNumber => {
    return service.get(`/police/delete/${ phoneNumber }`)
  },

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
  getTerminalUsersByPrisonConfigId: params => {
    return service.get('/jails/getUserListByPrisonConfigId', params)
  },
  // 亲情短信收费配置
  getConfigMessageList: params => {
    return service.get('/configurationsFamilyMessage/messageList', params).then(res => res && res.data)
  },
  //  亲情短信收费配置更新
  editMessageList: params => {
    return service.postObj('/configurationsFamilyMessage/editMessage', params)
  }
}

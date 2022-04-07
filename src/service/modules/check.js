import * as service from '../config/service'

export default {
  // 家属注册管理-列表
  getRegistrations: params => service.get('/registrations/page', params).then(res => res && res.data),

  // 家属注册管理-详情
  getRegistrationsDetail: params => service.get('/registrations/getDetail', params).then(res => res && res.data),

  //  家属注册下载
  exportFamilyRegJails: params => service.get('/download/exportFamilyRegJails', params, { responseType: 'blob' }).then(res => res && res.data),

  // 家属注册管理-未审核-会见告知书详情
  getRegistrationNotificationDetail: params => service.get('/notification/detail-registration', params).then(res => res && res.data),

  // 家属注册管理-列表-所有监狱
  getRegistrationsAll: params => service.get('/registrations/findPage', params).then(res => res && res.data),

  // 家属注册管理-授权
  authorizeRegistrations: params => service.post('/registrations/authorize', params).then(res => res && res.code === 200),

  // 家属注册-下载电子关系证明
  downloadRelationshipFile: params => service.postObj('/registrations/getRelationshipFile', params, { responseType: 'blob' }),

  // 获取驳回编辑列表 家属注册管理
  getRejectEdit: params => service.get('/meetingsReviewWord/get', params).then(res => res && res.data),

  // 保存修改驳回编辑列表 家属注册管理
  setRejectEdit: params => service.postObj('/meetingsReviewWord/edit', params).then(res => res && res.code === 200),

  // 监狱配置管理中的家属关系更新
  updateRelationshipTemplate: params => service.post('/jails/updateRelationshipTemplate', params).then(res => res && res.code === 200),

  // 家属注册管理-一级授权
  authorizeFirstLevel: params => service.post('/registrations/firstLevelAuthorize', params),

  // 家属会见申请-列表
  getMeetings: params => service.get('/meetings/page', params).then(res => res && res.data),

  // 外交领事官员可视电话申请-列表
  getMeetingsDiplomats: params => service.get('/meetings/diplomats/page', params).then(res => res && res.data),

  // 外交领事官员可视电话申请-列表
  getMeetingsDiplomatsDetail: params => service.get('/meetings/diplomats/familyDetail', params).then(res => res && res.data),

  // 外交领事官员可视电话授权获取审批图
  getApprovalImageUrl: params => service.get('/meetings/getApprovalImageUrl', params).then(res => res && res.data),

  // 外交领事官员可视电话 查询监狱家属可视电话时间段
  getMeetingsDiplomatsfamilyMeetingTimes: params => service.get('/meetings/diplomats/familyMeetingTimes', params).then(res => res && res.data),

  // 外交领事官员根据当前时间获取终端-列表
  getMeetingsUsableTerminal: params => service.get('/meetings/diplomats/usableTerminal', params).then(res => res && res.data),

  // 外交领事官员根据同意提交
  // return service.post('/meetings/authorize', params).then(res => res && res.code === 200)
  authorizeDiplomatsMeeting: params => service.post('/meetings/diplomats/authorize', params),

  // 家属会见申请-列表-所有监狱
  getMeetingsAll: params => service.get('/meetings/findPage', params).then(res => res && res.data),

  // 家属会见申请-家属详情
  getMeetingsFamilyDetail: params => service.get('/meetings/familyDetail', params).then(res => res && res.data),

  // 家属会见申请-会见变更详情 //详情接口修改
  getMeettingsChangelogDetail: params => service.get('/meetings/meeting-changelog', params).then(res => res && res.data),

  // 家属会见申请-会见详情
  getMeettingsDetail: params => service.get('/meetings/detail', params).then(res => res && res.data.meetings),

  // 家属会见申请-授权
  // return service.post('/meetings/authorize',params).then(res => res && res.code === 200)
  authorizeMeeting: params => service.post('/meetings/authorize', params),

  //  可视电话申请-一级审批
  firstLevelSubmitMeeting: params => service.post('/meetings/submitMeeting', params),

  // 家属会见申请-获取会见信息
  getMeetingConfigs: params => service.get('/meetings/adjustment', params),

  // 家属会见申请-获取会见信息
  getMeetingSeparateArea: params => service.get('/meetings/separateArea', params).then(res => res),

  // 家属会见申请-调整
  adjustMeeting: params => service.postObj(`/meetings/adjustMeeting`, params).then(res => res && res.code === 200),

  // 家属会见申请-撤回
  withdrawMeeting: params => service.post('/meetings/withdraw', params).then(res => res && res.code === 200),

  // 添加异常通话的备注信息
  addUnusualRemark: params => service.post('/meetings/unusualRemark', params).then(res => res && res.code === 200),

  // 实地探监管理-列表
  getVisits: params => service.get('/prisoner_visits/page', params).then(res => res && res.data),

  // 实地探监管理-导出
  exportVisits: params => service.get('/prisoner_visits/exportPrisonerVisits', params, { responseType: 'blob' }).then(res => res && res.data),

  // 实地探监管理 admin-列表
  getVisitsByAdmin: params => service.get('/prisoner_visits/findPage', params).then(res => res && res.data),

  // 实地探监管理 admin-导出
  exportVisitsByAdmin: params => service.get('/prisoner_visits/exportAdminPrisonerVisits', params, { responseType: 'blob' }).then(res => res && res.data),

  // 实地探监管理-已取消
  getCanceledVisit: params => service.get('/prisoner_visits/findCanceled', params).then(res => res && res.data),

  // 实地探监管理-授权
  authorizeVisit: params => service.post('/prisoner_visits/auth', params).then(res => res && res.code === 200),

  // 实地探监管理-授权 有流程节点
  authorizeVisitByProcess: params => service.post('/prisoner_visits/authvisit', params),

  // 实地探监管理-查询家属详情
  getVisitsFamilyDetail: params => service.get('/prisoner_visits/familyDetail', params),

  // 实地探监管理-撤回
  withdrawVisit: params => service.post('/prisoner_visits/withdraw', params).then(res => res && res.code === 200),

  // 实地探监管理-获取实地会见配置信息
  getVisitsConfigDetail: jailId => service.get(`/prisoner_visits/configDetail?jailId=${jailId}`),

  // 实地探监管理-获取实地会见配置时间表
  getVisitsConfigMeetingtime: id => service.get(`/prisoner_visits/query-meettime-config?id=${id}`),

  // 实地探监管理-获取实地会见状态变更详情
  getVisitsChangelog: id => service.get(`/prisoner_visits/visit-changelog?visitId=${id}`),

  // 监狱长信箱-列表
  getMailboxes: params => service.get('/mailboxes/page', params).then(res => res && res.data),

  // 监狱长信箱-详情
  getMailbox: params => service.get(`/mailboxes/jailReply?id=${params}`).then(res => res && res.data),

  // 监狱长信箱-回复
  mailboxReply: params => service.post('/mailboxes/reply', params).then(res => res && res.code === 200),

  // 服刑人员信息管理-列表
  getPrisoners: params => service.get('/prisoners/page', params).then(res => res && res.data),

  // 服刑人员信息管理-列表-所有监狱
  getPrisonersAll: params => service.get('/prisoners/findPage', params).then(res => res && res.data),

  // 服刑人员信息管理-加入黑名单
  addPrisonerBlacklist: params => service.postFile('/blacklists/addPrisonerBlacklist', params).then(res => res && res.code === 200),

  // 服刑人员信息管理-移出黑名单
  removePrisonerBlacklist: params => service.postFile('/blacklists/removePrisonerBlacklist', params).then(res => res && res.code === 200),

  // 服刑人员信息管理-会见告知书-详情
  getNotification: params => service.get('/notification/detail', params).then(res => res.data),

  // 服刑人员信息管理-会见告知书-编辑
  updateNotification: params => service.post('/notification/update', params).then(res => res && res.code === 200),

  // 服刑人员信息管理-会见告知书-新增
  addNotification: params => service.post('/notification/add', params).then(res => res && res.data),

  // 服刑人员信息管理-会见告知书-家属列表
  getNotificationFamilies: params => service.get('/notification/families', params).then(res => res && res.data),

  // 服刑人员信息管理-批量更换监区
  changePrisonAreaBatch: params => service.post('/prisoners/changePrisonAreaBatch', params),

  // 家属信息管理-列表
  getFamilies: ({ url = '/families/page', params }) => service.get(url, params).then(res => res && res.data),

  // 家属信息管理-详情
  getFamilyDetail: params => service.get('/families/basicInfo', params).then(res => res && res.data),

  // 家属信息管理-加入黑名单
  addFamilyBlacklist: params => service.postFile('/blacklists/addFamilyBlacklist', params).then(res => res && res.code === 200),

  // 家属信息管理-移出黑名单
  removeFamilyBlacklist: params => service.postFile('/blacklists/removeFamilyBlacklist', params).then(res => res && res.code === 200),

  // 家属信息管理-狱警家属信息
  getPoliceFamilies: params => service.get('/families/findPolicePage', params),

  // 数据管理-罪犯数据导入-上传到服务器
  importPrisoner: params => service.post('/prisoners/processing', params, { timeout: 0 }).then(res => res && res.data),

  // 数据管理-狱政科罪犯数据导入-上传到服务器
  importPrisonerYZK: params => service.post('/prisoners/processingYzk', params, { timeout: 0 }).then(res => res && res.data),

  // 数据管理-刑期变动数据导入-上传到服务器
  importPrisonTerm: params => service.get('/prison_terms/processing', params).then(res => res && res.data),

  // 会见统计-远程免费会见纪录
  getFreeMeetings: params => {
    return service.get('/freeMeetings/page', params).then(res => res && res.data)
  },
  // 家属免费通话记录-导出
  familyfreecall: params => service.get('/freeMeetings/export', params, { responseType: 'blob' }).then(res => res && res.data),
  // 狱警免费通话记录-导出
  freecallsfromprisonguards: params => service.get('/freeMeetings/police/export', params, { responseType: 'blob' }).then(res => res && res.data),
  
  // 数据管理-上传并解析
  uploadAnalyticExcel: params => service.postFile(params.url, params.values).then(res => res && Object.assign(res.data, { type: params.type })),

  // 数据管理-导入解析成功的数据
  importSuccessfulAnalysisExcel: params => service.post(params.url, { path: params.path }).then(res => res && Object.assign(res.data, { type: params.type })),

  // 数据管理 - 下载罪犯信息导入Excel模板
  // downloadPrisonTemplate: params => {
  //   return service.get('/download/downloadfile', params, { responseType: 'blob' }).then(res => res.status === 200 && res)
  // },
  //  导入数据详情列表-服刑人员零花钱管理列表
  getPrisonersPocketMoney: params => service.get('/pocket_money/page', params).then(res => res && res.data),

  // 服刑人员信息管理 - 监区配置
  getPrisonConfigs: params => service.get('/prison_config/getPrisonConfigs', params).then(res => res && res.data),

  // 服刑人员信息管理 - 更换监区
  changePrisonArea: params => service.post('/prisoners/changePrisonArea', params).then(res => res),

  // 服刑人员信息管理 - 删除罪犯
  deletePrisoners: params => service.post('/prisoners/deletePrison', params).then(res => res && res.code === 200),

  // 服刑人员信息管理 - 新增罪犯
  addPrionser: params => service.postObj('/prisoners/addPrison', params).then(res => res && res.code === 200),

  // 服刑人员信息管理 - 人脸驳回
  rejectPrisonerFaceUrl: prisonerId => service.post('/prisoners/rejectFaceUrl', { prisonerId }),

  // 导入数据详情列表-服刑人员狱内消费情况列表
  getPrisonersInsideJailsCosts: params => service.get('/prisonerConsume/page', params).then(res => res && res.data),

  //  导入数据详情列表-罪犯刑期变动信息列表
  getPrisonTerms: params => service.get('/prison_terms/page', params).then(res => res && res.data),

  // 导入数据详情列表-罪犯奖励惩罚信息列表
  getPrisonerRewardPunishments: params => service.get('/prisoner_reward_punishments/page', params).then(res => res && res.data),

  // 会见申请管理-远程会见申请-批量审核授权
  authorizeBatchMeetings: params => service.post('/meetings/batchAuthorize', params),

  // 会见申请管理-远程会见申请-单条审核获取审核时间段
  getMeetingTimes: params => service.get('/meetings/showMeetingTimes', params),

  // 会见申请管理-远程会见申请-单条审核通过
  authorizeSingleMeeting: params => service.post('/meetings/singleAuthorize', params),

  // 会见申请管理 - 审核通过 - 选择时间段
  meetingSelectAuthorize: params => service.post('/meetings/selectAuthorize', params),

  // 会见申请管理 - 审核通过 - 自定义特殊时间段
  meetingSelectOtherAuthorize: params => service.post('/meetings/allotOtherMeetingTime', params),

  // 情亲会见申请管理-终端会见配置时间列表
  getMeetTimeConfig: params => service.get('/meetings/query-meettime-config', params).then(res => res && res.data),

  // 监狱配置管理查询
  getMeetDeploy: params => service.get('/jails/getAutoAuthorizeMeeting', params).then(res => res && res),

  // 监狱配置管理更新
  getMeetDeployUpdate: params => service.post('/jails/updateAutoAuthorizeMeeting', params).then(res => res && res.data),

  // 监狱配置 - 更新亲情短信次数
  updateFamilyMessageLevelNum: params => service.postObj('/configurationsFamilyMessage/updateLevelNum', params)
}

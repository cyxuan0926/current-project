import * as service from '../config/service'

export default {
  // 家属注册管理-列表
  getRegistrations: params => {
    return service.get('/registrations/page', params).then(res => res && res.data)
  },
  // 家属注册管理-详情
  getRegistrationsDetail: params => {
    return service.get('/registrations/getDetail', params).then(res => res && res.data)
  },
  // 家属注册管理-未审核-会见告知书详情
  getRegistrationNotificationDetail: params => {
    return service.get('/notification/detail-registration', params).then(res => res && res.data)
  },
  // 家属注册管理-列表-所有监狱
  getRegistrationsAll: params => {
    return service.get('/registrations/findPage', params).then(res => res && res.data)
  },
  // 家属注册管理-授权
  authorizeRegistrations: params => {
    return service.post('/registrations/authorize', params).then(res => res && res.code === 200)
  },

  // 家属注册-下载电子关系证明
  downloadRelationshipFile: params => {
    return service.postObj('/registrations/getRelationshipFile', params, { responseType: 'blob' })
  },
   // 获取驳回编辑列表 家属注册管理
   getRejectEdit: params => {
    return service.get('/meetingsReviewWord/get', params).then(res => res && res.data)
  },
  // 保存修改驳回编辑列表 家属注册管理
  setRejectEdit: params => {
    return service.postObj('/meetingsReviewWord/edit', params).then(res => res && res.code === 200)
  },

  // 家属注册管理-一级授权
  authorizeFirstLevel: params => {
    return service.post('/registrations/firstLevelAuthorize', params)
  },

  // 家属会见申请-列表
  getMeetings: params => {
    return service.get('/meetings/page', params).then(res => res && res.data)
  },
  // 外交领事官员可视电话申请-列表
  getMeetingsDiplomats: params => {
    return service.get('/meetings/diplomats/page', params).then(res => res && res.data)
  },
  // 外交领事官员可视电话申请-列表
  getMeetingsDiplomatsDetail: params => {
    return service.get('/meetings/diplomats/familyDetail', params).then(res => res && res.data)
  },
  // 外交领事官员可视电话授权获取审批图
  getApprovalImageUrl: params => {
    return service.get('/meetings/getApprovalImageUrl', params).then(res => res && res.data)
  },
  // 外交领事官员可视电话 查询监狱家属可视电话时间段
  getMeetingsDiplomatsfamilyMeetingTimes: params => {
    return service.get('/meetings/diplomats/familyMeetingTimes', params).then(res => res && res.data)
  },
  // 外交领事官员根据当前时间获取终端-列表
  getMeetingsUsableTerminal: params => {
    return service.get('/meetings/diplomats/usableTerminal', params).then(res => res && res.data)
  },
  // 外交领事官员根据同意提交
  authorizeDiplomatsMeeting: params => {
    // return service.post('/meetings/authorize', params).then(res => res && res.code === 200)
    return service.post('/meetings/diplomats/authorize', params)
  },
  // 家属会见申请-列表-所有监狱
  getMeetingsAll: params => {
    return service.get('/meetings/findPage', params).then(res => res && res.data)
  },
  // 家属会见申请-家属详情
  getMeetingsFamilyDetail: params => {
    return service.get('/meetings/familyDetail', params).then(res => res && res.data)
  },
  // 家属会见申请-会见变更详情 //详情接口修改
  getMeettingsChangelogDetail: params => {
    return service.get('/meetings/meeting-changelog', params).then(res => res && res.data)
    },
    // 家属会见申请-会见详情
  getMeettingsDetail: params => {
      return service.get('/meetings/detail', params).then(res => res && res.data.meetings)
    },
  // 家属会见申请-授权
  authorizeMeeting: params => {
    // return service.post('/meetings/authorize',params).then(res => res && res.code === 200)
    return service.post('/meetings/authorize', params)
  },

  //  可视电话申请-一级审批
  firstLevelSubmitMeeting: params => {
    return service.post('/meetings/submitMeeting', params)
  },

  // 家属会见申请-获取会见信息
  getMeetingConfigs: params => {
    return service.get('/meetings/adjustment', params)
  },
  // 家属会见申请-获取会见信息
  getMeetingSeparateArea: params => {
    return service.get('/meetings/separateArea', params).then(res => res)
  },
  // 家属会见申请-调整
  adjustMeeting: params => {
    return service.postObj(`/meetings/adjustMeeting`, params).then(res => res && res.code === 200)
  },
  // 家属会见申请-撤回
  withdrawMeeting: params => {
    return service.post('/meetings/withdraw', params).then(res => res && res.code === 200)
  },
   // 添加异常通话的备注信息
   addUnusualRemark: params => {
    return service.post('/meetings/unusualRemark', params).then(res => res && res.code === 200)
  },
  // 实地探监管理-列表
  getVisits: params => {
    return service.get('/prisoner_visits/page', params).then(res => res && res.data)
  },
  // 实地探监管理-已取消
  getCanceledVisit: params => {
    return service.get('/prisoner_visits/findCanceled', params).then(res => res && res.data)
  },
  // 实地探监管理-授权
  authorizeVisit: params => {
    return service.post('/prisoner_visits/auth', params).then(res => res && res.code === 200)
  },
  // 实地探监管理-撤回
  withdrawVisit: params => {
    return service.post('/prisoner_visits/withdraw', params).then(res => res && res.code === 200)
  },
  // 监狱长信箱-列表
  getMailboxes: params => {
    return service.get('/mailboxes/page', params).then(res => res && res.data)
  },
  // 监狱长信箱-详情
  getMailbox: params => {
    return service.get(`/mailboxes/jailReply?id=${ params }`).then(res => res && res.data)
  },
  // 监狱长信箱-回复
  mailboxReply: params => {
    return service.post('/mailboxes/reply', params).then(res => res && res.code === 200)
  },
  // 服刑人员信息管理-列表
  getPrisoners: params => {
    return service.get('/prisoners/page', params).then(res => res && res.data)
  },
  // 服刑人员信息管理-列表-所有监狱
  getPrisonersAll: params => {
    return service.get('/prisoners/findPage', params).then(res => res && res.data)
  },
  // 服刑人员信息管理-修改会见次数
  updateAccessTime: params => {
    return service.post('/prisoners/updateAccessTime', params).then(res => res && res.code === 200)
  },
  // 服刑人员信息管理-加入黑名单
  addPrisonerBlacklist: params => {
    return service.postFile('/blacklists/addPrisonerBlacklist', params).then(res => res && res.code === 200)
  },
  // 服刑人员信息管理-移出黑名单
  removePrisonerBlacklist: params => {
    return service.postFile('/blacklists/removePrisonerBlacklist', params).then(res => res && res.code === 200)
  },
  // 服刑人员信息管理-会见告知书-详情
  getNotification: params => {
    return service.get('/notification/detail', params).then(res => res.data)
  },
  // 服刑人员信息管理-会见告知书-编辑
  updateNotification: params => {
    return service.post('/notification/update', params).then(res => res && res.code === 200)
  },
  // 服刑人员信息管理-会见告知书-新增
  addNotification: params => {
    return service.post('/notification/add', params).then(res => res && res.data)
  },
  // 服刑人员信息管理-会见告知书-家属列表
  getNotificationFamilies: params => {
    return service.get('/notification/families', params).then(res => res && res.data)
  },

  // 服刑人员信息管理-批量更换监区
  changePrisonAreaBatch: params => {
    return service.post('/prisoners/changePrisonAreaBatch', params)
  },

  // 家属信息管理-列表
  getFamilies: params => {
    return service.get('/families/page', params).then(res => res && res.data)
  },
  // 家属信息管理-详情
  getFamilyDetail: params => {
    return service.get('/families/basicInfo', params).then(res => res && res.data)
  },
  // 家属信息管理-加入黑名单
  addFamilyBlacklist: params => {
    return service.postFile('/blacklists/addFamilyBlacklist', params).then(res => res && res.code === 200)
  },
  // 家属信息管理-移出黑名单
  removeFamilyBlacklist: params => {
    return service.postFile('/blacklists/removeFamilyBlacklist', params).then(res => res && res.code === 200)
  },

  // 家属信息管理-狱警家属信息
  getPoliceFamilies: params => {
    return service.get('/families/findPolicePage', params)
  },

  // 数据管理-罪犯数据导入-上传到服务器
  importPrisoner: params => {
    return service.post('/prisoners/processing', params, { timeout: 0 }).then(res => res && res.data)
  },
  // 数据管理-狱政科罪犯数据导入-上传到服务器
  importPrisonerYZK: params => {
    return service.post('/prisoners/processingYzk', params, { timeout: 0 }).then(res => res && res.data)
  },
  // 数据管理-刑期变动数据导入-上传到服务器
  importPrisonTerm: params => {
    return service.get('/prison_terms/processing', params).then(res => res && res.data)
  },
  // 数据管理-罪犯奖惩数据导入-上传到服务器
  importPrisonerRewardPunishment: params => {
    return service.get('/prisoner_reward_punishments/processing', params).then(res => res && res.data)
  },

  // 会见统计-远程免费会见纪录
  getFreeMeetings: params => {
    return service.get('/freeMeetings/page', params).then(res => res && res.data)
  },

  // 数据管理-上传并解析
  uploadAnalyticExcel: params => {
    return service.postFile(params.url, params.values).then(res => res && Object.assign(res.data, { type: params.type }))
  },
  // 数据管理-导入解析成功的数据
  importSuccessfulAnalysisExcel: params => {
    return service.post(params.url, { path: params.path }).then(res => res && Object.assign(res.data, { type: params.type }))
  },
  // 数据管理 - 下载罪犯信息导入Excel模板
  // downloadPrisonTemplate: params => {
  //   return service.get('/download/downloadfile', params, { responseType: 'blob' }).then(res => res.status === 200 && res)
  // },
  //  导入数据详情列表-服刑人员零花钱管理列表
  getPrisonersPocketMoney: params => {
    return service.get('/pocket_money/page', params).then(res => res && res.data)
  },
  // 服刑人员信息管理 - 监区配置
  getPrisonConfigs: params => {
    return service.get('/prison_config/getPrisonConfigs', params).then(res => res && res.data)
  },
  // 服刑人员信息管理 - 更换监区
  changePrisonArea: params => {
    return service.post('/prisoners/changePrisonArea', params).then(res => res)
  },
  // 服刑人员信息管理 - 删除罪犯
  deletePrisoners: params => {
    return service.post('/prisoners/deletePrison', params).then(res => res && res.code === 200)
  },
  // 服刑人员信息管理 - 新增罪犯
  addPrionser: params => {
    return service.postObj('/prisoners/addPrison', params).then(res => res && res.code === 200)
  },
  // 导入数据详情列表-服刑人员狱内消费情况列表
  getPrisonersInsideJailsCosts: params => {
    return service.get('/prisonerConsume/page', params).then(res => res && res.data)
  },
  //  导入数据详情列表-罪犯刑期变动信息列表
  getPrisonTerms: params => {
    return service.get('/prison_terms/page', params).then(res => res && res.data)
  },
  // 导入数据详情列表-罪犯奖励惩罚信息列表
  getPrisonerRewardPunishments: params => {
    return service.get('/prisoner_reward_punishments/page', params).then(res => res && res.data)
  },
  // 会见申请管理-远程会见申请-批量审核授权
  authorizeBatchMeetings: params => {
    return service.post('/meetings/batchAuthorize', params)
  },
  // 会见申请管理-远程会见申请-单条审核获取审核时间段
  getMeetingTimes: params => {
    return service.get('/meetings/showMeetingTimes', params)
  },
  // 会见申请管理-远程会见申请-单条审核通过
  authorizeSingleMeeting: params => {
    return service.post('/meetings/singleAuthorize', params)
  },
  // 情亲会见申请管理-审核通过
  meetingSelectAuthorize: params => {
    return service.post('/meetings/selectAuthorize', params)
  },
  // 情亲会见申请管理-审核通过
  meetingSelectOtherAuthorize: params => {
    return service.post('/meetings/allotOtherMeetingTime', params)
  },
  // 情亲会见申请管理-终端会见配置时间列表
  getMeetTimeConfig: params => {
    return service.get('/meetings/query-meettime-config', params).then(res => res && res.data)
  },
  // 监狱配置管理查询
  getMeetDeploy: params => {
    return service.get('/jails/getAutoAuthorizeMeeting', params).then(res => res && res)
  },
  // 监狱配置管理查询
  getMeetDeployUpdate: params => {
    return service.post('/jails/updateAutoAuthorizeMeeting', params).then(res => res && res.data)
  }

}

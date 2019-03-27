import * as service from '../config/service'

export default {
  // 家属注册管理-列表
  getRegistrations: params => {
    return service.get('/registrations/page', params).then(res => res && res.data)
  },
  // 家属注册管理-授权
  authorizeRegistrations: params => {
    return service.post('/registrations/authorize', params).then(res => res && res.code === 200)
  },
  // 家属会见申请-列表
  getMeetings: params => {
    return service.get('/meetings/page', params).then(res => res && res.data)
  },
  // 家属会见申请-家属详情
  getMeetingsFamilyDetail: params => {
    return service.get('/meetings/familyDetail', params).then(res => res && res.data)
  },
  // 家属会见申请-会见详情
  getMeettingsDetail: params => {
    return service.get('/meetings/detail', params).then(res => res && res.data.meetings)
  },
  // 家属会见申请-授权
  authorizeMeeting: params => {
    return service.post('/meetings/authorize', params).then(res => res && res.code === 200)
  },
  // 家属会见申请-获取会见信息
  getMeetingConfigs: params => {
    return service.get(`/meetings/adjustment?inputDate=${ params }`).then(res => res && res.data)
  },
  // 家属会见申请-调整
  adjustMeeting: params => {
    return service.postObj(`/meetings/adjustMeeting`, params).then(res => res && res.code === 200)
  },
  // 家属会见申请-撤回
  withdrawMeeting: params => {
    return service.post('/meetings/withdraw', params).then(res => res && res.code === 200)
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
  // 服刑人员零花钱管理-列表
  getPrisonersPocketMoney: params => {
    return service.get('/pocket_money/page', params).then(res => res && res.data)
  },
  // 服刑人员信息管理 - 监区配置
  getPrisonConfigs: params => {
    return service.get('/prison_config/getPrisonConfigs', params).then(res => res)
  },
  // 服刑人员信息管理 - 更换监区
  changePrisonArea: params => {
    return service.post('/prisoners/changePrisonArea', params).then(res => res)
  },
  // 服刑人员狱内消费情况 - 列表
  getPrisonersInsideJailsCosts: params => {
    return service.get('/prisonerConsume/page', params).then(res => res && res.data)
  }
}

// import frame from '@/views/layout/the-frame'
// import { helper } from '@/utils'
import dataImportDetails from '@/common/constants/data-import-details'

let check = [{
  path: '/registration',
  name: 'registration-manage',
  meta: { hidden: true, breadcrumbName: '家属注册管理' },
  children: [{
    path: '/registration/list',
    name: 'registration-list',
    props: { hasPrisonAreaAuth: true },
    meta: { permission: 'visit.family-registration.search', breadcrumbName: '家属注册列表' },
    // component: resolve => require(['@/views/check-registration/registration-list'], resolve)
    // component: helper.loadView('check-registration/registration-list')
    // 河源分支
    // component: 'check-registration/registration-list-heyuan'
    // 以前逻辑
    component: 'check-registration/registration-list'
  }]
}, {
  path: '/diplomatic-consul-official',
  name: 'diplomatic-consul-official-manage',
  redirect: { path: '/diplomatic-consul-official/list' },
  meta: { breadcrumbName: '外交领事官员注册管理' },
  children: [{
    path: '/diplomatic-consul-official/list',
    name: 'diplomatic-consul-official-list',
    meta: {
      permission: 'visit.diplomatic-consul-official.search',
      breadcrumbName: '外交领事官员注册列表'
    },
    component: 'diplomatic-consul-official/registration'
  }]
}, {
  path: '/meeting',
  name: 'meeting-manage',
  meta: { hidden: true, breadcrumbName: '可视电话申请管理' },
  children: [{
    path: '/meeting/list',
    name: 'meeting-list',
    // component: helper.loadView('check-meeting/meeting-list'),
    // component: 'check-meeting/meeting-list',
    // 以前逻辑
    component: 'check-meeting/meeting-list/meeting-list',
    // 河源逻辑
    // component: 'check-meeting/meeting-list/meeting-list-heyuan',
    props: { hasPrisonAreaAuth: true },
    // component: resolve => require(['@/views/check-meeting/meeting-list'], resolve),
    meta: { permission: 'visit.remote-visit-application.search', breadcrumbName: '可视电话申请列表' }
  }, {
    path: '/meeting/diplomatist',
    name: 'meeting-diplomatist',
    // component: helper.loadView('check-meeting/meeting-list'),
    // component: 'check-meeting/meeting-list',
    component: 'check-meeting/meeting-diplomatist/meeting-diplomatist',
    // component: resolve => require(['@/views/check-meeting/meeting-list'], resolve),
    meta: { permission: 'visit.remote-visit-application.search', breadcrumbName: '外交领事官员可视电话申请列表 ' }
  }, {
    path: '/meeting/adjust',
    name: 'meeting-adjust',
    // component: helper.loadView('check-meeting/meeting-adjust'),
    component: 'check-meeting/meeting-adjust/index',
    // component: resolve => require(['@/views/check-meeting/meeting-adjust'], resolve),
    meta: { permission: 'visit.remote-visit-application.view', breadcrumbName: '可视电话申请调整' }
    // component: resolve => require(['@/views/check-meeting/ws'], resolve)
  }, {
    path: '/visit/list',
    name: 'visit-list',
    // component: helper.loadView('check-meeting/visit-list'),
    component: 'check-meeting/visit-list', // 非河源
    // component: 'check-meeting/visit-list-heyuan', // 河源监狱
    // component: resolve => require(['@/views/check-meeting/visit-list'], resolve),
    props: { hasPrisonAreaAuth: true },
    meta: { permission: 'visit.field-visit.search', breadcrumbName: '现场探视预约列表' }
  }, {
    path: '/meeting/message',
    name: 'MeetingMessage',
    component: 'check-meeting/meeting-message',
    props: { hasPrisonAreaAuth: true },
    meta: { permission: 'visit.remote-visit-application.message', breadcrumbName: '短信申请管理' }
  }]
}, {
  path: '/meeting/deploy',
  redirect: '/meeting/deploy/deploy',
  meta: { breadcrumbName: '监狱配置管理' },
  children: [{
    path: '/meeting/deploy/deploy',
    meta: { permission: 'visit.prison-settings.deploy', breadcrumbName: '相关配置管理' },
    component: 'check-meeting/meeting-deploy/meeting-deploy'
  }, {
    path: '/meeting/deploy/process-edit',
    meta: { permission: 'visit.prison-settings.process-edit', breadcrumbName: '审批流程管理' },
    component: 'check-meeting/meeting-deploy/meeting-process-edit'
  }, {
    path: '/meeting/deploy/process-add',
    meta: { permission: 'visit.prison-settings.process-edit', breadcrumbName: '审批流程管理' },
    component: 'check-meeting/meeting-deploy/meeting-process-edit'
  }]
}, {
  path: '/meeting-report',
  name: 'meeting-report-check',
  meta: { hidden: true, breadcrumbName: '可视电话统计' },
  children: [{
    path: '/meeting-report/prison',
    name: 'prison-report-check',
    // component: helper.loadView('meeting-report/prison-report'),
    component: 'meeting-report/prison-report',
    props: { hasPrisonAreaAuth: true },
    // component: resolve => require(['@/views/meeting-report/prison-report'], resolve),
    meta: { permission: 'visit.visit-statistic.prison.search', breadcrumbName: '监狱统计' }
  }, {
    path: '/meeting-report/prison-area',
    name: 'prison-area-report-check',
    // component: helper.loadView('meeting-report/prison-area-report'),
    component: 'meeting-report/prison-area-report',
    // component: resolve => require(['@/views/meeting-report/prison-area-report'], resolve),
    meta: { permission: 'visit.visit-statistic.prison-area.search', breadcrumbName: '监区统计' }
  }, {
    path: '/meeting-report/records',
    name: 'MeetingRecordsJail',
    // component: helper.loadView('check-meeting/meeting-records'),
    component: 'check-meeting/meeting-records',
    // component: resolve => require(['@/views/check-meeting/meeting-records'], resolve),
    props: { hasPrisonAreaAuth: true },
    meta: { permission: 'visit.visit-statistic.remote-free-visit.search', breadcrumbName: '免费通话记录' }
  }, {
    path: '/meeting-report/meeting-achievements',
    component: 'check-meeting/meeting-achievements',
    meta: { permission: 'visit.visit-statistic.cost-save.search', breadcrumbName: '可视电话节约成本统计' }

  }, {
    path: '/meeting-report/meeting-diplomatist-detail',
    component: 'check-meeting/meeting-diplomatist/meeting-diplomatist-detail',
    props: { hasDiplomatQueryAuth: true },
    meta: { permission: 'visit.remote-visit-application.diplomatic-consul-official.search', breadcrumbName: '外交领事官员可视电话详情表' }
  }, {
    path: '/meeting-report/meeting-statistic-table',
    component: 'gd-admin/gd-meeting/meeting-list',
    props: { hasPrisonAreaAuth: true },
    meta: { permission: 'visit.visit-statistic.meeting-statistic-table', breadcrumbName: '监区可视电话统计表' }
  }, {
    path: '/meeting-report/meeting-island-list',
    component: 'gd-admin/gd-meeting/island-meeting-list',
    meta: { permission: 'visit.visit-statistic.island-list', breadcrumbName: '非大陆居民通话统计表' }
  }, {
    path: '/meeting/family-meeting-statistics',
    name: 'meeting-family-meeting-statistics',
    meta: {
      permission: 'visit.visit-statistic.family-phone-visit.search',
      breadcrumbName: '亲情电话统计报表'
    },
    component: 'check-meeting/meeting-family-statistics'
  }, {
    path: '/meeting/meeting-detail-guangxi',
    name: 'meeting-meeting-detail-guangxi',
    meta: {
      permission: 'visit.visit-search.metting-detail-guangxi.search',
      breadcrumbName: '服刑人员会见登记表'
    },
    component: 'gd-admin/gd-meeting/meeting-call-detail'
  }, {
    path: '/meeting/meeting-userNumber-list',
    name: 'meeting-meeting-userNumber-list',
    meta: {
      permission: 'visit.visit-search.metting-userNumber-list.search',
      breadcrumbName: '会见量和参会人数统计表'
    },
    component: 'gd-admin/gd-meeting/meeting-user-number'
  }]
}, {
  path: '/mailbox',
  name: 'mailbox',
  meta: { hidden: true, breadcrumbName: '监狱长信箱' },
  children: [{
    path: '/mailbox/list',
    name: 'mailbox-list',
    // component: helper.loadView('check-mailbox/list'),
    component: 'check-mailbox/list',
    // component: resolve => require(['@/views/check-mailbox/list'], resolve),
    meta: { permission: 'visit.warden-mail.search', breadcrumbName: '信件列表' }
  }]
}, {
  path: '/prisoner',
  name: 'prisoner-manage',
  meta: { hidden: true, breadcrumbName: '服刑人员信息管理' },
  children: [{
    path: '/prisoner/list',
    name: 'prisoner-list',
    // component: helper.loadView('check-prisoner/prisoner-list'),
    // 以前逻辑
    component: 'check-prisoner/prisoner-list',
    // 河源逻辑
    // component: 'check-prisoner/prisoner-list-heyuan',
    // component: resolve => require(['@/views/check-prisoner/prisoner-list'], resolve),
    props: { hasPrisonAreaAuth: true },
    meta: { permission: 'visit.prisoner.search', breadcrumbName: '服刑人员列表' }
  }]
}, {
  path: '/family',
  name: 'family-manage',
  meta: { hidden: true, breadcrumbName: '家属信息管理' },
  children: [{
    path: '/family/list',
    name: 'family-list',
    // component: helper.loadView('check-family/family-list'),
    component: 'check-family/family-list',
    // component: resolve => require(['@/views/check-family/family-list'], resolve),
    meta: { permission: 'visit.family.search', breadcrumbName: '家属列表' }
  },
  {
    path: '/family/detail/:id',
    name: 'family-detail',
    // component: helper.loadView('check-family/family-detail'),
    component: 'check-family/family-detail',
    // component: resolve => require(['@/views/check-family/family-detail'], resolve),
    meta: { permission: 'visit.family.view', breadcrumbName: '家属账户详情', activeMenu: '/family/list' }
  }]
}, {
  path: '/prisoner-data',
  name: 'prisoner-data',
  meta: { hidden: true, breadcrumbName: '数据管理' },
  children: [{
    path: '/prisoner-data/data-import',
    name: 'prisoner-data-import',
    // component: helper.loadView('check-prisoner-data/data-import'),
    component: 'check-prisoner-data/data-import',
    // component: resolve => require(['@/views/check-prisoner-data/data-import'], resolve),
    meta: { permission: 'visit.data-import.prisoner.import', breadcrumbName: '罪犯数据导入' }
  }, {
    path: '/prisoner-data/term-change',
    name: 'prisoner-term-change',
    // component: helper.loadView('check-prisoner-data/term-change'),
    component: 'check-prisoner-data/term-change',
    // component: resolve => require(['@/views/check-prisoner-data/term-change'], resolve),
    meta: { permission: 'visit.data-import.sentence-change.import', breadcrumbName: '刑期变动数据导入' }
  }, {
    path: '/prisoner-data/reward-punishment',
    name: 'prisoner-reward-punishment',
    // component: helper.loadView('check-prisoner-data/reward-punishment'),
    component: 'check-prisoner-data/reward-punishment',
    // component: resolve => require(['@/views/check-prisoner-data/reward-punishment'], resolve),
    meta: { permission: 'visit.data-import.reward-punishment.import', breadcrumbName: '服刑人员奖惩数据导入' }
  }, {
    path: '/prisoner-data/pocket-money',
    name: 'prisoner-pocket-money',
    // component: helper.loadView('check-prisoner-data/pocket-money'),
    component: 'check-prisoner-data/pocket-money',
    // component: resolve => require(['@/views/check-prisoner-data/pocket-money'], resolve),
    meta: { permission: 'visit.data-import.pocket-money.import', breadcrumbName: '零花钱数据导入' }
  }, {
    path: '/check-prisoner-data/reward-score-list',
    name: 'prisoner-score-import-list',
    // component: helper.loadView('check-prisoner-data/pocket-money'),
    component: 'check-prisoner-data/reward-score-list',
    // component: resolve => require(['@/views/check-prisoner-data/pocket-money'], resolve),
    meta: { permission: 'visit.data-import.prisoner-score.import', breadcrumbName: '服刑人员计分考核数据导入' }
  }, {
    path: '/prisoner-data/inside-jails-costs',
    name: 'prisoner-inside-jails-costs',
    // component: helper.loadView('check-prisoner-data/inside-jails-costs'),
    component: 'check-prisoner-data/inside-jails-costs',
    // component: resolve => require(['@/views/check-prisoner-data/inside-jails-costs'], resolve),
    meta: { permission: 'visit.data-import.prison-consumption.import', breadcrumbName: '狱内消费情况数据导入' }
  },{
    path: '/family-information/import/list',
    name: 'FamilyInformationRegistrationsList',
    props: { hasPrisonAreaAuth: true },
    meta: {
      permission: 'visit.data-import.prison-family-information.import',
      breadcrumbName: '家属信息导入'
    },
    component: 'check-prisoner-data/family-information',
  },{
    path: '/prisoner-data/sensitive-characters',
    name: 'HeiYuang-jail-prisoner-sensitive-characters',
    component: 'literature/literature-sensitive-characters/literature-sensitive-characters',
    meta: { permission: 'visit.sensitive-word.manage', breadcrumbName: '敏感词管理' }
  }
]
}, {
  path: '/import-data-details',
  name: 'import-data-details',
  meta: { hidden: true, breadcrumbName: '导入数据详情列表' },
  children: [{
    path: '/import-data-details/prisoner-term-change/list',
    name: 'prisoner-term-change-list',
    props: { type: dataImportDetails.DATA_SENTENCE_CHANGE },
    // component: helper.loadView('check-data-import-details/prisoner-term-change-list'),
    component: 'check-data-import-details/prisoner-term-change-list',
    // component: resolve => require(['@/views/check-data-import-details/prisoner-term-change-list'], resolve),
    meta: { permission: 'visit.data-search.sentence-change.search', breadcrumbName: '服刑人员刑期变动详情表' }
  }, {
    path: '/import-data-details/prisoner-reward-punishment/list',
    name: 'prisoner-reward-punishment-list',
    props: { type: dataImportDetails.DATA_REWARD_PUNISHMENT },
    // component: helper.loadView('check-data-import-details/prisoner-reward-punishment-list'),
    component: 'check-data-import-details/prisoner-reward-punishment-list',
    // component: resolve => require(['@/views/check-data-import-details/prisoner-reward-punishment-list'], resolve),
    meta: { permission: 'visit.data-search.reward-punishment.search', breadcrumbName: '服刑人员奖惩详情表' }
  }, {
    path: '/import-data-details/prisoner-pocket-money/list',
    name: 'prisoner-pocket-money-list',
    props: { type: dataImportDetails.DATA_POCKET_MONEY },
    component: 'check-data-import-details/prisoner-pocket-money-list',
    // component: helper.loadView('check-data-import-details/prisoner-pocket-money-list'),
    // component: resolve => require(['@/views/check-data-import-details/prisoner-pocket-money-list'], resolve),
    meta: { permission: 'visit.data-search.pocket-money.search', breadcrumbName: '服刑人员零花钱详情表' }
  }, {
    path: '/import-data-details/prisoner-score/list',
    name: 'prisoner-score-list',
    props: { type: dataImportDetails.DATA_REWARD_PUNISHMENT },
    component: 'check-data-import-details/prisoner-score-list',
    // component: resolve => require(['@/views/check-data-import-details/prisoner-reward-punishment-list'], resolve),
    meta: { permission: 'visit.data-search.diplomatic-score.search', breadcrumbName: '服刑人员计分考核表' }
  }, {
    path: '/import-data-details/inside-jails-costs/list',
    name: 'inside-jails-costs-list',
    props: { type: dataImportDetails.DATA_PRISON_CONSUMPTION },
    component: 'check-data-import-details/prisoner-inside-jails-costs-list',
    // component: helper.loadView('check-data-import-details/prisoner-inside-jails-costs-list'),
    // component: resolve => require(['@/views/check-data-import-details/prisoner-inside-jails-costs-list'], resolve),
    meta: { permission: 'visit.data-search.prison-consumption.search', breadcrumbName: '服刑人员狱内消费详情表' }
  }]
}, {
  path: '/family-sms',
  name: 'family-sms',
  meta: {
    breadcrumbName: '亲情短信管理',
    hidden: true
  },
  children: [
    {
      path: '/family-sms/send',
      name: 'sms-send',
      props: { hasPrisonAreaAuth: true },
      meta: { permission: 'visit.family-sms.send', breadcrumbName: '发送亲情短信' },
      component: 'family-sms/sms-send'
    },
    {
      path: '/family-sms/list',
      name: 'sms-list',
      props: { hasPrisonAreaAuth: true },
      meta: { permission: 'visit.family-sms.list', breadcrumbName: '亲情短信申请管理' },
      component: 'family-sms/sms-list'
    }
  ]
}]

// frame
check.forEach(item => {
  if (!item.component) item.component = 'layout/the-frame'
})

export default check

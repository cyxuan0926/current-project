import frame from '@/views/layout/the-frame'

let check = [{
  path: '/registration',
  name: '家属注册管理',
  meta: { hidden: true },
  children: [{
    path: '/registration/list',
    name: '家属注册列表',
    component: resolve => require(['@/views/check-registration/registration-list'], resolve)
  }]
}, {
  path: '/meeting',
  name: '会见申请管理',
  meta: { hidden: true },
  children: [{
    path: '/meeting/list',
    name: '远程会见申请列表',
    component: resolve => require(['@/views/check-meeting/meeting-list'], resolve)
  }, {
    path: '/meeting/adjust',
    name: '远程会见申请调整',
    component: resolve => require(['@/views/check-meeting/meeting-adjust'], resolve)
    // component: resolve => require(['@/views/check-meeting/ws'], resolve)
  }]
}, {
  path: '/meeting-report',
  name: '会见统计',
  meta: { hidden: true },
  children: [{
    path: '/meeting-report/prison',
    name: '监狱统计',
    component: resolve => require(['@/views/meeting-report/prison-report'], resolve)
  }, {
    path: '/meeting-report/prison-area',
    name: '监区统计',
    component: resolve => require(['@/views/meeting-report/prison-area-report'], resolve)
  }, {
    path: '/meeting/records',
    name: '远程免费会见记录',
    component: resolve => require(['@/views/check-meeting/meeting-records'], resolve)
  }]
}, {
  path: '/visit',
  name: '会见申请管理',
  meta: { hidden: true },
  children: [{
    path: '/visit/list',
    name: '实地探监列表',
    component: resolve => require(['@/views/check-visit/visit-list'], resolve)
  }]
}, {
  path: '/mailbox',
  name: '监狱长信箱',
  meta: { hidden: true },
  children: [{
    path: '/mailbox/list',
    name: '信件列表',
    component: resolve => require(['@/views/check-mailbox/list'], resolve)
  }]
}, {
  path: '/prisoner',
  name: '服刑人员信息管理',
  meta: { hidden: true },
  children: [{
    path: '/prisoner/list',
    name: '服刑人员列表',
    component: resolve => require(['@/views/check-prisoner/prisoner-list'], resolve)
  }]
}, {
  path: '/family',
  name: '家属信息管理',
  meta: { hidden: true },
  children: [{
    path: '/family/list',
    name: '家属列表',
    component: resolve => require(['@/views/check-family/family-list'], resolve)
  },
  {
    path: '/family/detail/:id',
    name: '家属账户详情',
    component: resolve => require(['@/views/check-family/family-detail'], resolve)
  }]
}, {
  path: '/prisoner-data',
  name: '数据管理',
  meta: { hidden: true },
  children: [{
    path: '/prisoner-data/data-import',
    name: '罪犯数据导入',
    component: resolve => require(['@/views/check-prisoner-data/data-import'], resolve)
  }, {
    path: '/prisoner-data/term-change',
    name: '刑期变动数据导入',
    component: resolve => require(['@/views/check-prisoner-data/term-change'], resolve)
  }, {
    path: '/prisoner-data/reward-punishment',
    name: '罪犯奖惩数据导入',
    component: resolve => require(['@/views/check-prisoner-data/reward-punishment'], resolve)
  }, {
    path: '/prisoner-data/pocket-money',
    name: '零花钱数据导入',
    component: resolve => require(['@/views/check-prisoner-data/pocket-money'], resolve)
  }, {
    path: '/prisoner-data/inside-jails-costs',
    name: '狱内消费情况数据导入',
    component: resolve => require(['@/views/check-prisoner-data/inside-jails-costs'], resolve)
  }]
}, {
  path: '/import-data-details',
  name: '导入数据详情列表',
  meta: { hidden: true },
  children: [{
    path: '/import-data-details/prisoner-term-change/list',
    name: '服刑人员刑期变动详情表',
    component: resolve => require(['@/views/check-data-import-details/prisoner-term-change-list'], resolve)
  }, {
    path: '/import-data-details/prisoner-reward-punishment/list',
    name: '服刑人员奖惩详情表',
    component: resolve => require(['@/views/check-data-import-details/prisoner-reward-punishment-list'], resolve)
  }, {
    path: '/import-data-details/prisoner-pocket-money/list',
    name: '服刑人员零花钱详情表',
    component: resolve => require(['@/views/check-data-import-details/prisoner-pocket-money-list'], resolve)
  }, {
    path: '/import-data-details/inside-jails-costs/list',
    name: '服刑人员狱内消费详情表',
    component: resolve => require(['@/views/check-data-import-details/prisoner-inside-jails-costs-list'], resolve)
  }]
}]

check.forEach(item => {
  if (!item.component) item.component = frame
})

export default check

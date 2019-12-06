// import frame from '@/views/layout/the-frame'
// import { helper } from '@/utils'

let superAdmin = [{
  path: '/',
  meta: { hidden: true },
  children: [{
    path: '/prison',
    name: 'prison-manage-first',
    meta: { breadcrumbName: '监狱管理' },
    component: 'sadmin-prison/prison-tab',
    // component: helper.loadView('sadmin-prison/prison-tab'),
    // component: resolve => require(['@/views/sadmin-prison/prison-tab'], resolve),
    children: [{
      path: '/prison/list',
      name: 'prison-list',
      meta: { permission: 'visit.prison.search', breadcrumbName: '监狱列表' },
      component: 'sadmin-prison/prison-list'
      // component: helper.loadView('sadmin-prison/prison-list')
      // component: resolve => require(['@/views/sadmin-prison/prison-list'], resolve)
    }, {
      path: '/tenant/list',
      name: 'tenant-list',
      meta: { permission: 'visit.prison.tenant.search', breadcrumbName: '租户列表', activeMenu: '/prison/list' },
      component: 'sadmin-prison/tenant-list'
      // component: resolve => require(['@/views/sadmin-prison/tenant-list'], resolve)
      // component: helper.loadView('sadmin-prison/tenant-list')
    }]
  }]
}, {
  path: '/prison',
  name: 'prison-manage',
  meta: { hidden: true, breadcrumbName: '监狱管理', permission: 'visit.prison.search' },
  children: [
  //   {
  //   path: '/prison/add',
  //   name: 'prison-add',
  //   meta: { role: '0', permission: 'visit.prison.add', deep: true, breadcrumbName: '新增监狱' },
  //   component: loadView('sadmin-prison/prison-add')
  // },
    {
      path: '/prison/visit/:id',
      name: 'prison-visit',
      props: { role: 0 },
      meta: { role: '0',
        permission: 'visit.prison.filed-visit-config.search',
        breadcrumbName: '监狱实地会见配置',
        activeMenu: '/prison/list' },
      component: 'meeting/visit-config'
      // component: resolve => require(['@/views/meeting/visit-config'], resolve)
      // component: helper.loadView('meeting/visit-config')
      // }, {
      //   path: '/prison/meeting-remote/:id',
      //   name: '监狱远程会见配置',
      //   meta: { role: '0' },
      //   component: resolve => require(['@/views/meeting/meeting-remote-edit'], resolve)
    }, {
      path: '/remote/edit/:id',
      name: 'remote-edit-super-admin',
      // permssion: 'edit'
      meta: { role: '0',
        permission: 'visit.prison.visit-config.search',
        breadcrumbName: '监狱远程会见配置',
        activeMenu: '/prison/list' },
      component: 'meeting/remote-edit'
      // component: resolve => require(['@/views/meeting/remote-edit'], resolve)
      // component: helper.loadView('meeting/remote-edit')
    }, {
      path: '/prison/edit/:id',
      name: 'prison-edit',
      meta: {
      // premission: 'edit'
        permission: 'visit.prison.update',
        role: '0',
        activeMenu: '/prison/list',
        breadcrumbName: '编辑监狱'
      },
      component: 'sadmin-prison/prison-edit'
      // component: resolve => require(['@/views/sadmin-prison/prison-edit'], resolve)
      // component: helper.loadView('sadmin-prison/prison-edit')
    }]
}, {
  path: '/prison-area',
  name: 'prison-area-manage',
  meta: { hidden: true, breadcrumbName: '监区管理' },
  children: [{
    path: '/prison-area/list',
    name: 'prison-area-list',
    props: { hasAllPrisonQueryAuth: true },
    meta: { permission: 'visit.prison-area.all-prison.search', breadcrumbName: '监区列表' },
    component: 'sadmin-prison-area/prison-area-list'
    // component: resolve => require(['@/views/sadmin-prison-area/prison-area-list'], resolve)
    // component: helper.loadView('sadmin-prison-area/prison-area-list')
  // }, {
  //   path: '/prison-area/add',
  //   name: '新增监狱',
  //   component: resolve => require(['@/views/sadmin-prison-area/prison-area-add'], resolve)
  // }, {
  //   path: '/prison-area/edit/:id',
  //   name: '编辑监狱',
  //   component: resolve => require(['@/views/sadmin-prison-area/prison-area-edit'], resolve)
  }]
}, {
  path: '/prison-user',
  name: 'prison-user-manage',
  meta: { hidden: true, breadcrumbName: '监狱用户管理' },
  children: [{
    path: '/prison-user/list',
    name: 'prison-user-list',
    props: { role: '0', hasAllPrisonQueryAuth: true },
    meta: { permission: 'visit.account.all-prison.search', breadcrumbName: '监狱用户列表' },
    component: 'sadmin-prison-user/prison-user-list'
    // component: resolve => require(['@/views/sadmin-prison-user/prison-user-list'], resolve)
    // component: helper.loadView('sadmin-prison-user/prison-user-list')
  }]
}, {
  path: '/feedback',
  name: 'feedback',
  meta: { hidden: true, breadcrumbName: '意见反馈' },
  children: [{
    path: '/feedback/list',
    name: 'feedback-list',
    meta: { permission: 'visit.feedback.search', breadcrumbName: '意见列表' },
    component: 'sadmin-feedback/feedback-list'
    // component: resolve => require(['@/views/sadmin-feedback/feedback-list'], resolve)
    // component: helper.loadView('sadmin-feedback/feedback-list')
  }]
}, {
  path: '/family-remittance',
  name: 'family-remittance',
  meta: { hidden: true, breadcrumbName: '家属汇款记录' },
  children: [{
    path: '/family-remittance/list',
    name: 'family-remittance-list',
    meta: { permission: 'visit.family-remittance.search', breadcrumbName: '家属汇款' },
    component: 'sadmin-remittance-record/family-remittance-list'
    // component: resolve => require(['@/views/sadmin-remittance-record/family-remittance-list'], resolve)
    // component: helper.loadView('sadmin-remittance-record/family-remittance-list')
  }]
}, {
  path: '/',
  meta: { hidden: true },
  children: [{
    path: '/trade',
    name: 'trade',
    meta: { breadcrumbName: '交易流水记录' },
    component: 'trade/list-router',
    // component: resolve => require(['@/views/trade/list-router'], resolve),
    // component: helper.loadView('trade/list-router'),
    children: [
      {
        path: '/trade/list',
        redirect: '/trade/account'
      },
      {
        path: '/trade/account',
        name: 'trade-account',
        meta: { deep: true, permission: 'visit.transaction-record.search', breadcrumbName: '账户明细' },
        component: 'trade/account'
        // component: resolve => require(['@/views/trade/account'], resolve)
        // component: helper.loadView('trade/account')
      },
      {
        path: '/trade/recharge',
        name: 'trade-rechange',
        meta: { deep: true, permission: 'visit.transaction-record.recharge.view', breadcrumbName: '充值明细' },
        component: 'trade/recharge'
        // component: resolve => require(['@/views/trade/recharge'], resolve)
        // component: helper.loadView('trade/recharge')
      },
      {
        path: '/trade/consumption',
        name: 'trade-consumption',
        meta: { deep: true, permission: 'visit.transaction-record.consumption.view', breadcrumbName: '消费明细' },
        component: 'trade/consumption'
        // component: resolve => require(['@/views/trade/consumption'], resolve)
        // component: helper.loadView('trade/consumption')
      },
      {
        path: '/trade/refund',
        name: 'trade-refund',
        meta: { deep: true, permission: 'visit.transaction-record.refund.view', breadcrumbName: '退款明细' },
        component: 'trade/refund'
        // component: resolve => require(['@/views/trade/refund'], resolve)
        // component: helper.loadView('trade/refund')
      }
    ]
  }]
},
{
  path: '/advertisement',
  name: 'advertisement-manage',
  meta: { hidden: true, breadcrumbName: '广告管理' },
  children: [{
    path: '/advertisement/list',
    name: 'advertisement-list',
    meta: { permission: 'visit.advertisement.search', breadcrumbName: '广告列表' },
    component: 'sadmin-advertisement/advertisement-list'
    // component: resolve => require(['@/views/sadmin-advertisement/advertisement-list'], resolve)
    // component: helper.loadView('sadmin-advertisement/advertisement-list')
  }, {
    path: '/advertisement/add',
    name: 'advertisement-add',
    meta: { deep: true, permission: 'visit.advertisement.add', breadcrumbName: '新增广告' },
    component: 'sadmin-advertisement/advertisement-add'
    // component: resolve => require(['@/views/sadmin-advertisement/advertisement-add'], resolve)
    // component: helper.loadView('sadmin-advertisement/advertisement-add')
  }, {
    path: '/advertisement/edit/:id',
    name: 'advertisement-edit',
    meta: { deep: true, permission: 'visit.advertisement.update', breadcrumbName: '编辑广告' },
    component: 'sadmin-advertisement/advertisement-edit'
    // component: resolve => require(['@/views/sadmin-advertisement/advertisement-edit'], resolve)
    // component: helper.loadView('sadmin-advertisement/advertisement-edit')
  }]
}, {
  path: '/whitemember',
  name: 'whitemember',
  meta: { hidden: true, breadcrumbName: '白名单管理' },
  children: [{
    path: '/whitemember/list',
    name: 'whitemember-list',
    meta: { permission: 'visit.white-list.search', breadcrumbName: '白名单列表' },
    component: 'sadmin-whitemember/whitemember-list'
    // component: resolve => require(['@/views/sadmin-whitemember/whitemember-list'], resolve)
    // component: helper.loadView('sadmin-whitemember/whitemember-list')
  }]
}, {
  path: '/terminal',
  name: 'terminal',
  meta: { hidden: true, breadcrumbName: '终端管理' },
  children: [{
    path: '/terminal/list',
    name: 'terminal-list',
    meta: { permission: 'visit.terminal.search', breadcrumbName: '终端列表' },
    component: 'sadmin-terminal/terminal-list'
    // component: resolve => require(['@/views/sadmin-terminal/terminal-list'], resolve)
    // component: helper.loadView('sadmin-terminal/terminal-list')
  }, {
    path: '/terminal/add',
    name: 'terminal-add',
    meta: { deep: true, permission: 'visit.terminal.add', breadcrumbName: '新增终端' },
    component: 'sadmin-terminal/terminal-add'
    // component: resolve => require(['@/views/sadmin-terminal/terminal-add'], resolve)
    // component: helper.loadView('sadmin-terminal/terminal-add')
  }, {
    path: '/terminal/edit/:id',
    name: 'terminal-edit',
    meta: { deep: true, permission: 'visit.terminal.update', breadcrumbName: '编辑终端' },
    component: 'sadmin-terminal/terminal-edit'
    // component: resolve => require(['@/views/sadmin-terminal/terminal-edit'], resolve)
    // component: helper.loadView('sadmin-terminal/terminal-edit')
  }]
}, {
  path: '/version',
  name: 'version',
  meta: { hidden: true, breadcrumbName: '版本管理' },
  children: [{
    path: '/version/list',
    name: 'version-list',
    meta: { permission: 'visit.version.search', breadcrumbName: '版本列表' },
    component: 'sadmin-version/version-list'
    // component: resolve => require(['@/views/sadmin-version/version-list'], resolve)
    // component: helper.loadView('sadmin-version/version-list')
  }]
}, {
  path: '/log',
  name: 'log',
  meta: { hidden: true, breadcrumbName: '日志' },
  children: [{
    path: '/log/app-error',
    name: 'log-app-error',
    meta: { permission: 'visit.app-crash-log.search', breadcrumbName: 'APP崩溃日志' },
    component: 'sadmin-log/app-error-list'
    // component: resolve => require(['@/views/sadmin-log/app-error-list'], resolve)
    // component: helper.loadView('sadmin-log/app-error-list')
  }]
}, {
  path: '/prison-data',
  name: 'prison-data',
  meta: { hidden: true, breadcrumbName: '监狱数据查询' },
  children: [{
    path: '/prison-data/meeting-achievements',
    component: 'check-meeting/meeting-achievements',
    meta: { permission: 'visit.visit-statistic.all-prison.cost-save.search', breadcrumbName: '远程会见节约成本统计' }
  }, {
    path: '/prison-data/registrations',
    name: 'prison-data_registrations',
    props: { hasAllPrisonQueryAuth: true },
    meta: { permission: 'visit.family-registration.all-prison.search', breadcrumbName: '家属注册信息' },
    component: 'check-registration/registration-list'
    // component: helper.loadView('check-registration/registration-list')
  }, {
    path: '/prison-data/meeting-applications',
    name: 'prison-data_meeting-applications',
    props: { hasAllPrisonQueryAuth: true },
    meta: { permission: 'visit.visit-statistic.all-prison.remote-visit.search', breadcrumbName: '远程会见申请' },
    component: 'check-meeting/meeting-list'
    // component: helper.loadView('check-meeting/meeting-list')
  }, {
    path: '/prison-data/meeting-statistics',
    name: 'prison-data_meeting-statistics',
    props: { hasAllPrisonQueryAuth: true },
    meta: { permission: 'visit.visit-statistic.all-prison.search', breadcrumbName: '监狱会见统计' },
    component: 'meeting-report/prison-report'
    // component: helper.loadView('meeting-report/prison-report')
  }, {
    path: '/prison-data/meeting-statistics/prison-area',
    name: 'prison-data_meeting-statistics_prison-area',
    props: { hasAllPrisonQueryAuth: true },
    meta: { permission: 'visit.visit-statistic.all-prison-area.search', breadcrumbName: '监区会见统计' },
    component: 'meeting-report/prison-area-report'
    // component: helper.loadView('meeting-report/prison-area-report')
  }, {
    path: '/prison-data/prisoners',
    name: 'prison-data_prisoners',
    props: { hasAllPrisonQueryAuth: true },
    meta: { permission: 'visit.prisoner.all-prison.search', breadcrumbName: '服刑人员信息' },
    component: 'check-prisoner/prisoner-list'
    // component: helper.loadView('check-prisoner/prisoner-list')
  }, {
    path: '/prison-data/warden-mailbox',
    name: 'prison-data_warden-mailbox',
    props: { hasOnlyAllPrisonQueryAuth: true },
    meta: { breadcrumbName: '监狱长信箱查询', permission: 'visit.prisoner.all-prison.search' },
    component: 'check-mailbox/list'
  }, {
    path: '/prison-data/prison-meeting-statistics',
    component: 'check-meeting/meeting-statistics',
    meta: { permission: '', breadcrumbName: '监狱会见数据统计表' }
  }]
}]

superAdmin.forEach(item => {
  item.component = 'layout/the-frame'
})

export default superAdmin

import frame from '@/views/common/the-frame'

let superAdmin = [{
  path: '/prison',
  name: '监狱管理',
  meta: { hidden: true },
  children: [{
    path: '/prison/list',
    name: '监狱列表',
    component: resolve => require(['@/views/sadmin-prison/prison-list'], resolve)
  }, {
    path: '/prison/add',
    name: '新增监狱',
    meta: { role: '0', permission: 'add' },
    component: resolve => require(['@/views/sadmin-prison/prison-add'], resolve)
  }, {
    path: '/prison/visit/:id',
    name: '监狱实地会见配置',
    meta: { role: '0' },
    component: resolve => require(['@/views/meeting/visit-config'], resolve)
  // }, {
  //   path: '/prison/meeting-remote/:id',
  //   name: '监狱远程会见配置',
  //   meta: { role: '0' },
  //   component: resolve => require(['@/views/meeting/meeting-remote-edit'], resolve)
  }, {
    path: '/remote/edit/:id',
    name: '监狱远程会见配置',
    meta: { role: '0', permission: 'edit' },
    component: resolve => require(['@/views/meeting/remote-edit'], resolve)
  }, {
    path: '/prison/edit/:id',
    name: '编辑监狱',
    meta: {
      permission: 'edit',
      role: '0',
      deep: true
    },
    component: resolve => require(['@/views/sadmin-prison/prison-edit'], resolve)
  }]
}, {
  path: '/prison-area',
  name: '监区管理',
  meta: { hidden: true },
  children: [{
    path: '/prison-area/list',
    name: '监区列表',
    component: resolve => require(['@/views/sadmin-prison-area/prison-area-list'], resolve)
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
  name: '监狱用户管理',
  meta: { hidden: true },
  children: [{
    path: '/prison-user/list',
    name: '监狱用户列表',
    props: { role: '0' },
    component: resolve => require(['@/views/sadmin-prison-user/prison-user-list'], resolve)
  }, {
    path: '/prison-user/edit/:id',
    name: '编辑监狱用户',
    props: { role: '0' },
    component: resolve => require(['@/views/sadmin-prison-user/prison-user-edit'], resolve)
  }, {
    path: '/prison-user/add',
    name: '新增监狱用户',
    props: { role: '0' },
    component: resolve => require(['@/views/sadmin-prison-user/prison-user-add'], resolve)
  }]
}, {
  path: '/feedback',
  name: '意见反馈',
  meta: { hidden: true },
  children: [{
    path: '/feedback/list',
    name: '意见列表',
    component: resolve => require(['@/views/sadmin-feedback/feedback-list'], resolve)
  }]
}, {
  path: '/family-remittance',
  name: '家属汇款记录',
  meta: { hidden: true },
  children: [{
    path: '/family-remittance/list',
    name: '家属汇款',
    component: resolve => require(['@/views/sadmin-remittance-record/family-remittance-list'], resolve)
  }]
}, {
  path: '/',
  meta: { hidden: true },
  children: [{
    path: '/trade',
    name: '交易流水记录',
    component: resolve => require(['@/views/trade/list-router'], resolve),
    children: [
      {
        path: '/trade/account',
        name: '账户明细',
        component: resolve => require(['@/views/trade/account'], resolve)
      },
      {
        path: '/trade/recharge',
        name: '充值明细',
        component: resolve => require(['@/views/trade/recharge'], resolve)
      },
      {
        path: '/trade/consumption',
        name: '消费明细',
        component: resolve => require(['@/views/trade/consumption'], resolve)
      },
      {
        path: '/trade/refund',
        name: '退费明细',
        component: resolve => require(['@/views/trade/refund'], resolve)
      }
    ]
  }]
},
{
  path: '/advertisement',
  name: '广告管理',
  meta: { hidden: true },
  children: [{
    path: '/advertisement/list',
    name: '广告列表',
    component: resolve => require(['@/views/sadmin-advertisement/advertisement-list'], resolve)
  }, {
    path: '/advertisement/add',
    name: '新增广告',
    component: resolve => require(['@/views/sadmin-advertisement/advertisement-add'], resolve)
  }, {
    path: '/advertisement/edit/:id',
    name: '编辑广告',
    component: resolve => require(['@/views/sadmin-advertisement/advertisement-edit'], resolve)
  }]
}, {
  path: '/whitemember',
  name: '白名单管理',
  meta: { hidden: true },
  children: [{
    path: '/whitemember/list',
    name: '白名单列表',
    component: resolve => require(['@/views/sadmin-whitemember/whitemember-list'], resolve)
  }]
}, {
  path: '/terminal',
  name: '终端管理',
  meta: { hidden: true },
  children: [{
    path: '/terminal/list',
    name: '终端列表',
    component: resolve => require(['@/views/sadmin-terminal/terminal-list'], resolve)
  }, {
    path: '/terminal/add',
    name: '新增终端',
    component: resolve => require(['@/views/sadmin-terminal/terminal-add'], resolve)
  }, {
    path: '/terminal/edit/:id',
    name: '编辑终端',
    component: resolve => require(['@/views/sadmin-terminal/terminal-edit'], resolve)
  }]
}, {
  path: '/version',
  name: '版本管理',
  meta: { hidden: true },
  children: [{
    path: '/version/list',
    name: '版本列表',
    component: resolve => require(['@/views/sadmin-version/version-list'], resolve)
  }]
}, {
  path: '/log',
  name: '日志',
  meta: { hidden: true },
  children: [{
    path: '/log/app-error',
    name: 'APP崩溃日志',
    component: resolve => require(['@/views/sadmin-log/app-error-list'], resolve)
  }]
}]

superAdmin.forEach(item => {
  item.component = frame
})

export default superAdmin

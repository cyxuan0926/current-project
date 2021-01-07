// import frame from '@/views/layout/the-frame'
// import { helper } from '@/utils'

let admin = [{
  path: '/account',
  name: 'account-manage',
  meta: { hidden: true, breadcrumbName: '账户管理' },
  children: [{
    path: '/account/list',
    name: 'account-list',
    props: { role: '4' },
    meta: {
      permission: 'visit.account.current-prison.search',
      breadcrumbName: '账户列表',
      componentsToKeepAlive: ['AccountList']
    },
    // component: resolve => require(['@/views/sadmin-prison-user/prison-user-list'], resolve)
    // component: helper.loadView('sadmin-prison-user/prison-user-list')
    component: 'sadmin-prison-user/prison-user-list'
  }, {
    path: '/account/add',
    name: 'account-add',
    meta: {
      role: '4',
      deep: true,
      permission: 'visit.account.add',
      breadcrumbName: '新增账户',
      componentsUnRemoveKeepAlive: ['AccountList']
    },
    // component: resolve => require(['@/views/sadmin-prison-user/prison-user-add'], resolve)
    // component: helper.loadView('sadmin-prison-user/prison-user-add')
    component: 'sadmin-prison-user/prison-user-add'
  }, {
    path: '/account/edit/:id',
    name: 'account-edit',
    meta: {
      role: '4',
      deep: true,
      permission: 'visit.account.update',
      breadcrumbName: '编辑账户',
      componentsUnRemoveKeepAlive: ['AccountList']
    },
    // component: resolve => require(['@/views/sadmin-prison-user/prison-user-edit'], resolve)
    // component: helper.loadView('sadmin-prison-user/prison-user-edit')
    component: 'sadmin-prison-user/prison-user-edit'
  }]
}, {
  path: '/adminPrison-area',
  name: 'adminPrison-area',
  meta: { hidden: true, breadcrumbName: '监狱监区管理' },
  children: [{
    path: '/adminPrison-area/list',
    name: 'adminPrison-area-list',
    meta: { permission: 'visit.prison-area.current-prison.search', breadcrumbName: '监狱监区列表' },
    props: { role: '4' },
    // component: resolve => require(['@/views/sadmin-prison-area/prison-area-list'], resolve)
    // component: helper.loadView('sadmin-prison-area/prison-area-list')
    component: 'sadmin-prison-area/prison-area-list'
  }]
}, {
  path: '/operation-guide',
  name: 'operation-guide',
  meta: { hidden: true, breadcrumbName: '后台更新操作指引' },
  children: [{
    path: '/operation-guide/list',
    name: 'operation-guide-list',
    meta: { permission: 'visit.operation-guide.index', breadcrumbName: '后台更新操作指引' },
    component: 'operation-guide/index'
  }, {
    path: '/operation-guide/add',
    name: 'operation-guide-add',
    meta: { permission: 'visit.operation-guide.add', breadcrumbName: '后台更新操作指引' },
    component: 'operation-guide/guide-edit'
  }, {
    path: '/operation-guide/edit/:id',
    name: 'operation-guide-edit',
    meta: { permission: 'visit.operation-guide.edit', breadcrumbName: '后台更新操作指引' },
    component: 'operation-guide/guide-edit'
  }, {
    path: '/operation-guide/detail/:id',
    name: 'operation-guide-detail',
    meta: { permission: 'visit.operation-guide.detail', breadcrumbName: '后台更新操作指引' },
    component: 'operation-guide/guide-detail'
  }]
}]

admin.forEach(item => {
  item.component = 'layout/the-frame'
})

export default admin

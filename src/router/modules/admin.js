import frame from '@/views/layout/the-frame'

let admin = [{
  path: '/account',
  name: '账户管理',
  meta: { hidden: true },
  children: [{
    path: '/account/list',
    name: '账户列表',
    props: { role: '4' },
    component: resolve => require(['@/views/sadmin-prison-user/prison-user-list'], resolve)
  }, {
    path: '/account/add',
    name: '新增账户',
    meta: { role: '4', deep: true },
    component: resolve => require(['@/views/sadmin-prison-user/prison-user-add'], resolve)
  }, {
    path: '/account/edit/:id',
    name: '编辑账户',
    meta: { role: '4', deep: true },
    component: resolve => require(['@/views/sadmin-prison-user/prison-user-edit'], resolve)
  }]
}, {
  path: '/adminPrison-area',
  name: '监狱监区管理',
  meta: { hidden: true },
  children: [{
    path: '/adminPrison-area/list',
    name: '监狱监区列表',
    props: { role: '4' },
    component: resolve => require(['@/views/sadmin-prison-area/prison-area-list'], resolve)
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
  }]
}]

admin.forEach(item => {
  item.component = frame
})

export default admin

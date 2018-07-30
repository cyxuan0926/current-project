import frame from '@/views/common/the-frame'

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
    props: { role: '4' },
    component: resolve => require(['@/views/sadmin-prison-user/prison-user-add'], resolve)
  }, {
    path: '/account/edit/:id',
    name: '编辑账户',
    props: { role: '4' },
    component: resolve => require(['@/views/sadmin-prison-user/prison-user-edit'], resolve)
  }]
}, {
  path: '/prison-area',
  name: '监区管理',
  meta: { hidden: true },
  children: [{
    path: '/prison-area/list',
    name: '监区列表',
    props: { role: '4' },
    component: resolve => require(['@/views/sadmin-prison-area/prison-area-list'], resolve)
  }]
}]

admin.forEach(item => {
  item.component = frame
})

export default admin

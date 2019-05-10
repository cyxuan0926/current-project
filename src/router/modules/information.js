import frame from '@/views/layout/the-frame'

let infomation = [{
  path: '/jails',
  name: '监狱基本信息管理',
  meta: { hidden: true },
  children: [{
    path: '/jails/list',
    redirect: '/jails/detail'
  }, {
    path: '/jails/detail',
    name: '监狱基本信息',
    component: resolve => require(['@/views/jail/detail'], resolve)
  }, {
    path: '/jails/edit/:id',
    name: '编辑监狱基本信息',
    meta: {
      permission: 'edit',
      role: '3',
      deep: true
    },
    component: resolve => require(['@/views/sadmin-prison/prison-edit'], resolve)
  }]
}, {
  path: '/prison-affairs-public',
  name: '狱务公开信息管理',
  meta: { hidden: true },
  children: [{
    path: '/prison-affairs-public/prison-affairs-public',
    name: '狱务公开',
    meta: { typeId: 1, hidden: true },
    component: resolve => require(['@/views/common/router-view'], resolve),
    children: [
      {
        path: '/prison-affairs-public/prison-affairs-public/4',
        name: '减刑假释',
        meta: { typeId: 4 },
        component: resolve => require(['@/views/info-prison-affairs-public/list'], resolve)
      },
      {
        path: '/prison-affairs-public/prison-affairs-public/4/add',
        name: '新增减刑假释',
        meta: { typeId: 4, deep: true, activeMenu: '/prison-affairs-public/prison-affairs-public/4' },
        component: resolve => require(['@/views/info-prison-affairs-public/add'], resolve)
      },
      {
        path: '/prison-affairs-public/prison-affairs-public/4/edit/:id',
        name: '编辑减刑假释',
        meta: { typeId: 4, deep: true, activeMenu: '/prison-affairs-public/prison-affairs-public/4' },
        component: resolve => require(['@/views/info-prison-affairs-public/edit'], resolve)
      },
      {
        path: '/prison-affairs-public/prison-affairs-public/5',
        name: '暂予监外执行',
        meta: { typeId: 5 },
        component: resolve => require(['@/views/info-prison-affairs-public/list'], resolve)
      },
      {
        path: '/prison-affairs-public/prison-affairs-public/5/add',
        name: '新增暂予监外执行',
        meta: { typeId: 5, deep: true, activeMenu: '/prison-affairs-public/prison-affairs-public/5' },
        component: resolve => require(['@/views/info-prison-affairs-public/add'], resolve)
      },
      {
        path: '/prison-affairs-public/prison-affairs-public/5/edit/:id',
        name: '编辑暂予监外执行',
        meta: { typeId: 5, deep: true, activeMenu: '/prison-affairs-public/prison-affairs-public/5' },
        component: resolve => require(['@/views/info-prison-affairs-public/edit'], resolve)
      },
      {
        path: '/prison-affairs-public/prison-affairs-public/6',
        name: '社会帮教',
        meta: { typeId: 6 },
        component: resolve => require(['@/views/info-prison-affairs-public/list'], resolve)
      },
      {
        path: '/prison-affairs-public/prison-affairs-public/6/add',
        name: '新增社会帮教',
        meta: { typeId: 6, deep: true, activeMenu: '/prison-affairs-public/prison-affairs-public/6' },
        component: resolve => require(['@/views/info-prison-affairs-public/add'], resolve)
      },
      {
        path: '/prison-affairs-public/prison-affairs-public/6/edit/:id',
        name: '编辑社会帮教',
        meta: { typeId: 6, deep: true, activeMenu: '/prison-affairs-public/prison-affairs-public/6' },
        component: resolve => require(['@/views/info-prison-affairs-public/edit'], resolve)
      }
    ]
  }, {
    path: '/prison-affairs-public/prison-affairs-public/add',
    name: '新增狱务公开信息',
    meta: { typeId: 1, deep: true },
    component: resolve => require(['@/views/info-prison-affairs-public/add'], resolve)
  }, {
    path: '/prison-affairs-public/prison-affairs-public/edit/:id',
    name: '编辑狱务公开信息',
    meta: { typeId: 1, deep: true },
    component: resolve => require(['@/views/info-prison-affairs-public/edit'], resolve)
  }, {
    path: '/prison-affairs-public/working-dynamics',
    name: '工作动态',
    meta: { typeId: 2 },
    component: resolve => require(['@/views/info-prison-affairs-public/list'], resolve)
  }, {
    path: '/prison-affairs-public/working-dynamics/add',
    name: '新增工作动态',
    meta: { typeId: 2, deep: true, activeMenu: '/prison-affairs-public/working-dynamics' },
    component: resolve => require(['@/views/info-prison-affairs-public/add'], resolve)
  }, {
    path: '/prison-affairs-public/working-dynamics/edit/:id',
    name: '编辑工作动态',
    meta: { typeId: 2, deep: true, activeMenu: '/prison-affairs-public/working-dynamics' },
    component: resolve => require(['@/views/info-prison-affairs-public/edit'], resolve)
  }, {
    path: '/prison-affairs-public/complaints-suggestions',
    name: '投诉建议公示',
    meta: { typeId: 3 },
    component: resolve => require(['@/views/info-prison-affairs-public/list'], resolve)
  }, {
    path: '/prison-affairs-public/complaints-suggestions/add',
    name: '新增投诉/建议',
    meta: { typeId: 3, deep: true, activeMenu: '/prison-affairs-public/complaints-suggestions' },
    component: resolve => require(['@/views/info-prison-affairs-public/add'], resolve)
  }, {
    path: '/prison-affairs-public/complaints-suggestions/edit/:id',
    name: '编辑投诉/建议',
    meta: { typeId: 3, deep: true, activeMenu: '/prison-affairs-public/complaints-suggestions' },
    component: resolve => require(['@/views/info-prison-affairs-public/edit'], resolve)
  }]
}, {
  path: '/remote',
  name: '远程会见信息',
  meta: { hidden: true },
  children: [{
    path: '/remote/edit',
    name: '远程会见配置',
    meta: { role: '3', permission: 'edit' },
    component: resolve => require(['@/views/meeting/remote-edit'], resolve)
  }]
}, {
  path: '/visit',
  name: '实地探监信息',
  meta: { hidden: true },
  children: [{
    path: '/visit/config',
    name: '实地探监配置',
    props: { role: 3 },
    meta: { role: '3' },
    component: resolve => require(['@/views/meeting/visit-config'], resolve)
  }]
}]

infomation.forEach(item => {
  item.component = frame
})

export default infomation

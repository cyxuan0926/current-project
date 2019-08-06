import frame from '@/views/layout/the-frame'
// eslint-disable-next-line
import { helper } from '@/utils'

let infomation = [{
  path: '/jails',
  name: 'jails',
  meta: { hidden: true, breadcrumbName: '监狱基本信息管理' },
  children: [{
    path: '/jails/list',
    redirect: '/jails/detail'
  }, {
    path: '/jails/detail',
    name: 'jails-list',
    component: helper.loadView('jail/detail'),
    // component: resolve => require(['@/views/jail/detail'], resolve),
    meta: { permission: 'visit.prison-profile.view', breadcrumbName: '监狱基本信息' }
  }, {
    path: '/jails/edit/:id',
    name: 'jails-edit',
    meta: {
      // permission: 'edit',
      permission: 'visit.prison-profile.update',
      role: '3',
      deep: true,
      breadcrumbName: '编辑监狱基本信息'
    },
    component: helper.loadView('sadmin-prison/prison-edit')
    // component: resolve => require(['@/views/sadmin-prison/prison-edit'], resolve)
  }]
}, {
  path: '/prison-affairs-public',
  name: 'prison-affairs-public-manage',
  meta: { hidden: true, breadcrumbName: '狱务公开信息管理' },
  children: [{
    path: '/prison-affairs-public/prison-affairs-public',
    name: 'prison-affairs-public-prison-affairs-public',
    meta: { typeId: 1, hidden: true, breadcrumbName: '狱务公开' },
    component: helper.loadView('common/router-view'),
    // component: resolve => require(['@/views/common/router-view'], resolve),
    children: [
      {
        path: '/prison-affairs-public/prison-affairs-public/4',
        name: 'prison-affairs-public-sentence-parole',
        meta: { typeId: 4, permission: 'visit.sentence-parole.search', breadcrumbName: '减刑假释' },
        // component: resolve => require(['@/views/info-prison-affairs-public/list'], resolve)
        component: helper.loadView('info-prison-affairs-public/list')
      },
      {
        path: '/prison-affairs-public/prison-affairs-public/4/add',
        name: 'prison-affairs-public-sentence-parole-add',
        meta: { typeId: 4, deep: true, activeMenu: '/prison-affairs-public/prison-affairs-public/4', permission: 'visit.sentence-parole.add', breadcrumbName: '新增减刑假释' },
        // component: resolve => require(['@/views/info-prison-affairs-public/add'], resolve)
        component: helper.loadView('info-prison-affairs-public/add')
      },
      {
        path: '/prison-affairs-public/prison-affairs-public/4/edit/:id',
        name: 'prison-affairs-public-sentence-parole-edit',
        meta: { typeId: 4, deep: true, activeMenu: '/prison-affairs-public/prison-affairs-public/4', permission: 'visit.sentence-parole.update', breadcrumbName: '编辑减刑假释' },
        // component: resolve => require(['@/views/info-prison-affairs-public/edit'], resolve)
        component: helper.loadView('info-prison-affairs-public/edit')
      },
      {
        path: '/prison-affairs-public/prison-affairs-public/5',
        name: 'prison-affairs-public-execution-outside-of-prison',
        meta: { typeId: 5, permission: 'visit.execution-outside-of-prison.search', breadcrumbName: '暂予监外执行' },
        // component: resolve => require(['@/views/info-prison-affairs-public/list'], resolve)
        component: helper.loadView('info-prison-affairs-public/list')
      },
      {
        path: '/prison-affairs-public/prison-affairs-public/5/add',
        name: 'prison-affairs-public-execution-outside-of-prison-add',
        meta: { typeId: 5, deep: true, activeMenu: '/prison-affairs-public/prison-affairs-public/5', permission: 'visit.execution-outside-of-prison.add', breadcrumbName: '新增暂予监外执行' },
        // component: resolve => require(['@/views/info-prison-affairs-public/add'], resolve)
        component: helper.loadView('info-prison-affairs-public/add')
      },
      {
        path: '/prison-affairs-public/prison-affairs-public/5/edit/:id',
        name: 'prison-affairs-public-execution-outside-of-prison-edit',
        meta: { typeId: 5, deep: true, activeMenu: '/prison-affairs-public/prison-affairs-public/5', permission: 'visit.execution-outside-of-prison.update', breadcrumbName: '编辑暂予监外执行' },
        // component: resolve => require(['@/views/info-prison-affairs-public/edit'], resolve)
        component: helper.loadView('info-prison-affairs-public/edit')
      },
      {
        path: '/prison-affairs-public/prison-affairs-public/6',
        name: 'prison-affairs-public-social-education',
        meta: { typeId: 6, permission: 'visit.social-education.search', breadcrumbName: '社会帮教' },
        // component: resolve => require(['@/views/info-prison-affairs-public/list'], resolve)
        component: helper.loadView('info-prison-affairs-public/list')
      },
      {
        path: '/prison-affairs-public/prison-affairs-public/6/add',
        name: 'prison-affairs-public-social-education-add',
        meta: { typeId: 6, deep: true, activeMenu: '/prison-affairs-public/prison-affairs-public/6', permission: 'visit.social-education.add', breadcrumbName: '新增社会帮教' },
        // component: resolve => require(['@/views/info-prison-affairs-public/add'], resolve)
        component: helper.loadView('info-prison-affairs-public/add')
      },
      {
        path: '/prison-affairs-public/prison-affairs-public/6/edit/:id',
        name: 'prison-affairs-public-social-education-edit',
        meta: { typeId: 6, deep: true, activeMenu: '/prison-affairs-public/prison-affairs-public/6', permission: 'visit.social-education.update', breadcrumbName: '编辑社会帮教' },
        // component: resolve => require(['@/views/info-prison-affairs-public/edit'], resolve)
        component: helper.loadView('info-prison-affairs-public/edit')
      }
    ]
  },
  // {
  //   path: '/prison-affairs-public/prison-affairs-public/add',
  //   name: '新增狱务公开信息',
  //   meta: { typeId: 1, deep: true, permission: '' },
  //   component: resolve => require(['@/views/info-prison-affairs-public/add'], resolve)
  // }, {
  //   path: '/prison-affairs-public/prison-affairs-public/edit/:id',
  //   name: '编辑狱务公开信息',
  //   meta: { typeId: 1, deep: true, permission: '' },
  //   component: resolve => require(['@/views/info-prison-affairs-public/edit'], resolve)
  // },
  {
    path: '/prison-affairs-public/working-dynamics',
    name: 'prison-affairs-public-working-dynamics',
    meta: { typeId: 2, permission: 'visit.work-trend.search', breadcrumbName: '工作动态' },
    // component: resolve => require(['@/views/info-prison-affairs-public/list'], resolve)
    component: helper.loadView('info-prison-affairs-public/list')
  }, {
    path: '/prison-affairs-public/working-dynamics/add',
    name: 'prison-affairs-public-working-dynamics-add',
    meta: { typeId: 2, deep: true, activeMenu: '/prison-affairs-public/working-dynamics', permission: 'visit.work-trend.add', breadcrumbName: '新增工作动态' },
    // component: resolve => require(['@/views/info-prison-affairs-public/add'], resolve)
    component: helper.loadView('info-prison-affairs-public/add')
  }, {
    path: '/prison-affairs-public/working-dynamics/edit/:id',
    name: 'prison-affairs-public-working-dynamics-edit',
    meta: { typeId: 2, deep: true, activeMenu: '/prison-affairs-public/working-dynamics', permission: 'visit.work-trend.update', breadcrumbName: '编辑工作动态' },
    // component: resolve => require(['@/views/info-prison-affairs-public/edit'], resolve)
    component: helper.loadView('info-prison-affairs-public/edit')
  }, {
    path: '/prison-affairs-public/complaints-suggestions',
    name: 'prison-affairs-public-complaints-suggestions',
    meta: { typeId: 3, permission: 'visit.complaint-suggestion.search', breadcrumbName: '投诉建议公示' },
    // component: resolve => require(['@/views/info-prison-affairs-public/list'], resolve)
    component: helper.loadView('info-prison-affairs-public/list')
  }, {
    path: '/prison-affairs-public/complaints-suggestions/add',
    name: 'prison-affairs-public-complaints-suggestions-add',
    meta: { typeId: 3, deep: true, activeMenu: '/prison-affairs-public/complaints-suggestions', permission: 'visit.complaint-suggestion.add', breadcrumbName: '新增投诉/建议' },
    // component: resolve => require(['@/views/info-prison-affairs-public/add'], resolve)
    component: helper.loadView('info-prison-affairs-public/add')
  }, {
    path: '/prison-affairs-public/complaints-suggestions/edit/:id',
    name: 'prison-affairs-public-complaints-suggestions-edit',
    meta: { typeId: 3, deep: true, activeMenu: '/prison-affairs-public/complaints-suggestions', permission: 'visit.complaint-suggestion.update', breadcrumbName: '编辑投诉/建议' },
    // component: resolve => require(['@/views/info-prison-affairs-public/edit'], resolve)
    component: helper.loadView('info-prison-affairs-public/edit')
  }]
}, {
  path: '/remote',
  name: 'remote',
  meta: { hidden: true, breadcrumbName: '远程会见信息' },
  children: [{
    path: '/remote/edit',
    name: 'remote-edit-information',
    // permission: 'edit' 这里需要注意修改
    meta: { role: '3', permission: 'visit.remote-visit-configure.search', breadcrumbName: '远程会见配置' },
    // component: resolve => require(['@/views/meeting/remote-edit'], resolve)
    component: helper.loadView('meeting/remote-edit')
  }]
}, {
  path: '/visit',
  name: 'visit',
  meta: { hidden: true, breadcrumbName: '实地探监信息' },
  children: [{
    path: '/visit/config',
    name: 'visit-config',
    props: { role: 3 },
    meta: { role: '3', permission: 'visit.field-visit-configure.search', breadcrumbName: '实地探监配置' },
    // component: resolve => require(['@/views/meeting/visit-config'], resolve)
    component: helper.loadView('meeting/visit-config')
  }]
}]

infomation.forEach(item => {
  item.component = frame
})

export default infomation

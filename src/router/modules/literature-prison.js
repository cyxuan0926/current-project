import { helper } from '@/utils'

const routes = [
  {
    path: '/prison/literature-check',
    redirect: { path: '/prison/literature-check/literatures' },
    children: [{
      path: '/prison/literature-check/literatures',
      props: { role: '5', jailId: 2 },
      meta: { permission: '', breadcrumbName: '作品审核' },
      component: helper.loadView('literature/literature-check/literature-check')
    }]
  },
  {
    path: '/prison/literature-management',
    redirect: { path: '/prison/literature-management/literatures' },
    children: [{
      path: '/prison/literature-management/literatures',
      props: { role: '5', jailId: 2 },
      meta: { permission: '', breadcrumbName: '作品管理' },
      component: helper.loadView('literature/literature-management/literature-management')
    }]
  },
  {
    path: '/prison/literature-account-management',
    redirect: { path: '/prison/literature-account-management/accounts' },
    children: [{
      path: '/prison/literature-account-management/accounts',
      props: { role: '5', jailId: 2 },
      meta: { permission: '', breadcrumbName: '账户管理' },
      component: helper.loadView('literature/literature-account-management/literature-account-management')
    }]
  },
  {
    path: '/prison/literature-my',
    redirect: { path: '/prison/literature-my/literatures' },
    children: [{
      path: '/prison/literature-my/literatures',
      props: { role: '5', jailId: 2 },
      meta: { permission: '', breadcrumbName: '我的作品' },
      component: helper.loadView('literature/literature-my/literature-my')
    }]
  }
]

// routes.forEach(item => (item.component = helper.loadView('layout/the-frame')))
routes.forEach(item => (item.component = helper.loadView('common/router-view')))

export default {
  path: '/prison/literature',
  redirect: { path: '/prison/literature-check/literatures' },
  component: helper.loadView('layout/the-frame'),
  children: routes
}

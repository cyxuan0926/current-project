import frame from '@/views/layout/the-frame'
import { helper } from '@/utils'

const routes = [
  {
    path: '/literature-check-prison',
    redirect: { path: '/literature-check-prison/literatures' },
    children: [{
      path: '/literature-check-prison/literatures',
      meta: { permission: '', breadcrumbName: '作品审核' },
      component: helper.loadView('literature/literature-check/literature-check')
    }]
  },
  {
    path: '/literature-management-prison',
    redirect: { path: '/literature-management-prison/literatures' },
    children: [{
      path: '/literature-management-prison/literatures',
      meta: { permission: '', breadcrumbName: '作品管理' },
      component: helper.loadView('literature/literature-management/literature-management')
    }]
  },
  {
    path: '/literature-account-management-prison',
    redirect: { path: '/literature-account-management-prison/accounts' },
    children: [{
      path: '/literature-account-management-prison/accounts',
      meta: { permission: '', breadcrumbName: '账户管理' },
      component: helper.loadView('literature/literature-account-management/literature-account-management')
    }]
  },
  {
    path: '/literature-my-prison',
    redirect: { path: '/literature-my-prison/literatures' },
    children: [{
      path: '/literature-my-prison/literatures',
      meta: { permission: '', breadcrumbName: '我的作品' },
      component: helper.loadView('literature/literature-my/literature-my')
    }]
  },
  {
    path: '/literature-sensitive-characters-prison',
    redirect: { path: '/literature-sensitive-characters-prison/characters' },
    children: [{
      path: '/literature-sensitive-characters-prison/characters',
      meta: { permission: '', breadcrumbName: '敏感字符集' },
      component: helper.loadView('literature/literature-sensitive-characters/literature-sensitive-characters')
    }]
  }
]

routes.forEach(item => (item.component = frame))

export default routes

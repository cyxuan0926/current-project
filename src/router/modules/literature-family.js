import { helper } from '@/utils'

const routes = [
  {
    path: '/family/literature-check',
    redirect: { path: '/family/literature-check/literatures' },
    children: [{
      path: '/family/literature-check/literatures',
      props: { role: '6' },
      meta: { permission: '', breadcrumbName: '作品审核' },
      component: helper.loadView('literature/literature-check/literature-check')
    }]
  },
  {
    path: '/family/literature-management',
    redirect: { path: '/family/literature-management/literatures' },
    children: [{
      path: '/family/literature-management/literatures',
      props: { role: '6' },
      meta: { permission: '', breadcrumbName: '作品管理' },
      component: helper.loadView('literature/literature-management/literature-management')
    }]
  },
  {
    path: '/family/literature-account-management',
    redirect: { path: '/family/literature-account-management/accounts' },
    children: [{
      path: '/family/literature-account-management/accounts',
      props: { role: '6' },
      meta: { permission: '', breadcrumbName: '账户管理' },
      component: helper.loadView('literature/literature-account-management/literature-account-management')
    }]
  },
  {
    path: '/family/literature-sensitive-characters',
    redirect: { path: '/family/literature-sensitive-characters/characters' },
    children: [{
      path: '/family/literature-sensitive-characters/characters',
      props: { role: '6' },
      meta: { permission: '', breadcrumbName: '敏感字符集' },
      component: helper.loadView('literature/literature-sensitive-characters/literature-sensitive-characters')
    }]
  }
]

// routes.forEach(item => (item.component = helper.loadView('layout/the-frame')))
routes.forEach(item => (item.component = helper.loadView('common/router-view')))

export default {
  path: '/family/literature',
  redirect: { path: '/family/literature-check/literatures' },
  component: helper.loadView('layout/the-frame'),
  children: routes
}

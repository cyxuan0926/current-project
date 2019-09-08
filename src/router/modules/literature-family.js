import frame from '@/views/layout/the-frame'
import { helper } from '@/utils'

const routes = [
  {
    path: '/literature-check',
    redirect: { path: '/literature-check/literatures' },
    children: [{
      path: '/literature-check/literatures',
      meta: { permission: '', breadcrumbName: '作品审核' },
      component: helper.loadView('literature/literature-check/literature-check')
    }]
  },
  {
    path: '/literature-management',
    redirect: { path: '/literature-management/literatures' },
    children: [{
      path: '/literature-management/literatures',
      meta: { permission: '', breadcrumbName: '作品管理' },
      component: helper.loadView('literature/literature-management/literature-management')
    }]
  },
  {
    path: '/literature-account-management',
    redirect: { path: '/literature-account-management/accounts' },
    children: [{
      path: '/literature-account-management/accounts',
      meta: { permission: '', breadcrumbName: '账户管理' },
      component: helper.loadView('literature/literature-account-management/literature-account-management')
    }]
  },
  {
    path: '/literature-my',
    redirect: { path: '/literature-my/literatures' },
    children: [{
      path: '/literature-my/literatures',
      meta: { permission: '', breadcrumbName: '我的作品' },
      component: helper.loadView('literature/literature-my/literature-my')
    }]
  },
  {
    path: '/literature-sensitive-characters',
    redirect: { path: '/literature-sensitive-characters/characters' },
    children: [{
      path: '/literature-sensitive-characters/characters',
      meta: { permission: '', breadcrumbName: '敏感字符集' },
      component: helper.loadView('literature/literature-sensitive-characters/literature-sensitive-characters')
    }]
  }
]

routes.forEach(item => (item.component = frame))

export default routes

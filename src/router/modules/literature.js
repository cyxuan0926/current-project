const routes = [
  {
    path: '/literature-check',
    redirect: { path: '/literature-check/literatures' },
    children: [
      {
        path: '/literature-check/literatures',
        meta: {
          componentsToKeepAlive: ['LiteratureCheck'],
          permission: 'visit.literature-check.search',
          breadcrumbName: '作品审核'
        },
        component: 'literature/literature-check/literature-check'
      },
      {
        path: '/literature-check/literature-preview/:id',
        meta: {
          componentsUnRemoveKeepAlive: ['LiteratureCheck'],
          permission: 'visit.literature-check.search',
          breadcrumbName: '作品详情'
        },
        component: 'literature/literature-preview/literature-preview'
      }
    ]
  },
  {
    path: '/literature-management',
    redirect: { path: '/literature-management/literatures' },
    children: [
      {
        path: '/literature-management/literatures',
        meta: {
          componentsToKeepAlive: ['LiteratureManagement'],
          permission: 'visit.literature-management.search',
          breadcrumbName: '作品管理'
        },
        component: 'literature/literature-management/literature-management'
      },
      {
        path: '/literature-management/literature-preview/:id',
        meta: {
          componentsUnRemoveKeepAlive: ['LiteratureManagement'],
          permission: 'visit.literature-management.search',
          breadcrumbName: '作品详情'
        },
        component: 'literature/literature-preview/literature-preview'
      }
    ]
  },
  {
    path: '/literature-account-management',
    redirect: { path: '/literature-account-management/accounts' },
    children: [
      {
        path: '/literature-account-management/accounts',
        meta: {
          permission: 'visit.literature-account-management.search',
          breadcrumbName: '作品账户管理'
        },
        component:
          'literature/literature-account-management/literature-account-management'
      }
    ]
  },
  {
    path: '/literature-sensitive-characters',
    redirect: { path: '/literature-sensitive-characters/characters' },
    children: [
      {
        path: '/literature-sensitive-characters/characters',
        meta: {
          permission: 'visit.sensitive-word.search',
          breadcrumbName: '敏感字符集'
        },
        component:
          'literature/literature-sensitive-characters/literature-sensitive-characters'
      }
    ]
  },
  {
    path: '/literature-my',
    redirect: { path: '/literature-my/literatures' },
    children: [
      {
        path: '/literature-my/literatures',
        meta: {
          permission: 'visit.literature-my.search',
          breadcrumbName: '我的作品'
        },
        component: 'literature/literature-my/literature-my'
      },
      {
        path: '/literature-my/literature-create',
        meta: {
          permission: 'visit.literature-my.add',
          breadcrumbName: '发表作品'
        },
        component: 'literature/literature-detail/literature-detail'
      },
      {
        path: '/literature-my/literature-update/:id',
        meta: {
          permission: 'visit.literature-my.update',
          breadcrumbName: '修改作品'
        },
        component: 'literature/literature-detail/literature-detail'
      }
    ]
  }
]

routes.forEach(item => (item.component = 'layout/the-frame'))

export default routes

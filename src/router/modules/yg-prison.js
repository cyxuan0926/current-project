const routes = [
  {
    path: '/yg-prison',
    name: 'YgPrison',
    meta: {
      breadcrumbName: '阳光监狱信息管理',
      hidden: true
    },
    children: [
      {
        path: '/yg-prison/prison-administration/list',
        name: 'YgPrisonPrisonAdministrationList',
        props: { hasPrisonAreaAuth: true },
        meta: { permission: 'visit.yg-prison.prison-administration-jail.search', breadcrumbName: '狱政管理查询' },
        component: 'yg-prison-module/prison-administration/list'
      }, {
        path: '/yg-prison/execution-punishment/list',
        name: 'YgPrisonExecutionPunishmentList',
        props: { hasPrisonAreaAuth: true },
        meta: { permission: 'visit.yg-prison.execution-punishment-jail.search', breadcrumbName: '刑罚执行查询' },
        component: 'yg-prison-module/execution-punishment/list'
      }, {
        path: '/yg-prison/educational-transformation/list',
        name: 'YgPrisonEducationalTransformationList',
        props: { hasPrisonAreaAuth: true },
        meta: { permission: 'visit.yg-prison.educational-transformation-jail.search', breadcrumbName: '教育改造查询' },
        component: 'yg-prison-module/educational-transformation/list'
      }, {
        path: '/yg-prison/life-hygiene/list',
        name: 'YgPrisonLifeHygieneList',
        props: { hasPrisonAreaAuth: true },
        meta: { permission: 'visit.yg-prison.life-hygiene-jail.search', breadcrumbName: '生活卫生查询' },
        component: 'yg-prison-module/life-hygiene/list'
      }, {
        path: '/yg-prison/labor-reform/list',
        name: 'YgPrisonLaborReformList',
        props: { hasPrisonAreaAuth: true },
        meta: { permission: 'visit.yg-prison.labor-reform-jail.search', breadcrumbName: '劳动改造查询' },
        component: 'yg-prison-module/labor-reform/list'
      }
    ]
  }
]

routes.forEach(item => (item.component = 'layout/the-frame'))

export default routes

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
        name: 'FamilyPhoneFamiliesManageList',
        props: { hasPrisonAreaAuth: true },
        meta: { permission: 'visit.yg-prison.prison-administration-jail.search', breadcrumbName: '狱政管理查询' },
        component: 'yg-prison-module/prison-administration/list'
      }, {
        path: '/family-phone-manage/phone/list',
        name: 'FamilyPhoneList',
        props: { hasPrisonAreaAuth: true },
        meta: { permission: 'visit.yg-prison.prison-administration-jail.search', breadcrumbName: '刑罚执行查询' },
        component: 'family-phone/phone'
      }, {
        path: '/family-phone-manage/conversation-cost-detail/list',
        name: 'FamilyPhoneManageConversationCostDetailList',
        props: { hasPrisonAreaAuth: true },
        meta: { permission: 'visit.yg-prison.prison-administration-jail.search', breadcrumbName: '教育改造查询' },
        component: 'family-phone/conversation-cost-detail/list'
      }, {
        path: '/family-phone-manage/phone-cost',
        name: 'FamilyPhoneManagePhoneCost',
        props: { hasPrisonAreaAuth: true },
        meta: { permission: 'visit.yg-prison.prison-administration-jail.search', breadcrumbName: '生活卫生查询' },
        component: 'family-phone/phone/phone-cost-list'
      }, {
        path: '/family-phone-manage/phone-statistics-list',
        name: 'FamilyStatisticsList',
        props: { hasPrisonAreaAuth: true },
        meta: { permission: 'visit.yg-prison.prison-administration-jail.search', breadcrumbName: '劳动改造查询' },
        component: 'family-phone/phone/phone-statistics-list'
      }
    ]
  }
]

routes.forEach(item => (item.component = 'layout/the-frame'))

export default routes

const routes = [
  {
    path: '/family-phone-manage',
    name: 'FamilyPhoneManage',
    meta: {
      breadcrumbName: '亲情电话管理',
      hidden: true
    },
    children: [
      {
        path: '/family-phone-manage/families/list',
        name: 'FamilyPhoneFamiliesManageList',
        props: { hasPrisonAreaAuth: true },
        meta: { permission: 'visit.family-phone.families-jail.search', breadcrumbName: '亲情电话家属管理' },
        component: 'family-phone/families/list'
      }, {
        path: '/family-phone-manage/phone/list',
        name: 'FamilyPhoneList',
        props: { hasPrisonAreaAuth: true },
        meta: { permission: 'visit.family-phone.phone-jail.search', breadcrumbName: '亲情电话申请管理' },
        component: 'family-phone/phone'
      }, {
        path: '/family-phone-manage/conversation-cost-detail/list',
        name: 'FamilyPhoneManageConversationCostDetailList',
        props: { hasPrisonAreaAuth: true },
        meta: { permission: 'visit.family-phone.conversation-cost-detail.search', breadcrumbName: '亲情电话通话费用详情报表' },
        component: 'family-phone/conversation-cost-detail/list'
      }, {
        path: '/family-phone-manage/phone-cost',
        name: 'FamilyPhoneManagePhoneCost',
        props: { hasPrisonAreaAuth: true },
        meta: { permission: 'visit.family-phone-cost.search', breadcrumbName: '亲情电话通话费用结算报表' },
        component: 'family-phone/phone/phone-cost-list'
      }, {
        path: '/family-phone-manage/phone-statistics-list',
        name: 'FamilyStatisticsList',
        props: { hasPrisonAreaAuth: true },
        meta: { permission: 'visit.family-phone.phone-statistics-jail.search', breadcrumbName: '亲情电话通话统计表' },
        component: 'family-phone/phone/phone-statistics-list'
      }, {
        path: '/family-phone-manage/phone-supervise',
        name: 'FamilyPhoneSupervise',
        meta: { permission: 'visit.family-phone.phone-supervise', breadcrumbName: '亲情电话监管表' },
        props: { hasPrisonAreaAuth: true },
        component: 'family-phone/supervise/index'
      }
    ]
  }
]

routes.forEach(item => (item.component = 'layout/the-frame'))

export default routes

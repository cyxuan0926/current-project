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
      }
    ]
  }
]

routes.forEach(item => (item.component = 'layout/the-frame'))

export default routes

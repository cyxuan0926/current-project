let common = [{
  path: '/',
  meta: { hidden: true },
  component: 'layout/the-frame',
  children: [{
    path: '/dashboard',
    name: '工作台',
    // component: resolve => require(['@/views/dashboard/dashboard'], resolve)
    component: 'dashboard/dashboard'
  }]
}, {
  path: '/password/edit',
  name: '修改密码',
  meta: { notLogin: true },
  // component: resolve => require(['@/views/password/password-edit'], resolve)
  component: 'password/password-edit'
}, {
  path: '/login',
  name: '登录',
  meta: { notLogin: true },
  component: 'login/login'
  // component: resolve => require(['@/views/login/login'], resolve)
}, {
  path: '/slient-login',
  name: 'SlientLogin',
  meta: { notLogin: true },
  component: 'login/slient-login'
  // component: resolve => require(['@/views/login/login'], resolve)
}, {
  path: '/app_preview',
  name: 'app下载',
  component: 'layout/the-frame',
  meta: { hidden: true },
  children: [{
    path: '/app_preview/family_download',
    name: '家属版app',
    meta: { notLogin: true },
    // component: resolve => require(['@/views/download/app-family'], resolve)
    component: 'download/app-family'
  }, {
    path: '/app_preview/prison_download',
    name: '监狱版app',
    meta: { notLogin: true },
    // component: resolve => require(['@/views/download/app-prison'], resolve)
    component: 'download/app-prison'
    // component: helper.loadView('download/app-prison')
  }, {
    path: '/app_preview/police_download',
    name: '狱警版app',
    meta: { notLogin: true },
    component: 'download/app-police'
  }]
}, {
  path: '/download',
  name: '文件下载',
  component: 'layout/the-frame',
  meta: { hidden: true },
  children: [{
    path: '/download/operation',
    name: '操作手册',
    meta: { notLogin: true },
    // component: resolve => require(['@/views/download/operation'], resolve)
    component: 'download/operation'
  }]
}, {
  // 账号加安全问题找回密码的逻辑
  path: '/password_retrieve',
  name: 'password-retrieve',
  meta: { hidden: true },
  component: 'password/password-retrieve',
  children: [{
    path: '/password_retrieve/step_one',
    name: 'password-retrieve-one',
    meta: { notLogin: true, step: 1 },
    component: 'password/password-retrieve-step-one'
  }, {
    path: '/password_retrieve/step_two',
    name: 'password-retrieve-two',
    props: { step: 2 },
    meta: { notLogin: true, step: 2 },
    component: 'password/password-retrieve-step-two'
  }, {
    path: '/password_retrieve/step_three',
    name: 'password-retrieve-three',
    meta: { notLogin: true, step: 3 },
    component: 'password/password-retrieve-step-three'
  }]
}, {
  path: '/password_retrieve/byPhone',
  name: 'passwordRetrieveByPhone',
  meta: { notLogin: true },
  component: 'password/phone-code'
}, {
  path: '*',
  redirect: '/dashboard'
}]

export default common

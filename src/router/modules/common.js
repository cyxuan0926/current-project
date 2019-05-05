import frame from '@/views/layout/the-frame'

let common = [{
  path: '/',
  meta: { hidden: true },
  component: frame,
  children: [{
    path: '/dashboard',
    name: '工作台',
    component: resolve => require(['@/views/dashboard/dashboard'], resolve)
  }, {
    path: '/password/edit',
    name: '修改密码',
    component: resolve => require(['@/views/password/password-edit'], resolve)
  }]
}, {
  path: '/login',
  name: '登录',
  meta: { notLogin: true },
  component: resolve => require(['@/views/login/login'], resolve)
}, {
  path: '/app_preview',
  name: 'app下载',
  component: frame,
  meta: { hidden: true },
  children: [{
    path: '/app_preview/family_download',
    name: '家属版app',
    meta: { notLogin: true },
    component: resolve => require(['@/views/download/app-family'], resolve)
  }, {
    path: '/app_preview/prison_download',
    name: '监狱版app',
    meta: { notLogin: true },
    component: resolve => require(['@/views/download/app-prison'], resolve)
  }]
}, {
  path: '/download',
  name: '文件下载',
  component: frame,
  meta: { hidden: true },
  children: [{
    path: '/download/operation',
    name: '操作手册',
    meta: { notLogin: true },
    component: resolve => require(['@/views/download/operation'], resolve)
  }]
}]

export default common

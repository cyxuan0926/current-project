import frame from '@/views/layout/the-frame'
// eslint-disable-next-line
import { helper } from '@/utils'

let common = [{
  path: '/',
  meta: { hidden: true },
  component: frame,
  children: [{
    path: '/dashboard',
    name: '工作台',
    // component: resolve => require(['@/views/dashboard/dashboard'], resolve)
    component: helper.loadView('dashboard/dashboard')
  }, {
    path: '/password/edit',
    name: '修改密码',
    // component: resolve => require(['@/views/password/password-edit'], resolve)
    component: helper.loadView('password/password-edit')
  }]
}, {
  path: '/login',
  name: '登录',
  meta: { notLogin: true },
  component: helper.loadView('login/login')
  // component: resolve => require(['@/views/login/login'], resolve)
}, {
  path: '/app_preview',
  name: 'app下载',
  component: frame,
  meta: { hidden: true },
  children: [{
    path: '/app_preview/family_download',
    name: '家属版app',
    meta: { notLogin: true },
    // component: resolve => require(['@/views/download/app-family'], resolve)
    component: helper.loadView('download/app-family')
  }, {
    path: '/app_preview/prison_download',
    name: '监狱版app',
    meta: { notLogin: true },
    // component: resolve => require(['@/views/download/app-prison'], resolve)
    component: helper.loadView('download/app-prison')
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
    // component: resolve => require(['@/views/download/operation'], resolve)
    component: helper.loadView('download/operation')
  }]
}]

export default common

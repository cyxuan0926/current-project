import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index'
import { helper } from '@/utils'

import common from './modules/common'
import superAdmin from './modules/superAdmin'
import admin from './modules/admin'
import check from './modules/check'
import information from './modules/information'
import literature from './modules/literature'

import familyPhone from './modules/family-phone'

import ygPrison from './modules/yg-prison'

const routes = [
  ...superAdmin,
  ...admin,
  ...check,
  ...information,
  ...literature,
  ...common,
  ...familyPhone,
  ...ygPrison
]

/**
 *
 * @param {*} routes:当前的路由数组
 * 为了修复动态添加路由之后重复挂载frame组件
 */
const mapLoadComponet = (routes) => {
  return routes.map(route => {
    if (route.component) {
      route.component = helper.loadView(route.component)
    }

    if (route.children) {
      return mapLoadComponet(route.children)
    }
  })
}

mapLoadComponet(routes)

Vue.use(Router)

// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push

Router.prototype.push = function push(location) {
  try {
    return originalPush.call(this, location)
  }
  catch (err) {
    Promise.reject(err)
  }
}

const originalReplace = Router.prototype.replace

Router.prototype.replace = function replace(location) {
  try {
    return originalReplace.call(this, location)
  }
  catch (err) {
    Promise.reject(err)
  }
}

const router = new Router({
  mode: 'history',
  routes,
  linkActiveClass: 'active-menu',
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    else if (to.hash) {
      return { selector: to.hash }
    }
    else {
      return { x: 0, y: 0 }
    }
  }
})

// 登录校验
router.beforeEach((to, from, next) => {
  const isLogin = localStorage.getItem('accountInfo')
  if (isLogin) {
    if (to.path.startsWith('/login')) {
      next({ path: '/dashboard', replace: true })
    }
    else {
      next()
    }
  }
  else {
    if (to.meta.notLogin) {
      next()
    }
    else {
      next({ path: '/login', replace: true, query: { redirect: to.fullPath } })
    }
  }
})

// 路由权限校验
router.beforeEach((to, from, next) => {
  const permission = store.state.account.authorities
  if (permission.includes('all') || permission.includes(to.meta.permission) || !to.meta.permission) {
    next()
  }
  else {
    next({ path: '/dashboard', replace: true })
  }
})

router.beforeEach((to, from, next) => {
  if (to.meta.hidden) {
    next({ path: '/dashboard', replace: true })
  }
  else {
    next()
  }
})

// 动态缓存组件
router.beforeEach((to, from, next) => {
  // 移除缓存组件
  if (to.meta.componentsUnRemoveKeepAlive) {
    const componentsKeepAlive = [...new Set([
      ...store.state.global.componentsKeepAlive
    ])]
    const components = componentsKeepAlive.filter(comp => {
      return to.meta.componentsUnRemoveKeepAlive.includes(comp)
    })

    store.commit('setComponentsKeepAlive', components)
  }
  else {
    store.commit('setComponentsKeepAlive', [])
  }

  // 缓存组件
  if (to.meta.componentsToKeepAlive) {
    const components = new Set([
      ...to.meta.componentsToKeepAlive,
      ...store.state.global.componentsKeepAlive
    ])

    store.commit('setComponentsKeepAlive', [...components])
  }

  next()
})

export default router

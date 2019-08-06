import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index'

import admin from './modules/admin'
import check from './modules/check'
import common from './modules/common'
import information from './modules/information'
import superAdmin from './modules/superAdmin'

// 重置路由: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
  store.commit('setDynamicRoutes', [])
}

Vue.use(Router)

// const noAuthRoute = ['/dashboard', '/password/edit', '/app_preview/family_download', '/app_preview/prison_download', '/download/operation', '/login']

const createRouter = () => new Router({
  mode: 'history',
  // routes: [...common, ...check, ...admin, ...information, ...superAdmin],
  routes: common,
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

const router = createRouter()

const dynamicAddRoutes = (auth, menuRoutes) => {
  let DynamicRoutes = []
  for (let permission of auth) {
    for (let routes of menuRoutes) {
      if (routes.meta && routes.meta.length && routes.meta.permission === permission) {
        DynamicRoutes.push(routes)
        break
      }
      if (routes.children && routes.children.length) {
        const result = mapChildren(routes.children, permission)
        if (result) {
          DynamicRoutes.push(routes)
          break
        }
      }
    }
  }
  DynamicRoutes.push({
    path: '*',
    redirect: '/dashboard'
  })
  return Array.from(new Set(DynamicRoutes))
}
const mapChildren = (auth, permission) => {
  for (let val of auth) {
    if (val.meta && val.meta.permission && val.meta.permission === permission) return val
    if (val.children && val.children.length) {
      const result = mapChildren(val.children, permission)
      if (result) return result
    }
  }
}

// 动态添加路由 这里
router.beforeEach((to, from, next) => {
  // const role = store.state.global.user.role
  const hasDynamicRoutes = store.state.global.dynamicRoutes.length > 0
  const permission = store.state.account.authorities
  if (permission && permission.length && !hasDynamicRoutes) {
    const routes = dynamicAddRoutes(permission, [...superAdmin, ...information, ...admin, ...check])
    router.addRoutes(routes)
    store.commit('setDynamicRoutes', routes)
    next({ ...to, replace: true })
  }
  if (!to.meta.notLogin) {
    let isLogin = localStorage.getItem('accountInfo')
    if (!isLogin) {
      next({ path: '/login', replace: true, query: { redirect: to.fullPath } })
      return
    }
  }
  if (to.meta.hidden) {
    next({ path: '/dashboard', replace: true })
    return
  }
  if (permission.includes(to.meta.permission)) {
    next()
    return
  }
  // if (!permission.includes(to.meta.permission) && !noAuthRoute.includes(to.path)) {
  //   next({ path: '/dashboard', replace: true })
  //   return
  // }
  // if (role && !hasDynamicRoutes) {
  //   /**
  //    * 超级管理员（role=0）
  //    * 审核人员（role=1）
  //    * 信息管理员（role=3）
  //    * 监狱管理员（role=4）
  //    * 租户管理员 (role=-1)
  //    */
  //   const routesMap = [superAdmin, check, [], information, admin]
  //   let routes = routesMap[JSON.parse(role)]
  //   if (JSON.parse(role) === -1) routes = [...admin, ...information, ...check]
  //   if (!routes.includes(notFoundRoute)) routes.push(notFoundRoute)
  //   router.addRoutes(routes)
  //   store.commit('setDynamicRoutes', routes)
  //   next({ ...to, replace: true })
  // }
  next()
})

// router.onError(error => {
//   const pattern = /Loading chunk (\d)+ failed/g
//   const isChunkLoadFailed = error.message.match(pattern)
//   const targetPath = router.history.pending.fullPath
//   if (isChunkLoadFailed) router.replace(targetPath)
// })

export default router

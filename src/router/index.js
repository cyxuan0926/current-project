import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index'

import admin from './modules/admin'
import check from './modules/check'
import common from './modules/common'
import information from './modules/information'
import superAdmin from './modules/superAdmin'

Vue.use(Router)

const notFoundRoute = {
  path: '*',
  redirect: '/dashboard'
}

const createRouter = () => new Router({
  mode: 'history',
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

// 重置路由: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
  store.commit('setDynamicRoutes', [])
}

// 动态添加路由
router.beforeEach((to, form, next) => {
  const role = store.state.global.user.role
  const hasDynamicRoutes = store.state.global.dynamicRoutes.length > 0

  if (role && !hasDynamicRoutes) {
    /**
     * 超级管理员（role=0）
     * 审核人员（role=1）
     * 商品管理员（role=2）
     * 信息管理员（role=3）
     * 监狱管理员（role=4）
     */
    const routesMap = [superAdmin, check, null, information, admin]
    const routes = routesMap[JSON.parse(role)]

    routes.push(notFoundRoute)
    router.addRoutes(routes)
    store.commit('setDynamicRoutes', routes)
    next({ ...to, replace: true })
  }

  next()
})

export default router

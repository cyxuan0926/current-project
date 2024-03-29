import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index'

import admin from './modules/admin'
import check from './modules/check'
import common from './modules/common'
import information from './modules/information'
import superAdmin from './modules/superAdmin'
// import literatureFamily from './modules/literature-family'
// import literaturePrison from './modules/literature-prison'
import literature from './modules/literature'

import md5 from 'js-md5'
import { helper } from '@/utils'

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
  routes: common,
  // routes: [...common, literatureFamily, literaturePrison],
  // routes: [...common, literatureFamily, literaturePrison, ...check, ...admin, ...information, ...superAdmin, { path: '*', redirect: '/dashboard' }],
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

// 获取菜单或者当前路由权限数组
/**
 *
 * @param {*} menus 菜单数组或者路由数组
 * @param {*} accumulator 累加器 结果为所有的权限数组
 */
// eslint-disable-next-line
const handlePermissions = (menus, accumulator = []) => {
  menus.map(val => {
    if (val.permission || (val.meta && val.meta.permission)) accumulator.push(val.permission || val.meta.permission)
    if (val.children && val.children.length) handlePermissions(val.children, accumulator)
  })
  return accumulator
}
/**
 *
 * @param {*} menusAuthorities 当前用户所有的菜单权限
 * @param {*} routes 定义的所有路由数组
 * @param {*} result 当前用户的精确的路由数组
 * 现在的目标是优化算法 减少遍历范围 做到精确获取
 * 1.就是先遍历出菜单数组对应的全部权限 去遍历这个数组 获取当前权限对应的路由对象
 * 2.再去遍历当前权限所对应的路由对象 得到其全部的权限 再和服务器返回给的权限数组做比较 来精确匹配路由
 * 3.再过滤掉菜单数组中当前路由对象的权限、权限数组的权限 路由数组里面的当前路由对象
 * 4.重复上面步骤
 * 注 都是引用类型 需要用他的副本拷贝
 */
// eslint-disable-next-line
const dynamicAddRoutes = (rootmenusAuthorities = [], routes = [], currentUsersAuth = [], result = [{ path: '*', redirect: '/dashboard' }]) => {
  rootmenusAuthorities.some(auth => {
    let { currentRouter, filterRoutes } = getCurrenRouter(auth, routes)
    if (currentRouter.length) {
      let currentRouterAuth = handlePermissions(currentRouter),
        { menusAuthorities, authorities, ownRouterAuthorities } = filterAuthorities(currentUsersAuth, currentRouterAuth, rootmenusAuthorities)
      getExactCurrentRouter(currentRouter, ownRouterAuthorities)
      mapLoadComponet(currentRouter)
      result.push(...currentRouter)
      return dynamicAddRoutes(menusAuthorities, filterRoutes, authorities, result)
    }
  })
  return result
}
/**
 *
 * @param {*} router 当前路由对象的子路由数组
 * @param {*} permission 当前的菜单权限
 * 返回 当前菜单权限是否匹配当前路由对象
 */
// eslint-disable-next-line
const mapChildren = (permission = '', router = []) => {
  return router.some(route => {
    if (route.children && route.children.length) return mapChildren(permission, route.children)
    return route.meta && route.meta.permission && route.meta.permission === permission
  })
}
/**
 *
 * @param {*} permission 当前的菜单权限
 * @param {*} routes 路由数组
 * 返回 当前权限 所匹配到的路由对象 已经过滤了当前路由对象的路由数组
 * 这里考虑不全面
 */
// eslint-disable-next-line
const getCurrenRouter = (permission = '', routes = []) => {
  let currentRouter = routes.filter(route => {
      if (route.meta && route.meta.permission && route.meta.permission === permission) return true
      if (route.children && route.children.length) return mapChildren(permission, route.children)
    }), filterRoutes = new Set(routes)
  // if (filterRoutes.has(...currentRouter)) filterRoutes.delete(...currentRouter)
  currentRouter.map(router => {
    if (filterRoutes.has(router)) filterRoutes.delete(router)
  })
  return { currentRouter, filterRoutes: [...filterRoutes] }
}
/**
 *
 * @param {*} authorities 当前用户所有的权限
 * @param {*} currentRouterAuthorities 当前路由对象所有的菜单权限
 * @param {*} menusAuthorities 当前用户的所有菜单权限
 * 返回 过滤后的用户的所有权限 和对应菜单拥有的菜单权限 所有菜单权限
 */
// eslint-disable-next-line
const filterAuthorities = (authorities = [], currentRouterAuthorities = [], menusAuthorities = []) => {
  let ownRouterAuthorities = currentRouterAuthorities.filter(currentRouterAuth => {
    const passed = authorities.some(auth => {
      return auth === currentRouterAuth && authorities.splice(authorities.indexOf(auth), 1)
    })
    if (passed && menusAuthorities.includes(currentRouterAuth)) menusAuthorities.splice(menusAuthorities.indexOf(currentRouterAuth), 1)
    return passed
  })
  return { ownRouterAuthorities, menusAuthorities, authorities }
}
// eslint-disable-next-line
const getExactCurrentRouter = (currentRouter, ownRouterAuthorities) => {
  currentRouter.map(router => {
    if (router.children && router.children.length) return getExactCurrentChildrenRouter(router.children, ownRouterAuthorities)
  })
  return currentRouter
}
/**
 *
 * @param {*} routers
 * @param {*} auth
 */
// eslint-disable-next-line
const getExactCurrentChildrenRouter = (routers, auth) => {
  let temp = routers.map(router => {
    if (router.children && router.children.length) return getExactCurrentChildrenRouter(router.children, auth)
    return !router.redirect && !(router.meta && router.meta.permission && auth.includes(router.meta.permission))
  })
  filterRoutes(temp, routers)
  return !temp.includes(false)
}
/**
 *
 * @param {*} filterResult:路由是否再该用户的权限之内
 * @param {*} routes:当前遍历的路由的children
 */
// eslint-disable-next-line
const filterRoutes = (filterResult, routes) => {
  filterResult.map((val, index) => {
    if (val) {
      routes.splice(index, 1)
      filterResult.splice(index, 1)
      return filterRoutes(filterResult, routes)
    }
  })
}
/**
 *
 * @param {*} routes:当前的路由数组
 * 为了修复动态添加路由之后重复挂载frame组件
 */
// eslint-disable-next-line
const mapLoadComponet = routes => {
  return routes.map(childRouter => {
    if (childRouter.component) childRouter.component = helper.loadView(childRouter.component)
    if (childRouter.children) return mapLoadComponet(childRouter.children)
  })
}

// eslint-disable-next-line
const md5RoleId = (userRoles) => md5(userRoles.map(val => val.roleId).join(''))

// 动态添加路由
router.beforeEach((to, from, next) => {
  const hasDynamicRoutes = store.state.global.dynamicRoutes.length > 0
  const memoryDynamicRoutes = store.state.global.memoryDynamicRoutes
  const permission = store.state.account.authorities
  if (permission && permission.length && !hasDynamicRoutes) {
    // 函数记忆 受限的地方很多 不同监狱的同一角色相同权限的roleId不一样 因为sessiStorage只能存储字符串 所有对象里面的函数也存不了 所有只能是在不刷新的情况下才有限
    let routes, { userRoles } = store.state.account.publicUserInfo, keys = md5RoleId(userRoles), clonePermission = permission.slice(0),
      cloneDeepRoutes = _.cloneDeep([...superAdmin, ...information, ...admin, ...check, ...literature]), testmenusAuth = handlePermissions(store.state.account.menus)
    if (memoryDynamicRoutes.hasOwnProperty(keys)) {
      routes = memoryDynamicRoutes[keys]
    }
    else {
      routes = dynamicAddRoutes(testmenusAuth, cloneDeepRoutes, clonePermission)
      store.commit('setMemoryDynamicRoutes', { routes, memoryId: keys })
    }
    router.addRoutes(routes)
    store.commit('setDynamicRoutes', routes)
    next({ ...to, replace: true })
    return
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
  //   // return
  // }
  next()
})

// router.onError(error => {
//   const pattern = /Loading chunk (\d)+ failed/g
//   const isChunkLoadFailed = error.message.match(pattern)
//   const targetPath = router.history.pending.fullPath
//   if (isChunkLoadFailed) router.replace(targetPath)
// })

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

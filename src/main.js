import Vue from 'vue'
import App from '@/app'
import router from './router'
import ElementUI from 'element-ui'
import store from './store'
import filters from './filters'
import components from '@/components'
import urls from '@/service/urls'

import '@/assets/fonts/iconfont.css'
import 'element-ui/lib/theme-chalk/index.css'
import 'quill/dist/quill.snow.css'
import 'viewerjs/dist/viewer.css'
import '@/assets/css/main.scss'
import '@/assets/css/index.scss'

Vue.use(ElementUI)

Vue.config.productionTip = false

Vue.prototype.$urls = urls

// 声明过滤器
Object.keys(filters).forEach((key) => Vue.filter(key, filters[key]))

// 声明公共功能组件
Object.keys(components).forEach((key) => {
  let name = key.replace(/(\w)/, (v) => v.toUpperCase())
  Vue.component(`m${ name }`, components[key])
})

router.beforeEach((to, from, next) => {
  if (!to.meta.notLogin) {
    let isLogin = localStorage.getItem('user')
    if (!isLogin) {
      next({ path: '/login', replace: true, query: { redirect: to.fullPath } })
      store.commit('setLoginState')
    }
  }
  if (to.meta.hidden) next({ path: '/dashboard', replace: true })
  next()
})

router.onError(error => {
  const pattern = /Loading chunk (\d)+ failed/g
  const isChunkLoadFailed = error.message.match(pattern)
  const targetPath = router.history.pending.fullPath
  if (isChunkLoadFailed) router.replace(targetPath)
})
window.router = router
/* eslint-disable no-new */
new Vue({
  el: '#layout',
  router,
  store,
  template: '<App/>',
  components: { App }
})

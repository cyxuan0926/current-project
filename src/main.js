import Vue from 'vue'
// import VueWebsocket from 'vue-websocket'
import App from '@/app'
import router from './router'
import ElementUI from 'element-ui'
import store from './store'
import filters from './filters'
import components from '@/components'
import config from '@/service/config/base'
import '../static/bootstrap/js/bootstrap.min.js'
import '../static/dist/js/app.min.js'

import '../static/bootstrap/css/bootstrap.min.css'
import '../static/dist/css/AdminLTE.min.css'
import '../static/dist/css/skins/_all-skins.min.css'
import '@/assets/fonts/iconfont.css'
import '@/assets/icons/iconfont.css'
import 'element-ui/lib/theme-chalk/index.css'
import 'quill/dist/quill.snow.css'
import 'viewerjs/dist/viewer.css'
import '@/assets/css/main.css'

Vue.use(ElementUI)
// Vue.use(VueWebsocket, 'wss://pandax.mofasion.com/ws/7')
// Vue.use(VueWebsocket, `ws://120.78.190.101/ws/2`)

Vue.config.productionTip = false

// Vue.prototype._$baseUrl = 'https://www.yuwugongkai.com'

// Vue.prototype._$agency = 'http://10.10.10.2:8081/ywgk'

// Vue.prototype._$agency = 'http://39.108.185.51:1339'

Vue.prototype._$agency = `${ config.baseURL }image-server`

// Vue.prototype._$agency = 'http://10.10.10.127:8081';

// Vue.prototype._$agency = 'http://localhost:3000';

// Vue.prototype._$agency = 'http://localhost:1339'

// Vue.prototype._$baseURL = 'http://39.108.185.51:8081/ywgk'

Vue.prototype._$baseURL = `${ config.baseURL }ywgk`
// Vue.prototype._$baseURL = `${ config.baseURL }ywgk-demo`

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
      next({ path: '/new-login', replace: true })
    }
  }
  let routes = localStorage.getItem('routes') && JSON.parse(localStorage.getItem('routes'))
  if (to.meta.hidden || (routes && routes.indexOf(to.matched[to.matched.length - 1].path) < 0)) {
    next({ path: '/dashboard', replace: true })
  }
  next()
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

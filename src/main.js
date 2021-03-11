import Vue from 'vue'
import App from '@/app'
import router from './router'
import ElementUI from 'element-ui'
import store from './store'
import filters from './filters'
import components from '@/components'
import urls from '@/service/urls'
import fullscreen from 'vue-fullscreen'
// 原来的icons丢失
import '@/assets/fonts/iconfont.css'
// 项目新增的icon
import '@/assets/newfonts/iconfont.css'
// import 'element-ui/lib/theme-chalk/index.css'
import 'quill/dist/quill.snow.css'
import 'viewerjs/dist/viewer.css'
import '@/assets/css/main.scss'
import '@/assets/css/index.scss'

import ActiveMonitor from '@/utils/ActiveMonitor'

import directives from '@/plugin/directives'

import {
  _dateNow,
  _dateOneWeekAgo,
  _timeNow,
  _timeOneWeekAgo
} from '@/common/constants/const'

Vue.use(ElementUI)

Vue.use(fullscreen)

Vue.use(directives)

Vue.config.productionTip = false

Vue.prototype.$urls = urls

Vue.prototype.$_dateNow = _dateNow

Vue.prototype.$_dateOneWeekAgo = _dateOneWeekAgo

Vue.prototype.$_timeNow = _timeNow

Vue.prototype.$_timeOneWeekAgo = _timeOneWeekAgo

// 只在生产环境启用等保
if (process.env.NODE_ENV === 'production') {
  new ActiveMonitor().start()
}

// 声明过滤器
Object.keys(filters).forEach((key) => Vue.filter(key, filters[key]))

// 声明公共功能组件
Object.keys(components).forEach((key) => {
  let name = key.replace(/(\w)/, (v) => v.toUpperCase())
  Vue.component(`m${ name }`, components[key])
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

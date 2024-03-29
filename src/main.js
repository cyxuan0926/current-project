import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import App from '@/app'
import router from './router'
import ElementUI from 'element-ui'
import store from './store'
import filters from './filters'
import components from '@/components'
import urls from '@/service/urls'
import fullscreen from 'vue-fullscreen'
import dragDialog from '@/components/modules/dialog'

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
  _timeOneWeekAgo,
  _operationAuthorizations,
  uploadStepsTabOptions,
  _oneMonthAgo,
  _prisonerDataExcelDownloadConsts,
  limitInputPositiveInteger,
  elInputTypes
} from '@/common/constants/const'

// 打印机
import Print from '@/common/constants/print'
// import Print from 'vue-print-nb'
Vue.use(Print) // 注册
Vue.use(VueCompositionAPI)
Vue.use(ElementUI)
Vue.use(fullscreen)
Vue.use(directives)

Vue.config.productionTip = false

Vue.prototype.$urls = urls
Vue.prototype.$_dateNow = _dateNow
Vue.prototype.$_dateOneWeekAgo = _dateOneWeekAgo
Vue.prototype.$_timeNow = _timeNow
Vue.prototype.$_timeOneWeekAgo = _timeOneWeekAgo
Vue.prototype.$_operationAuthorizations = _operationAuthorizations
Vue.prototype.$_uploadStepsTabOptions = uploadStepsTabOptions
Vue.prototype.$_oneMonthAgo = _oneMonthAgo
Vue.prototype.$_prisonerDataExcelDownloadConsts = _prisonerDataExcelDownloadConsts
Vue.prototype.$_limitInputPositiveInteger = limitInputPositiveInteger
Vue.prototype.$_elInputTypes = elInputTypes

// 只在生产环境启用等保
if (BUILD_ENV === 'production') {
  new ActiveMonitor().start()
}

// 声明过滤器
Object.keys(filters).forEach((key) => Vue.filter(key, filters[key]))

// 声明公共功能组件
Object.keys(components).forEach((key) => {
  const name = key.replace(/(\w)/, (v) => v.toUpperCase())

  Vue.component(`m${ name }`, components[key])
})

// 使el-dialog弹出框可拖动 需放在ElementUI注册和自定义组件注册之后执行
Vue.use(dragDialog)

window.router = router
/* eslint-disable no-new */
new Vue({
  el: '#layout',
  router,
  store,
  template: '<App/>',
  components: { App }
})

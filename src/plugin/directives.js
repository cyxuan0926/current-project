import * as directives from '@/directive'

export default {
  install: Vue => {
    Vue.directive('permission', directives.permission)
  }
}

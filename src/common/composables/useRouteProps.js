// 为了拿到router里面的props
import router from '@/router'

import { ref } from '@vue/composition-api'

export default function() {
  const routeProps = ref({})

  const  matchedRoute = router.currentRoute.matched

  const setRouteProps = () => {
    if (matchedRoute && matchedRoute.length) routeProps.value = Object.assign({}, matchedRoute[matchedRoute.length - 1]['props']['default'])
  }

  setRouteProps()

  return {
    routeProps
  }
}
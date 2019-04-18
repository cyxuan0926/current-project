import store from '@/store'
export default {
  setUser(state, params) {
    state.user = params || {}
  },
  resetState: (state, params) => {
    if (params === 'logout') {
      Object.keys(store.state).forEach(key => {
        if (store.state[key] && store.state[key].contents && store.state[key].contents.length) store.state[key] = { contents: [], total: 0 }
      })
    }
    else {
      Object.keys(params).forEach(key => {
        if (store.state[key] && store.state[key].contents && store.state[key].contents.length) store.state[key] = { contents: [], total: 0 }
        else store.state[key] = params[key]
      })
    }
  },
  setUrlStorage: (state, params) => {
    state.urlStorage = params
  },
  setDynamicRoutes: (state, routes) => {
    state.dynamicRoutes = routes
  }
}

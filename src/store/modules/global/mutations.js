export default {
  setUser(state, params) {
    state.user = params || {}
  },
  resetState: (state, params) => {
    if (params === 'logout') {
      Object.keys(state).forEach(key => {
        if (state[key] && state[key].contents && state[key].contents.length) state[key] = { contents: [], total: 0 }
      })
    }
    else {
      Object.keys(params).forEach(key => {
        state[key] = params[key]
      })
    }
  },
  setUrlStorage: (state, params) => {
    state.urlStorage = params
  }
}

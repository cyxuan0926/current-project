import actions from './actions'
import mutations from './mutations'

let state = {
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {},
  urlStorage: false, // 是否正在删除url的localstorage
  dynamicRoutes: [] // 根据用户角色，动态添加的路由
}

export default {
  actions,
  mutations,
  state
}

import getters from './getters'
import actions from './actions'
import mutations from './mutations'

let state = {
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {},
  urlStorage: false, // 是否正在删除url的localstorage
  dynamicRoutes: [], // 根据用户角色，动态添加的路由
  memoryDynamicRoutes: {},
  // modifyPasswordResult: {}, // 获取修改用户密码的结果
  uploadResult: {}, // 上传文件的结果,
  // loginState: { // 登陆状态
  //   loading: false,
  //   loged: false
  // }
  // 需要缓存的组件名列表（后期如需扩展，可动态修改该列表）
  componentsKeepAlive: [],

  // 是否刷新多级审批消息铃铛
  isRefreshMultistageExamineMessageBell: false
}

export default {
  getters,
  actions,
  mutations,
  state
}

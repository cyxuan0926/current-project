export default {
  // 获取监狱基本信息
  getJailInformation: (state, params) => {
    state.detail = Object.assign({}, params.jails)
  }
}

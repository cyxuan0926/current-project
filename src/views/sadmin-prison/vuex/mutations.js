export default {
  // 获取家属信息列表
  getPrisons(state, params) {
    state.prisons.contents = params.jails
    state.prisons.total = params.jailsSize
  },
  // 获取是否可以修改是否分监区状态
  getBranchStatus(state, params) {
    state.branchStatus = params
  },
  getPrisonDetail(state, params) {
    state.prison = Object.assign({}, params)
  },
  getTenants(state, params) {
    state.tenants.contents = params.tenants
    state.tenants.total = params.tenantsSize
  },

  // 设置人脸识别配置
  setFaceRecognitionConfigs(state, configs) {
    state.faceRecognitionConfigs = Object.assign({}, configs)
  },

  // 获取监狱收费配置
  setPrisonChargeConfigs(state, prisonChargeConfigs) {
    state.prisonChargeConfigs = Object.assign({}, prisonChargeConfigs)
  }
}

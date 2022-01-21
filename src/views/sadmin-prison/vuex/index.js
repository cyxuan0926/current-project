import actions from './actions'
import mutations from './mutations'

let state = {
  prisons: { contents: [], total: 0 },
  prison: { imageUrl: '', usual: [null], weekend: [null], special: [{ date: '', queue: [null] }] },
  tenants: { contents: [], total: 0 },
  branchStatus: true,

  // 人脸识别配置
  faceRecognitionConfigs: {
    afrIOSSetValue: '0.2',

    afrAndroidSetValue: '0.4',

    afrInterval: '60',

    verificationCodeSwitch: 1
  },

  // 监狱收费配置
  prisonChargeConfigs: {}
}

export default {
  actions,
  mutations,
  state
}

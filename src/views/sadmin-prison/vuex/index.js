import actions from './actions'
import mutations from './mutations'

let state = {
  prisons: { contents: [], total: 0 },
  prison: { imageUrl: '', usual: [null], weekend: [null], special: [{ date: '', queue: [null] }] },
  tenants: { contents: [], total: 0 },
  branchStatus: true,

  // 人脸识别配置
  faceRecognitionConfigs: {
    AFRIOSSetValue: '0.2',

    AFRAndroidSetValue: '0.4',

    AFRInterval: '60'
  }
}

export default {
  actions,
  mutations,
  state
}

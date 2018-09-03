import actions from './actions'
import mutations from './mutations'

let state = {
  registrations: { contents: [], total: 0 },
  frontRemarks: [
    '您的身份信息错误',
    '您与服刑人员关系不符',
    '身份证照片模糊，请上传清晰的身份证正反面照',
    '今日已预约已满，请选择其他日期',
    '其他'
  ],
  registRemarks: [
    '身份信息错误',
    '与服刑人员关系不符',
    '身份证照片模糊，请上传清晰的身份证正反面照',
    '其他'
  ]
}

export default {
  actions,
  mutations,
  state
}

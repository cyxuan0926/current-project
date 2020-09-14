import actions from './actions'
import mutations from './mutations'

let state = {
  registrations: { contents: [], total: 0 },
  frontRemarks: [
    '您的身份信息错误',
    '您与服刑人员关系不符',
    '身份证照片模糊',
    '今日预约已满，请选择其他日期',
    '其他'
  ],
  registRemarks: [
    '身份信息错误',
    '上传的资料不足以证明与服刑人员的关系',
    '身份证照片模糊',
    '其他'
  ],

  isSuccessFirstLevelAuthorize: false
}

export default {
  actions,
  mutations,
  state
}

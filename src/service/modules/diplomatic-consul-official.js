import { get, post } from '../config/service'

export default {
  // 获取分页数据
  getPageData: (url, params) => {
    return get(url, params)
  },

  // 注册审批
  registrationAuthorize: params => {
    return post('/diplomats/registrations/authorize', params)
  }
}

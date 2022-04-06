import { get, post } from '../config/service'

export default {
  // 获取分页数据
  getPageData: (url, params) => get(url, params),

  // 注册审批
  registrationAuthorize: params => post('/diplomats/registrations/authorize', params)
}

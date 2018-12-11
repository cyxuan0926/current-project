import * as service from '@/service/config/service'

export default {
  // 罪犯数据导入-验证
  validate: (params) => {
    return service.post('/prisoners/validate', params).then(res => res && res.data)
  },
  // 罪犯数据导入-狱政科验证
  validateYZK: (params) => {
    return service.post('/prisoners/validateYzk', params).then(res => res && res.data)
  }
}

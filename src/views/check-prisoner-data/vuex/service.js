import * as service from '@/service/config/service'

export default {
  // 罪犯数据导入-验证
  validate: (params) => {
    return service.post('/prisoners/validate', params).then(res => res && res.data)
  }
}

import * as service from '@/service/config/service'

export default {
  // 操作手册列表
  getPagedOperation: params => {
    return service.get('/download/list', params).then(res => res && res.data)
  }
}

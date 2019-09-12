import * as service from '../config/service'

export default {
  // 获取家属作品列表
  getFamilyLiteratures: params => {
    return service.get('/article/findFamilyPage', params)
  },
  // 获取作品详情
  getLiteratureDetail: params => {
    return service.get('/article/findDetail', params)
  },
  // 审核通过作品
  passLiterature: params => {
    return service.post('/article/passAricle', params)
  },
  // 审核拒绝作品
  rejectLiterature: params => {
    return service.post('/article/rejectAricle', params)
  },
  // 下架作品
  offlineLiterature: params => {
    return service.post('/article/shelfAricle', params)
  },
  // 分页查询敏感字符集
  getSensitivewords: params => {
    return service.get('/sensitiveword/page', params)
  },
  // 删除敏感关键字
  delSensitiveword: params => {
    return service.post('/sensitiveword/delete', params)
  },
  // 新增敏感关键字
  addSensitiveword: params => {
    return service.post('/sensitiveword/add', params)
  },
  // 编辑敏感关键字
  editSensitiveword: params => {
    return service.post('/sensitiveword/edit', params)
  },
  // 家属-分页查询账户管理
  getAuthorFamily: params => {
    return service.get('/authorFamily/page', params)
  },
  // 家属-启用/禁用用户
  enableAuthorFamily: params => {
    return service.post('/authorFamily/enabled', params)
  }
}

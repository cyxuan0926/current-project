import * as service from '../config/service'

export default {
  // 获取家属作品列表
  getFamilyLiteratures: params => {
    return service.get('/article/findFamilyPage', params)
  },
  // 获取狱警作品列表
  getPoliceLiteratures: params => {
    return service.get('/article/findPolicePage', params)
  },
  // 获取我的作品列表
  getMyLiteratures: params => {
    return service.get('/article/getMyArticle', params)
  },
  // 获取作品详情
  getLiteratureDetail: params => {
    return service.get('/article/findDetail', params)
  },
  // 发布作品
  publishLiterature: params => {
    return service.post('/article/publishJailArticle', params)
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
  // 家属-导出
  exportAuthorFamily: () => {
    return service.get('/authorFamily/export', {}, { responseType: 'blob' })
  },
  // 狱警-新增账户
  addAuthorPolice: params => {
    return service.post('/authorPolice/add', params)
  },
  // 分页查询家属/狱警账户信息
  getAuthors: (url, params) => {
    return service.get(url, params)
  },
  // 启用/禁用账户
  enableAuthor: (url, params) => {
    return service.post(url, params)
  }
}

import * as service from '../config/service'

export default {
  // 获取家属作品列表
  getFamilyLiteratures: params => service.get('/article/findFamilyPage', params),

  // 获取狱警作品列表
  getPoliceLiteratures: params => service.get('/article/findPolicePage', params),

  // 获取我的作品列表
  getMyLiteratures: params => service.get('/article/getMyArticle', params),
 
  // 获取作品详情
  getLiteratureDetail: params => service.get('/article/findDetail', params),

  // 发布作品
  publishLiterature: params => service.post('/article/publishJailArticle', params),

  // 审核通过作品
  passLiterature: params => service.post('/article/passAricle', params),
 
  // 审核拒绝作品
  rejectLiterature: params => service.post('/article/rejectAricle', params),

  // 下架作品
  offlineLiterature: params => service.post('/article/shelfAricle', params),

  // 上架作品
  onlineLiterature: params => service.post('/article/upperShelfAricle', params),

  // 分页查询敏感字符集
  getSensitivewords: params => service.get('/sensitiveword/page', params),

  // 删除敏感关键字
  delSensitiveword: params => service.post('/sensitiveword/delete', params),

  // 新增敏感关键字
  addSensitiveword: params => service.post('/sensitiveword/add', params),

  // 编辑敏感关键字
  editSensitiveword: params => service.post('/sensitiveword/edit', params),

  // 家属-导出
  exportAuthorFamily: () => service.get('/authorFamily/export', {}, { responseType: 'blob' }),

  // 狱警-新增账户
  addAuthorPolice: params => service.post('/authorPolice/add', params),

  // 分页查询家属/狱警账户信息
  getAuthors: (url, params) => service.get(url, params),

  // 启用/禁用账户
  enableAuthor: (url, params) => service.post(url, params),

  // 家属/狱警 作品管理-作品管理-举报详情 / 家属作品管理-举报管理-分页列表
  getReportLiteratures: (url, params) => service.get(url, params),

  // 家属/狱警 作品管理-作品管理/举报管理-忽略
  ignoreReportArticles: (url, params) => service.post(url, params)
}

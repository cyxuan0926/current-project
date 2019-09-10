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
  // 下架作品
  offlineLiterature: params => {
    return service.post('/article/shelfAricle', params)
  }
}

import * as service from '../config/service'

export default {
  // 亲情电话家属管理 - 列表
  getFamilyPhoneFamilies: inputs => {
    const { url, params } = inputs

    return service.get(url, params).then(response => response && response.data)
  },

  // 亲情电话家属管理 - 新增/编辑家属
  // 审批流程中可以编辑家属/关系
  // 审批流程结束后 已通过的 还可以编辑 是否接听亲情电话
  operateFamilyPhoneFamilies: inputs => {
    const { url, params } = inputs

    return service.postFile(url, params)
  },

  // 亲情电话家属 - 导出excel
  exportFamilyPhone: inputs => {
    const { params, url } = inputs

    return service.post(url, params, { responseType: 'blob' })
  },

  // 亲情电话家属 - 导入 - 验证数据
  validateUploadFamilies: filepath => {
    return service.post('/parse/familyphone/validateFpm', { filepath }).then(response => response && response.data)
  },

  // 亲情电话监管 - 查询
  getFamilyphoneSum: params => service.get('/familyphonesummary/findPage'),

  // 亲情电话监管通话纪要复核内容 - 查询
  getFamilyphoneSumCons: id => service.get(`/familyphonesummary/findSummary?videoId=${ id }`)
}

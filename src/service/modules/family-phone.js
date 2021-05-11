import * as service from '../config/service'

export default {
  // 亲情电话家属管理 - 列表
  getFamilyPhoneFamilies: inputs => {
    const {
      url,
      params,
      isPrisonInternetGetUrlWay
    } = inputs

    return service.get(isPrisonInternetGetUrlWay ? service[isPrisonInternetGetUrlWay](url) : url, params).then(response => response && response.data)
  },

  // 亲情电话家属管理 - 新增/编辑家属
  // 审批流程中可以编辑家属/关系
  // 审批流程结束后 已通过的 还可以编辑 是否接听亲情电话
  operateFamilyPhoneFamilies: inputs => {
    const { url, params } = inputs

    return service.post(service['getHyUrl'](url), params)
  },

  // 亲情电话家属 - 导出excel
  exportFamilyPhone: inputs => {
    const {
      methods = 'post',
      params,
      url,
      isPrisonInternetGetUrlWay
    } = inputs

    return service[methods](isPrisonInternetGetUrlWay ? service[isPrisonInternetGetUrlWay](url) : url, params, { responseType: 'blob' }).then(response => response && response.data)
  },

  // 亲情电话家属 - 导入 - 验证数据
  validateUploadFamilies: filepath => {
    return service.post(service['getHyUrl']('/parse/familyphone/validateFpm'), { filepath }).then(response => response && response.data)
  },

  // 亲情电话申请 - 导入 - 验证数据
  validateUploaPhone: filepath => {
    return service.post('/parse/familyphone/apply/validateFpna', { filepath }).then(response => response && response.data)
  },

  // 亲情电话家属 - 详情
  getFamilyPhoneFamiliesDetail: inputs => {
    const {
      url,
      params,
      isPrisonInternetGetUrlWay
    } = inputs

    return service.get(isPrisonInternetGetUrlWay ? service[isPrisonInternetGetUrlWay](url) : url, params).then(response => response && response.data)
  },

  // 亲情电话家属 - 审核
  authFamilyPhoneFamilies: params => {
    return service.post(service['getHyUrl']('/familyPhoneManage/auth'), params)
  },

  // 亲情电话通话费用详情 - 列表
  getFamilyPhoneSettleAccounts: inputs => {
    const {
      url,
      params,
      isPrisonInternetGetUrlWay
    } = inputs

    return service.get(isPrisonInternetGetUrlWay ? service[isPrisonInternetGetUrlWay](url) : url, params).then(response => response && response.data)
  },

  // 亲情电话通话费用详情 - 详情
  getFamilyPhoneSettleAccountsDetail: inputs => {
    const {
      url,
      params,
      isPrisonInternetGetUrlWay
    } = inputs

    return service.get(isPrisonInternetGetUrlWay ? service[isPrisonInternetGetUrlWay](url) : url, params).then(response => response && response.data)
  },

  // 亲情电话通话费用详情 - 编辑是否出狱状态
  editFamilyPhoneSettleAccountsRelease: params => {
    return service.post(service['getHyUrl']('/settleAccounts/editRelease'), params)
  },

  // 亲情电话通话费用详情 - 结算
  settleFamilyPhoneSettleAccounts: params => {
    return service.post(service['getHyUrl']('/settleAccounts/settlement'), params, { responseType: 'blob' }).then(response => response && response.data)
  },

  // 亲情电话通话费用详情 - 导出
  exportFamilyPhoneSettleAccounts: inputs => {
    const {
      methods = 'post',
      params,
      url,
      isPrisonInternetGetUrlWay
    } = inputs

    return service[methods](isPrisonInternetGetUrlWay ? service[isPrisonInternetGetUrlWay](url) : url, params, { responseType: 'blob' }).then(response => response && response.data)
  }
}

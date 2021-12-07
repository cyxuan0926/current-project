import * as service from '@/service/config/service'

export default {
  // 亲情监管 列表查询
  getIntraFamilyphoneSum: params => service.get(service.getHyUrl('/tel/summary/videoTelSummaryList'), params),
  // 亲情监管 列表导出
  exportIntraFamilyphoneSum: params => service.get(service.getHyUrl('/download/exportVideoTelSummary'), params, { responseType: 'blob' }).then(res => res && res.data),
  // 亲情监管 通话纪要查询
  getIntraFamilyphoneCon: params => service.get(service.getHyUrl('/tel/summary/showSummary'), params),
  // 亲情监管 通话复核-添加通话纪要
  createIntraFamilyReview: data => service.postObj(service.getHyUrl('/tel/summary/saveSummary'), data),
  // 亲情监管 音视频详情查询
  getIntraFamilyphoneDet: params => service.get(service.getHyUrl('/tel/summary/showVideoTelSummaryDetails'), params),
  // 亲情监管 可视电话家属详情
  getIntraMeetingInfo: params => service.get(service.getHyUrl('/meetings/familyDetail'), params),
  // 亲情监管 亲情电话家属详情
  getIntraFamilyInfo: params => service.get(service.getHyUrl('/msg/familyPhoneManage/familyDetail'), params),
  // 查询亲情电话申请列表
  familyPhoneList: params => {
    return service.get(service.getHyUrl('/msg/parse/familyphone/apply/page'), params).then(res => res && res.data)
  },
  // 查询亲情电话申请列表
  familyInformationList: params => {
    return service.get(service.getHyUrl('/familyInformationImport/page'), params).then(res => res && res.data)
  },
  // 查询亲情电话申请详情
  familyPhoneDetail: params => {
    return service.get(service.getHyUrl('/msg/parse/familyphone/apply/detail'), params).then(res => res && res.data)
  },
  // 新增亲情电话申请
  familyPhoneAdd: data => {
    return service.postObj(service.getHyUrl('/msg/parse/familyphone/apply/save'), data).then(res => res && res.data)
  },
  // 新增家属信息
  familyforAdd: data => {
    return service.post(service.getHyUrl('/familyInformationImport/addFamilyInformation'), data).then(res => res && res.data)
  },
  // 通过审核
  authPhone: data => {
    return service.postObj(service.getHyUrl('/msg/parse/familyphone/apply/auth'), data).then(res => res && res.data)
  },
  // 亲情电话通话统计表
  phoneRecordList: params => {
    return service.get(service.getHyUrl('/tel/summary/phoneRecordList'), params).then(res => res && res.data)
  },
  // 亲情电话通话统计表详情
  phoneRecordDetail: data => {
    return service.get(service.getHyUrl('/tel/summary/getPhoneRecord'), data).then(res => res && res.data)
  },
  // 亲情电话通话费用结算表列表查询
  phoneSettleAccountsList: params => {
    return service.get(service.getHyUrl('/msg/settleAccounts/findPage'), params).then(res => res && res.data)
  }
}

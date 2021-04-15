import * as service from '@/service/config/service'

export default {
    // 亲情监管列表查询
    getIntraFamilyphoneSum: params => service.get(service.getIntraUrl('/tel/summary/videoTelSummaryList'), params),
    // 亲情监管通话纪要查询
    getIntraFamilyphoneCon: params => service.get(service.getIntraUrl('/tel/summary/showSummary'), params),
    // 亲情监管通话复核-添加通话纪要
    createIntraFamilyReview: data => service.postObj(service.getIntraUrl('/tel/summary/saveSummary'), data),
    // 亲情监管音视频详情查询
    getIntraFamilyphoneDet: params => service.get(service.getIntraUrl('/tel/summary/showVideoTelSummaryDetails'), params),
    // 查询亲情电话申请列表
     familyPhoneList: params => {
          return service.get(service.getIntraUrl('/parse/familyphone/apply/page'), params).then(res => res && res.data)
     },
   // 查询亲情电话申请详情
     familyPhoneDetail: params => {
          return service.get(service.getIntraUrl('/parse/familyphone/apply/detail'), params).then(res => res && res.data)
     },
    // 新增亲情电话申请
      familyPhoneAdd: data => {
        return service.post(service.getIntraUrl('/parse/familyphone/apply/save'), data).then(res => res && res.data)
     },
       // 通过审核
       authPhone: data => {
        return service.post(service.getIntraUrl('/parse/familyphone/apply/auth'), data).then(res => res && res.data)
    },
       // 亲情电话通话统计表
       phoneRecordList: params => {
        return service.get(service.getIntraUrl('/tel/summary/phoneRecordList'), params).then(res => res && res.data)
     },
    // 亲情电话通话统计表详情
       phoneRecordDetail: data => {
        return service.get(service.getIntraUrl('/tel/summary/getPhoneRecord'), data).then(res => res && res.data)
     },
   // 亲情电话通话费用结算表列表查询
      phoneSettleAccountsList: params => {
        return service.get(service.getIntraUrl('/settleAccounts/findPage'), params).then(res => res && res.data)
  }
}

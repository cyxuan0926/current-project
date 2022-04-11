import * as service from '@/service/config/service'

export default {
    // 亲情电话监管 - 查询
    getFamilyphoneSum: params => service.get('/familyphonesummary/findPage', params),

    // 亲情电话监管通话纪要复核内容 - 查询
    getFamilyphoneSumCons: params => service.get('/familyphonesummary/findSummary', params),

    // 亲情电话监管表 - 导出
    exportFamilyphoneSum: params => service.
        get('/familyphonesummary/export', params, { responseType: 'blob' }).
        then(res => res && res.data),

    // 查询亲情电话申请列表ywt-admin
    QAYWT_familyPhoneList: params => service.
        get('/msg/parse/familyphone/apply/page', params).
        then(res => res && res.data),

    // 查询亲情电话申请详情ywt-admin
    QAYWT_familyPhoneDetail: params => service.
        get('/msg/parse/familyphone/apply/detail', params).
        then(res => res && res.data),

    // 查询亲情电话申请统计ywt-admin
    familyPhoneAccountList: params => service.
        get('/report/familyPhone/call-account', params).
        then(res => res && res.data),

    // 查询亲情电话申请统计详情ywt-admin
    familyPhoneAccountDetail: params => service.
        get('/report/familyPhone/call/detail', params).
        then(res => res && res.data),

    // 查询亲情电话统计费用结算ywt-admin
    familyPhoneSettleAccount: params => service.
        get('/report/familyPhone/settle-account', params).
        then(res => res && res.data)

}

import * as service from '@/service/config/service'

export default {
    // 亲情电话监管 - 查询
    getFamilyphoneSum: params => service.get('/familyphonesummary/findPage', params),

    // 亲情电话监管通话纪要复核内容 - 查询
    getFamilyphoneSumCons: params => service.get('/familyphonesummary/findSummary', params)
}

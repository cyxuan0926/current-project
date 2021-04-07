import * as service from '@/service/config/service'
import { setPrisonUrl } from './utils'

export default {
    // 亲情监管列表查询
    getIntraFamilyphoneSum: params => service.get(setPrisonUrl('/tel/summary/videoTelSummaryList'), params),
    // 亲情监管通话纪要查询
    getIntraFamilyphoneCon: id => service.get(setPrisonUrl(`/tel/summary/showSummary?videoId=${ id }`)),
    // 亲情监管通话复核-添加通话纪要
    createIntraFamilyReview: data => service.post(setPrisonUrl('/tel/summary/saveSummary'), data),
    // 亲情监管音视频详情查询
    getIntraFamilyphoneDet: id => service.get(setPrisonUrl(`/tel/summary/showVideoTelSummaryDetails?videoId=${ id }`))
}

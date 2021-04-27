import * as service from '@/service/config/service'

export default {
    //  服刑人员会见登记表
    getMettingCallDetail: params => service.get('/meetingCallDetail/page?', params).then(res => res && res.data),
     //  会见量和参会人数统计报表
    getMettinMemberStatis: params => service.get('/meetingMembersStatistics/page?', params).then(res => res && res.data)
}

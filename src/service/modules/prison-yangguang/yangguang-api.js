import * as service from '@/service/config/service'

export default {
    // 查询法律法规和刑务公示的模块
    queryDictItemByDictCode: dictCode => service.get(service.getYgUrl(`/sys/dict/queryDictItemByDictCode?dictCode=${dictCode}`)),

    // 查询各类型文章
    queryPrisonAffairs: params => service.get(service.getYgUrl('/contents/findPageByType'), params),

    // 保存各类型文章
    savePrisonAffairs: data => service.postObj(service.getYgUrl('/contents'), data),

    // 编辑各类型文章
    updatePrisonAffairs: data => service.putObj(service.getYgUrl('/contents'), data),

    // 删除各类型文章
    deletePrisonAffairs: id => service.remove(service.getYgUrl(`/contents/deleteById?id=${id}`)),

    // 上下架 0-下架 1-上架
    updatePrisonAffairsStatus: ({ id, status }) => service.putObj(service.getYgUrl(`/contents/manage?id=${id}&status=${status}`)),

    // 计分考核列表
    getPrisonerScorelist: params => service.get(service.getYgUrl('/prisoner_score/queryPrisonerScore'), params),

    // 奖惩表
    getPrisonerBonusPenaltylist: params => service.get(service.getYgUrl('/prisoner_bonus_penalty/queryPrisonerBonusPenalty'), params),

    // 数据管理-罪犯奖惩数据解析-上传到服务器
    importPrisonerRewardPunishmentlist: params => service.get(service.getYgUrl('/prisoner_bonus_penalty/processingYzk'), params),

    // 数据管理-罪犯奖惩数据解析-验证
    validatePrisonerRewardPunishmentlist: params => service.get(service.getYgUrl('/prisoner_bonus_penalty/validate'), params),

    // 数据管理-计分考核数据解析-上传到服务器
    importPrisonerScorelist: params => service.get(service.getYgUrl('/prisoner_score/processingYzk'), params),

    // 数据管理-计分考核数据解析-验证
    validatePrisonerScorelist: params => service.get(service.getYgUrl('/prisoner_score/validate'), params),

    // 数据导入uploadFile
    uploadFileYangGuangHost: params => service.postFormData(service.getYgUrl('/upload/uploadfile'), { file: params }),

    // 阳光监狱 - 上传文件
    ygUploadFile: file => service.postFile(service.getYgUrl('/upload/uploadfile'), file).then(res => res && res.data),

    // 阳光监狱 - 查询列表
    getPaged: ({ params, url }) => service.get(service.getYgUrl(url), params),

    // 阳光监狱 - 验证excel
    validateUploadYgCommon: ({ params, url, methods = 'post' }) => service[methods](service.getYgUrl(url), params).then(response => response && response.data),

    // 阳光监狱 - 导出excel
    exportYgPrisonExcel: ({ params, url, methods = 'post' }) => service[methods](service.getYgUrl(url), params, { responseType: 'blob' }).then(response => response && response.data),

    // 查询亲情电话通话费用管理ywt-admin
    familytelephonecallcostmanagement: ({ params, url }) => service.get(url, params),

    // 亲情电话通话费用管理 --导出excel
    familytelephoneexcel: ({ params, url, methods = 'post' }) => service[methods](url, params, { responseType: 'blob' }).then(response => response && response.data),

    // 查询亲情电话充值管理ywt-admin
    familyphonerechargefeemanagement: ({ params, url }) => service.get(url, params),

    // 亲情电话通话充值管理 --导出excel
    callchargerecharge: ({ params, url, methods = 'post' }) => service[methods](url, params, { responseType: 'blob' }).then(response => response && response.data),

    // 亲情电话费用充值 - 导入文件
    familyphonerechargeimport: file => service.postFile('/upload/uploadfile', file).then(res => res && res.data),

     // 亲情电话费用充值 - 验证excel
    familyphonerechargeyanzheng: ({ params, url, methods = 'post' }) => service[methods](url, params, { responseType: 'blob' }).then(response => response && response.data),
     
}

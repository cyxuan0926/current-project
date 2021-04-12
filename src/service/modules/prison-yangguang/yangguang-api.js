import * as service from '@/service/config/service'

export default {
    // 查询法律法规和刑务公示的模块
    queryDictItemByDictCode: dictCode => service.get(service.getYgUrl(`/sys/dict/queryDictItemByDictCode?dictCode=${ dictCode }`)),
    // 查询各类型文章
    queryPrisonAffairs: params => service.get(service.getYgUrl('/contents/findPageByType'), params),
    // 保存各类型文章
    savePrisonAffairs: data => service.postObj(service.getYgUrl('/contents'), data),
    // 编辑各类型文章
    updatePrisonAffairs: data => service.putObj(service.getYgUrl('/contents'), data),
    // 删除各类型文章
    deletePrisonAffairs: id => service.remove(service.getYgUrl(`/contents/deleteById?id=${ id }`)),
    // 上下架 0-下架 1-上架
    updatePrisonAffairsStatus: ({ id, status }) => service.putObj(service.getYgUrl(`/contents/manage?id=${ id }&status=${ status }`)),
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
    uploadFileYangGuangHost: params => service.postFormData(service.getYgUrl('/upload/uploadfile'), { file: params })
}
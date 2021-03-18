import config from '@/service/urls'
import { get, post, postObj, put, putObj, remove, postFormData } from '@/service/config/service'
const ygApis = {
    get,
    post,
    postObj,
    put,
    putObj,
    remove,
    postFormData
}
Object.keys(ygApis).forEach(m => {
    let _fn = ygApis[m]
    ygApis[m] = (...args) => {
        args[0] = `${ config.yangguangApiHost }${ config.yangguangApiPath }${ args[0] }`
        return _fn(...args)
    }
})

export default {
    // 查询法律法规和刑务公示的模块
    queryDictItemByDictCode: dictCode => ygApis.get(`/sys/dict/queryDictItemByDictCode?dictCode=${ dictCode }`),
    // 查询各类型文章
    queryPrisonAffairs: params => ygApis.get('/contents/findPageByType', params),
    // 保存各类型文章
    savePrisonAffairs: data => ygApis.postObj('/contents', data),
    // 编辑各类型文章
    updatePrisonAffairs: data => ygApis.putObj('/contents', data),
    // 删除各类型文章
    deletePrisonAffairs: id => ygApis.remove(`/contents?id=${ id }`),
    // 上下架 0-下架 1-上架
    updatePrisonAffairsStatus: data => ygApis.putObj('/contents/manage', data),
    // 计分考核列表
     getPrisonerScorelist: params => ygApis.get('/prisoner_score/queryPrisonerScore', params),
    // 奖惩表
     getPrisonerBonusPenaltylist: params => ygApis.get('/prisoner_bonus_penalty/queryPrisonerBonusPenalty', params),
    // 数据管理-罪犯奖惩数据解析-上传到服务器
    importPrisonerRewardPunishmentlist: params => ygApis.get('/prisoner_bonus_penalty/processingYzk', params),
    // 数据管理-计分考核数据解析-上传到服务器
    importPrisonerScorelist: params => ygApis.get('/prisoner_score/processingYzk', params),
    // 数据导入uploadFile
    uploadFileYangGuangHost: params => ygApis.postFormData('/upload/uploadfile', { file: params })
}

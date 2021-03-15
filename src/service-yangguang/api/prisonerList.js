import { get, postFormData } from '../request'
import urls from '@/service/urls'
// 计分考核列表
export function getPrisonerScorelist(params) {
  return get('/prisoner_score/queryPrisonerScore', params, { baseURL: urls.yangguangHost }).then(res => res && res.data)
}
// 奖惩表
export function getPrisonerBonusPenaltylist(params) {
  return get('/prisoner_bonus_penalty/queryPrisonerBonusPenalty', params, { baseURL: urls.yangguangHost }).then(res => res && res.data)
}
  // 数据管理-罪犯奖惩数据导入-上传到服务器
export function importPrisonerRewardPunishmentlist(params) {
    return get('/prisoner_bonus_penalty/processingYzk', params, { baseURL: urls.yangguangHost }).then(res => res && res.data)
}
  // 数据导入uploadFile
export function uploadFileYangGuangHost(params) {
  console.log(params)
    return postFormData('/upload/uploadfile', { file: params }, { baseURL: urls.yangguangHost }).then(res => res && res.data)
}

import { get, postFormData, put, post, strike } from '../request'

export function getPagedMessagInside(params) {
    return get('/ad/page', params).then(res => res && res.data)
 }
// 查询服务列表
export function getadserviceslist(params) {
  return get('/ad/adservices', params).then(res => res && res.data)
}
// 根据服务id查询广告位置
export function getadservicesTypes(data) {
  return get(`/ad/adtypes/${ data }`, data).then(res => res && res.data)
}
// 根据服务id查询广告位置
export function uploadadservices(data) {
  return postFormData('/files', data).then(res => res && res)
}
// 查询地区
export function getprovinceslist() {
  return get('/api/provinces/list').then(res => res && res.data)
}
// 根据地区id查询监狱
export function getjailIdlist(params) {
  return get('/api/jail/list', params).then(res => res && res.data)
}
// 根据广告位置id查询序号数
export function getusedSort(params) {
  return get('/ad/getUnusedSort', params).then(res => res && res.data)
}
// 根据服务id查询广告位置
export function addInside(data) {
  return post('/ad/add', data).then(res => res && res)
}
// 根据广告id上架广告
export function onlineInside(data) {
  return put(`/ad/online/${ data }`, data).then(res => res && res.data)
}
// 根据广告id下架广告
export function offlineInside(data) {
  return put(`/ad/offline/${ data }`, data).then(res => res && res.data)
}
// 根据广告id删除广告
export function deleteInside(data) {
  return strike(`/ad/${ data }`, data).then(res => res && res.data)
}
// 更新当前配置
export function updateInside(data) {
  return put('/ad/update', data).then(res => res && res)
}

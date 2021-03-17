import config from '@/service/urls'
import { get, post, postObj, put, putObj, remove } from '@/service/config/service'
const ygApis = {
    get,
    post,
    postObj,
    put,
    putObj,
    remove
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
    deletePrisonAffairs: id => ygApis.remove(`/contents/deleteById?id=${ id }`),
    // 上下架 0-下架 1-上架
    updatePrisonAffairsStatus: ({ id, status }) => ygApis.putObj(`/contents/manage?id=${ id }&status=${ status }`)
}

import * as service from '../config/service'
import axios from 'axios'
import { deleteMediaUrl, default as urls } from '../urls'

export default {
  // 远程会见-常规配置-详情
  getRemoteUsualConfig: params => {
    return service.get('/jails/normal_config', params).then(res => res && res.data)
  },
  // 远程会见-常规配置-编辑
  updateRemoteUsualConfig: params => {
    return service.postObj('/jails/normal_config/update', params).then(res => res && res.code === 200)
  },
  // 远程会见-周末配置-详情
  getRemoteWeekendConfig: params => {
    return service.get('/jails/weekend_config', params).then(res => res && res.data)
  },
  // 远程会见-周末配置-编辑
  updateRemoteWeekendConfig: params => {
    return service.postObj('/jails/weekend_config/update', params).then(res => res && res.code === 200)
  },
  // 远程会见-特殊配置-详情
  getRemoteSpecialConfigOld: params => {
    return service.get('/jails/special_configs/list', params).then(res => res && res.data)
  },
  // 远程会见-特殊配置-新增
  addRemoteSpecialConfig: params => {
    return service.postObj('/jails/special_configs/add', params).then(res => res && res.data)
  },
  // 远程会见-特殊配置-编辑
  updateRemoteSpecialConfig: params => {
    return service.postObj('/jails/special_configs/update', params).then(res => res && res.code === 200)
  },
  // 远程会见-特殊配置-删除
  deleteRemoteSpecialConfig: params => {
    return service.post('/jails/special_configs/delete', params).then(res => res && res.code === 200)
  },
  // 会见统计-监狱会见
  getPrisonReportList: params => {
    return service.get('/report/prisonReportPage', params).then(res => res && res.data)
  },
  // 会见统计-监区会见
  getPrisonAreaReportList: params => {
    return service.get('/report/prisonareaReportPage', params).then(res => res && res.data)
  },
  // 删除图片
  deleteImage: params => {
    params = Array.from(new Set(params.concat(localStorage.getItem('toDelete') ? JSON.parse(localStorage.getItem('toDelete')) : [])))
    if (!params.length) return new Promise(function(resolve, reject) { resolve(true) })
    return axios.delete(deleteMediaUrl, { data: { urls: params }, headers: { Authorization: urls.token } }).then(res => {
      if (res.status === 200 && res.data.code === 200) {
        localStorage.removeItem('toDelete')
        return true
      }
      else {
        localStorage.setItem('toDelete', JSON.stringify(params))
      }
    }).catch(error => {
      console.log(error)
      localStorage.setItem('toDelete', JSON.stringify(params))
    })
  }
}

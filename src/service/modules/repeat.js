import * as service from '../config/service'
import axios from 'axios'

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
  getRemoteSpecialConfig: params => {
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
  deleteImage: params => {
    params = Array.from(new Set(params.concat(localStorage.getItem('toDelete') ? JSON.parse(localStorage.getItem('toDelete')) : [])))
    if (!params.length) return new Promise(function(resolve, reject) { resolve(true) })
    return axios.delete('http://120.79.67.25:1339/delete/resources', { data: { urls: params }, headers: { Authorization: '523b87c4419da5f9186dbe8aa90f37a3876b95e448fe2a' } }).then(res => {
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

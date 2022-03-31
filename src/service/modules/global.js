import * as service from '../config/service'
import axios from 'axios'
import { deleteMediaUrl, default as urls } from '../urls'

export default {
  // 删除图片
  deleteUrls: params => {
    return axios.delete(deleteMediaUrl, { data: { urls: params }, headers: { Authorization: urls.token } }).then(res => {
      if (res.status === 200 && res.data.code === 200) {
        return true
      }
    }).catch(error => {
      Promise.reject(error)
    })
  },
  // 修改用户名密码执行的方法
  // modifyPassword: userInfo =>
  //   service.post('/users/resetPwd', userInfo).then(res => res).catch(err => err),
  // 上传文件
  uploadFile: file => {
    return service.postFile('/upload/uploadfile', file).then(res => res && res.data)
  }
}

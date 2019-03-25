// import * as service from '../config/service'
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
      console.log(error)
    })
  }
}

import * as service from '../config/service'

export default {
  // 下载文件
  uploadFile: file => {
    return service.postFile('/upload/uploadfile', file).then(res => res && res.data)
  }
}

import * as service from '@/service/config/service'

export default {
  // 上传文件
  commonUploadFile:  (
    {
      url,
      module,
      file
    }
  ) => service.postFormData(module ? service[module](url) : url, { file }),

  // 验证文件格式
  commonValidateUpload: (
    {
      url,
      module,
      params,
      methods = 'post'
    }
  ) => service[methods](module ? service[module](url): url, params)
}

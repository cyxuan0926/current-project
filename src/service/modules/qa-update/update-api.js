import * as service from '@/service/config/service'

export default {
      // 监狱配置 - 获取亲情电话收费配置
   getConfiguractionAndtemplate: params => {
    return service.get(service.getUpdate('/familyPhoneCharge/getConfigurationsAndTemplate'), params)
  },
    // 修改收费配置模板
    editTemplate: params => {
      return service.postObj(service.getUpdate('/familyPhoneCharge/editTemplate'), params)
    },
    // 新增收费配置模板
    addTemplate: params => {
      return service.postObj(service.getUpdate('/familyPhoneCharge/addTemplate'), params)
    },
    // 修改参数配置
    editConfigurations: params => service.postObj(service.getUpdate('/familyPhoneCharge/editConfigurations'), params)
}

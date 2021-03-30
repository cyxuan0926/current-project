import config from '@/service/urls'
import * as service from '@/service/config/service'
const setBpmnUrl = url => /^(http|https).*/.test(url) ? url : `${ config.bpmnApiHost }${ url }`

export default {
    // 上传xml字符串部署流程
    saveProcess: data => service.post(setBpmnUrl('/processDefinition/addDeploymentByString'), data),
    // 依据key获取流程定义图
    getProcess: key => service.get(setBpmnUrl(`/processDefinition/showresource?key=${ key }`))
}

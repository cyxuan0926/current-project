import * as service from '@/service/config/service'
export default {
    // 上传xml字符串部署流程
    saveProcess: data => service.post(service.getBpmnUrl('/processDefinition/addDeploymentByString'), data),
    // 依据key获取流程定义图
    getProcess: key => service.get(service.getBpmnUrl(`/processDefinition/showresource?key=${ key }`)).then(response => response.data)
}

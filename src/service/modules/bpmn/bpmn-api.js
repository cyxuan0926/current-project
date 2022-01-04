import * as service from '@/service/config/service'
export default {
    // 上传xml字符串部署流程
    saveProcess: data => service.post(service.getBpmnUrl('/processDefinition/addDeploymentByString'), data),
    // 依据key获取流程定义图
    getProcess: key => service.get(service.getBpmnUrl(`/processDefinition/showresource?key=${ key }`)),

    // 获取当前节点任务
    getProcessTask: processInstanceId => service.get(service.getBpmnUrl(`/process/get-task?processInstanceId=${ processInstanceId }`)),

    // 依据多个流程实例id获取是否为同一流程
    getIsSameProcessDefinition: instanceIds => service.post(service.getBpmnUrl('/processDefinition/getSameDefinitions'), { instanceIds })
}

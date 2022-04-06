import * as service from '@/service/config/service'

export default {
    // 获取当前任务的下一任务
    getSubtaskPhone: params => service.
      get(service.getBpmnUrl('/task/get-subtask'), params).
      then(res => res && res.data),

    // 获取驳回编辑列表监狱内网
    getIntraRejectEdit: params => service.
      get(service.getHyUrl('/meetingsReviewWord/get'), params).
      then(res => res && res.data),

    // 保存修改驳回编辑列表监狱内网
    setIntraRejectEdit: data => service.
      postObj(service.getHyUrl('/meetingsReviewWord/edit'), data).
      then(res => res && res.data)
}

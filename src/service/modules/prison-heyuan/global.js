import * as service from '@/service/config/service'

export default {
      // 获取当前任务的下一任务
    getSubtaskPhone: params => {
      return service.get(service.getBpmnUrl('/task/get-subtask'), params).then(res => res && res.data)
    },
     // 获取驳回编辑列表监狱内网
     getIntraRejectEdit: params => {
      return service.get(service.getHyUrl('/meetingsReviewWord/get'), params).then(res => res && res.data)
    },
     // 保存修改驳回编辑列表监狱内网
     setIntraRejectEdit: data => {
      return service.postObj(service.getHyUrl('/meetingsReviewWord/edit'), data).then(res => res && res.data)
    }
}

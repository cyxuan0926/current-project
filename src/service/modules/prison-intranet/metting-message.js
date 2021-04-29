import * as service from '@/service/config/service'

export default {
      // 短信列表
      getIntraMessagelist: params => service.get(service.getIntraUrl('/msg/terminal/selectMessage'), params).then(res => res && res.data),
      // 短信授权
      dealIntraMessage: params => service.postObj(service.getIntraUrl('/msg/terminal/dealMessage'), params).then(res => res && res.data)
}

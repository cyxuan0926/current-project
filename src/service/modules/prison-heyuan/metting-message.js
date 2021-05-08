import * as service from '@/service/config/service'

export default {
      // 短信列表
      getIntraMessagelist: params => service.get(service.getHyUrl('/msg/terminal/selectMessage'), params).then(res => res && res.data),
      // 短信授权
      dealIntraMessage: params => service.postObj(service.getHyUrl('/msg/terminal/dealMessage'), params).then(res => res && res.data)
}
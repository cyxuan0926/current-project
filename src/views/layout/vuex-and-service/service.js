import * as service from '@/service/config/service'

export default {
  logout: () => service.get('/users/logout').then(res => res && res.code === 200),

  // 获取多级审批数目配置
  getMultistageExamineCountConfigs: () => service.get('/jails/getPendingCount')
}

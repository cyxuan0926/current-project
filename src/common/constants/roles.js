import gdAdminUrl from '../../assets/images/gd-admin-title.png'
import gsAdminUrl from '../../assets/images/gs-admin-title.png'

export default {
  // 超级管理员
  SUPER_ADMIN: 'super_admin',

  // 租户管理员
  TENANT_ADMIN: 'tenant_admin',

  // 信息管理员
  INFORMATION_ADMIN: 'information_admin',

  // 审核人员(初级)
  AUDITOR: 'auditor',

  // 狱警作品审核人员
  POLICE_LITERATURE_AUDITOR: 'police_literature_auditor',

  // 家属作品审核人员
  FAMILY_LITERATURE_AUDITOR: 'family_literature_auditor',

  // 监狱白名单
  JAIL_WHITELIST: ['4411'],

  // 高级审核人员
  ADVANCED_AUDITOR: 'advanced_auditor',

  // 匹配 /static/dist/map 省地图
  // 地图数据来源 https://datav.aliyun.com/tools/atlas/index.html
  CHART_ROLES: {
    'gd_admin': {
      adcode: 440000,
      label: '广东省',
      provincesId: '20',
      titleUrl: gdAdminUrl,
      adname: 'guangdong'
    },

    'gs_admin': {
      adcode: 620000,
      label: '甘肃省',
      provincesId: '21',
      titleUrl: gsAdminUrl,
      adname: 'gansu'
    }
  }
}

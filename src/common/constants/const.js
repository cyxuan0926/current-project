export const responseURLWhiteLists = [
  '/feedbacks/download',
  '/authorFamily/export',
  '/download/province/export',
  '/registrations/getRelationshipFile'
]

export const withdrawOrAnthorinputReason = `1、上传的资料不足以证明与服刑人员的关系。
2、每月只能申请一次会见，该服刑人员本月已会见。
3、夫妻关系必须上传结婚证。
4、根据可视可视电话管理规定，只允许直系亲属申请。`

export const registrationWithdrawOrAnthorinputReason = `1、夫妻关系必须上传结婚证。
2、根据可视电话管理规定，只允许直系亲属申请。`

// 人脸识别阈值范围
export const faceRecognitionValues = [ '0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9', '1' ]

// 多级审批管理菜单名称/路由
export const multistageExamineDropdownItems = [
  {
    menuName: '家属注册管理',

    path: { path: '/registration/list' },

    paramsKey: 'regTotal'
  },

  {
    menuName: '外交领事官员注册管理',

    path: { path: '/diplomatic-consul-official/list' },

    paramsKey: 'regDiplomatsTotal'
  },

  {
    menuName: '可视电话申请列表',

    path: { path: '/meeting/list' },

    paramsKey: 'meetingTotal'
  },

  {
    menuName: '外交领事官员可视电话申请列表',

    path: { path: '/meeting/diplomatist' },

    paramsKey: 'meetingDiplomatsTotal'
  }
]

// 可选的会见时间段
export const meetingChargeConfigDurations = [5, 10, 15, 20, 25]

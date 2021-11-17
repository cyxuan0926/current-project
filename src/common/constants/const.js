import Moment from 'moment'

import { _ygPrisonExportExcelUrls } from './yg-prisons'

const isDesensitizationCol = true

const className = 'el-form-item--ellipsis'

export const responseURLWhiteLists = [
  '/feedbacks/download',
  '/authorFamily/export',
  '/download/exportVideoTelRecords',
  '/download/province/export',
  '/familyMessage/export',
  '/registrations/getRelationshipFile',
  '/parse/familyphone/exportFamilyPhone',
  '/parse/familyphone/validateFpm',
  '/msg/parse/familyphone/apply/validateFpna',
  '/msg/parse/familyphone/apply/exportFamilyPhoneApply',
  '/parse/familyphone/apply/export',
  '/processDefinition/showresource',
  '/familyPhone/export',
  '/export/exportSmsManage',
  '/msg/settleAccounts/exportDetailExcel',
  '/msg/settleAccounts/settlement',
  '/settleAccounts/export',
  '/familyphonesummary/export',
  '/download/exportVideoTelSummary',
  '/terminal/version/exportUpdateDetail',
  '/terminal/version/exportUpgradeStatistics',
  '/meetingMembersStatistics/export',
  '/meetingCallDetail/export',
  '/registrations/exportFamilyRegJails',
  '/prisoner_visits/exportPrisonerVisits',
  '/prisoner_visits/exportAdminPrisonerVisits',
  ..._ygPrisonExportExcelUrls
]

export const withdrawOrAnthorinputReason = `1、上传的资料不足以证明与服刑人员的关系。
2、每月只能申请一次会见，该服刑人员本月已会见。
3、夫妻关系必须上传结婚证。
4、根据可视电话管理规定，只允许直系亲属申请。`

export const registrationWithdrawOrAnthorinputReason = `1、夫妻关系必须上传结婚证。
2、根据可视电话管理规定，只允许直系亲属申请。`

// 人脸识别阈值范围
export const faceRecognitionValues = [ '0', '0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9', '1' ]

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

// 省监狱配置参数名
export const provinceJailLevelConfigsParamsName = [
  'provincesId',
  'jailId',
  'prisonAreaId',
  'prisonBranchId',
  'prisonBuildingId',
  'prisonLayerId'
]

// 监狱层级数
export const prisonAreaLevelObject = {
  // 这里面的属性可以自己更换
  // 监区
  prisonArea: {
    label: '监区',

    prop: 'areaId',

    gettingData: false,

    options: [],

    childNode: 'prisonBranch',

    level: 1
  },

  // 分监区
  prisonBranch: {
    label: '分监区',

    prop: 'branchId',

    gettingData: false,

    options: [],

    childNode: 'prisonBuilding',

    level: 2
  },

  // 楼栋
  prisonBuilding: {
    label: '楼栋',

    prop: 'buildingId',

    gettingData: false,

    options: [],

    childNode: 'prisonLayer',

    level: 3
  },

  // 楼层
  prisonLayer: {
    label: '楼层',

    prop: 'layerId',

    gettingData: false,

    options: [],

    level: 4
  }
}

export const _thisYear = Moment().format('YYYY')

export const weeks = [
  { label: '星期一', value: 1, key: 'Monday' },
  { label: '星期二', value: 2, key: 'Tuesday' },
  { label: '星期三', value: 3, key: 'Wednesday' },
  { label: '星期四', value: 4, key: 'Thursday' },
  { label: '星期五', value: 5, key: 'Friday' },
  { label: '星期六', value: 6, key: 'Saturday' },
  { label: '星期日', value: 0, key: 'Sunday' }
]

// 今天
export const _dateNow = Moment().format('YYYY-MM-DD')

// 一星期之前
export const _dateOneWeekAgo = Moment().subtract(7, 'days').format('YYYY-MM-DD')

export const _timeNow = `${ _dateNow } 23:59:59`

export const _timeOneWeekAgo = `${ _dateOneWeekAgo } 00:00:00`

export const _operationAuthorizations = {
  _familyPhoneFamiliesSubPrisonAreaAuth: 'visit.family-phone.families-sub-prison-area.auth'
}

// 监狱内网白名单(租户编号)
export const prisonerInsideWhiteLists = ['4411']

// 星号隐藏配置
export const asteriskDisplayConst = {
  // 身份证
  asterisk_idCard: {
    start: 6,
    asteriskCount: 8
  },

  // 电话号码
  asterisk_phone: {
    start: 3,
    asteriskCount: 4
  },

  // 服刑人员编号
  asterisk_prisonerNumber: {
    start: 4,
    asteriskCount: 4
  },

  // 姓名
  asterisk_name: {
    start: 1
  }
}

// table 脱敏列基本配置
export const $likeName = {
  isDesensitizationCol,
  asteriskProp: 'asterisk_name',
  className
}

export const $likePrisonerNumber = {
  isDesensitizationCol,
  asteriskProp: 'asterisk_prisonerNumber',
  className
}

export const $likePhone = {
  isDesensitizationCol,
  asteriskProp: 'asterisk_phone',
  className
}

export const $likeIdCard = {
  isDesensitizationCol,
  asteriskProp: 'asterisk_idCard',
  className
}

export const terminalUsersBasicAuths = [
  'terminal.meeting',
  'terminal.family-phone',
  'terminal.family-message',
  'terminal.realtime-monitor',
  'terminal.surveillance-video',
  'terminal-videoconference',
  'terminal.terminal-to-termianl',
  'terminal.police-meeting'
]


export const smsSendTemplate = [
  {
    template: '尊敬的用户，湖南省女子监狱（$prisonerName）正在给您发送亲情短信，系统检测显示您的亲情短信服务功能还未开通。请您打开国科服务APP，点击服务-更多-亲情短信，开通亲情短信服务业务。',
    value: 2
  },
  {
    template: '尊敬的用户，湖南省女子监狱（$prisonerName）正在给您发送亲情短信，系统检测显示您的账户余额不足。请您打开国科服务APP，点击服务-更多-亲情短信，按照提示进行账户充值。',
    value: 3
  }
]

export const uploadStepsTabOptions = [
  { label: '读取excel' },
  { label: '解析excel' },
  { label: '初始化数据' },
  { label: '校验数据' },
  { label: '导入数据' },
  { label: '导入完成' }
]

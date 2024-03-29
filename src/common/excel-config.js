import { formatTime } from '@/utils/helper'

// eslint-disable-next-line
const filename_failed_data = '导入失败的数据'

// 服刑人员
const prisonerExcelConfig = {
  filename: {
    value: '服刑人员信息'
  },

  header: [
    '监狱名称',
    '服刑人员编号',
    '监区',
    '罪名',
    '每月通话次数',
    '刑期起止',
    '服刑人员状态',
    '对应家属'
  ],

  filterFields: [
    { key: 'jailName' },
    { key: 'prisonerNumber' },
    { key: 'prisonArea' },
    { key: 'crimes' },
    { key: 'accessTime' },

    {
      key: ['prisonTermStartedAt', 'prisonTermEndedAt'],

      formater: ([st, et]) => `${ formatTime(st, 'yyyy-MM-dd') }/${ formatTime(et, 'yyyy-MM-dd') }`
    },

    {
      key: [
        'sysFlag',
        'isBlacklist',
        'deleteReason',
        'reason'
      ],

      formater: ([sysFlag, isBlacklist, deleteReason, reason]) => {
        if (!sysFlag) {
          return `删除原因：${ deleteReason }`
        }
        else if (isBlacklist) {
          return `黑名单原因：${ reason }`
        }
        else {
          return ''
        }
      }
    },

    {
      key: 'families',

      formater: families => {
        if (families instanceof Array && families.length > 0) {
          return families.reduce((previous, current) => {
            if (previous === 'START') {
              return `${ current.familyName }`
            } else {
              eturn `${ previous } ${ current.familyName }`
            }
          }, 'START')
        } else return ''
      }
    }
  ]
}

// 监狱长信箱
const wardenMailboxExcelConfig = {
  filename: {
    value: '监狱长信箱',

    formater: filename => `${ filename + formatTime(undefined, 'yyyyMMddhhmmss') }`
  },

  header: [
    '监狱名称',
    '监区',
    '用户',
    '信件类别',
    '信件内容',
    '发件时间',
    '是否答复',
    '答复内容'
  ],

  filterFields: [
    { key: 'jailName' },
    { key: 'prisonArea' },
    { key: 'name' },
    { key: 'typeName' },
    { key: 'contents' },
    { key: 'createdAt' },

    {
      key: 'isReply',

      formater: isReply => {
        if (isReply) {
          return '是'
        } else {
          return '否'
        }
      }
    },

    { key: 'reply' }
  ]
}

const prisonerDataImportExcelConfig = {
  filename: {
    value: filename_failed_data
  },

  header: [
    '错误序号',
    '罪犯编号',
    '姓名',
    '性别',
    '罪名',
    '罚金',
    '起日',
    '止日',
    '队别',
    '分监区',
    '楼栋',
    '楼层',
    '原判刑期',
    '管教等级',
    '失败原因'
  ],

  filterFields: [
    { key: 'rowNum' },
    { key: 'prisonerNumber' },
    { key: 'name' },

    {
      key: 'gender',

      formater: gender => {
        if (gender === 'm') {
          return '男'
        }
        if (gender === 'f') {
          return '女'
        }
        else {
          return ''
        }
      }
    },

    { key: 'crimes' },
    { key: 'additionalPunishment' },

    {
      key: 'prisonTermStartedAt',

      formater: prisonTermStartedAt => formatTime(prisonTermStartedAt, 'yyyy/MM/dd')
    },

    {
      key: 'prisonTermEndedAt',

      formater: prisonTermEndedAt => formatTime(prisonTermEndedAt, 'yyyy/MM/dd')
    },

    // 队别
    { key: 'prisonArea' },
    // 分监区
    { key: 'subPrisonArea' },
    // 楼栋
    { key: 'buildName' },
    // 楼层
    { key: 'floorName' },
    // 原判刑期
    { key: 'originalSentence' },
    // 管教级别
    { key: 'level' },
    { key: 'reason' }
  ]
}

//  奖惩失败数据
const punishmentImportExcelConfig = {
  filename: {
    value: filename_failed_data
  },

  header: [
    '年份',
    '月份',
    '姓名',
    '编号',
    '表扬数',
    '物质奖励数',
    '立功个数',
    '重大立功数',
    '警告个数',
    '记过个数',
    '禁闭个数',
    '失败原因'
  ],

  filterFields: [
    { key: 'year' },
    { key: 'monthName' },
    { key: 'name' },
    { key: 'prisonerNumber' },
    { key: 'praiseTimes' },
    { key: 'materialAwardTimes' },
    { key: 'meritTimes' },
    { key: 'greatMeritTimes' },
    { key: 'warnTimes' },
    { key: 'mistakeTimes' },
    { key: 'confinementTimes' },
    { key: 'reason' }
  ]
}

//  积分考核失败数据
const scoreImportExcelConfig = {
  filename: {
    value: filename_failed_data
  },

  header: [
    '年份',
    '月份',
    '姓名',
    '编号',
    '教育改造基础分',
    '劳动改造基础分',
    '当月基础分',
    '教育改造加分',
    '劳动改造加分',
    '当月加分',
    '教育改造扣分',
    '劳动改造扣分',
    '当月扣分',
    '专项加分',
    '处罚',
    '总得分',
    '失败原因'
  ],

  filterFields: [
    { key: 'year' },
    { key: 'monthName' },
    { key: 'name' },
    { key: 'prisonerNumber' },
    { key: 'educationBaseScore' },
    { key: 'workBaseScore' },
    { key: 'monthBaseScore' },
    { key: 'educationAwardScore' },
    { key: 'workAwardScore' },
    { key: 'monthAwardScore' },
    { key: 'educationDeductScore' },
    { key: 'workDeductScore' },
    { key: 'monthDeductScore' },
    { key: 'specialAwardScore' },
    { key: 'punishScore' },
    { key: 'totalScore' },
    { key: 'reason' }
  ]
}

export {
  prisonerExcelConfig,
  wardenMailboxExcelConfig,
  prisonerDataImportExcelConfig,
  punishmentImportExcelConfig,
  scoreImportExcelConfig
}

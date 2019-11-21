import { formatTime } from '@/utils/helper'

const prisonerExcelConfig = {
  filename: {
    value: '服刑人员信息'
  },
  header: ['监狱名称', '服刑人员编号', '监区', '罪名', '每月会见次数', '刑期起止', '服刑人员状态', '对应家属'],
  filterFields: [
    { key: 'jailName' },
    { key: 'prisonerNumber' },
    { key: 'prisonArea' },
    { key: 'crimes' },
    { key: 'accessTime' },
    {
      key: ['prisonTermStartedAt', 'prisonTermEndedAt'],
      formater: ([st, et]) => {
        return `${ formatTime(st, 'yyyy-MM-dd') }/${ formatTime(et, 'yyyy-MM-dd') }`
      }
    },
    {
      key: ['sysFlag', 'isBlacklist', 'deleteReason', 'reason'],
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
      formater: (families) => {
        if (families instanceof Array && families.length > 0) {
          return families.reduce((previous, current) => {
            if (previous === 'START') {
              return `${ current.familyName }`
            }
            else {
              return `${ previous } ${ current.familyName }`
            }
          }, 'START')
        }
        else {
          return ''
        }
      }
    }
  ]
}

const wardenMailboxExcelConfig = {
  filename: {
    value: '监狱长信箱',
    formater: (filename) => {
      return `${ filename + formatTime(undefined, 'yyyyMMddhhmmss') }`
    }
  },
  header: [ '监狱名称', '监区', '用户', '信件类别', '信件内容', '发件时间', '是否答复', '答复内容' ],
  filterFields: [
    { key: 'jailName' },
    { key: 'prisonArea' },
    { key: 'name' },
    { key: 'typeName' },
    { key: 'contents' },
    { key: 'createdAt' },
    {
      key: 'isReply',
      formater: (isReply) => {
        if (isReply) return '是'
        else return '否'
      }
    },
    { key: 'reply' }
  ]
}

export { prisonerExcelConfig, wardenMailboxExcelConfig }

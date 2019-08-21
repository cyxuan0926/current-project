import { formatTime } from '@/utils/helper'

const prisonerExcelConfig = {
  filename: '服刑人员信息',
  header: ['服刑人员姓名', '服刑人员编号', '监区', '罪名', '每月会见次数', '刑期起止', '黑名单原因', '对应家属'],
  filterFields: [
    { key: 'name' },
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
    { key: 'reason' },
    {
      key: 'families',
      formater: (families) => {
        if (families instanceof Array && families.length > 0) {
          return families.reduce((previous, current) => {
            return `${ previous }, ${ current.familyName }`
          }, families[0].familyName)
        }
        else {
          return ''
        }
      }
    }
  ]
}

export { prisonerExcelConfig }

import { _ygPrisonCommonSearchItems, _ygPrisonCommonTableCols } from '@/common/constants/yg-prisons'

import { arrayRemove } from '@/utils/helper'

export const tabItems = [
  {
    label: '考核奖惩情况表',
    name: '0'
  },

  {
    label: '罪犯等级评定表',
    name: '1'
  },

  {
    label: '计分考核表',
    name: '2'
  }
]

export const _searchItems = _ygPrisonCommonSearchItems()

export const httpRequests = {
  pagedRequest: {
    url: '/prisonManagementEnquiry/page',

    params: {}
  },

  excelExportRequest: {
    url: '/prisonManagementEnquiry/export',

    params: {},

    methods: 'get'
  },

  excelDownloadRequest: {
    '0': {
      params: {
        fileName: '/template/reward_punish_template.xls'
      }
    },

    '1': {
      params: {
        fileName: '/template/rating_template.xls'
      }
    },

    '2': {
      params: {
        fileName: '/template/score_template.xls'
      }
    }
  },

  excelUploadRequest: {
    url: '/prisonManagementEnquiry/import',

    params: {},

    methods: 'get'
  }
}

const _commonCols = _ygPrisonCommonTableCols()

const _criminalRate = () => {
  const _temp = _ygPrisonCommonTableCols()

  arrayRemove(_temp, '年份', 'label')

  arrayRemove(_temp, '月份', 'label')

  return _temp
}

const _createTime = {
  label: '导入时间',
  prop: 'createTime',
  width: 120
}

const _remark = {
  label: '备注',
  prop: 'remark',
  showOverflowTooltip: true,
  minWidth: 120
}

export const _tableCols = {
  '0': [
    ..._commonCols,
    {
      label: '奖惩事由',
      prop: 'reason',
      showOverflowTooltip: true,
      minWidth: 120
    },

    {
      label: '奖惩类别',
      prop: 'type',
      showOverflowTooltip: true
    },

    {
      label: '加减分情况',
      prop: 'score',
      showOverflowTooltip: true
    },

    {
      label: '审批时间',
      prop: 'auditTime'
    },

    _remark,

    _createTime
  ],

  '1': [
    ..._criminalRate(),

    {
      label: '分管等级',
      prop: 'level'
    },

    _createTime
  ],

  '2': [
    ..._commonCols,

    {
      label: '教育改造分',
      prop: 'educationScores'
    },

    {
      label: '劳动改造分',
      prop: 'laborScores'
    },

    {
      label: '奖扣分',
      prop: 'awardScores'
    },

    {
      label: '事由',
      prop: 'reason',
      minWidth: 120
    },

    {
      label: '当月得分',
      prop: 'monthScores'
    },

    {
      label: '累计得分',
      prop: 'scores'
    },

    _remark,

    _createTime
  ]
}

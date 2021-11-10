import { _ygPrisonCommonSearchItems, _ygPrisonCommonTableCols } from '@/common/constants/yg-prisons'

import { arrayRemove } from '@/utils/helper'

export const tabItems = [
  {
    label: '伙食供应量表',
    name: '0'
  },

  {
    label: '医疗费用开支表',
    name: '1'
  },

  {
    label: '被服发放标准表',
    name: '2'
  }
]

export const _searchItems = _ygPrisonCommonSearchItems()

export const httpRequests = {
  // 查询数据表
  pagedRequest: {
    0: {
      url: '/infoFoodSupply/foodSupplyList',
      params: {}
    },
    1: {
      url: '/infoMedicalExpense/medicalExpenseList',
      params: {}
    },
    2: {
      url: '/infoQuiltSend/quiltSendList',
      params: {}
    }
  },
    // 导出数据表
  excelExportRequest: {
    0: {
      url: '/infoFoodSupply/exportFoodSupplyList',
      params: {},
      methods: 'get'
    },
    1: {
      url: '/infoMedicalExpense/exportMedicalExpense',
      params: {},
      methods: 'get'
    },
    2: {
      url: '/infoQuiltSend/export',
      params: {},
      methods: 'post'
    }
  },
   // 数据表模板下载
  excelDownloadRequest: {
    0: {
      params: {
        fileName: 'reward_punish_template.xls'
      }
    },

    1: {
      params: {
        fileName: 'rating_template.xls'
      }
    },

    2: {
      params: {
        fileName: '/template/quilt_send_template.xls'
      }
    }
  },
 // 导入数据表
  excelUploadRequest: {
     0: {
      url: '/infoFoodSupply/importInfoFoodSupply',
      params: {},
      methods: 'get'
      },
     1: {
        url: '/infoMedicalExpense/importInfoMedicalExpense',
        params: {},
        methods: 'get'
        },
     2: {
          url: '/infoQuiltSend/importInfoQuiltSend',
          params: {},
          methods: 'get'
      }
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
  showOverflowTooltip: true
}

export const _tableCols = {
  0: [
    ..._commonCols,
    {
      label: '奖惩事由',
      prop: 'reason',
      showOverflowTooltip: true
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

  1: [
    ..._criminalRate(),

    {
      label: '分管等级',
      prop: 'level'
    },

    _createTime
  ],

  2: [
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
      prop: 'scores'
    },

    {
      label: '事由',
      prop: 'reason'
    },

    {
      label: '当月得分',
      prop: 'monthScores'
    },

    _remark,

    _createTime
  ]
}

import { _ygPrisonCommonSearchItems, _ygPrisonCommonTableCols } from '@/common/constants/yg-prisons'

import { arrayRemove } from '@/utils/helper'

export const tabItems = [
  {
    label: '劳动改造任务完成情况表',
    name: '0'
  },

  {
    label: '劳动报酬明细表',
    name: '1'
  },

  {
    label: '岗前培训明细表',
    name: '2'
  }
]

export const _searchItems = _ygPrisonCommonSearchItems()

export const httpRequests = {
  // 查询数据表
  pagedRequest: {
    0: {
      url: '/infoLaborReform/queryPageList',
      params: {}
    },
    1: {
      url: '/infoLaborRemuneration/queryPageList',
      params: {}
    },
    2: {
      url: '/infoLaborTrain/queryPageList',
      params: {}
    }
  },
    // 导出数据表
  excelExportRequest: {
    0: {
      url: '/infoLaborReform/exportList',
      params: {},
      methods: 'get'
    },
    1: {
      url: '/infoLaborRemuneration/exportList',
      params: {},
      methods: 'get'
    },
    2: {
      url: '/infoLaborTrain/exportList',
      params: {},
      methods: 'get'
    }
  },
   // 数据表模板下载
  excelDownloadRequest: {
    0: {
      params: {
        fileName: '/template/labor_reform_template.xlsx'
      }
    },

    1: {
      params: {
        fileName: '/template/labor_remuneration_template.xlsx'
      }
    },

    2: {
      params: {
        fileName: '/template/labor_train_template.xlsx'
      }
    }
  },
 // 导入数据表
  excelUploadRequest: {
     0: {
      url: '/infoLaborReform/importInfoLaborReform',
      params: {},
      methods: 'post'
      },
     1: {
        url: '/infoLaborRemuneration/importInfoLaborRemuneration',
        params: {},
        methods: 'post'
        },
     2: {
          url: '/infoLaborTrain/importInfoLaborTrain',
          params: {},
          methods: 'post'
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
      label: '劳动项目',
      prop: 'project',
      showOverflowTooltip: true
    },
    {
      label: '岗位',
      prop: 'post',
      showOverflowTooltip: true
    },
    {
      label: '完成劳动任务',
      prop: 'situation',
      showOverflowTooltip: true
    },

    _remark,

    _createTime
  ],

  1: [
    ..._commonCols,

    {
      label: '劳动报酬金',
      prop: 'amount'
    },
    {
      label: '劳动报酬累计',
      prop: 'amountSum'
    },
    _remark,
    _createTime
  ],

  2: [
    ..._commonCols,
    {
      label: '岗前培训情况',
      prop: 'situation'
    },
    {
      label: '培训时间',
      prop: 'trainDate'
    },
    _remark,

    _createTime
  ]
}

import { _ygPrisonCommonSearchItems, _ygPrisonCommonTableCols } from '@/common/constants/yg-prisons'

export const tabItems = [
  {
    label: '减刑假释情况表',
    name: '0'
  }
]

export const _searchItems = _ygPrisonCommonSearchItems()

export const httpRequests = {
  pagedRequest: {
    url: '/infoSentenceParole/page'
  },

  excelExportRequest: {
    url: '/infoSentenceParole/export',

    methods: 'get'
  },

  excelDownloadRequest: {
    '0': {
      params: {
        fileName: 'info_sentence_parole_template.xls'
      }
    }
  },

  excelUploadRequest: {
    url: '/infoSentenceParole/import'
  }
}

const _commonCols = _ygPrisonCommonTableCols()

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
      label: '减刑假释情况',
      prop: 'sentenceParoleDetail',
      showOverflowTooltip: true,
      minWidth: 120
    },

    {
      label: '减刑时间',
      prop: 'reduceTime',
      showOverflowTooltip: true
    },

    {
      label: '减刑后刑止日期',
      prop: 'releaseTime',
      showOverflowTooltip: true,
      minWidth: 120
    },

    _remark,

    _createTime
  ]
}

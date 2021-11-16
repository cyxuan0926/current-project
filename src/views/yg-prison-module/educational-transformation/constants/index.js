import { _ygPrisonCommonSearchItems, _ygPrisonCommonTableCols } from '@/common/constants/yg-prisons'

export const tabItems = [
  {
    label: '三课教育统计表',
    name: '0'
  }
]

export const _searchItems = _ygPrisonCommonSearchItems()

export const httpRequests = {
  pagedRequest: {
    url: '/infoEducation/page'
  },

  excelExportRequest: {
    url: '/infoEducation/export',

    methods: 'get'
  },

  excelDownloadRequest: {
    '0': {
      params: {
        fileName: '/template/info_education_template.xls'
      }
    }
  },

  excelUploadRequest: {
    url: '/infoEducation/import'
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
  minWidth: 100
}

export const _tableCols = {
  '0': [
    ..._commonCols,
    {
      label: '思想教育',
      prop: 'ideologyEducation',
      showOverflowTooltip: true
    },

    {
      label: '考核结果',
      prop: 'ideologyResult',
      showOverflowTooltip: true
    },

    {
      label: '考核时间',
      prop: 'ideologyTime',
      showOverflowTooltip: true
    },

    {
      label: '文化教育',
      prop: 'cultureEducation',
      showOverflowTooltip: true
    },

    {
      label: '考核结果',
      prop: 'cultureResult',
      showOverflowTooltip: true
    },

    {
      label: '考核时间',
      prop: 'cultureTime',
      showOverflowTooltip: true
    },

    {
      label: '职业技术教育',
      prop: 'vocationalEducation',
      showOverflowTooltip: true,
      minWidth: 100
    },

    {
      label: '考核结果',
      prop: 'vocationalResult',
      showOverflowTooltip: true
    },

    {
      label: '考核时间',
      prop: 'vocationalTime',
      showOverflowTooltip: true
    },

    {
      label: '获证情况',
      prop: 'certification',
      showOverflowTooltip: true
    },

    _remark,

    _createTime
  ]
}

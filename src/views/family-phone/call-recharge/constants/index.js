import { _ygPrisonCommonSearchItems, _ygPrisonCommonTableCols } from '@/common/constants/yg-prisons'

import { arrayRemove } from '@/utils/helper'

import switches from '@/filters/modules/switches'

import { _dateNow, _oneMonthAgo } from '@/common/constants/const'

import Moment from 'moment'

export const tabItems = [
  {
    label: '亲情电话通话费用充值',
    name: '0'
  },

  {
    label: '亲情电话通话费用管理',
    name: '1'
  }
]

const { prisonArea, ...others } = _ygPrisonCommonSearchItems()

const types = {
  label: '类型',
  type: 'select',
  options: switches['familyPhoneCallRechargeTypeOptions'],
  filterable: true,
  value: '',
  miss: false
}

let _minTime = null, _maxTime = null

const dateMonth = {
  type: 'dateRange',
  unlinkPanels: true,
  start: 'applicationStartDate',
  end: 'applicationEndDate',
  startPlaceholder: '通话开始时间',
  endPlaceholder: '通话结束时间',
  value: [_dateNow, _oneMonthAgo],
  pickerOptions: {
    onPick: ({ minDate, maxDate }) => {
      if (!maxDate) {
        _minTime = Moment(minDate).subtract(0.5, 'years').format('x')

        _maxTime = Moment(minDate).add(0.5, 'years').format('x')
      } else _minTime = _maxTime = null
    },

    disabledDate: t => {
      if (_minTime && _maxTime) return t.getTime() < _minTime || t.getTime() > _maxTime
    }
  }
}

export const _searchItems = {
  prisonArea,
  types,
  ...others,
  dateMonth
}

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

// const _commonCols = () => {
//   const _temp = _ygPrisonCommonTableCols()

//   arrayRemove(_temp, '序号', 'label')

//   arrayRemove(_temp, '年份', 'label')

//   arrayRemove(_temp, '月份', 'label')

//   return _temp
// }
const _commonCols = _ygPrisonCommonTableCols()
console.log(_commonCols)

const _rechargeAmount = {
  label: '亲情电话充值金额(元)',
  prop: '',
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

    _rechargeAmount,

    {
      label: '充值账号',
      prop: 'ideologyResult',
      showOverflowTooltip: true
    },

    _remark,

    {
      label: '充值时间',
      prop: 'cultureEducation',
      showOverflowTooltip: true
    }
  ],

  '1': [
    ..._commonCols,
    
    {
      label: '亲情电话充值金额(元)',
      prop: 'rechargeAmount',
      showOverflowTooltip: true
    },
    
    {
      label: '可视电话消费金额(元)',
      prop: 'cultureEducation',
      showOverflowTooltip: true
    },
    {
      label: '系统电话消费金额(元)',
      prop: 'cultureEducation',
      showOverflowTooltip: true
    },

    {
      label: '亲情电话余额(元)',
      prop: 'cultureEducation',
      showOverflowTooltip: true
    },

    _remark
  ]
}

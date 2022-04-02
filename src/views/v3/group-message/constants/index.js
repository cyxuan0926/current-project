import { _ygPrisonCommonTableCols } from '@/common/constants/yg-prisons'
import { _dateNow, _oneMonthAgo } from '@/common/constants/const'

import Moment from 'moment'

export const tabItems = [
  {
    label: '监狱群发短信',
    name: '1'
  },
  {
    label: '系统群发短信',
    name: '0'
  }
]
let _minTime = null, _maxTime = null
const dateMonth = {
  type: 'dateRange',
  unlinkPanels: true,
  start: 'startDate',
  end: 'endDate',
  startPlaceholder: '通话开始时间',
  endPlaceholder: '通话结束时间',
  value: [_oneMonthAgo, _dateNow],
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
  content: {
    type: 'input',
    label: '短信内容',
    miss: false,
    value: ''
  },
  dateMonth
}

export const httpRequests = {
  // 查询数据表
  pagedRequest: {
    '0': {
      url: '/batchNotify/page',
      params: { isYgPrison: true, role: 0 }
    },
    '1': {
      url: '/batchNotify/page',
      params: { isYgPrison: true, role: 1 }
    }
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
  showOverflowTooltip: true
}

export const _tableCols = {
  '0': [
    {
      label: '序号',
      type: 'index'
    },
    {
      label: '省份',
      prop: 'provincesName',
      showOverflowTooltip: true
    },

    {
      label: '监狱名称',
      prop: 'jailName',
      showOverflowTooltip: true
    },

    {
      // 以防需要自定义
      label: '年份',
      prop: 'yearNum',
      slotName: 'infoRecipeYearNum'
    },

    {
      // 以防需要自定义
      label: '月份',
      prop: 'monthNum',
      slotName: 'infoRecipeMonthNum'
    },

    {
      // 以防需要自定义
      label: '星期',
      prop: 'week'
    },
    {
      // 以防需要自定义
      label: '早餐',
      prop: 'breakfast'
    },
    {
      label: '中餐',
      prop: 'lunch'
    },
    {
      // 以防需要自定义
      label: '晚餐',
      prop: 'dinner'
    },
    _remark,

    _createTime
  ],

  '1': [
    ..._commonCols,
    {
      label: '食物名称',
      prop: 'foodName'
    },
    {
      label: '用量',
      prop: 'quantity'
    },
    _remark,
    _createTime
  ]
}

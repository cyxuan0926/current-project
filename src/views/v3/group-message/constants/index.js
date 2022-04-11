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
      params: { isYgPrison: 'batchNotifyList', role: 0 }
    },
    '1': {
      url: '/batchNotify/page',
      params: { isYgPrison: 'batchNotifyList', role: 1 }
    }
  }
}

export const _tableCols = {
  '0': [
    {
      label: '序号',
      type: 'index'
    },
    {
      label: '短信内容',
      prop: 'content',
      slotName: 'content'
    },

    {
      label: '发送时间',
      prop: 'createTime'
    },
    {
      label: '发送范围(省份)',
      prop: 'provincesName'
    },
    {
      label: '发送范围(监狱)',
      prop: 'jailName'
    },
    {
      label: '短信发送状态',
      prop: 'status'
    },
    {
      label: '短信发送人',
      prop: 'sender'
    }
  ],

  '1': [
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
      label: '短信内容',
      prop: 'content',
      slotName: 'content'
    },

    {
      label: '发送时间',
      prop: 'createTime'
    },
    {
      label: '发送范围',
      prop: 'breakfast'
    },
    {
      label: '短信发送状态',
      prop: 'status'
    },
    {
      label: '短信发送人',
      prop: 'sender'
    }
  ]
}

import { _ygPrisonCommonSearchItems, _ygPrisonCommonTableCols } from '@/common/constants/yg-prisons'

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
  start: 'startDate',
  end: 'endDate',
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
  // 分页查询
  pagedRequest: {
    '0': {
      url: '/callChargeManage/page',
      params: { isYgPrison: true }
    },
    '1': {
      url: '/callChargeManage/managePage',
      //非阳光监狱传true
      params: { isYgPrison: 'familyInfoImportList' }
    }
  },
  // 导出
  excelExportRequest: {
    '0': {
      url: '/callChargeManage/export',
      params: { isYgPrison: true },
      methods: 'get'
    },
    '1': {
      url: '/callChargeManage/exportManage',
      params: { isYgPrison: true },
      methods: 'get'
    }
  },
  // 模板
  excelDownloadRequest: {
    '0': {
      params: {
        fileName: '/template/call_charge_recharge_template.xls'
      }
    }
  },
  // 导入
  excelUploadRequest: {
    '0': {
      url: '/callChargeManage/importCallChargeManage',
      params:{ isYgPrison: true },
      methods: 'post'
    },
  }
}


const _commonCols = [
  {
    label: '省份',
    prop: 'provinceName',
    showOverflowTooltip: true
  },

  {
    label: '监狱名称',
    prop: 'jailName',
    showOverflowTooltip: true
  },
  {
    label: '监区',
    prop: 'prisonArea',
    slotName: 'prisonArea',
    showOverflowTooltip: true
  },
  {
    label: '罪犯姓名',
    prop: 'prisonerName'
    // ...$likeName
  },

  {
    label: '罪犯编号',
    prop: 'prisonerNumber'
    // ...$likePrisonerNumber
  }
]

const _rechargeAmount = {
  label: '亲情电话充值金额(元)',
  prop: 'rechargeAmount',
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
      prop: 'systemAmount',
      showOverflowTooltip: true
    },

    _remark,

    {
      label: '充值时间',
      prop: 'systemAmount',
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
      prop: 'videophoneAmount',
      slotName: 'videophoneAmount',
      showOverflowTooltip: true
    },
    {
      label: '系统电话消费金额(元)',
      prop: 'systemAmount',
      showOverflowTooltip: true
    },
    {
      label: '退款金额(元)',
      prop: 'refundAmount',
      showOverflowTooltip: true
    },

    {
      label: '亲情电话余额(元)',
      prop: 'balanceAmount',
      showOverflowTooltip: true
    },

    _remark
  ]
}

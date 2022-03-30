import { _ygPrisonCommonSearchItems, _ygPrisonCommonTableCols } from '@/common/constants/yg-prisons'

export const tabItems = [
  {
    label: '监狱群发短信',
    name: '0'
  },
  {
    label: '系统群发短信',
    name: '1'
  }
]

export const _searchItems = _ygPrisonCommonSearchItems()

export const httpRequests = {
  // 查询数据表
  pagedRequest: {
    '0': {
      url: '/infoRecipe/page',
      params: {}
    },
    '1': {
      url: '/infoFoodSupply/foodSupplyList',
      params: {}
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

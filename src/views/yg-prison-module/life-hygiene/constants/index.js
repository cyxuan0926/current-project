import { _ygPrisonCommonSearchItems, _ygPrisonCommonTableCols } from '@/common/constants/yg-prisons'
import { $likeName, $likePrisonerNumber } from '@/common/constants/const'
import { arrayRemove } from '@/utils/helper'

export const tabItems = [
  {
    label: '食谱表',
    name: '0'
  },
  {
    label: '伙食供应量表',
    name: '1'
  },

  {
    label: '医疗费用开支表',
    name: '2'
  },

  {
    label: '被服发放标准表',
    name: '3'
  },
  {
    label: '零花钱详情表',
    name: '4'
  }
]

export const _searchItems = _ygPrisonCommonSearchItems()

export const httpRequests = {
  // 查询数据表
  pagedRequest: {
    0: {
      url: '/infoRecipe/page',
      params: {}
    },
    1: {
      url: '/infoFoodSupply/foodSupplyList',
      params: {}
    },
    2: {
      url: '/infoMedicalExpense/medicalExpenseList',
      params: {}
    },
    3: {
      url: '/infoQuiltSend/quiltSendList',
      params: {}
    },
    4: {
      url: '/infoPocketMoney/pocketMoneyList',
      params: {}
    }
  },
    // 导出数据表
  excelExportRequest: {
    0: {
      url: '/infoRecipe/export',
      params: {},
      methods: 'get'
    },
    1: {
      url: '/infoFoodSupply/exportFoodSupplyList',
      params: {},
      methods: 'get'
    },
    2: {
      url: '/infoMedicalExpense/exportMedicalExpense',
      params: {},
      methods: 'get'
    },
    3: {
      url: '/infoQuiltSend/export',
      params: {},
      methods: 'get'
    },
    4: {
      url: '/infoPocketMoney/exportPocketMoney',
      params: {},
      methods: 'get'
    }
  },
   // 数据表模板下载
  excelDownloadRequest: {
    0: {
      params: {
        fileName: '/template/info_recipe_template.xls'
      }
    },

    1: {
      params: {
        fileName: '/template/food_supply_template.xls'
      }
    },

    2: {
      params: {
        fileName: '/template/medical_expense_template.xls'
      }
    },

    3: {
      params: {
        fileName: '/template/quilt_send_template.xls'
      }
    },

    4: {
      params: {
        fileName: '/template/pocket_money_template.xls'
      }
    }
  },
 // 导入数据表
  excelUploadRequest: {
    0: {
      url: '/infoRecipe/import',
      params: {},
      methods: 'post'
      },
     1: {
      url: '/infoFoodSupply/importInfoFoodSupply',
      params: {},
      methods: 'post'
      },
    2: {
        url: '/infoMedicalExpense/importInfoMedicalExpense',
        params: {},
        methods: 'post'
        },
     3: {
          url: '/infoQuiltSend/importInfoQuiltSend',
          params: {},
          methods: 'post'
      },
     4: {
           url: '/infoPocketMoney/importInfoPocketMoney',
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
const _reason = {
  label: '备注',
  prop: 'reason',
  showOverflowTooltip: true
}

export const _tableCols = {
  0: [
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
      slotName: 'yearNum'
    },

    {
      // 以防需要自定义
      label: '月份',
      prop: 'monthNum',
      slotName: 'monthNum'
    },
    {
      // 以防需要自定义
      label: '早餐',
      prop: 'breakfast'
    },
    {
      // 以防需要自定义
      label: '星期',
      prop: 'week'
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

  1: [
    ..._criminalRate(),

    {
      // 以防需要自定义
      label: '年份',
      prop: 'yearNum',
      slotName: 'yearNum'
    },

    {
      // 以防需要自定义
      label: '月份',
      prop: 'monthNum',
      slotName: 'monthNum'
    },
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
  ],

  2: [
    ..._commonCols,

    {
      label: '病因',
      prop: 'reason'
    },

    {
      label: '治疗费',
      prop: 'cost'
    },
    _reason,
    _createTime
  ],
  3: [
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
      label: '监区',
      prop: 'prisonArea',
      slotName: 'prisonArea',
      showOverflowTooltip: true
    },
    {
      label: '罪犯姓名',
      prop: 'prisonerName',
      ...$likeName
    },

    {
      label: '罪犯编号',
      prop: 'prisonerNumber',
      ...$likePrisonerNumber
    },
    {
      label: '类别',
      prop: 'category'
    },

    {
      label: '品名',
      prop: 'brandName',
      showOverflowTooltip: true
    },
    {
      label: '标准',
      prop: 'standard',
      showOverflowTooltip: true
    },
    {
      label: '发放情况',
      prop: 'condition',
      showOverflowTooltip: true
    },
    _remark,
    _createTime
  ],
  4: [
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
      label: '监区',
      prop: 'prisonArea',
      slotName: 'prisonArea',
      showOverflowTooltip: true
    },
    {
      label: '罪犯姓名',
      prop: 'prisonerName',
      ...$likeName
    },

    {
      label: '罪犯编号',
      prop: 'prisonerNumber',
      ...$likePrisonerNumber
    },
    {
      label: '收入情况',
      prop: 'income'
    },

    {
      label: '支出情况（购物）',
      prop: 'expenditure',
      showOverflowTooltip: true
    },
    {
      label: '余额',
      prop: 'balance',
      showOverflowTooltip: true
    },
    _remark,
    _createTime
  ]
}

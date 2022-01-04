// import { $likeName, $likePrisonerNumber } from '@/common/constants/const'
import { formatTime } from '@/utils/helper'

const startDate = formatTime(new Date(), 'yyyy-MM')

const endDate = formatTime(new Date(), 'yyyy-MM')

// search选项 适用绝大部分时间
export const _ygPrisonCommonSearchItems = () => {
  return {
    // 重定义监区字段 因为 只查第一次监区 selectKey不要为prisonAreaId这个就可以了
    prisonArea: {
      label: '监区',
      selectKey: 'prisonArea',
      type: 'select',
      options: [],
      filterable: true,
      belong: { value: 'id', label: 'name' },
      value: '',
      miss: false
    },

    // 服刑人员编号
    prisonerNumber: {
      type: 'input',
      label: '罪犯编号',
      miss: false,
      value: ''
    },

    // 服刑人员姓名
    prisonerName: {
      type: 'input',
      label: '罪犯姓名',
      miss: false,
      value: ''
    },

    // 开始时间-结束时间
    dateMonth: {
      type: 'monthRangeSelector',
      canNotClear: true,
      startKey: 'startDate',
      endKey: 'endDate',
      range: {
        max: formatTime(new Date(), 'yyyy-MM'),
        maxMonthRange: 24
      },
      value: [startDate, endDate]
    }
  }
}

// table选项 绝大部分的都适用顺序
export const _ygPrisonCommonTableCols = () => {
  return [
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
      slotName: 'yearNum',
      width: 50
    },

    {
      // 以防需要自定义
      label: '月份',
      prop: 'monthNum',
      slotName: 'monthNum',
      width: 50
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
}

// 导出excel的请求url
export const _ygPrisonExportExcelUrls = [
  '/prisonManagementEnquiry/export',
  '/infoFoodSupply/exportFoodSupplyList',
  '/infoQuiltSend/export',
  '/infoMedicalExpense/exportMedicalExpense',
  '/infoSentenceParole/export',
  '/infoEducation/export',
  '/infoPocketMoney/exportPocketMoney',
  '/infoRecipe/export',
  '/infoLaborReform/exportList',
  '/infoLaborRemuneration/exportList',
  '/infoLaborTrain/exportList',
  '/infoMedicalExpense/exportMedicalExpense',
  // 为了处理baseURL 不是狱物通的
  '/download/common/download'
]

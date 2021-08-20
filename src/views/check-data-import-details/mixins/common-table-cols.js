import dataImportDetails from '@/common/constants/data-import-details'

import { mapActions, mapState } from 'vuex'

import { $likeName, $likePrisonerNumber } from '@/common/constants/const'

export default {
  data() {
    const basicSearchItems = {
      name: {
        type: 'input',
        label: '罪犯姓名'
      },
      prisonerNumber: {
        type: 'input',
        label: '罪犯编号'
      },
      time: {
        type: 'dateRange',
        start: 'start',
        end: 'end',
        unlinkPanels: true
      }
    }
    return {
      selfOwnSearchItems: {},
      searchItems: { ...basicSearchItems }
    }
  },
  props: {
    type: String
  },

  async mounted() {
    this.searchItems = {
      ...this.searchItems,
      ...this.selfOwnSearchItems
    }

    if (![dataImportDetails.DATA_POCKET_MONEY].includes(this.type)) this.$set(this.searchItems['time'], 'value', [this.$_dateOneWeekAgo, this.$_dateNow])

    this.onLocalGetFilter()

    await this.getDatas()
  },

  methods: {
    ...mapActions([
      'getPrisonersInsideJailsCosts',
      'getPrisonersPocketMoney',
      'getPrisonTerms',
      'getPrisonerRewardPunishments']),

    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },

    onLocalGetFilter() {}
  },
  computed: {
    ...mapState([
      'prisonersInsideJailsCosts',
      'prisonersPocketMoney',
      'prisonTerms',
      'prisonerRewardPunishments'
    ]),

    tableCols() {
      const leadingCols = [
        {
          label: '罪犯姓名',
          prop: 'name',
          minWidth: '80',
          ...$likeName
        },
        {
          label: '罪犯编号',
          prop: 'prisonerNumber',
          minWidth: '70',
          ...$likePrisonerNumber
        },
        {
          label: '监区',
          prop: 'prisonArea'
        }
      ]
      const trailingCols = [
        {
          label: '数据导入人员',
          prop: 'realName',
          minWidth: '92'
        },
        {
          label: '数据导入时间',
          minWidth: '120',
          slotName: 'createdAt'
        }
      ]
      let middleCols
      switch (this.type) {
        case dataImportDetails.DATA_SENTENCE_CHANGE:
          middleCols = [
            {
              label: '减刑时间',
              prop: 'termStart',
              minWidth: '115'
            },
            {
              label: '变动类型',
              prop: 'changetype',
              showOverflowTooltip: true
            },
            {
              label: '减刑变动年/月/日',
              minWidth: '110',
              slotName: 'changeyear'
            },
            {
              label: '变动后刑期止日',
              minWidth: '120',
              prop: 'termFinish'
            }
          ]
          break
        case dataImportDetails.DATA_REWARD_PUNISHMENT:
          middleCols = [
            {
              label: '年份',
              prop: 'datayear'
            },
            {
              label: '奖惩内容',
              prop: 'ndry'
            }
          ]
          break
        case dataImportDetails.DATA_POCKET_MONEY:
          middleCols = [
            {
              label: '当前余额',
              slotName: 'balance'
            },
            {
              label: '收入总额',
              slotName: 'income'
            },
            {
              label: '支出总额',
              slotName: 'expenditure'
            },
            {
              label: '日期',
              prop: 'accountDate'
            }
          ]
          break
        case dataImportDetails.DATA_PRISON_CONSUMPTION:
          leadingCols[0]['prop'] = 'prisonerName'
          middleCols = [
            {
              label: '类别',
              prop: 'consumeType',
              minWidth: '68'
            },
            {
              label: '场地',
              prop: 'address'
            },
            {
              label: '交易金额',
              minWidth: '68',
              slotName: 'consume'
            },
            {
              label: '余额',
              minWidth: '65',
              slotName: 'balance'
            },
            {
              label: '操作时间',
              minWidth: '120',
              slotName: 'consumeAt'
            }
          ]
          break
        default:
          break
      }
      return [
        ...leadingCols,
        ...middleCols,
        ...trailingCols
      ]
    }
  }
}

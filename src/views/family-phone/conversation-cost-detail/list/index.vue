<template>
  <el-row class="row-container" :gutter="0">
    <m-search
      ref="search"
      :items="searchItems"
      @searchSelectChange="searchSelectChange"
      @search="onSearch"
    >
      <template #append>
        <m-excel-download :path="''" :params="{}" />

        <el-button type="primary">结算</el-button>
      </template>
    </m-search>

    <el-col :span="24">
      <m-table-new
        stripe
        :cols="tableCols"
        :data="settleAccountsPaged.content"
        :cell-class-name="tableCellClassName"
      >
        <template #time="{ row }">{{ row.startAt + '-' + row.endAt }}</template>

        <template #detail>
          <el-button type="text">详情</el-button>
        </template>

        <template #duration="{ row }">{{ row.duration | time }}</template>

        <template #releaseType="{ row }">{{ row.releaseType | isReleaseType }}</template>
      </m-table-new>
    </el-col>

    <m-pagination
      ref="pagination"
      :total="settleAccountsPaged.totalCount"
      @onPageChange="getDatas"
    />
  </el-row>
</template>

<script>
import {
  mapGetters,
  mapActions,
  mapState
} from 'vuex'

import prisonFilterCreator from '@/mixins/prison-filter-creator'

import Moment from 'moment'
export default {
  name: 'FamilyPhone_ConversationCostDetail_List',

  mixins: [prisonFilterCreator],

  data() {
    return {
      searchItems: {
        familyName: {
          type: 'input',
          label: '家属姓名'
        },

        criminalName: {
          type: 'input',
          label: '罪犯姓名'
        },

        criminalNumber: {
          type: 'input',
          label: '罪犯编号'
        },

        releaseType: {
          type: 'select',
          label: '是否出狱',
          options: this.$store.state.isReleaseType
        },

        meetingTime: {
          type: 'dateRange',
          unlinkPanels: true,
          start: 'meetingStartDate',
          end: 'meetingEndDate',
          startPlaceholder: '通话开始时间',
          endPlaceholder: '通话结束时间',
          clearable: true,
          pickerOptions: {
            disabledDate: time => {
              return time.getTime() > Date.now()
            }
          }
        },

        settleAccounts: {
          type: 'select',
          label: '是否结算',
          options: this.$store.state.isSettleAccounts
        },

        time: {
          type: 'dateRange',
          unlinkPanels: true,
          start: 'startDate',
          end: 'endDate',
          startPlaceholder: '结算开始时间',
          endPlaceholder: '结算结束时间'
        }
      }
    }
  },

  computed: {
    ...mapGetters(['isSuperAdmin']),

    ...mapState('familyPhone', ['settleAccountsPaged', 'familyPhoneSettleAccountsDetail']),

    tableCols() {
      const cols = [
        {
          label: '监区',
          prop: 'prisonArea'
        },
        {
          label: '罪犯编号',
          prop: 'criminalNumber'
        },
        {
          label: '罪犯姓名',
          prop: 'criminalName'
        },
        {
          label: '家属姓名',
          prop: 'familyName'
        },
        {
          label: '家属电话',
          prop: 'familyPhone'
        },
        {
          label: '总通话时间段',
          slotName: 'time',
          minWidth: 180
        },
        {
          label: '详情',
          slotName: 'detail'
        },
        {
          label: '通话时长',
          slotName: 'duration'
        },
        {
          label: '通话总费用(元)',
          prop: 'expense'
        },
        {
          label: '是否出狱',
          slotName: 'releaseType'
        },
        {
          label: '结算时间',
          prop: 'settleTime'
        }
      ], onlySuperAdminCols = [
        {
          label: '省份',
          prop: 'provinceName'
        },
        {
          label: '监狱名称',
          prop: 'jailName',
          showOverflowTooltip: true
        }
      ]

      if (this.isSuperAdmin) return [ ...onlySuperAdminCols, ...cols ]

      return cols
    },

    apiUrl() {
      const urls = {
        pagedUrl: this.isSuperAdmin ? '' : '/settleAccounts/page',
      }

      return urls
    }
  },

  methods: {
    ...mapActions('familyPhone', [
      'getFamilyPhoneSettleAccounts',
      'getFamilyPhoneSettleAccountsDetail',
      'editFamilyPhoneSettleAccountsRelease',
      'settleFamilyPhoneSettleAccounts'
    ]),

    async getDatas() {
      const inputs = {
        url: this.apiUrl['pagedUrl'],

        params: {
          ...this.filter,
          ...this.pagination
        }
      }

      await this.getFamilyPhoneSettleAccounts(inputs)
    },

    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },

    tableCellClassName({row, column, rowIndex, columnIndex}) {
      console.log(row, column)
      return 'red'
    }
  },

  async mounted() {
    await this.getDatas()

    const { configs } = this.settleAccountsPaged

    const { meetingEndDate = Moment().subtract(1, 'days').format('YYYY-MM-DD'), meetingStartDate } = configs
  }
}
</script>

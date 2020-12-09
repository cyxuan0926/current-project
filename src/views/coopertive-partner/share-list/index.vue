<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-excel-download
      :params="filter"
      :path="excelPath"
    />

    <m-search
      :items="searchItems"
      @search="onSearch" >
      <template #dealTime>
        <el-date-picker
          v-if="activeTabName !== tabOptions['TERMINAL_SHARED_DETAILS']"
          v-model="dealTime"
          type="monthrange"
          value-format="yyyy-MM"
          start-placeholder="开始月份"
          end-placeholder="结束月份"
          unlink-panels />
      </template>
    </m-search>

    <el-col :span="24">
      <el-tabs
        v-model="activeTabName"
        type="card" >
        <el-tab-pane
          label="终端收入账单"
          name="terminalIncomeMenus" />

        <el-tab-pane
          label="终端分成明细"
          name="terminalSharedDetails" />
      </el-tabs>

      <m-table-new
        :data="pageData.content"
        :cols="tableCols"
      />
    </el-col>

    <m-pagination
      ref="pagination"
      :total="pageData.totalCount"
      @onPageChange="getDatas" />
  </el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'

import prisonFilterCreator from '@/mixins/prison-filter-creator'

import switches from '@/filters/modules/switches'

import Moment from 'moment'

import { $likePhone } from '@/common/constants/const'

export default {
  name: 'coopertivePartnerSharedList',

  mixins: [prisonFilterCreator],

  data() {
    const tabOptions = {
      TERMINAL_INCOME_MENUS: 'terminalIncomeMenus',
      TERMINAL_SHARED_DETAILS: 'terminalSharedDetails'
    }

    const coopertivePartnerTransferStatus = switches['coopertivePartnerTransferStatus']

    const date = Moment().format('YYYY-MM')

    const phoneItem = {
      label: '手机号码(合作商)',
      prop: 'partnerPhone',
      minWidth: 105,
      ...$likePhone
    }

    const terminaUniquelIdItem = {
      label: '终端唯一标识',
      prop: 'uniqueId',
      minWidth: 95,
      showOverflowTooltip: true
    }

    const prisonNameItem = {
      label: '监狱名称',
      prop: 'jailName',
      minWidth: 70,
      showOverflowTooltip: true
    }

    const terminalIncomeMenusItems = [
      phoneItem,
      terminaUniquelIdItem,
      prisonNameItem,
      {
        label: '月份',
        prop: 'month'
      },
      {
        label: '合作商终端收入（元）',
        prop: 'amount'
      }
    ]

    const terminalSharedDetailsItems = [
      phoneItem,
      {
        label: '交易金额（元）',
        prop: 'transactionAmount',
        minWidth: 70
      },
      {
        label: '交易场景时间',
        prop: 'transactionTime',
        minWidth: 120
      },
      {
        label: '通话结束时间',
        prop: 'mettingEndTime',
        minWidth: 120
      },
      {
        label: '到账时间',
        prop: 'paymentTime',
        minWidth: 120
      },
      {
        label: '分成比例（%）',
        prop: 'divideRate',
        minWidth: 70
      },
      {
        label: '合作商分成（元）',
        prop: 'divideMoney'
      },
      prisonNameItem,
      {
        label: '通话ID',
        prop: 'mettingId',
        minWidth: 55,
        showOverflowTooltip: true
      },
      terminaUniquelIdItem,
      {
        label: '转账状态',
        prop: 'transferFlag'
      }
    ]

    return {
      tabOptions,
      activeTabName: tabOptions.TERMINAL_SHARED_DETAILS,
      searchItems: {
        partnerPhone: {
          type: 'input',
          label: '手机号码',
          value: null
        },

        status: {
          type: 'select',
          label: '转账状态',
          options: coopertivePartnerTransferStatus,
          value: null,
          miss: false
        },

        dateRange: {
          type: 'dateRange',
          unlinkPanels: true,
          start: 'startDate',
          end: 'endDate',
          miss: false
        },

        monthRange: {
          slotName: 'dealTime'
        }
      },

      terminalSharedDetailsItems,

      terminalIncomeMenusItems,

      dealTime: [date, date],

      date
    }
  },

  computed: {
    ...mapState('coopertivePartner', ['pageData']),

    tableCols() {
      if (this.activeTabName === this.tabOptions['TERMINAL_INCOME_MENUS']) return this.terminalIncomeMenusItems

      else return this.terminalSharedDetailsItems
    },

    excelPath() {
      if (this.activeTabName === this.tabOptions['TERMINAL_INCOME_MENUS']) return '/download/exportTerminalIncome'

      else return '/download/exportTerminalDivide'
    }
  },

  watch: {
    activeTabName(val) {
      if (val === this.tabOptions['TERMINAL_INCOME_MENUS']) {
        this.$set(this.searchItems['dateRange'], 'miss', true)

        this.$set(this.searchItems['status'], 'miss', true)

        this.resetSearchFilters(['status', 'dateRange'])

        this.dealTime = [this.date, this.date]

      } else {
        this.$set(this.searchItems['dateRange'], 'miss', false)

        this.$set(this.searchItems['status'], 'miss', false)

        this.dealTime = []
      }

      this.resetSearchFilters(['partnerPhone', 'jailId'])

      this.onSearch()
    }
  },

  methods: {
    ...mapActions('coopertivePartner', ['getPageData']),

    async getDatas() {
      const { rows, page } = this.pagination

      let params = {
        page: page - 1,
        size: rows,
        ...this.filter
      }
      if (this.activeTabName === this.tabOptions['TERMINAL_INCOME_MENUS']) {
        if (this.dealTime) {
          params = {
            ...params,
            startDate: this.dealTime[0],
            endDate: this.dealTime[1]
          }
        }
        await this.getPageData({
          url: '/sharing/terminalIncome',
          params
        })
      } else {
        await this.getPageData({
          url: '/sharing/terminalDivide',
          params
        })
      }
    },

    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },

    // 重置搜索组件的filter
    resetSearchFilters(filters = []) {
      filters.map(filter => {
        this.$set(this.searchItems[filter], 'value', '')

        delete this.filter[filter]
      })
    }
  },

  mounted() {
    this.getDatas()
  }
}
</script>

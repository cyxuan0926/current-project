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
      @sizeChange="sizeChange"
      @search="onSearch" >
      <template #dealTime>
        <el-date-picker
          v-if="activeTabName === tabOptions['TERMINAL_SHARED_DETAILS']"
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

      <m-table
        stripe
        :data="pageData.content"
        :cols="tableCols">
        <template #status="{ row }">
          {{ row.status | coopertivePartnerTransferStatus }}
        </template>
      </m-table>
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
      prop: ''
    }

    const terminaUniquelIdItem = {
      label: '终端唯一标识',
      prop: ''
    }

    const prisonNameItem = {
      label: '监狱名称',
      prop: ''
    }

    const terminalIncomeMenusItems = [
      phoneItem,
      terminaUniquelIdItem,
      prisonNameItem,
      {
        label: '月份',
        prop: ''
      },
      {
        label: '合作商终端收入（元）',
        prop: ''
      }
    ]

    const terminalSharedDetailsItems = [
      phoneItem,
      {
        label: '交易金额（元）',
        prop: ''
      },
      {
        label: '交易场景时间',
        prop: ''
      },
      {
        label: '会见结束时间',
        prop: ''
      },
      {
        label: '到账时间',
        prop: ''
      },
      {
        label: '分成比例（%）',
        prop: ''
      },
      {
        label: '合作商分成（元）',
        prop: ''
      },
      prisonNameItem,
      {
        label: '会见ID',
        prop: ''
      },
      terminaUniquelIdItem,
      {
        label: '转账状态',
        slotName: 'status'
      }
    ]

    return {
      tabOptions,
      activeTabName: tabOptions.TERMINAL_SHARED_DETAILS,
      searchItems: {
        phone: {
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
          start: 'start',
          end: 'end',
          miss: true
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
      if (this.activeTabName === this.tabOptions['TERMINAL_INCOME_MENUS']) return '/'

      else return '/test'
    }
  },

  watch: {
    activeTabName(val) {
      if (val === this.tabOptions['TERMINAL_INCOME_MENUS']) {
        this.$set(this.searchItems['dateRange'], 'miss', false)

        this.$set(this.searchItems['status'], 'miss', true)

        this.resetSearchFilters(['status'])

        this.dealTime = []

      } else {
        this.$set(this.searchItems['dateRange'], 'miss', true)

        this.$set(this.searchItems['status'], 'miss', false)

        this.resetSearchFilters(['dateRange'])

        this.dealTime = [this.date, this.date]
      }

      this.resetSearchFilters(['phone', 'jailId'])

      this.onSearch()
    }
  },

  methods: {
    ...mapActions('coopertivePartner', []),

    sizeChange(rows) {
      this.$refs.pagination.handleSizeChange(rows)

      this.getDatas()
    },

    getDatas() {
      console.log({...this.pagination, ...this.filter}, this.activeTabName, this.dealTime)
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

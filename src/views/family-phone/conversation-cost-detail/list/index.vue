<template>
  <el-row class="row-container" :gutter="0">
    <m-search ref="search" :items="searchItems">
      <template #append>
        <m-excel-download :path="''" :params="{}" />

        <el-button type="primary">结算</el-button>
      </template>
    </m-search>

    <el-col :span="24">
      <m-table-new stripe :cols="tableCols"></m-table-new>
    </el-col>

    <m-pagination
      ref="pagination"
      :total="1"
      @onPageChange="getDatas"
    />
  </el-row>
</template>

<script>
import { mapGetters } from 'vuex'

import prisonFilterCreator from '@/mixins/prison-filter-creator'
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

        name: {
          type: 'input',
          label: '罪犯姓名'
        },

        prisonerNumber: {
          type: 'input',
          label: '罪犯编号'
        },

        isChuyu: {
          type: 'select',
          label: '是否出狱',
          options: this.$store.state.isChuyuType
        },

        meetingTime: {
          type: 'dateRange',
          unlinkPanels: true,
          start: 'meetingDateStart',
          end: 'meetingDateEnd',
          startPlaceholder: '通话开始时间',
          endPlaceholder: '通话结束时间'
        },

        isJiesuan: {
          type: 'select',
          label: '是否结算',
          options: this.$store.state.isJiesuanType
        },

        jiesuanTime: {
          type: 'dateRange',
          unlinkPanels: true,
          start: 'jiesuanDateStart',
          end: 'jiesuanDateEnd',
          startPlaceholder: '结算开始时间',
          endPlaceholder: '结算结束时间'
        }
      }
    }
  },

  computed: {
    ...mapGetters(['isSuperAdmin']),

    tableCols() {
      const cols = [
        {
          label: '监区'
        },
        {
          label: '罪犯编号'
        },
        {
          label: '罪犯姓名'
        },
        {
          label: '家属姓名',
          slotName: 'name'
        },
        {
          label: '家属电话'
        },
        {
          label: '总通话时间段'
        },
        {
          label: '详情'
        },
        {
          label: '通话时长'
        },
        {
          label: '通话总费用(元)'
        },
        {
          label: '是否出狱'
        },
        {
          label: '结算时间'
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
    }
  },

  methods: {
    getDatas() {},
  }
}
</script>

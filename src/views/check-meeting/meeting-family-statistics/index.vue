<template>
  <el-row class="row-container" :gutter="0">
    <m-search
      :items="searchItems"
      ref="search"
      @searchSelectChange="searchSelectChange"
      @search="onSearch" 
    />

    <el-col :span="24">
      <m-table-new
        stripe
        :data="freeMeetingsFamilyPhone.contents"
        :cols="tableCols">
        <template #index="{ $index }">{{ $index | handleGetIndex(pagination.rows, pagination.page) }}</template>
      </m-table-new>
    </el-col>

    <m-pagination
      ref="pagination"
      :total="freeMeetingsFamilyPhone.total"
      @onPageChange="getDatas"
    />
  </el-row>
</template>

<script>
import prisonFilterCreator from '@/mixins/prison-filter-creator'

import { mapState, mapActions } from 'vuex'

import Moment from 'moment'

export default {
  name: 'MeetingFamilyStatistics',

  mixins: [prisonFilterCreator],

  data() {
    const typeInput = {
      type: 'input'
    }

    const endDate = this.$_dateNow

    const startDate = Moment().subtract(1, 'months').format('YYYY-MM-DD')

    const options = [
      {
        label: '未通话',
        value: 'PENDING'
      },
      {
        label: '通话完成',
        value: 'FINISHED'
      }
    ]
    return {
      initFilter: { // 默认查询上一个月的，筛选框初始化
        startDate,
        endDate
      },

      searchItems: {
        status: {
          type: 'select',
          selectKey: 'familyStatisticsStatus',
          label: '是否完成通话',
          options
        },

        meetingDate: {
          type: 'dateRange',
          unlinkPanels: true,
          start: 'startDate',
          end: 'endDate',
          startPlaceholder: '通话开始时间',
          endPlaceholder: '通话结束时间',
          disabled: false,
          value: [startDate, endDate]
        },

        familyName: {
          ...typeInput,
          label: '家属姓名'
        },

        prisonName: {
          ...typeInput,
          label: '罪犯姓名'
        },

        prisonNumber: {
          ...typeInput,
          label: '罪犯编号'
        }
      }
    }
  },

  computed: {
    ...mapState(['freeMeetingsFamilyPhone']),

    tableCols() {
      let allCols = [
        {
          label: '序号',
          slotName: 'index',
          width: 70
        },
        {
          label: '省份',
          prop: 'province',
          showOverflowTooltip: true
        },
        {
          label: '监狱名称',
          prop: 'jailName',
          minWidth: 100,
          showOverflowTooltip: true
        },
        {
          label: '家属姓名',
          prop: 'familyName',
          showOverflowTooltip: true
        },
        {
          label: '罪犯姓名',
          prop: 'prisonerName',
          showOverflowTooltip: true
        },
        {
          label: '罪犯编号',
          prop: 'prisonerNumber',
          showOverflowTooltip: true
        },
        {
          label: '关系',
          prop: 'relationship',
          showOverflowTooltip: true
        },
        {
          label: '预约通话时间',
          prop: 'applicationTime',
          minWidth: 95
        },
        {
          label: '通话时间段',
          prop: 'meetingTime',
          minWidth: 180
        },
        {
          label: '通话时长(秒)',
          prop: 'duration',
          width: 95
        }
      ]

      if (!this.hasOnlyAllPrisonQueryAuth) allCols.splice(1, 2)

      return allCols
    }
  },

  methods: {
    ...mapActions(['getPagedFreeMeetingsFamilyPhone']),

    async getDatas() {
      let filter = {
        ...this.filter
      }

      if (!this.hasOnlyAllPrisonQueryAuth) {
        const { jailId } = this.$store.state.global.user

        filter = {
          ...filter,
          jailId
        }
      }

      await this.getPagedFreeMeetingsFamilyPhone({ ...filter, ...this.pagination })
    },

    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },

    // 覆盖mixins里面的 prisonFilterCreatorSelfSearchSelectChange 方法
    prisonFilterCreatorSelfSearchSelectChange(selectKey, value) {
      if (selectKey === 'familyStatisticsStatus') {
        if (value === 'PENDING') {
          this.$set(this.searchItems['meetingDate'], 'disabled', true)
          this.$set(this.searchItems['meetingDate'], 'value', '')
        }
        else this.$set(this.searchItems['meetingDate'], 'disabled', false)
      }
    }
  },

  async mounted() {
    this.filter = Object.assign({}, this.filter, this.initFilter)

    await this.getDatas()
  }
}
</script>

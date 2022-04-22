<template>
  <el-row class="row-container" :gutter="0">
    <m-search
      ref="search"
      :items="searchItems"
      @search="onSearch"
    />

    <el-col :span="24">
      <el-table
        class="border el-table__has__border-bottom"
        :data="tabledata.list"
        style="width: 100%"
      >
        <el-table-column
          prop="year"
          label="年"
          width="150"
        />

        <el-table-column
          prop="monthName"
          label="月"
          width="150"
        />

        <el-table-column
          prop="name"
          label="姓名"
          width="150"
        >
          <template #default="{ row }">
            <el-popover
              popper-class="is-asterisk_display"
              placement="top-start"
              trigger="hover"
              :content="row.name"
            >
              <span slot="reference">{{ row.name | asteriskDisplay('asterisk_name') }}</span>
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column prop="prisonerNumber" label="编号">
          <template #default="{ row }">
            <el-popover
              popper-class="is-asterisk_display"
              placement="top-start"
              trigger="hover"
              :content="row.prisonerNumber"
            >
              <span slot="reference">{{ row.prisonerNumber | asteriskDisplay('asterisk_prisonerNumber') }}</span>
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column label="行政奖励">
          <el-table-column label="表扬数" prop="praiseTimes" />
          <el-table-column label="物质奖励数" prop="materialAwardTimes" />
          <el-table-column label="立功个数" prop="meritTimes" />
          <el-table-column label="重大立功数" prop="greatMeritTimes" />
        </el-table-column>

        <el-table-column label="行政处罚">
          <el-table-column
            label="警告个数"
            prop="warnTimes"        
            width="120"
          />

          <el-table-column
            label="记过个数"
            prop="mistakeTimes"        
            width="120"
          />        
          <el-table-column
            label="禁闭个数"
            prop="confinementTimes"
            width="100"
          />
        </el-table-column>
      </el-table>
    </el-col>

    <m-pagination
      ref="pagination"
      :total="tabledata.totalCount"
      @onPageChange="getDatas"
    />
  </el-row>
</template>

<script>
import http from '@/service'
import Moment from 'moment'

export default {
  data() {
    const MonthDate = Moment().format('YYYY-MM')

    return {
      tabledata:{},
      MonthDate,
      filterInit:{},
      searchItems: {
        date: {
          label: '时间',
          type: 'month',
          canNotClear: true,
          value: MonthDate
        },

        name:  {
          label: '罪犯姓名',
          type: 'input'
        }
      }
    }
  },

  async mounted() {
    this.$refs.search.onGetFilter()
    await this.getDatas()
  },

  methods: {
    async getDatas() {
      let jailId=jailId
      let res = await http.getPrisonerBonusPenaltylist({ ...this.filter,jailId:jailId, ...this.pagination })
      this.tabledata= res.data
    },

    onSearch() {
      this.$refs.pagination.handleCurrentChange(0)
    }
  }
}
</script>

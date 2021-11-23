<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-search
      ref="search"
      :items="searchItems"
      @search="onSearch" />
    <el-col :span="24">
      <el-table
        class="border el-table__has__border-bottom"
        :data="tabledata.list"
        style="width: 100%">
        <el-table-column
            prop="year"
            label="年"
            width="150" />
            <el-table-column
            prop="monthName"
            label="月"
            width="150" />
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
            <el-table-column
            label="基础分">
                  <el-table-column
                    prop="educationBaseScore"
                    label="教育改造基础分"
                    width="120">
                  </el-table-column>
                  <el-table-column
                    prop="workBaseScore"
                    label="劳动改造基础分"
                    width="120">
                  </el-table-column>
                  <el-table-column
                    prop="monthBaseScore"
                    label="当月基础分"
                    width="100">
                  </el-table-column>
            </el-table-column>
            <el-table-column
            label="加分"
            width="150" >
                  <el-table-column
                    prop="educationAwardScore"
                    label="教育改造加分"
                    width="120">
                  </el-table-column>
                  <el-table-column
                    prop="workAwardScore"
                    label="劳动改造加分"
                    width="120">
                  </el-table-column>
                  <el-table-column
                    prop="monthAwardScore"
                    label="当月加分"
                    width="100">
                  </el-table-column>
            </el-table-column>
            <el-table-column
            label="扣分"
            width="150" >
                  <el-table-column
                    prop="educationDeductScore"
                    label="教育改造扣分"
                    width="120">
                  </el-table-column>
                  <el-table-column
                    prop="workDeductScore"
                    label="劳动改造扣分"
                    width="120">
                  </el-table-column>
                  <el-table-column
                    prop="monthDeductScore"
                    label="当月扣分"
                    width="100">
                  </el-table-column>
            </el-table-column>
             <el-table-column
            prop="specialAwardScore"
            label="专项加分"
            width="150" />
            <el-table-column
            prop="punishScore"
            label="处罚"
            width="150" />
            <el-table-column
            prop="totalScore"
            label="总得分"
            width="150" />
      </el-table>
    </el-col>
    <m-pagination
      ref="pagination"
      :total="tabledata.totalCount"
      @onPageChange="getDatas" />
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
          type: 'month',
          label: '时间',
          canNotClear: true,
          value: ''
        },
        name:  {
          type: 'input',
          label: '罪犯姓名'
        }
      }
    }
  },
  created() {
      this.filterInit = Object.assign({}, this.filterInit, { date: this.MonthDate })
    },
  async mounted() {
    this.$set(this.searchItems['date'], 'value', this.MonthDate)
    this.getDatas()
  },
  methods: {
    async getDatas() {
       let jailId=JSON.parse(localStorage.getItem('user')).jailId
      let res = await http.getPrisonerScorelist({ ...this.filter,jailId:jailId, ...this.pagination })
      this.tabledata= res.data
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(0)
    }
  }
}
</script>

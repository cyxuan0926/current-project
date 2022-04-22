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
          label="年"
          prop="year"  
          width="150"
        />

        <el-table-column
          label="月"
          prop="monthName"  
          width="150"
        />

        <el-table-column
          label="姓名"
          prop="name"
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

        <el-table-column label="编号" prop="prisonerNumber">
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

        <el-table-column label="基础分">
          <el-table-column
            label="教育改造基础分"
            prop="educationBaseScore"        
            width="120"
          />

          <el-table-column
            label="劳动改造基础分"
            prop="workBaseScore"        
            width="120"
          />

          <el-table-column
            label="当月基础分"
            prop="monthBaseScore"
            width="100"
          />     
        </el-table-column>

        <el-table-column label="加分" width="150">
          <el-table-column
            label="教育改造加分"
            prop="educationAwardScore"
            width="120"
          />

          <el-table-column
            label="劳动改造加分"
            prop="workAwardScore"
            width="120"
          />

          <el-table-column
            label="当月加分"
            prop="monthAwardScore"
            width="100"
          />
        </el-table-column>

        <el-table-column label="扣分" width="150">
          <el-table-column
            label="教育改造扣分"
            prop="educationDeductScore"
            width="120"
          />

          <el-table-column
            label="劳动改造扣分"
            prop="workDeductScore"
            width="120"
          />

          <el-table-column
            label="当月扣分"
            prop="monthDeductScore"
            width="100"
          />
        </el-table-column>

        <el-table-column
          label="专项加分"
          prop="specialAwardScore"
          width="150"
        />

        <el-table-column
          label="处罚"
          prop="punishScore" 
          width="150"
        />

        <el-table-column
          label="总得分"
          prop="totalScore"  
          width="150"
        />
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
          value: ''
        },

        name: {
          label: '罪犯姓名',
          type: 'input'
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
      const jailId = JSON.parse(localStorage.getItem('user')).jailId
      let res = await http.getPrisonerScorelist({ ...this.filter,jailId:jailId, ...this.pagination })
      this.tabledata = res.data
    },

    onSearch() {
      this.$refs.pagination.handleCurrentChange(0)
    }
  }
}
</script>

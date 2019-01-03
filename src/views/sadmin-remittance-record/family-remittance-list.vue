<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-search
      :items="searchItems"
      @sizeChange="sizeChange"
      @search="onSearch" />
    <el-col
      :span="24"
      v-show="show">
      <el-tabs
        value="first"
        type="card">
        <el-tab-pane
          label="家属汇款记录"
          name="first" />
      </el-tabs>
      <el-table
        :data="familyRemittanceRecords.contents"
        border
        stripe
        style="width: 100%">
        <el-table-column
          label="汇款单号"
          prop="remitNum"
          min-width="120"/>
        <el-table-column
          label="服刑人员姓名"
          prop="prisonerName"/>
        <el-table-column
          label="囚号"
          prop="prisonerNumber"/>
        <el-table-column
          label="汇款家属"
          prop="familyName"/>
        <el-table-column
          label="汇款金额(元)"
          prop="money"
          min-width="80"/>
        <el-table-column
          label="汇款时间"
          min-width="110">
          <template slot-scope="scope">
            {{ scope.row.createdAt | Date }}
          </template>
        </el-table-column>
        <el-table-column label="汇款状态">
          <template slot-scope="scope">
            {{ scope.row.status | payStatus }}
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <m-pagination
      v-show="show"
      ref="pagination"
      :total="familyRemittanceRecords.total"
      @onPageChange="getDatas" />
  </el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      searchItems: {
        jailId: {
          type: 'select',
          label: '所属监狱',
          canNotClear: true,
          filterable: true,
          getting: true,
          options: [],
          value: '',
          belong: { label: 'title', value: 'id' }
        },
        prisonerName: { type: 'input', label: '服刑人员姓名' },
        prisonerNumber: { type: 'input', label: '囚号' },
        familyName: { type: 'input', label: '汇款家属' },
        remitTime: { type: 'date', label: '汇款时间' }
      },
      show: false
    }
  },
  computed: {
    ...mapState(['familyRemittanceRecords', 'prisonAll'])
  },
  mounted() {
    this.getPrisonAll().then(res => {
      if (!res) return
      this.searchItems.jailId.options = this.prisonAll
      this.searchItems.jailId.value = this.prisonAll[0].id
      this.filter.jailId = this.prisonAll[0].id
      this.searchItems.jailId.getting = false
      this.getDatas()
    })
  },
  methods: {
    ...mapActions(['getPrisonAll', 'getFamilyRemittance']),
    sizeChange(rows) {
      this.$refs.pagination.handleSizeChange(rows)
      this.getDatas()
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },
    getDatas() {
      this.show = true
      this.getFamilyRemittance({ ...this.filter, ...this.pagination })
    }
  }
}
</script>

<style scoped>

</style>

<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-search
      :items="searchItems"
      @sizeChange="sizeChange"
      @search="onSearch" />
    <el-col :span="24">
      <el-tabs
        value="first"
        type="card">
        <el-tab-pane
          label="远程免费会见记录"
          name="first" />
      </el-tabs>
      <el-table
        :data="freeMeetings.contents"
        border
        stripe
        style="width: 100%">
        <el-table-column
          prop="name"
          label="家属姓名" />
        <el-table-column
          prop="prisonerName"
          label="罪犯姓名" />
        <el-table-column
          prop="prisonerNumber"
          min-width="92px"
          label="罪犯编号" />
        <el-table-column
          label="会见时间"
          min-width="140px"
          prop="meetingTime"
          show-overflow-tooltip/>
        <el-table-column
          prop="prisonArea"
          min-width="92px"
          label="监区" />
        <el-table-column
          min-width="110px"
          label="会见时长"
          show-overflow-tooltip>
          <template slot-scope="props">
            {{ props.row.duration | time }}
          </template>
        </el-table-column>
        <el-table-column
          prop="terminalNumber"
          label="终端号" />
        <el-table-column
          prop="province"
          label="家属所在省" />
        <el-table-column
          prop="city"
          label="家属所在市" />
      </el-table>
    </el-col>
    <m-pagination
      ref="pagination"
      :total="freeMeetings.total"
      @onPageChange="getDatas" />
  </el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data() {
    return {
      searchItems: {
        name: { type: 'input', label: '家属姓名' },
        prisonerNumber: { type: 'input', label: '罪犯编号' },
        prisonArea: { type: 'select', label: '监区', options: (JSON.parse(localStorage.getItem('user')).prisonConfigList || []), belong: { value: 'prisonConfigName', label: 'prisonConfigName' } }
      }
    }
  },
  computed: {
    ...mapState(['freeMeetings'])
  },
  mounted() {
    this.getDatas()
  },
  methods: {
    ...mapActions(['getFreeMeetings']),
    sizeChange(rows) {
      this.$refs.pagination.handleSizeChange(rows)
      this.getDatas()
    },
    getDatas() {
      this.getFreeMeetings({ ...this.filter, ...this.pagination })
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    }
  }
}
</script>

<style type="text/stylus" lang="stylus" scoped>
</style>

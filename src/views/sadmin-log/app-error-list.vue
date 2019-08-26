<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-search
      :items="searchItems"
      @sizeChange="sizeChange"
      @search="onSearch" />
    <el-col :span="24">
      <el-table
        :data="appLogs.contents"
        border
        stripe
        style="width: 100%">
        <el-table-column
          prop="phone"
          label="账号" />
        <el-table-column
          prop="appVersion"
          label="app版本" />
        <el-table-column
          prop="deviceName"
          label="设备名称" />
        <el-table-column
          prop="deviceType"
          label="设备类型" />
        <el-table-column
          prop="sysVersion"
          label="系统版本" />
        <el-table-column
          prop="contents"
          width="380px"
          label="内容" />
        <el-table-column
          label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.createdAt | Date }}
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <m-pagination
      ref="pagination"
      :total="appLogs.total"
      @onPageChange="getDatas" />
  </el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      tabNum: 'first',
      searchItems: {
        // endTime: { type: 'datetime', label: '结束时间' },
        time: { type: 'datetimerange', start: 'startTime', end: 'endTime' }
      }
    }
  },
  computed: {
    ...mapState(['appLogs'])
  },
  mounted() {
    this.getDatas()
  },
  methods: {
    ...mapActions(['getAppLogs']),
    sizeChange(rows) {
      this.$refs.pagination.handleSizeChange(rows)
      this.getDatas()
    },
    getDatas() {
      this.getAppLogs({ ...this.filter, ...this.pagination })
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    }
  }
}
</script>

<style type="text/stylus" lang="stylus" scoped>
</style>

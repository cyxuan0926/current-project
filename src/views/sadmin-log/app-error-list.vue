<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-search
      :items="searchItems"
      @search="onSearch" />
    <el-col :span="24">
      <m-table-new
        stripe
        :data="appLogs.contents"
        :cols="tableCols">
        <template #createdAt="{ row }">{{ row.createdAt | Date }}</template>  
      </m-table-new>
    </el-col>
    <m-pagination
      ref="pagination"
      :total="appLogs.total"
      @onPageChange="getDatas" />
  </el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'

import { $likePhone } from '@/common/constants/const'

export default {
  data() {
    return {
      tabNum: 'first',
      searchItems: {
        // endTime: { type: 'datetime', label: '结束时间' },
        time: {
          type: 'datetimerange',
          start: 'startTime',
          end: 'endTime'
        }
      },
      tableCols: [
        {
          label: '账号',
          prop: 'phone',
          ...$likePhone
        },
        {
          label: 'app版本',
          prop: 'appVersion'
        },
        {
          label: '设备名称',
          prop: 'deviceName'
        },
        {
          label: '设备类型',
          prop: 'deviceType'
        },
        {
          label: '系统版本',
          prop: 'sysVersion'
        },
        {
          label: '内容',
          prop: 'contents',
          width: '380px',
          showOverflowTooltip: true
        },
        {
          label: '创建时间',
          slotName: 'createdAt',
          width: '166px'
        }
      ]
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

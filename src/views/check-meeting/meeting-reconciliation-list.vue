<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-excel-download
    :params="filter"
    path="/download/exportMeetingReconciliation" />
    <m-search
      ref="search"
      :items="searchItems"
      @search="onSearch"
      @searchSelectChange="searchSelectChange"
    />
    <el-col :span="24">
      <m-table-new
        class="reconciliation-table"
        border
        stripe
        :cols="tableCols"
        :data="meetingCallRecords.contents"
        :span-method="onTableSpanMethod" >
        <!-- <template #durationConcat="{ row }">{{ row.durationConcat | time  }}</template> -->
        <template #mcstatusConcat="{ row }"><span v-if="row.mcstatusConcat">{{ row.mcstatusConcat | applyStatus }}</span></template>
        <!-- <template #zijingDurationConcat="{ row }">{{ row.zijingDurationConcat ? row.zijingDurationConcat + '分钟' : '' }}</template> -->
      </m-table-new>
      <!-- <m-table-new
        border
        stripe
        :cols="tableBackupCols"
        :data="meetingCallRecords.contents"
        :cell-class-name="cellClassName" >
        <template #startTimeConcat="{ row }">
          <el-col
            v-for="(item, index) in row.startTimeConcat"
            :key="item + index + row.meetingId"
            :class="['el-table-column__col', !item ? 'padding-20' : '']">{{ item }}</el-col>
        </template>
        <template #endTimeConcat="{ row }">
          <el-col
            v-for="(item, index) in row.endTimeConcat"
            :key="item + index + row.meetingId"
            :class="['el-table-column__col', !item ? 'padding-20' : '']">{{ item }}</el-col>
        </template>
        <template #durationConcat="{ row }">
          <el-col
            v-for="(item, index) in row.durationConcat"
            :key="item + index + row.meetingId"
            :class="['el-table-column__col', !item ? 'padding-20' : '']">{{ item | time }}</el-col>
        </template>
        <template #mcstatusConcat="{ row }">
          <el-col
            v-for="(item, index) in row.mcstatusConcat"
            :key="item + index + row.meetingId"
            :class="['el-table-column__col', !item ? 'padding-20' : '']"><template v-if="item">{{ item | applyStatus }}</template></el-col>
        </template>
        <template #remarksConcat="{ row }">
          <el-col
            v-for="(item, index) in row.remarksConcat"
            :key="item + index + row.meetingId"
            :class="['el-table-column__col', !item ? 'padding-20' : '']">{{ item }}</el-col>
        </template>
        <template #zijingStartTimeConcat="{ row }">
          <el-col
            v-for="(item, index) in row.zijingStartTimeConcat"
            :key="item + index + row.meetingId"
            :class="['el-table-column__col', !item ? 'padding-20' : '']">{{ item }}</el-col>
        </template>
        <template #zijingEndTimeConcat="{ row }">
          <el-col
            v-for="(item, index) in row.zijingEndTimeConcat"
            :key="item + index + row.meetingId"
            :class="['el-table-column__col', !item ? 'padding-20' : '']">{{ item }}</el-col>
        </template>
        <template #zijingDurationConcat="{ row }">
          <el-col
            v-for="(item, index) in row.zijingDurationConcat"
            :key="item + index + row.meetingId"
            :class="['el-table-column__col', !item ? 'padding-20' : '']">{{ item ? item + '分钟' : '' }}</el-col>
        </template>
      </m-table-new> -->
    </el-col>
    <m-pagination
      ref="pagination"
      :total="meetingCallRecords.total"
      @onPageChange="getDatas" />
  </el-row>
</template>

<script>

import { mapActions, mapState } from 'vuex'

import prisonFilterCreator from '@/mixins/prison-filter-creator'

export default {
  mixins: [prisonFilterCreator],
  data() {
    return {
      searchItems: {
        meetingId: {
          type: 'input',
          label: '通话ID'
        },
        Date: {
          type: 'datetimerange',
          start: 'startTime',
          end: 'endTime',
          startPlaceholder: '实际通话开始时间',
          endPlaceholder: '实际通话结束时间'
        },

        meetingDate: {
          type: 'datetimerange',
          start: 'applicationStartTime',
          end: 'applicationEndTime',
          startPlaceholder: '申请开始时间',
          endPlaceholder: '申请结束时间',
          value: [this.$_timeOneWeekAgo, this.$_timeNow]
        }
        // status: {
        //   type: 'select',
        //   label: '通话状态',
        //   options: this.$store.state.applyStatus
        // }
      },
      // 这个是真的单元格合并的实现
      tableCols: [
        {
          label: '序号',
          prop: 'orderIndex',
          minWidth: 45
        },
        {
          label: '省份',
          prop: 'provincesName',
          showOverflowTooltip: true
        },
        {
          label: '监狱名称',
          prop: 'jailName',
          showOverflowTooltip: true
        },
        {
          label: '通话ID',
          prop: 'meetingId',
          minWidth: 60
        },
        {
          label: '申请通话时间',
          prop: 'meetingTime',
          minWidth: 140
        },
        {
          label: '实际通话开始时间',
          prop: 'startTimeConcat',
          minWidth: 125
        },
        {
          label: '实际通话结束时间',
          prop: 'endTimeConcat',
          minWidth: 125
        },
        {
          // 需要自己处理 返回的是秒
          label: '通话时长(秒)',
          prop: 'durationConcat'
        },
        // {
        //   // 需要自己处理 只有 FINISHED 和 MEETING_ON 两个状态
        //   label: '通话状态',
        //   slotName: 'mcstatusConcat'
        // },
        {
          label: '挂断原因',
          prop: 'remarksConcat',
          showOverflowTooltip: true
        },
        {
          label: '会见室ID',
          prop: 'conferenceIdConcat',
          showOverflowTooltip: true
        },
        {
          label: '会见室名称',
          prop: 'conferenceName',
          showOverflowTooltip: true
        },
        {
          label: '会议短号',
          prop: 'roomNumber'
        },
        {
          label: '紫荆通话开始时间',
          prop: 'zijingStartTimeConcat',
          minWidth: 125
        },
        {
          label: '紫荆通话结束时间',
          prop: 'zijingEndTimeConcat',
          minWidth: 125
        },
        {
          // 紫荆通话时长 返回的是分钟 需要加上'分钟'的
          label: '紫荆通话时长(秒)',
          prop: 'zijingDurationConcat',
          minWidth: 80
        }
      ],
      // // 这个是用样式来控制的'伪单元格合并'效果
      // tableBackupCols: [
      //   {
      //     label: '序号',
      //     type: 'index',
      //     index: this.onGetIndex,
      //     prop: 'orderIndex',
      //     minWidth: 40
      //   },
      //   {
      //     label: '监狱名称',
      //     prop: 'jailName',
      //     showOverflowTooltip: true
      //   },
      //   {
      //     label: '会议号',
      //     prop: 'meetingId',
      //     minWidth: 60
      //   },
      //   {
      //     label: '通话开始时间',
      //     slotName: 'startTimeConcat',
      //     minWidth: 120
      //   },
      //   {
      //     label: '通话结束时间',
      //     slotName: 'endTimeConcat',
      //     minWidth: 120
      //   },
      //   {
      //     // 需要自己处理 返回的是秒
      //     label: '通话时长',
      //     slotName: 'durationConcat'
      //   },
      //   {
      //     // 需要自己处理 只有 FINISHED 和 MEETING_ON 两个状态
      //     label: '通话状态',
      //     slotName: 'mcstatusConcat'
      //   },
      //   {
      //     label: '挂断原因',
      //     slotName: 'remarksConcat',
      //     showOverflowTooltip: true
      //   },
      //   {
      //     label: '紫荆通话开始时间',
      //     slotName: 'zijingStartTimeConcat',
      //     minWidth: 120
      //   },
      //   {
      //     label: '紫荆通话结束时间',
      //     slotName: 'zijingEndTimeConcat',
      //     minWidth: 120
      //   },
      //   {
      //     // 紫荆通话时长 返回的是分钟 需要加上'分钟'的
      //     label: '通话时长',
      //     slotName: 'zijingDurationConcat'
      //   }
      // ]
    }
  },

  methods: {
    // getBackupMeetingCallRecords： 样式控制实现

    // ...mapActions(['getBackupMeetingCallRecords']),

    // getMeetingCallRecords: 单元格合并实现
    ...mapActions(['getMeetingCallRecords']),
    // 搜索组件的搜索操作
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },

    // table 排序
    onGetIndex(index) {
      return this.pagination.rows * (this.pagination.page - 1) + index + 1
    },

    // 获取列表数据
    async getDatas() {
      await this.getMeetingCallRecords({ ...this.pagination, ...this.filter })
      // await this.getBackupMeetingCallRecords({ ...this.pagination, ...this.filter })
    },

    // 合并单元格
    onTableSpanMethod({ row, column, rowIndex, columnIndex }) {
      if ([
          'orderIndex',
          'jailName',
          'meetingId',
          'provincesName',
          'meetingTime',
          'conferenceName',
          'roomNumber'].includes(column.property)) {
        if (row.orderNumber % row.count === 0) {
          return {
            rowspan: row.count,
            colspan: 1
          }
        }
        else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },

    // 单元格样式
    // cellClassName({row, column, rowIndex, columnIndex}) {
    //   if (!['orderIndex', 'jailName', 'meetingId'].includes(column.property)) return 'no-pandding__td'
    // }

  },

  computed: {
    ...mapState(['meetingCallRecords'])
  }
}
</script>

<style lang="scss" scoped>
.row-container {
  /deep/ .reconciliation-table {
    border-right: none !important;
    td {
      border-bottom: 1px solid #e6e6e6 !important;
    }
    // /deep/ .el-table-column__col {
    //   padding: 10px !important;
    //   border-bottom: 1px solid #e6e6e6 !important;
    //   &:last-child {
    //     border-bottom: 0 !important;
    //   }
    // }
    // /deep/ .padding-20 {
    //   padding: 20px !important;
    // }
    // /deep/ .no-pandding__td {
    //   padding: 0px !important;
    //   & > .cell {
    //     padding: 0px !important;
    //   }
    // }
  }

  /deep/ .filter-container {
    .el-date-editor--datetimerange {
      width: 320px !important;
    }
  }
}
</style>


<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-search
      ref="search"
      :items="searchItems"
      @search="onSearch" >
        <template slot="append">
        <el-button
          type="primary"
          :loading="downloading"
          @click="onDownloadExcel"
        >导出 Excel</el-button>
       </template>
    </m-search>
    <el-col :span="24">
      <m-table-new
        stripe
        :data="tabledata.list"
        :cols="tableCols">
        <template #imageUrl="{ row }">
          <img :src="row.imageUrl + '?token=' + $urls.token">
        </template>
        <template #isDate="{ row }">{{ row.startTime | Date }} - {{ row.endTime | Date }}</template>
       
      </m-table-new>
    </el-col>
    <m-pagination
      ref="pagination"
      :total="tabledata.size"
      @onPageChange="getDatas" />
  </el-row>
</template>

<script>
import http from '@/service'
import Moment from 'moment'
import { DateFormat } from '@/utils/helper'
import { saveAs } from 'file-saver'

// import {
//   $likeName,
//   $likePrisonerNumber,
//   $likePhone,
//   $likeIdCard
// } from '@/common/constants/const'
export default {
  data() {
    const startTime = Moment().subtract(1, 'months').subtract(1, 'days').format('YYYY-MM-DD')
    return {
      downloading:false,
      searchItems: {
       time: {
          type: 'dateRange',
          start: 'startTime',
          end: 'endTime',
          value: [startTime, this.$_dateNow],
          unlinkPanels: true
        }
      },
     tableCols: [
        {
          label: '罪犯姓名',
          prop: 'prisonerName',
          minWidth: '8.2%'
          // ...$likeName
        },
        {
          label: '罪犯编号',
          prop: 'prisonerNumber',
          minWidth: '8.2%'
          // ...$likePrisonerNumber
        },
        {
          label: '会见开始时间',
          prop: 'startTime',
          minWidth: '8.2%'
        },
        {
          label: '会见结束时间',
          prop: 'endTime',
          minWidth: '8.2%'
        },
        {
          label: '会见人数',
          prop: 'familyNum',
          minWidth: '8.2%'
        },
        {
          label: '会见方式',
          prop: 'authedToExpired',
          minWidth: '9%'
        },
        {
          label: '会见日期',
          prop: 'meetingTime',
          minWidth: '8.2%'
        },
        {
          label: '经办人',
          prop: 'changerName',
          minWidth: '8.2%'
        },
        {
          label: '会见情况分类',
          prop: 'policeCanceled',
          minWidth: '8.8%'
        },
        {
          label: '会见情况',
          prop: 'familiesCanceled',
          minWidth: '8.8%'
        },
        {
          label: '会见人姓名',
          prop: 'familyName',
          minWidth: '8.8%'
          // ...$likeName
        },
        {
          label: '关系',
          prop: 'relationship',
          minWidth: '8.8%'
        },
        {
          label: '性别',
          prop: 'gender',
          minWidth: '8.8%'
        },
        {
          label: '会见人证件类型',
          prop: 'familiesCanceled',
          minWidth: '8.8%'
        },
        {
          label: '会见人证件号',
          prop: 'familyUuid',
          minWidth: '8.8%'
          // ...$likeIdCard
        },
        {
          label: '会见人联系电话',
          prop: 'phone',
          minWidth: '8.8%'
          // ...$likePhone
        },
        {
          label: '家庭详情住址',
          prop: 'familiesCanceled',
          minWidth: '8.8%'
        }
      ],
      tabledata:{}
    }
  },
  async mounted() {
    this.$refs.search.onGetFilter()

    await this.getDatas()
  },
  methods: {
     // 导出excel
    async onDownloadExcel() {
                if (this.downloading) {
                    return
                }
                this.downloading = true
                const params = Object.assign( { ...this.filter} )
                try {
                    let data = await http.exportMeetingCallDetail(params)
                    saveAs(data, `服刑人员会见登记表-${ DateFormat(Date.now(),'YYYYMMDDHHmmss') }.xls`)
                    this.downloading = false
                } catch (error) {
                    this.downloading = false
                }
    },

     async getDatas() {
       let params = { ...this.filter, ...this.pagination }
      let res = await http.getMettingCallDetail(params)
      this.tabledata=res
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    }
  }
}
</script>

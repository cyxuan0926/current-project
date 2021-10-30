<template>
  <el-row class="row-container" :gutter="0">
    <m-search
      ref="search"
      :items="searchItems"
      @search="onSearch"
    >
    <template slot="append">
        <el-button
          type="primary"
          :loading="downloading"
          @click="onDownloadExcel"
        >导出 Excel</el-button>
       </template>
    </m-search>
    <el-col :span="24">
      <m-table-new stripe
         :data="tabledate.list"
         :cols="tableCols">

        <template #aduitDetail="{row}">
           <span> {{`${row.startTime}~${row.endTime}`}}</span>
        </template>
          <template #status="{row}">
           <span v-if="row.status=='FINISHED'">已完成</span>
           <span v-if="row.status=='MEETING_NO'">通话中</span>
           <span v-if="row.status=='CALLFALL'">未接通</span>
        </template>

        <template #operation="{row}">
          <el-button type="text" @click="getDetail(row,true)">详情</el-button>
        </template>
      </m-table-new>
    </el-col>

    <m-pagination
      ref="pagination"
      @onPageChange="getDatas" 
      :total="tabledate.pageCounts"
    />
     <el-dialog
      :visible.sync="show.dialog"
      title="详情"
      width="780px"
      class="authorize-dialog"
      lock-scroll
      @close="onCloseShow">
       <div style="max-height:380px;overflow: auto">
        <div style="display: flex;border: 1px solid #E4E7ED;">
          <div class="family-detail">基本信息</div>
          <div class="detail-message">
            <p class="detail-message-family">
              <span class="family-name">家属姓名</span>
              <span class="family-nameDetail">{{toShow.familyName}}</span>
            </p>
            <p class="detail-message-family" style="border: none">
              <span class="family-name">罪犯编号</span>
              <span class="family-nameDetail">{{toShow.criminalNumber}}</span>
            </p>
          </div>
          <div class="detail-content">
            <p class="detail-message-family">
              <span class="family-name">罪犯姓名</span>
              <span class="family-nameDetail">{{toShow.criminalName}}</span>
            </p>
            <p class="detail-message-family" style="border: none">
              <span class="family-name">终端号</span>
              <span class="family-nameDetail">{{toShow.terminalNumbers}}</span>
            </p>
          </div>
        </div>
         <div
          v-for="(item,index) in toShow.records"
          :key='index'
          style="display: flex;border: 1px solid #E4E7ED;border-top: none"
        >
          <div class="family-detail">{{index+1}}</div>
          <div class="detail-message">
            <p class="detail-message-family">
              <span class="family-name">呼叫时间</span>
              <span class="family-nameDetail">{{item.startTime}}</span>
            </p>
            <p class="detail-message-family">
              <span class="family-name">通话时间</span>
              <span class="family-nameDetail">{{item.optionTime}}</span>
            </p>
          </div>
          <div class="detail-content">
            <p class="detail-message-family">
              <span class="family-name">呼叫状态</span>
              <span class="family-nameDetail">
                <template v-if="item.status=='MEETING_ON'">会见中</template>
                <template v-if="item.status=='CALLFAIL'">未接通</template>
                <template v-if="item.status=='FINISHED'">结束会见</template>
                </span></p>
              <p class="detail-message-family">
              <span class="family-name">
                <template v-if="item.phoneType=='1'">语音通话时长</template>
                <template v-if="item.phoneType=='2'">视频通话时长</template>
              </span>
              <span class="family-nameDetail">{{item.callStatusOrDuration}}</span></p>
          </div>
        </div>
        <div style="display: flex;border: 1px solid #E4E7ED;border-top:none;" v-if="toShow.endReson">
          <div class="family-detail">{{toShow.records.length+1}}</div>
          <div class="detail-message">
            <p class="detail-message-family">
              <span class="family-name">结束原因</span>
              <span class="family-nameDetail">{{toShow.endReson}}</span>
            </p>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
  </el-row>
</template>

<script>

import prisonFilterCreator from '@/mixins/prison-filter-creator'
import { mapActions, mapState } from 'vuex'
import registrationDialogCreator from '@/mixins/registration-dialog-creator'
import Moment from 'moment'
import { DateFormat } from '@/utils/helper'
import { tokenExcel } from '@/utils/token-excel'
import http from '@/service'

import {
  $likeName,
  $likePrisonerNumber,
  $likePhone
} from '@/common/constants/const'
export default {
  name: 'FamilyPhone_Families',

  mixins: [prisonFilterCreator,registrationDialogCreator],

  data() {
   const todayDate = Moment().format('YYYY-MM-DD')
    const oneMonthLater = Moment().add(-7, 'days').format('YYYY-MM-DD')
    const clearable = true
    return {
      messageContent:"",
      todayDate,
      oneMonthLater,
      downloading: false,
      tabledate:{},
      toShow:{},
      searchItems: {
        familyName: {
          type: 'input',
          label: '家属姓名'
        },

        criminalName: {
          type: 'input',
          label: '罪犯姓名'
        },

        criminalNumber: {
          type: 'input',
          label: '罪犯编号'
        },
         applicationDate: {
            type: 'dateRange',
            unlinkPanels: true,
            start: 'startTime',
            end: 'endTime',
            startPlaceholder: '开始时间',
            endPlaceholder: '结束时间'
          },

        status: {
          type: 'select',
          label: '通话状态',
          options:[{label: '已完成', value: 'FINISHED'},{label: '通话中', value: 'MEETING_NO'},{label: '未接通', value: 'CALLFALL'}],
          miss: false,
          value:"",
        },
      },
      show:{
        isAdd:false,
        message:false,
        disagree: false,
        authorize:false,
        agree: false,
        process:false,
        editRebut:true,
        dialog:false
      }
    }
  },
  computed: {
    ...mapState({
        uploadResult: state => state.global.uploadResult,
        validatePhoneResult: state => state.familyPhone.validatePhoneResult
      }),
    tableCols() {
      const cols = [
        {
          label: '监区',
          prop: 'prisonArea',
          showOverflowTooltip: true
        },
        {
          label: '罪犯编号',
          prop: 'criminalNumber',
          ...$likePrisonerNumber
        },
        {
          label: '罪犯姓名',
          prop: 'criminalName',
          ...$likeName
        },
        {
          label: '家属姓名',
          prop: 'familyName',
          ...$likeName
        },
        {
          label: '家属电话',
          minWidth: 120,
          prop: 'familyPhone',
          ...$likePhone
        },
         {
          label: '总通话时间段',
          slotName: 'aduitDetail',
          minWidth: 300,
        },
        {
          label: '通话时长',
          prop: 'duration'
        },
        {
          label: '通话状态',
          slotName: 'status'
        },
        {
          label: '操作',
          slotName: 'operation',
           minWidth: 140,
        }
      ]
      return cols
    }
  },
  methods: {
      // 导出excel
    async onDownloadExcel() {
     this.downloading = true
      const times = DateFormat(Date.now(),'YYYYMMDDHHmmss'),
        actionName = 'familyPhone/exportFamilyPhone',
        params = {
          url: "/download/exportVideoTelRecords",
          methods:'get',
          params: { ...this.filter},
          isPrisonInternetGetUrlWay: "getHyUrl"
        }
      await tokenExcel({
        params,
        actionName,
        menuName: `亲情电话通话统计表-${ times }`,
      })

      setTimeout(() => {
        this.downloading = false
      }, 300)
    },
    async getDetail(e,type=false){
       let res= await http.phoneRecordDetail({ videoId: e.uid })
          if (!res) return
        this.toShow = Object.assign({}, res, e)
          if(type){
            this.show.dialog = true
          }
    },
      onCloseShow() {
        this.show.dialog=false
        this.toShow ={}
      },
    async getDatas() {
     this.filter.tab = this.tabs
     let res = await http.phoneRecordList({
        ...this.filter,
        ...this.pagination
      })
      this.tabledate=res
    },
     messageDetail(row){
        this.messageContent=row.applyReason
        this.show.message=true
      },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },
  },
  created() {
      this.filterInit = Object.assign({}, this.filterInit, {
        startTime: this.oneMonthLater,
        endTime: this.todayDate
      })
    },
  async mounted() {
    this.$set(this.searchItems.applicationDate, 'value', [this.oneMonthLater, this.todayDate])
    await this.getDatas()
  }
}
</script>
<style lang="stylus" scope>
.logMgCls .el-select__tags-text {
  display: inline-block;
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.logMgCls .el-select .el-tag__close.el-icon-close {
  top: -7px;
}
 .el-select-dropdown{
        max-width: 243px;
    }
    .el-select-dropdown__item{
        display: inline-block;
    }
    .el-select-dropdown__item span {
        min-width: 400px;
        display: inline-block;
   }
</style>


<style lang="scss" scoped>
.el-steps {
  /deep/ .el-step__title {
    font-size: 12px;
    line-height: 32px;
  }
}

.process-col_tips {
  width: 68%;
  margin-left: 32%;
  span {
    color: #303133;
    font-weight: bold;
    & + span {
      padding-left: 3%;
    }
  }
}

.process-col_waiting {
  width: 60%;
  margin-left: 40%;
  color: #303133;
  font-weight: bold;
}

.upload-dialog {
  /deep/ .el-dialog__body {
    padding-bottom: 30px !important;
  }

  /deep/ .button-box {
    padding-bottom: 0px;
  }
}

.m-excel-export {
  float: none;
}

.authorize-dialog {
  /deep/ .el-dialog__footer {
    padding: 0px 20px 20px 0px;
  }
}
  .family-detail{
    width: 100px;
    display: flex;
    align-items:center;
    justify-content: center;
    border-right: 1px solid #E4E7ED
  }
  .detail-message{
    width: 380px;
  }
  .detail-message-family{
    display: flex;
    line-height: 40px ;
    font-size: 12px;
    border-bottom: 1px solid #E4E7ED;
    .family-name{
      width: 120px;
      background: #F5F7FA;
      text-align: right;
      padding-right: 10px;
      border-right: 1px solid #E4E7ED;
    }
    .family-nameDetail{
      flex: 1;
      padding-left: 10px;
      border-right: 1px solid #E4E7ED
    }

  }
  .detail-content{
    flex: 1;
    line-height: 30px ;
    font-size: 12px;
    .family-name{
      width: 120px;
      background: #F5F7FA;
      padding-right: 10px;
      text-align: right;
      border-right: 1px solid #E4E7ED;
    }
  }
</style>

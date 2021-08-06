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

        <template #status="{row}">
          <span v-if="row.status==0">未开始</span>
          <span v-if="row.status==1">通话中</span>
          <span v-if="row.status==2">已结束</span>
        </template>

        <template #operation="{row}">
          <el-button type="text" @click="getDetail(row,true)">详情</el-button>
        </template>
      </m-table-new>
    </el-col>

    <m-pagination
      ref="pagination"
      @onPageChange="getDatas" 
      :total="tabledate.total"
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
              <span class="family-name">罪犯姓名</span>
              <span class="family-nameDetail">{{toShow.criminalName}}</span>
            </p>
          </div>
          <div class="detail-content">
            <p class="detail-message-family">
              <span class="family-name">与罪犯关系</span>
              <span class="family-nameDetail">{{toShow.relationship}}</span>
            </p>
            <p class="detail-message-family" style="border: none">
              <span class="family-name">申请理由</span>
              <span class="family-nameDetail">{{toShow.applyReason}}</span>
            </p>
          </div>
        </div>
         <div
          v-for="(item,index) in toShow.logs"
          :key='index'
          style="display: flex;border: 1px solid #E4E7ED;border-top: none"
        >
          <div class="family-detail">{{index+1}}</div>
          <div class="detail-message">
            <p class="detail-message-family">
              <span class="family-name">审核人员账号</span>
              <span class="family-nameDetail">{{item.createUser}}</span>
            </p>
            <p class="detail-message-family">
              <span class="family-name">审核时间</span>
              <span class="family-nameDetail">{{item.createTime}}</span>
            </p>
          </div>
          <div class="detail-content">
            <p class="detail-message-family" >
              <span class="family-name">审核人姓名</span>
              <span class="family-nameDetail">{{item.nextCheckRole}}</span></p>
              <p class="detail-message-family" >
              <span class="family-name">审核人意见</span>
              <span class="family-nameDetail">{{item.remarks}}</span></p>
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
     <el-dialog
      :visible.sync="show.message"
      title="申请理由"
      width="530px"
      class="authorize-dialog">
      <div class="flex-dialog">
        <div class="infinite-list" style="margin-left:20px;min-height:400px;width:100%">
          {{ messageContent }}
        </div>
      </div>
    </el-dialog>

  </el-row>
</template>

<script>

import prisonFilterCreator from '@/mixins/prison-filter-creator'
import { mapActions, mapState } from 'vuex'
import registrationDialogCreator from '@/mixins/registration-dialog-creator'
import Moment from 'moment'
import http from '@/service'
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
      downloading:false,
      tabledate:{},
      toShow:{},
      searchItems: {
        familyName: {
          type: 'input',
          label: '家属姓名'
        },

        prisonerName: {
          type: 'input',
          label: '罪犯姓名'
        },

        prisonerNumber: {
          type: 'input',
          label: '罪犯编号'
        },
         applicationDate: {
            type: 'dateRange',
            unlinkPanels: true,
            start: 'startDate',
            end: 'endDate',
            startPlaceholder: '开始时间',
            endPlaceholder: '结束时间'
          },

        status: {
          type: 'select',
          label: '通话状态',
          options:[{label: '已结束', value: '2'},{label: '通话中', value: '1'},{label: '未接通', value: '0'}],
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
          label: '省份',
          prop: 'provincesName'
        },{
          label: '监狱名称',
          prop: 'jailName'
        },
        {
          label: '结算时间',
          prop: 'createdAt',
          minWidth: 150,
        },
        {
          label: '结算通话开始日期',
          prop: 'startTime',
          minWidth: 150,
        },
        {
          label: '结算通话结束日期',
          prop: 'endTime',
          minWidth: 150,
        },
        {
          label: '结算通话次数（次）',
          minWidth: 150,
          prop: 'number'
        },
        {
          label: '出狱人员通话次数（次）',
          minWidth: 160,
          prop: 'releaseNumber'
        },{
          label: '结算总费用（元）',
          minWidth: 130,
          prop: 'expense'
        },{
          label: '出狱人员通话的费用（元）',
          minWidth: 180,
          prop: 'releaseExpense'
        },{
          label: '实际结算的费用',
          minWidth: 130,
          prop: 'finalExpense'
        },
        {
          label: '结算人员',
          slotName: 'createdBy',
          minWidth: 100,
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
          url: "/download/settle-account/export",
          methods:'get',
          params: { ...this.filter},
          isPrisonInternetGetUrlWay: false
        }
      await tokenExcel({
        params,
        actionName,
        menuName: `亲情电话通话统计报表-${ times }`,
      })

      setTimeout(() => {
        this.downloading = false
      }, 300)
    },
    async getDetail(e,type=false){
       let res= await http.familyPhoneAccountDetail({ id: e.id })
          if (!res) return
        this.toShow = Object.assign({}, res, {processInstanceId: e.processInstanceId,id: e.id })
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
     let res = await http.familyPhoneSettleAccount({
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
        startDate: this.oneMonthLater,
        endDate: this.todayDate
      })
    },
  mounted() {
     this.$set(this.searchItems.applicationDate, 'value', [this.oneMonthLater, this.todayDate])
    this.getDatas()
  }
}
</script>


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

.el-upload__excel {
  margin-right: 0px !important;
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
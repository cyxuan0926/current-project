<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-search
      :items="searchItems"
      ref="search"
      @searchSelectChange="searchSelectChange"
      @search="onSearch" >
        <el-button
        slot="append"
          class="m-excel-download"
          type="primary"
          @click="onDownloadExcel()"
        >
        导出 Excel
        </el-button>
    </m-search>
    <el-col :span="24">
      <el-tabs
        v-model="tabs"
        type="card">
        <el-tab-pane
          v-for="(pane, index) in tabPanes"
          :key="`id-visit-pane-${ index + Math.random() }`"
          :label="pane.label"
          :name="pane.name"/>
      </el-tabs>
      <m-table-new
        stripe
        :data="tabledate.meetings"
        class="mini-td-padding td"
        :cols="tableCols">
          <template
          slot="content"
          slot-scope="scope">
          <span style="color:#409EFF;cursor: pointer;" @click="messageDetail(scope.row)">短信内容</span>
        </template>
        <template
          slot="status"
          slot-scope="scope">
          <span v-if="scope.row.status == 'PENDING'">未授权</span>
          <span v-if="scope.row.status == 'PASSED'">已发送</span>
          <span v-if="scope.row.status == 'DENIED'">已拒绝</span>
          <span v-if="scope.row.status == 'CANCELED'">已取消</span>
        </template>
          <template
          slot="isSensitive"
          slot-scope="scope">
          <span v-if="scope.row.isSensitive == '0'">无</span>
          <span v-if="scope.row.isSensitive == '1'">有</span>
        </template>
        <template
          slot="lastCoiumn"
          slot-scope="scope">
          <template>
              <span v-if="scope.row.status!='PENDING'" style="color:#409EFF;cursor: pointer;" @click="onDetail(scope.row)">详情</span>
         </template>
        </template>
      </m-table-new>
    </el-col>
    <m-pagination
      ref="pagination"
      :total="tabledate.total"
      @onPageChange="getDatas" />
     <el-dialog
      :visible.sync="show.message"
      title="短信内容1111"
      width="530px"
      class="authorize-dialog">
      <div class="flex-dialog" v-if="show.editRebut">
        <div class="infinite-list" style="margin-left:20px;min-height:400px;width:100%">
          {{ messageContent }}
        </div>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="show.dialog"
      title="详情"
      width="780px"
      class="authorize-dialog"
      lock-scroll>
      <div style="max-height:380px;overflow: auto">
        <div style="display: flex;border: 1px solid #E4E7ED;">
          <div class="family-detail">基本信息</div>

          <div class="detail-message">
            <p class="detail-message-family">
              <span class="family-name">发送人姓名</span>
              <span class="family-nameDetail">{{toShow.senderName}}</span>
            </p>

            <p class="detail-message-family" style="border: none">
              <span class="family-name">接收人姓名</span>

              <span class="family-nameDetail">{{toShow.receiverName}}</span>
            </p>
          </div>

          <div class="detail-content">
            <p class="detail-message-family">
              <span class="family-name">与罪犯关系</span>

              <span class="family-nameDetail">{{toShow.relationship}}</span>
            </p>

            <p class="detail-message-family" style="border: none">
              <span class="family-name">是否有敏感词</span>

              <span class="family-nameDetail">{{toShow.isSensitive?"有":"无"}}</span>
            </p>
          </div>
        </div>
        <div style="display: flex;border: 1px solid #E4E7ED;border-top: none"
        >
          <div class="family-detail">1</div>
          <div class="detail-message">
            <template v-if="toShow.status == 'CANCELED'">
            <p class="detail-message-family">
              <span class="family-name" >取消人姓名</span>
              <span class="family-nameDetail">{{toShow.auditName}}</span>
            </p>
            <p class="detail-message-family" style="border: none" >
              <span class="family-name">取消时间</span>
                 <span class="family-nameDetail">{{toShow.auditTime}}</span>
            </p>

            </template>
            <template v-else>
            <p class="detail-message-family">
              <span class="family-name" >审核人员账号</span>
              <span class="family-nameDetail">{{toShow.auditId}}</span>
            </p>

            <p class="detail-message-family" style="border: none" >
              <span class="family-name">审核时间</span>
                 <span class="family-nameDetail">{{toShow.auditTime}}</span>
            </p>
            <p
              v-if="toShow.status == 'DENIED'"
              class="detail-message-family"
              style="border-top:  1px solid #E4E7ED;border-bottom: none;text-align: justify;line-height: 18px"
            >
              <span class="family-name"  style="line-height: 40px">拒绝原因</span>

              <span class="family-nameDetail" style="padding: 10px;text-align: justify;line-height: 15px;">{{toShow.remark}}</span>
            </p>
            </template>
          </div>

          <div class="detail-content">
            <p class="detail-message-family" v-if="toShow.status != 'CANCELED'"  >
              <span class="family-name" >审核人姓名</span>
              <span class="family-nameDetail">{{toShow.auditName}}</span>
            </p>

            <p class="detail-message-family">
                 <span class="family-name">申请状态</span>
                  <span class="family-nameDetail">
                      <span v-if="toShow.status == 'PASSED'">已发送</span>
                      <span v-if="toShow.status == 'DENIED'">已拒绝</span>
                      <span v-if="toShow.status == 'CANCELED'">已取消</span>
                  </span>
            </p>
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
  </el-row>
</template>

<script>
import { mapActions } from 'vuex'
import Moment from 'moment'
import prisonFilterCreator from '@/mixins/prison-filter-creator'
import { DateFormat } from '@/utils/helper'
import { tokenExcel } from '@/utils/token-excel'
import http from '@/service'
export default {
  mixins: [prisonFilterCreator],
  data() {
    const todayDate = Moment().format('YYYY-MM-DD')
    const oneMonthLater = Moment().add(-1, 'months').format('YYYY-MM-DD')
    const stateAll = [
      {
        label: '未授权',
        value: 'PENDING'
      },
      {
        label: '已发送',
        value: 'PASSED'
      },
      {
        label: '已拒绝',
        value: 'DENIED'
      },{
        label: '已取消',
        value: 'CANCELED'
      }
    ]
    const state = [
      {
        label: '已拒绝',
        value: 'DENIED'
      },{
        label: '已取消',
        value: 'CANCELED'
      }
    ]
    const tabPanes = [
      {
        label: '短信申请',
        name: '0'
      },
      {
        label: '已发送',
        name: 'PASSED'
      },
      {
        label: '已拒绝',
        name: 'DENIED,CANCELED'
      },
      {
        label: '未审核',
        name: 'PENDING'
      }
    ]
    return {
      tabs: 'PENDING',
      stateAll,
      state,
      toShow:{},
      messageContent:'',
      searchItems: {
        // prisonerNumber: { type: 'input', label: '罪犯编号' },
        familyName: {
          type: 'input',
          label: '家属姓名'
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
            startPlaceholder: '申请开始时间',
            endPlaceholder: '申请结束时间'
          },
        prisonerName: {
          type: 'input',
          label: '罪犯姓名'
        },
        status: {
          type: 'select',
          label: '申请状态',
          options: this.stateAll,
          miss:true,
          value:"",
        },
         auditAt: {
            type: 'date',
            label: '审核时间',
            value: ''
          },
        sendType: {
          type: 'select',
          label: '短信发送人',
          options: [{label:"家属",value:"0"},{label:"罪犯",value:"1"}]
        },
        isSensitive: {
          type: 'select',
          label: '是否有敏感词',
          options: [{label:"无",value:"0"},{label:"有",value:"1"}]
        },
      },
      show: {
        dialog:false,
        authorize: false,
        agree: false,
        disagree: false,
        rejectEdit:false,
        editRebut:true,
        message:false,
        withdraw: false
      },
      toAuthorize: {},
       btnDisable: false, // 按钮禁用与启用
        content:[],
        updateer:'',
        contentId:"",
      remarks: [],
      tabPanes,
      todayDate,
      oneMonthLater,
      filterInit: {},
      tabledate:{},
      tableCols: [
        {
          label: '省份名称',
          prop: 'provincesName'
        },
        {
          label: '监狱名称',
          prop: 'jailName'
        },
        {
          label: '监区',
          prop: 'prisonArea'
        },
        {
          label: '罪犯编号',
          prop: 'prisonerNumber',
          width: 110
        },
        {
          label: '发送人姓名',
          prop: 'senderName'
        },
        {
          label: '申请时间',
          prop: 'createdAt',
          width: 140
        },
        {
          label: '接收人姓名',
          prop: 'receiverName'
        },
        {
          label: '家属电话',
          prop: 'phone',
          width: 140
        },
        {
          label: '关系',
          prop: 'relationship',
          width: 136
        },
        {
          label: '短信内容',
          slotName: 'content',
          width: 136
        },
        {
          label: '是否有敏感词',
          slotName: 'isSensitive',
          width: 136
        },
        {
          label: '申请状态',
          slotName: 'status',
          className: 'orange'
        },
        {
          label: '操作',
          minWidth: 100,
          slotName: 'lastCoiumn',
          showOverflowTooltip: true
        }
      ]
    }
  },
  watch: {
    tabs(val) {
      delete this.filter.status
      if(val=="PENDING" || val=="PASSED"){
        this.searchItems.status.miss = true
      }else if( val=='0') {
          this.searchItems.status.miss = false
          this.searchItems.status.value= ''
          this.searchItems.status.options=this.stateAll
      }else{
        this.searchItems.status.miss = false
        this.searchItems.status.value= ''
        this.searchItems.status.options=this.state
      }
      this.onSearch()
    }
  },
  created() {
      this.filterInit = Object.assign({}, this.filterInit, {
        startDate:this.oneMonthLater,
        endDate: this.todayDate
      })
    },
  mounted() {
     this.$set(this.searchItems.applicationDate, 'value', [this.oneMonthLater,this.todayDate ])
    this.getDatas()
  },
  methods: {
    ...mapActions([
      'getVisits',
      'getCanceledVisit',
      'authorizeVisit',
      'withdrawVisit' ]),
     async onDetail(row){
        let res = await http.getMessageDetail({id:row.id})
        this.toShow=res
        this.show.dialog=true
      },
      messageDetail(row){
        this.messageContent=row.content
        this.show.message=true
      },
    async onDownloadExcel(){
       this.downloading = true
      const times = DateFormat(Date.now(),'YYYYMMDDHHmmss'),
        tabItem = this.tabPanes.filter(tabItem => tabItem.name === this.tabs),
        TABName = tabItem[0]['label'],
        actionName = 'familyPhone/exportFamilyPhone',
        params = {
          url: "/familyMessage/export",
          methods:'get',
          params: { ...this.filter,status:this.tabs==0?null:this.tabs },
          isPrisonInternetGetUrlWay: false
        }
      await tokenExcel({
        params,
        actionName,
        menuName: `短信申请管理报表-${TABName}-${ times }`,
      })
      setTimeout(() => {
        this.downloading = false
      }, 300)
    },
   async getDatas() {
     this.filter.status = this.tabs==0?null:this.tabs
     let res = await http.getMessagelist({
        ...this.filter,
        ...this.pagination
      })
      this.tabledate=res
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },
    handleAuthorization(e) {
      this.toAuthorize = e
      this.show.agree = false
      this.show.disagree = false
      this.show.authorize = true
      this.messageContent=e.message
      this.onRejectshow(false,false)
      this.isform=false
    },
    handleWithdraw(e) {
      this.toAuthorize = e
      this.withdraw = {}
      this.onRejectshow(false,true)
        this.isform=true
      this.show.withdraw = true
    },
    async handleSubmit(params) {

    let  res= await  http.dealMessage(params)
        if (res){
        this.closeAuthorize()
        this.toAuthorize = {}
        this.getDatas()
        }else{
          return false
        }
    },
    closeAuthorize(e) {
      if (e === 'back') this.show.disagree = false
      else this.show.authorize = false
      this.remarks = []
      this.$refs['refuseForm'] && this.$refs['refuseForm'].resetFields()
    }
  }
}
</script>
<style lang="stylus">
#body .el-table.mini-td-padding td{
  padding: 8px 0;
}
.borderNone .el-form-item__content{
    display: flex;
    flex-direction: column;
}
.borderNone .el-textarea__inner{
    border:1px solid #DCDFE6 ;
    border-bottom:none;
    border-radius:4px 4px 0 0;

}
.bordertop .el-textarea__inner{
    border:1px solid #DCDFE6 ;
    border-top:none;
    border-radius:0px 0px 4px 4px;
}
</style>

<style lang="scss" scoped>
.el-table /deep/ td {
  padding: 7px 0;
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

<style type="text/stylus" lang="stylus" scoped>
.cell img
  width: 126.8px;
  cursor: pointer;
.withdraw-box
  margin-bottom 20px;
</style>

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
         <el-button
          slot="append"
            type="primary"
            class="button-add"
             @click="printList()"
          >批量打印</el-button>
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
        :data="tabledate.messages"
        @selection-change="handleSelectionChange"
        class="mini-td-padding td"
        :cols="tableCols">
         <el-table-column
          type="selection"
          width="55">
          </el-table-column>
          <template
          slot="message"
          slot-scope="scope">
          <span style="color:#409EFF;cursor: pointer;" @click="messageDetail(scope.row)">短信内容</span>
        </template>
        <template
          slot="state"
          slot-scope="scope">
          <span v-if="scope.row.state == '0'">未审核</span>
          <span v-if="scope.row.state == '1'">已发送</span>
          <span v-if="scope.row.state == '2'">已拒绝</span>
          <span v-if="scope.row.state == '5'">已取消</span>
          <span v-if="scope.row.state == '6'">已打印</span>
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
            <el-button
              v-if="scope.row.state == '0'"
              size="mini"
              @click="handleAuthorization(scope.row)">审核</el-button>
              <span v-else style="color:#409EFF;cursor: pointer;" @click="onDetail(scope.row)">详情</span>
               <span v-if="scope.row.state == '1' && !scope.row.isPrisonerSend" style="color:#409EFF;cursor: pointer;margin-left:15px" @click="messageDetail(scope.row)">打印</span>
                <span v-if="scope.row.state == '6' && !scope.row.isPrisonerSend" style="color:#409EFF;cursor: pointer;margin-left:15px" @click="messageDetail(scope.row)">已打印</span>
          </template>
        </template>
      </m-table-new>
    </el-col>
    <m-pagination
      ref="pagination"
      :total="tabledate.totalElements"
      @onPageChange="getDatas" />
    <el-dialog
      :visible.sync="show.authorize"
      class="authorize-dialog"
      @close="closeAuthorize()"
      title="审核"
      width="530px">
      <div class="infinite-list"  style="margin-left:10px;min-height:200px;width:100%">
        <p>请审核短信内容：</p>
        <div v-html="toAuthorize.message" style="padding:8px 10px;margin-top:10px;min-height:160px;width:95%;border:1px solid ">
          {{ toAuthorize.message }}
        </div>
        </div>
      <div style="margin-top:10px"
        v-if="!show.agree && !show.disagree"
        class="button-box">
        <el-button
          plain
          @click="show.agree = true">同意</el-button>
        <el-button
          plain
          @click="show.disagree = true">不同意</el-button>
        <el-button
          type="danger"
          plain
          @click="show.authorize = false">关闭</el-button>
      </div>
      <div
         style="margin-top:10px"
        v-if="show.agree"
        class="button-box">
        <el-button
          plain
          @click="onAuthorization('1')">确定申请通过？</el-button>
        <el-button
          plain
          @click="show.agree=false">返回</el-button>
        <el-button
          type="danger"
          plain
          @click="show.authorize = false">关闭</el-button>
      </div>
       <!-- 不同意的情况 -->
      <div v-if="show.disagree" class="button-box logMgCls">
        <div style="margin-top:10px;margin-bottom: 10px;text-align: left;">请选择驳回原因</div>

        <div style="display: flex;">
          <el-select
            v-model="disArgeeRemarks"
            :multiple="true"
            :multiple-limit='5'
            collapse-tags
            @change="refuseFormChange"
            style="width:70%; margin-right:10px"
          >
            <el-option
            class="select_edit"
              v-for="(remark, index) in content"
              :value="remark"
              :label="(index + 1) + '、' + remark"
              :key="index"
            />
          </el-select>

          <el-button
            type="primary"
            :loading="btnDisable"
            @click="onRejectshow('PASSED')"
          >编辑驳回原因</el-button>
        </div>

        <el-form
          :model="refuseForm"
          :rules="withdrawRule"
          ref="refuseForm"
          class="withdraw-box"
        >
          <el-form-item prop="anotherRemarks">
            <el-input
              :autosize="{ minRows: 6, maxRows:8 }"
              type="textarea"
              show-word-limit
              maxlength="1000"
              placeholder="请输入驳回原因..."
              v-model="refuseForm.anotherRemarks"
            />
          </el-form-item>
        </el-form>
        <el-button
          plain
          :loading="btnDisable"
          @click="onAuthorization('2')">提交</el-button>
        <el-button
          plain
         @click="show.disagree = false">返回</el-button>
        <el-button
          type="danger"
          plain
          @click="closeAuthorize()">关闭</el-button>
      </div>
    </el-dialog>
     <el-dialog
      :visible.sync="show.message"
       class="authorize-dialog"
      title="短信内容"
      >
      <hr class="messageNone" />
      <div class="flex-dialog" ref="print">
        <div class="wapText"> 
          <p class="textContentTime">{{messageContent.receiveName}}</p>
          <p class="textContent">编号：<span class="phone">{{messageContent.criminalNumber}}</span></p>
          <p class="textContent">家属：<span class="familyname">{{messageContent.sendName}}</span></p>
          <p class="textContent">电话：<span class="phone">{{messageContent.familyPhone}}</span></p>
          <p class="textContent">时间：<span class="phone">{{messageContent.createTime}}</span></p>
        </div>
          <p class="textcontent">信息：</p>
        <div  v-html="messageContent.message"  class="infinite-list messageText" >
          {{ messageContent.message }}
        </div>
        <div>&nbsp;&nbsp;</div>
        <div>&nbsp;&nbsp;</div>
        <hr  class="messageNone"/>
      </div>
        <el-row :gutter="0">
           <!-- v-if="messageContent.state == '1' && !messageContent.isPrisonerSend" -->
          <el-button
           v-if="(messageContent.state == '1' || messageContent.state == '6') && !messageContent.isPrisonerSend"
            type="primary"
            class="button-add"
             @click="print"
            size="mini"
          >打印</el-button>
      </el-row>
    </el-dialog>
      <el-dialog
      :visible.sync="show.rejectEdit"
      title="编辑"
      width="530px"
      @close="changeClose"
      class="authorize-dialog">
      <div class="flex-dialog" v-if="show.editRebut">
        <ul class="infinite-list" style="padding:0 20px;min-height:400px;width:100%;text-align:justify;">
          <li
            v-for="(item,index) in content"
            :key='index'
            class="infinite-list-item" style="line-height:32px">
            {{ index + 1 }}.{{ item }}
          </li>
        </ul>

        <p style="margin-left:20px;">编辑用户: {{ updateer }}</p>
      </div>

      <div
        v-else
        class="infinite-list"
        style="margin-left:20px;min-height:400px"
      >
        <span v-for="(item,index) in content" :key="index">
          <el-input
            style="margin-bottom:10px"
            maxlength="200"
            v-model="content[index]"
            placeholder="请输入内容"
            clearable
          >
           <el-button
            slot="append"
            icon="el-icon-close"
            @click="removeReject(index)"
          />
          </el-input>
        </span>
      </div>

      <el-row :gutter="0">
        <el-button
          v-if="show.editRebut"
          type="primary"
          class="button-add"
          size="mini"
          @click="onRejectEditshow"
        >编辑</el-button>

        <span v-else>
          <el-button
            v-if="content.length>0"
            type="primary"
            class="button-add"
            size="mini"
            @click="onSubmitReject"
          >保存</el-button>

          <el-button
            v-if="content.length < 10"
            type="primary"
            class="button-add"
            size="mini"
            @click="addReject"
          >新增</el-button>
        </span>
      </el-row>
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
              <span class="family-nameDetail">{{toShow.sendName}}</span>
            </p>

            <p class="detail-message-family" style="border: none">
              <span class="family-name">接收人姓名</span>

              <span class="family-nameDetail">{{toShow.receiveName}}</span>
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
            <template v-if="toShow.state == '5'">
            <p class="detail-message-family">
              <span class="family-name" >取消人姓名</span>
              <span class="family-nameDetail">{{toShow.updateUser}}</span>
            </p>
            <p class="detail-message-family" style="border: none" >
              <span class="family-name">取消时间</span>
                 <span class="family-nameDetail">{{toShow.updateTime}}</span>
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
              v-if="toShow.state == '2'"
              class="detail-message-family"
              style="border-top:  1px solid #E4E7ED;border-bottom: none;text-align: justify;line-height: 18px"
            >
              <span class="family-name"  style="line-height: 40px">拒绝原因</span>

              <span class="family-nameDetail" style="padding: 10px;text-align: justify;line-height: 15px;">{{toShow.remarks}}</span>
            </p>
            </template>
          </div>

          <div class="detail-content">
            <p class="detail-message-family" v-if="toShow.state != '5'"  >
              <span class="family-name" >审核人姓名</span>
              <span class="family-nameDetail">{{toShow.auditName}}</span>
            </p>

            <p class="detail-message-family">
                 <span class="family-name">申请状态</span>
                  <span class="family-nameDetail">
                      <span v-if="toShow.state == '1' || toShow.state == '6'">已发送</span>
                      <span v-if="toShow.state == '2'">已拒绝</span>
                      <span v-if="toShow.state == '5'">已取消</span>
                  </span>
            </p>
          </div>
        </div>
        <template v-if="toShow.printLogs">
        <div v-for="(item,index) in toShow.printLogs" :key="index" style="display: flex;border: 1px solid #E4E7ED;border-top: none"
        >
          <div class="family-detail">{{index+2}}</div>
          <div class="detail-message">
            <p class="detail-message-family">
              <span class="family-name" >打印账号</span>
              <span class="family-nameDetail">{{item.printAccount}}</span>
            </p>
            <p class="detail-message-family" style="border: none" >
              <span class="family-name">打印姓名</span>
                 <span class="family-nameDetail">{{item.printName}}</span>
            </p>
          </div>

          <div class="detail-content">
            <p class="detail-message-family" >
              <span class="family-name" >打印时间</span>
              <span class="family-nameDetail">{{item.printTime}}</span>
            </p>

            <p class="detail-message-family">
                 <span class="family-name">申请状态</span>
                  <span class="family-nameDetail">
                      <span>已打印</span>
                  </span>
            </p>
          </div>
        </div>
        </template>
      </div>

      <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
      <span  ref="printList"  class="messageNone" >
     <hr />
    <div class="flex-dialog" v-for="(item,index) in messagePrintList" :key="index">
         <div class="wapText"> 
           <p class="textContentTime">{{item.receiveName}}</p>
           <p class="textContent">编号：<span class="phone">{{item.criminalNumber}}</span></p>
           <p class="textContent">家属：<span class="familyname">{{item.sendName}}</span></p>
          <p class="textContent">电话：<span class="phone">{{item.familyPhone}}</span></p>
          <p class="textContent">时间：<span class="phone">{{item.createTime}}</span></p>
        </div>
          <p class="textcontent">信息：</p>
        <div  v-html="item.message"  class="infinite-list messageText" >
          {{ item.message }}
        </div>
         <div>&nbsp;&nbsp;</div>
         <div>&nbsp;&nbsp;</div>
        <hr />
      </div>
        
      </span>
  </el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import validator from '@/utils'
import Moment from 'moment'
import prisons from '@/common/constants/prisons'
import prisonFilterCreator from '@/mixins/prison-filter-creator'
import http from '@/service'
import { DateFormat } from '@/utils/helper'
import { tokenExcel } from '@/utils/token-excel'
import {
    $likeName,
    $likePrisonerNumber,
    $likePhone
  } from '@/common/constants/const'
export default {
  mixins: [prisonFilterCreator],
  data() {
    const todayDate = Moment().format('YYYY-MM-DD')
    const oneMonthLater = Moment().add(-1, 'months').format('YYYY-MM-DD')
    const { belong } = prisons.PRISONAREA
    const { options } = this.$store.getters.prisonAreaOptions
    const stateAll = [
      {
        label: '未审核',
        value: '0'
      },
      {
        label: '已发送',
        value: '1'
      }, {
        label: '已打印',
        value: '6'
      },
      {
        label: '已拒绝',
        value: '2'
      },
      {
        label: '已取消',
        value: '5'
      }
    ]
   const printState = [
      {
        label: '已打印',
        value: '6'
      },
      {
        label: '已发送',
        value: '1'
      }
    ]
    const state = [
      {
        label: '已拒绝',
        value: '2'
      },{
        label: '已取消',
        value: '5'
      }
    ]
    const tabPanes = [
      {
        label: '短信申请',
        name: '0'
      },
      {
        label: '已发送',
        name: '1'
      },
      {
        label: '已拒绝',
        name: '2'
      },
      {
        label: '未审核',
        name: '3'
      }
    ]
    return {
      printPlugin: null,
      tabs: '3',
      stateAll,
      printState,
      state,
      toShow:{},
      messageContent:{},
      messagePrintList:[],
      searchItems: {
        familyName: {
          type: 'input',
          label: '家属姓名'
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
            startPlaceholder: '申请开始时间',
            endPlaceholder: '申请结束时间'
          },
        criminalName: {
          type: 'input',
          label: '罪犯姓名'
        },
        state: {
          type: 'select',
          label: '申请状态',
          options: this.stateAll,
          miss:true,
          value:"",
        },
         auditTime: {
            type: 'date',
            label: '审核时间',
            value: ''
          },
        isPrisonerSend: {
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
        isMessageList:false,
        withdraw: false
      },
      toAuthorize: {},
       btnDisable: false, // 按钮禁用与启用
        content:[],
        updateer:'',
        contentId:"",
         withdrawForm: {
        selectRemark:"",
        lengthRemark:1000,
        withdrawReason: ""
      },
      refuseForm: {
        selectRemark:"",
        lengthRemark:1000,
        anotherRemarks: ""
      },
      withdrawRule: {
        anotherRemarks: [
          {
            validator:(rule,value,callback)=>{
              if(this.refuseForm.anotherRemarks){
                  callback()
              }else{
                  callback(new Error('请填写驳回原因'))
              }
            }
          }
        ]
      },
      remarks: [],
      disArgeeRemarks: "",
      tabPanes,
      todayDate,
      mediaQueryList:null,
      oneMonthLater,
      filterInit: {},
      tabledate:{},
      tableCols: [
          {
          type: 'selection',
          selectable: this.handleControlSelect
        },
        {
          label: '监区',
          prop: 'prisonAreaName',
          showOverflowTooltip: true
        },
        {
          label: '罪犯编号',
          prop: 'criminalNumber',
          width: 110,
          ...$likePrisonerNumber
        },
        {
          label: '发送人姓名',
          prop: 'sendName',
          ...$likeName
        },
        {
          label: '申请时间',
          prop: 'createTime',
          width: 140
        },
        {
          label: '接收人姓名',
          prop: 'receiveName',
          ...$likeName
        },
        {
          label: '家属电话',
          prop: 'familyPhone',
          width: 140,
          ...$likePhone
        },
        {
          label: '关系',
          prop: 'relationship',
          width: 136
        },
        {
          label: '短信内容',
          slotName: 'message',
          width: 136
        },
        {
          label: '是否有敏感词',
          slotName: 'isSensitive',
          width: 136
        },
        {
          label: '申请状态',
          slotName: 'state',
          className: 'orange'
        },
        {
          label: '操作',
          minWidth: 150,
          slotName: 'lastCoiumn',
          showOverflowTooltip: true
        }
      ]
    }
  },
  computed: {
    ...mapState({
      visits: state => state.visits,
      frontRemarks: state => [
        ...state.frontRemarks.slice(0, state.frontRemarks.length - 1),
        '当月会见次数已达上限，请下月再申请',
        '其他'
      ]
    })
  },
  watch: {
    tabs(val) {
      delete this.filter.state
      if(val=="3"){
        this.searchItems.state.miss = true
      }else if( val=='1') {
          this.searchItems.state.miss = false
          this.searchItems.state.value= ''
          this.searchItems.state.options=this.printState
      }else if( val=='0') {
          this.searchItems.state.miss = false
          this.searchItems.state.value= ''
          this.searchItems.state.options=this.stateAll
      }else{
        this.searchItems.state.miss = false
        this.searchItems.state.value= ''
        this.searchItems.state.options=this.state
      }
      this.onSearch()
    },
    remarks(val) {
      if (val !== '其他' && this.refuseForm.refuseRemark) this.$refs['refuseForm'].resetFields()
    }
  },
  created() {
      this.filterInit = Object.assign({}, this.filterInit, {
        startTime:  this.oneMonthLater,
        endTime:this.todayDate
      })
    },
  mounted() {
     window.addEventListener("message",  e => {
      if(!e.data.type){
               this.$confirm('确认打印机是否正常工作, 正常出票?', '提示', {
                confirmButtonText: '正常出票',
                cancelButtonText: '没有出票',
                type: 'warning'
              }).then(async () => {
                let gkMessageIdList=[]
                //判断是单独打印还是批量打印
                if(this.show.isMessageList){
                  this.messagePrintList.forEach(item=>gkMessageIdList.push(item.uid))
                }else{
                  gkMessageIdList.push(this.messageContent.uid)
                }
                 let res = await http.messagePrint({gkMessageIdList:gkMessageIdList})
                  if(res){
                   this.show.message=false
                   this.messageContent={}
                   this.getDatas()
                  }
              })
      }
    }, false);
     this.$set(this.searchItems.applicationDate, 'value', [ this.oneMonthLater, this.todayDate])
    this.getDatas()
  },
  methods: {
    ...mapActions([
      'getVisits',
      'getCanceledVisit',
      'authorizeVisit',
      'withdrawVisit' ]),
      // 选择要打印的批量数据
    handleSelectionChange(val) {
      this.messagePrintList = val
    },
    printList(){
      if( this.messagePrintList.length==0){
          this.$message({
            message: '请选择需要打印的记录！',
            type: 'error'
          });
          return false
      }else{
         this.show.isMessageList=true
        this.$print(this.$refs.printList, { isUseTemplate :true})
      }
    },
       // 筛选不可打印的数据
    handleControlSelect(row) {
      return (row.state == 1 || row.state == 6) && !row.isPrisonerSend? true : false
    },
      print(){
        this.show.isMessageList=false
        this.$print(this.$refs.print, { isUseTemplate :true})
      },
      onDetail(row){
        this.toShow=row
        this.show.dialog=true
      },
      messageDetail(row){
        this.messageContent=row
        this.show.message=true
      },
      refuseFormChange(e) {
       let str = ""
      if (!this.refuseForm.anotherRemarks) {
        this.refuseForm.anotherRemarks = ""
      }
      e.forEach((item,index) => {
        if(!this.refuseForm.anotherRemarks.includes(item)) {
          str +=`${item}。\n`
        }
      })
      this.refuseForm.anotherRemarks += str
    },
    // 获取当前驳回原因列表
  async onRejectshow(str,isform){
      let params={}
          params.jailId=JSON.parse(localStorage.getItem('user')).jailId
          params.type=4
      let res = await http.getIntraRejectEdit( params )
      if(res.content){
        this.content = res.content
        this.contentId=res.id
        this.updateer=res.updateEr
      }else{
        this.content = []
      }
      if(str=='PASSED'){
        this.show.rejectEdit=true
      }else{
       this.show.rejectEdit=false
      }
    },
    addReject(){
      this.content.push('')
    },
    removeReject(index){
      this.content.splice(index,1)
    },
    onRejectEditshow(){
      this.show.editRebut=false
    },
     changeClose(){
      this.remarks=[]
      this.onRejectshow(false,this.isform)
       this.show.editRebut=true
    },
     async onSubmitReject(){
      this.content=this.content.filter((res)=>res&&res.trim())
       if(this.content.length<1){
         this.$message({
            message: '新增编辑内容不能为空',
            type: 'error'
          });
          return false
      }else{
        let params={
        id: this.contentId,
        type:4,
        content:this.content,
        updateer:JSON.parse(localStorage.getItem('user')).realName,
        jailId:JSON.parse(localStorage.getItem('user')).jailId
        }
        let res = await http.setIntraRejectEdit(params)
          if(res){
          let params={}
              params.jailId=JSON.parse(localStorage.getItem('user')).jailId
              params.type=4
          let res = await http.getIntraRejectEdit( params )
          if(res.content){
            this.content = res.content
            this.contentId=res.id
            this.updateer=res.updateEr
          }else{
            this.content = []
          }
        }
       this.show.editRebut=true
      }
    },
    async onDownloadExcel(){
       this.downloading = true

      const times = DateFormat(Date.now(),'YYYYMMDDHHmmss'),
        tabItem = this.tabPanes.filter(tabItem => tabItem.name === this.tabs),
        TABName = tabItem[0]['label'],
        actionName = 'familyPhone/exportFamilyPhone',
        params = {
          url: "/export/exportSmsManage",
          methods:'get',
          params: { ...this.filter, tab: this.tabs },
          isPrisonInternetGetUrlWay: "getHyUrl"
        }
      await tokenExcel({
        params,
        actionName,
        menuName: `短信申请管理-${ TABName }-${ times }`,
      })

      setTimeout(() => {
        this.downloading = false
      }, 300)

    },
   async getDatas() {
     this.filter.tab = this.tabs
     let res = await http.getIntraMessagelist({
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
      this.disArgeeRemarks=''
      this.refuseForm.anotherRemarks=''
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
    onAuthorization(e) {
      let params = { uid: this.toAuthorize.uid.toString(), state: parseInt(e) }
      if (e === '2') {
          this.$refs.refuseForm.validate(valid => {
          if (valid) params.remarks = this.refuseForm.anotherRemarks.replace(/\s*/g, '')
          })
        if (params.remarks) this.handleSubmit(params)
      }
      else this.handleSubmit(params)
    },
    async handleSubmit(params) {

    let  res= await http.dealIntraMessage(params)
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

<style type="text/stylus" lang="stylus" scoped>
.messageNone{
    display:none
  }
.flex-dialog{
  .wapText{
  line-height:30px;
  margin-bottom:20px;
  }
  .messageText{
    padding:0 20px;
    min-height:200px;
    width:100%;
    text-align:justify;
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
.cell img
  width: 126.8px;
  cursor: pointer;
.withdraw-box
  margin-bottom 20px;
.el-table.mini-td-padding td
  padding: 8px 0;
</style>
<style lang="stylus">
.logMgCls {
  text-align:left
}
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
    .select_edit.el-select-dropdown__item{
        display: inline-block;
    }
    .select_edit.el-select-dropdown__item span {
        min-width: 400px;
        display: inline-block;
   }
</style>

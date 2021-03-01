<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-search
      :items="searchItems"
      ref="search"
      @search="onSearch" />
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
        :data="visits.contents"
        class="mini-td-padding td"
        :cols="tableCols">
        <template
          slot="idcards"
          slot-scope="scope">
          <div class="idcard-box">
            <m-img-viewer
              v-if="scope.row.idCardFront"
              :url="scope.row.idCardFront"
              title="身份证正面" />
            <m-img-viewer
              v-if="scope.row.idCardBack"
              :url="scope.row.idCardBack"
              title="身份证背面" />
          </div>
        </template>
        <template
          slot="window"
          slot-scope="scope">
          <span v-if="scope.row.window">
            {{ scope.row.batch }} ({{ scope.row.window }}窗口)
          </span>
        </template>
        <template
          slot="status"
          slot-scope="scope">
          <span v-if="!scope.row.remarks">{{ scope.row.status | applyStatus }}</span>
          <el-tooltip
            v-else
            :content="scope.row.remarks"
            placement="top">
            <span>{{ scope.row.status | applyStatus }}</span>
          </el-tooltip>
        </template>
        <template
          slot="lastCoiumn"
          slot-scope="scope">
          <span v-if="tabs === 'CANCELED'">{{ scope.row.cause }}</span>
          <template v-else>
            <el-button
              v-if="scope.row.status == 'PENDING'"
              size="mini"
              @click="handleAuthorization(scope.row)">授权</el-button>
            <el-button
              v-else-if="scope.row.status === 'PASSED' && scope.row.isWithdrawFlag === 1"
              size="mini"
              @click="handleWithdraw(scope.row)">撤回</el-button>
          </template>
        </template>
      </m-table-new>
    </el-col>
    <m-pagination
      ref="pagination"
      :total="visits.total"
      @onPageChange="getDatas" />
    <el-dialog
      :visible.sync="show.authorize"
      class="authorize-dialog"
      @close="closeAuthorize"
      title="授权"
      width="530px">
      <div
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
        v-if="show.agree"
        class="button-box">
        <el-button
          plain
          @click="onAuthorization('PASSED')">确定申请通过？</el-button>
        <el-button
          plain
          @click="show.agree=false">返回</el-button>
        <el-button
          type="danger"
          plain
          @click="show.authorize = false">关闭</el-button>
      </div>
      <div
        v-if="show.disagree"
        class="button-box">
        <div style="margin-bottom: 10px;">请选择驳回原因</div>
          <div>
        <el-select v-model="remarks" :multiple="true" @change="refuseFormChange" style="width:70%;margin-right:10px">
          <el-option
            v-for="(remark,index) in content"
            :value="remark"
            :label="remark"
            :key="index" />
        </el-select>
        <el-button
            type="primary"
            :loading="btnDisable"
            @click="onRejectshow('PASSED')">编辑驳回原因</el-button>
          </div>
          <el-form
            :model="refuseForm"
            :rules="withdrawRule"
            ref="refuseForm"
            class="withdraw-box">
            <el-form-item prop="anotherRemarks"  class="borderNone">
              <el-input  class="borderNone" type="textarea" maxlength="1000"  :autosize="{ minRows: 1 }" v-model="refuseForm.selectRemark"  :readonly="true"/>
              <el-input
               class="bordertop"
                :autosize="{ minRows: 1 }"
                 style="border-top: none;"
                type="textarea"
                show-word-limit
                :maxlength="refuseForm.lengthRemark"
                placeholder="请输入驳回原因..."
                v-model="refuseForm.anotherRemarks"
              />
            </el-form-item>
          </el-form>
        <el-button
          plain
          :loading="btnDisable"
          @click="onAuthorization('DENIED')">提交</el-button>
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
      :visible.sync="show.withdraw"
      @close="closeAuthorize"
      class="authorize-dialog"
      title="撤回"
      width="530px">
     <div style="margin-bottom: 10px;">请选择撤回原因</div>
          <div style="margin-bottom: 10px;">
            <el-select v-model="remarks" :multiple="true" @change="withdrawFormChange" style="width:70%;margin-right:10px">
            <el-option
              v-for="(remark,index) in content"
              :value="remark"
              :label="remark"
              :key="index"/>
          </el-select>
           <el-button
            type="primary"
            :loading="btnDisable"
            @click="onRejectshow('PASSED')">编辑驳回原因</el-button>
          </div>
          <el-form
            :model="withdrawForm"
            :rules="withdrawRule"
            ref="withdrawForm"
            class="withdraw-box">
            <el-form-item prop="withdrawReason" class="borderNone">
              <el-input  class="borderNone" type="textarea" maxlength="1000"  :autosize="{ minRows: 1 }" v-model="withdrawForm.selectRemark"  :readonly="true"/>
              <el-input
               class="bordertop"
                type="textarea"
                show-word-limit
                :maxlength="withdrawForm.lengthRemark"
                :autosize="{ minRows: 1 }"
                placeholder="请输入撤回理由..."
                v-model="withdrawForm.withdrawReason" />
            </el-form-item>
          </el-form>
      <el-row :gutter="0">
        <el-button
          class="button-add"
          size="mini"
          @click="onWithdraw">提交</el-button>
          <el-button
          class="button-add"
          size="mini"
          type="danger"
          @click="show.withdraw = false">关闭</el-button>
      </el-row>
    </el-dialog>
    <el-dialog
      :visible.sync="show.rejectEdit"
      title="编辑"
      width="530px"
      @close="changeClose()"
      class="authorize-dialog">
      <div class="flex-dialog" v-if="show.editRebut">
        <ul class="infinite-list" style="margin-left:20px;min-height:400px;width:100%">
           <li v-for="(item,index) in content" 
               :key='index' 
               class="infinite-list-item" style="line-height:32px">
               {{index+1}}.{{ item }}
            </li>
        </ul>
         <p style="margin-left:20px;">编辑用户:{{updateer}}</p>
      </div>
       <div class="infinite-list" v-else style="margin-left:20px;min-height:400px">
         <span v-for="(item,index) in content" :key="index">
        <el-input style="margin-bottom:10px" maxlength="200" v-model="content[index]" placeholder="请输入内容" clearable>
           <el-button slot="append" icon="el-icon-close" @click="removeReject(index)"></el-button>
        </el-input>
         </span>
      </div>
      <el-row :gutter="0">
       
        <el-button
           v-if='show.editRebut'
           type="primary"
          class="button-add"
          size="mini"
          @click="onRejectEditshow()">编辑</el-button>
          <span v-else>
          <el-button
          v-if='content.length>0'
          type="primary"
          class="button-add"
          size="mini"
          @click="onSubmitReject()">保存</el-button>
           <el-button
          type="primary"
          class="button-add"
          size="mini"
          v-if='content.length<10'
          @click="addReject()">新增</el-button>
          </span>
      </el-row>
    </el-dialog>
  </el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import validator from '@/utils'
import prisons from '@/common/constants/prisons'
import prisonFilterCreator from '@/mixins/prison-filter-creator'
import http from '@/service'
export default {
  mixins: [prisonFilterCreator],
  data() {
    const { belong } = prisons.PRISONAREA
    const { options } = this.$store.getters.prisonAreaOptions
    const tabPanes = [
      {
        label: '会见预约',
        name: 'first'
      },
      {
        label: '已取消',
        name: 'CANCELED'
      }
    ]
    return {
      tabs: 'first',
      searchItems: {
        // prisonerNumber: { type: 'input', label: '罪犯编号' },
        name: {
          type: 'input',
          label: '家属姓名'
        },
        // prisonArea: {
        //   type: 'select',
        //   label: '监区',
        //   options,
        //   belong
        // }
      },
      show: {
        authorize: false,
        agree: false,
        disagree: false,
        rejectEdit:false,
        editRebut:true,
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
              if(this.refuseForm.selectRemark||this.refuseForm.anotherRemarks){
                  callback()
              }else{
                  callback(new Error('请填写驳回原因'))
              }
            }
          }
        ],
        withdrawReason: [
          {
            validator:(rule,value,callback)=>{
              if(this.withdrawForm.selectRemark||this.withdrawForm.withdrawReason){
                  callback()
              }else{
                  callback(new Error('请填撤回原因'))
              }
            }
          }
        ]
      },
      remarks: [],
      tabPanes,
      tableCols: [
        {
          label: '家属姓名',
          prop: 'name'
        },
        {
          label: '身份证信息',
          slotName: 'idcards',
          width: 156
        },
        {
          label: '罪犯编号',
          prop: 'prisonerNumber'
        },
        {
          label: '监区',
          prop: 'prisonArea'
        },
        {
          label: '关系',
          prop: 'relationship'
        },
        {
          label: '申请时间',
          prop: 'applicationDate'
        },
        {
          label: '批次(窗口号)',
          slotName: 'window',
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
      // if (val === 'first' || val === 'CANCELED') {
      //   delete this.filter.status
      // }
      // else {
      //   this.filter.status = val
      // }
      if (val === 'CANCELED') this.$set(this.tableCols[this.tableCols.length - 1], 'label', '取消原因')
      if (val === 'first') this.$set(this.tableCols[this.tableCols.length - 1], 'label', '操作')
      this.$refs.search.onSearch('tabs')
      this.onSearch()
    },
    remarks(val) {
      if (val !== '其他' && this.refuseForm.refuseRemark) this.$refs['refuseForm'].resetFields()
    }
  },
  mounted() {
    this.getDatas()
  },
  methods: {
    ...mapActions([
      'getVisits',
      'getCanceledVisit',
      'authorizeVisit',
      'withdrawVisit' ]),
      refuseFormChange(e){
      let str=""
        e.forEach((item,index)=>{
          if(index==(e.length-1)){
             str +=`${index+1}、${item}。`
          }else{
             str +=`${index+1}、${item}。\n`
          }
        })
        this.refuseForm.selectRemark=str
        this.refuseForm.lengthRemark=1000-this.refuseForm.selectRemark.length
    },
    withdrawFormChange(e){
      let str=""
        e.forEach((item,index)=>{
          if(index==(e.length-1)){
             str +=`${index+1}、${item}。`
          }else{
             str +=`${index+1}、${item}。\n`
          }
        })
        this.withdrawForm.selectRemark=str
        this.withdrawForm.lengthRemark=1000-this.withdrawForm.selectRemark.length
    },
    // 获取当前驳回原因列表
  async onRejectshow(str,isform){
      let params=JSON.parse(localStorage.getItem('user'));
          params.type=3
      let res = await http.getRejectEdit( params )
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
        if(this.content[0]){
          this.remarks.push(this.content[0])
          //判断打开的是驳回还是撤回
          if(isform){
            this.withdrawForm.selectRemark=`1、${this.content[0]}。`
            this.withdrawForm.lengthRemark=997-this.content[0].length
          }else{
            this.refuseForm.selectRemark=`1、${this.content[0]}。`
            this.refuseForm.lengthRemark=997-this.content[0].length
          }
        }
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
        type:3,
        content:this.content,
        updateer:JSON.parse(localStorage.getItem('user')).realName,
        jailId:JSON.parse(localStorage.getItem('user')).jailId
        }
        let res = await http.setRejectEdit(params)
       this.show.editRebut=true
      }
    },
    getDatas() {
      if (this.tabs === 'CANCELED') this.getCanceledVisit({
        ...this.filter,
        ...this.pagination
      })
      else if (this.tabs !== 'CANCELED') this.getVisits({
        ...this.filter,
        ...this.pagination
      })
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },
    handleAuthorization(e) {
      this.toAuthorize = e
      this.show.agree = false
      this.show.disagree = false
      this.show.authorize = true
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
      let params = { id: this.toAuthorize.id, status: e }
      if (e === 'DENIED') {
          this.$refs.refuseForm.validate(valid => {
          if (valid) params.remarks =this.refuseForm.selectRemark + this.refuseForm.anotherRemarks.replace(/\s*/g, '')
          })
        if (params.remarks) this.handleSubmit(params)
      }
      else this.handleSubmit(params)
    },
    handleSubmit(params) {
      this.authorizeVisit(params).then(res => {
        if (!res) return
        this.closeAuthorize()
        this.toAuthorize = {}
        this.getDatas()
      })
    },
    onWithdraw() {
      this.$refs['withdrawForm'].validate(valid => {
        if (valid) {
          const params = {
            id: this.toAuthorize.id,
            status: 'DENIED'
          }
          params.remarks =this.withdrawForm.selectRemark + this.withdrawForm.withdrawReason.replace(/\s*/g, '')
          this.withdrawVisit(params).then(res => {
            if (!res) return
            this.closeWithdraw()
            this.toAuthorize = {}
            this.getDatas()
          })
        }
      })
    },
    closeAuthorize(e) {
      if (e === 'back') this.show.disagree = false
      else this.show.authorize = false
      this.remarks = []
      this.$refs['refuseForm'] && this.$refs['refuseForm'].resetFields()
    },
    closeWithdraw() {
      this.show.withdraw = false
      this.$refs['withdrawForm'].resetFields()
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

<style lang="scss" scoped>
.el-table /deep/ td {
  padding: 7px 0;
}
</style>

<style type="text/stylus" lang="stylus" scoped>
.cell img
  width: 126.8px;
  cursor: pointer;
.withdraw-box
  margin-bottom 20px;
</style>


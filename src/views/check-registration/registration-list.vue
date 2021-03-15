<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-excel-download
      v-if="hasAllPrisonQueryAuth"
      path="/download/exportRegistrations"
      :params="filter" />
    <m-search
      :items="searchItems"
      ref="search"
      @searchSelectChange="searchSelectChange"
      @search="onSearch">
      <template #append v-if="!hasAllPrisonQueryAuth && ['first', 'PASSED'].includes(tabs)">
        <el-button type="primary" @click="onDownload('all')">
          下载关系证明
        </el-button>
      </template>
    </m-search>
    <el-col :span="24">
      <el-tabs
        v-model="tabs"
        type="card">
        <el-tab-pane
          label="家属注册"
          name="first" />
        <el-tab-pane
          label="审核已通过"
          name="PASSED" />
        <el-tab-pane
          label="审核未通过"
          name="DENIED,WITHDRAW" />
        <el-tab-pane
          label="未授权"
          name="PENDING" />
      </el-tabs>
      <el-table
        :data="registrations.contents"
        stripe
        class="mini-td-padding registration-table"
        style="width: 100%"
        @sort-change="sortChange"
        ref="elTable"
      >
        <el-table-column
          v-if="hasProvinceQueryAuth"
          label="省份"
          min-width="55"
          prop="provinceName"
          show-overflow-tooltip
        />
        <el-table-column
          v-if="hasAllPrisonQueryAuth"
          label="监狱名称"
          prop="jailName"
          min-width="50"
          show-overflow-tooltip
        />
        <el-table-column
          show-overflow-tooltip
          label="家属姓名"
          min-width="50"
        >
          <template slot-scope="scope">
            <span>{{scope.row.name + (scope.row.businessType == 3 ? '（附）' : '')}}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-if="isShowPhone"
          prop="phone"
          min-width="90"
          label="家属电话"
        />
        <el-table-column
          width="148px"
          label="身份证件信息">
          <template slot-scope="scope">
            <m-img-viewer
              :url="scope.row.idCardFront"
              isRequired
              :toolbar="{ prev: 1, next: 1 }"
              title="身份证正面照"
            />
            <m-img-viewer
              isRequired
              :url="scope.row.idCardBack"
              :toolbar="{ prev: 1, next: 1 }"
              title="身份证背面照"
            />
            <m-img-viewer
              isRequired
              class="img-viewer__hidden"
              :url="scope.row.avatarUrl"
              :toolbar="{ prev: 1, next: 1 }"
              title="头像"
            />
          </template>
        </el-table-column>
        <!-- <el-table-column
          label="身份证件有效期至"
          prop="validDate"
        /> -->
        <el-table-column
          label="家属类型"
          prop="domicileName"
          show-overflow-tooltip
          min-width="70"
        />
        <el-table-column
          label="申请时间"
          min-width="120"
        >
          <template slot-scope="scope"> {{ scope.row.createdAt | Date }} </template>
        </el-table-column>
        <el-table-column
          prop="prisonerName"
          show-overflow-tooltip
          label="罪犯姓名"
          min-width="55"
          sortable="custom"
        />
        <el-table-column
          prop="prisonerNumber"
          show-overflow-tooltip
          label="罪犯编号"
          min-width="50"
        />
        <!-- <el-table-column
          v-if="isInWhitelist"
          prop="prisonerName"
          show-overflow-tooltip
          label="罪犯姓名"
          min-width="55"
        /> -->
        <el-table-column
          prop="prisonArea"
          show-overflow-tooltip
          label="监区"
          min-width="50"
        />
        <el-table-column
          prop="relationship"
          label="关系"
          min-width="50"
          show-overflow-tooltip
        />
        <el-table-column
          label="家属可视电话告知书"
          min-width="65"
        >
          <template slot-scope="scope">
            <span
              :class="[
                'bold',
                { 'red' : scope.row.notifyId === null },
                { 'green' : scope.row.notifyId !== null }
            ]">{{ scope.row.notifyId !== null ? '已签订' : '未签订' }}</span>
            <el-button
              v-if="scope.row.notifyId !== null"
              type="text"
              size="small"
              @click="showSign(scope.row)">点击查看</el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="申请状态"
          min-width="60"
          class-name="orange"
        >
          <template slot-scope="scope"> {{ scope.row.status | registStatus }} </template>
        </el-table-column>
        <el-table-column
          prop="auditRealName"
          label="审核信息"
          min-width="60"
          show-overflow-tooltip
        >
          <template
            v-if="scope.row.auditAt"
            slot-scope="scope">
            {{ scope.row.auditRealName }} ({{ scope.row.auditUserName }})<br >
            {{ scope.row.auditAt | Date }}</template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="60"
        >

          <template slot-scope="scope">
            <template v-if="!hasAllPrisonQueryAuth">
              <el-button
                v-if="scope.row.status == 'PENDING' && !( haveMultistageExamine && scope.row.authorizeLevel === 1 && !isAdvancedAuditor )"
                size="mini"
                @click="handleAuthorization(scope.row)">授权
              </el-button>
              <template v-if="scope.row.status == 'PASSED'">
                <el-button
                  v-if="!!scope.row.canWithdraw"
                  size="mini"
                  @click="handleCallback(scope.row)">撤回</el-button>
                <el-button
                  size="mini"
                  @click="onDownload(scope.row)">下载</el-button>
              </template>
              <el-button
                v-if="!!scope.row.showDetail"
                size="mini"
                @click="handleAuthorDetail(scope.row.id)">详情
              </el-button>
            </template>
            <!-- <el-button
              v-if="hasProvinceQueryAuth"
              size="mini"
              @click="onView(scope.row)">查看</el-button> -->
            <el-button
              v-if="hasProvinceQueryAuth"
              size="mini"
              @click="handleAuthorDetail(scope.row.id)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <m-pagination
      ref="pagination"
      :total="registrations.total"
      @onPageChange="getDatas"
    />
    <el-dialog
      :visible.sync="showDetail"
      class="authorize-dialog"
      title="详情"
      @close="showDetail = false"
    >
      <registration-detail  :toAuthorize="authorizeDetData" />
      <div class="button-box view-box">
        <el-button
          type="danger"
          plain
          @click="showDetail = false">关闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="show.authorize"
      class="authorize-dialog"
      :title="dialogTitle"
      @close="closeWithdraw"
      :close-on-click-modal="false"
    >
      <div style="margin-bottom: 10px;">请核对申请人信息:</div>
      <div
        class="img-box"
        :style="{'margin-bottom': toAuthorize.relationalProofUrls && toAuthorize.relationalProofUrls.length || toAuthorize.meetNoticeUrl ? '10px' : '40px'}"
      >
        <m-img-viewer
          isRequired
          :class="[{'el-image__no-box_shadow': !toAuthorize.idCardFront}]"
          :url="toAuthorize.idCardFront"
          :toolbar="{ prev: 1, next: 1 }"
          title="身份证正面照"
        />
        <m-img-viewer
          isRequired
          :class="[{'el-image__no-box_shadow': !toAuthorize.idCardBack}]"
          :url="toAuthorize.idCardBack"
          :toolbar="{ prev: 1, next: 1 }"
          title="身份证背面照"
        />
        <m-img-viewer
          isRequired
          :class="[{'el-image__no-box_shadow': !toAuthorize.avatarUrl}]"
          :url="toAuthorize.avatarUrl"
          :toolbar="{ prev: 1, next: 1 }"
          title="头像"
        />
      </div>
      <template v-if="toAuthorize.relationalProofUrls && toAuthorize.relationalProofUrls.length" >
        <div style="margin-bottom: 10px;">请核对关系证明:</div>
        <div class="img-box">
          <template v-for="relationalProofUrl in toAuthorize.relationalProofUrls" >
            <m-img-viewer
              :style="{ width: relationalWidth }"
              :class="relationalProofUrl.className"
              :key="relationalProofUrl.url"
              :url="relationalProofUrl.url"
              :toolbar="toAuthorize.relationalProofUrls.length === 1 ? {} : { prev: 1, next: 1 }"
              title="关系证明图"
            />
          </template>
        </div>
      </template>
      <template v-if="!!toAuthorize.meetNoticeUrl">
        <div style="margin-bottom: 10px;">可视电话通知单:</div>
        <div class="img-box">
          <m-img-viewer
            :class="[{'el-image__no-box_shadow': !toAuthorize.meetNoticeUrl}]"
            :url="toAuthorize.meetNoticeUrl"
            title="可视电话通知单"
          />
        </div>
      </template>

      <template v-if="isAdvancedAuditor && toAuthorize.changeList">
        <m-multistage-records :values="toAuthorize.changeList"/>
      </template>

      <template v-if="!hasAllPrisonQueryAuth">
        <div
          v-if="!show.agree && !show.disagree && !show.callback && !show.multistageExamine"
          class="button-box">
          <el-button
            plain
            @click="show.agree = true">同意</el-button>
          <el-button
            plain
            @click="show.disagree = true">不同意</el-button>
          <!-- 这个监狱开启多级审批并且是初级审核人员 -->
          <el-button
            v-if="!isAdvancedAuditor && haveMultistageExamine"
            plain
            @click="show.multistageExamine = true">提交</el-button>
          <el-button
            type="danger"
            plain
            @click="show.authorize = false">关闭</el-button>
        </div>

        <!-- 提交到二级审批 -->
        <div v-if="show.multistageExamine" class="button-box multistage-examine_button_box">
          <div style="margin-bottom: 10px;">初审意见：</div>

          <el-form
            :model="multistageExamineForm"
            :rules="multistageExamineRule"
            ref="multistageExamineForm"
            class="withdraw-box"
          >
            <el-form-item prop="remarks">
              <el-input
                :autosize="{ minRows: 2 }"
                type="textarea"
                show-word-limit
                maxlength="50"
                placeholder="请输入初审意见"
                v-model="multistageExamineForm.remarks"
              />
            </el-form-item>
          </el-form>
          <el-button
            plain
            :loading="btnDisable"
            @click="onAuthorizeFirstLevel">确认提交二级审批吗？</el-button>
          <el-button
            plain
            @click="onAuthorizeFirstLevelGoBack">返回</el-button>
          <el-button
            type="danger"
            plain
            @click="onFirstLevelClose">关闭</el-button>
        </div>

        <!-- 同意 -->
        <div
          v-if="show.agree"
          class="button-box">
          <el-button
            plain
            :loading="btnDisable"
            @click="onAuthorization('PASSED')">确定申请通过？</el-button>
          <el-button
            plain
            @click="show.agree = false">返回</el-button>
          <el-button
            type="danger"
            plain
            @click="show.authorize = false">关闭</el-button>
        </div>

        <!-- 不同意 -->
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
              :key="index"/>
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
              <!-- <el-input  class="borderNone" type="textarea" maxlength="1000"  :autosize="{ minRows: 1 }" v-model="refuseForm.selectRemark"  :readonly="true"/> -->
              <el-input
               class="bordertop"
                :autosize="{ minRows: 3 ,maxRows:10 }"
                 style="border-top: none;"
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
            @click="onAuthorization('DENIED')">提交</el-button>
          <el-button
            plain
            @click="show.disagree = false">返回</el-button>
          <el-button
            type="danger"
            plain
            @click="closeWithdraw('refuseForm')">关闭</el-button>
        </div>
        <!-- 撤回 -->
        <div
          v-if="show.callback"
          class="button-box">
          <div style="margin-bottom: 10px;">请选择撤回原因</div>
          <div>
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
                maxlength="1000"
                :autosize="{ minRows: 3 }"
                placeholder="请输入撤回理由..."
                v-model="withdrawForm.withdrawReason" />
            </el-form-item>
          </el-form>
          <el-button
            plain
            :loading="btnDisable"
            @click="onAuthorization('WITHDRAW')">提交</el-button>
          <el-button
            type="danger"
            plain
            @click="closeWithdraw('withdrawForm')">关闭</el-button>
        </div>
      </template>
      <template v-if="hasAllPrisonQueryAuth">
        <div class="button-box view-box">
          <el-button
            type="danger"
            plain
            @click="show.authorize = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      :visible.sync="notificationShow"
      title="可视电话告知书"
      width="530px"
      class="authorize-dialog">
      <div class="flex-dialog">
        <div style="width: 100%;"><label>家属姓名：</label><span>{{ notification.familyName }}</span></div>
        <div style="width: 100%;"><label>家属身份证号：</label><span>{{ notification.familyUuid }}</span></div>
        <div style="width: 100%;"><label>与服刑人员关系：</label><span>{{ notification.familyRelationship }}</span></div>
        <div style="width: 100%;"><label>协议编号：</label><span>{{ notification.protoNum }}</span></div>
        <div style="width: 100%;"><label>签署日期：</label><span>{{ notification.signDate }}</span></div>
        <div
          v-show="notification.meetingNotificationUrl"
          class="block__meetingNotificationUrl"
        >
          <label>告知书：</label>

          <m-img-viewer
            :url="notification.meetingNotificationUrl"
            :isLazy="false"
            title="告知书"
          />
        </div>
      </div>
      <el-row :gutter="0">
        <el-button
          class="button-add"
          size="mini"
          type="danger"
          @click="notificationShow = false">关闭</el-button>
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
               class="infinite-list-item">
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
          v-if='content.length>=1'
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
import {
  mapActions,
  mapState,
  mapGetters,
  mapMutations
} from 'vuex'
import prisonFilterCreator from '@/mixins/prison-filter-creator'
import prisons from '@/common/constants/prisons'
import switches from '@/filters/modules/switches'
import registrationDetail from './registration-detail'
import http from '@/service'

import { tokenExcel } from '@/utils/token-excel'

//import { registrationWithdrawOrAnthorinputReason } from '@/common/constants/const'

import moment from 'moment'

import { helper } from '@/utils'

export default {
  components: {
    registrationDetail
  },
  mixins: [prisonFilterCreator],
  data() {
    const { belong } = prisons.PRISONAREA
    const { options } = this.$store.getters.prisonAreaOptions
    return {
      showDetail: false,
      authorizeDetData: {},
      searchItems: {
        name: {
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
        // prisonArea: {
        //   type: 'select',
        //   label: '监区',
        //   options,
        //   belong,
        //   value: ''
        // },
        auditName: {
          type: 'input',
          label: '审核人',
          miss: true
        },
        status: {
          type: 'select',
          label: '审核状态',
          options: this.$store.state.registStatus,
          miss: true,
          // no: ['DENIED'],
          value: ''
        },
        auditAt: {
          type: 'date',
          label: '审核时间',
          miss: true
        },
        nationality: {
          type: 'select',
          label: '家属类型',
          options: switches['nationality'],
          value: ''
        }
      },
      toAuthorize: {},
      show: {
        authorize: false,
        agree: false,
        disagree: false,
        callback: false,
        multistageExamine: false,
        rejectEdit:false,
        editRebut:true
      },
      withdrawForm: {
        selectRemark:"",
        withdrawReason: ""
      },
      refuseForm: {
        selectRemark:"",
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
      btnDisable: false, // 按钮禁用与启用
      tabs: 'PENDING',
      notificationShow: false,
      dialogTitle: '',

      multistageExamineForm: {
        remarks: ''
      },

      multistageExamineRule: {
        remarks: [
          {
            required: true,

            message: '请输入初审意见'
          }
        ]
      },
      sortObj: {},
      content:[],
      updateer:'',
      contentId:"",
      isform:false
    }
  },
  watch: {
    tabs(val) {
      this.$refs.search.onSearch('tabs')
      if (val !== 'first') {
        if ( val === 'DENIED,WITHDRAW' ) {
          delete this.filter.status
          this.searchItems.status.miss = false
          this.searchItems.status.options = this.$store.state.refuseStatus
        }
        if (val === '') {
          delete this.filter.status
          this.searchItems.status.miss = false
          this.searchItems.status.options = this.$store.state.unusualStatus
        }
        else {
          this.searchItems.status.miss = true
        }
        this.searchItems.auditAt.miss = true
        delete this.filter.auditName
        delete this.filter.auditAt
        this.searchItems.auditName.value = ''
        this.searchItems.auditAt.value = ''
        this.searchItems.status.value = ''
      }
      else {
        delete this.filter.status
        this.searchItems.status.value = ''
        this.searchItems.status.miss = false
        this.searchItems.auditName.miss = false
        this.searchItems.auditAt.miss = false
        this.searchItems.status.options = this.$store.state.registStatus
      }
      this.onSearch()
    }
  },
  mounted() {
    this.getDatas()
  },
  computed: {
    ...mapState([
      'registrations',
      'registRemarks',
      'notification',
      'isSuccessFirstLevelAuthorize'
    ]),

    ...mapGetters([
      'isInWhitelist',
      'isAuditor',
      'isAdvancedAuditor',
      'haveMultistageExamine',
      'isShowPhone'
    ]),

    relationalWidth() {
      const widthConstent = {
        0: '0%',
        1: '32%',
        2: '48%',
        3: '32%',
        4: '24%'
      }
      return widthConstent[this.toAuthorize.relationalProofUrls.length]
    }
  },
  methods: {
    ...mapActions([
      'getRegistrations',
      'getRegistrationsAll',
      'authorizeRegistrations',
      'getNotification',
      'getRegistrationNotificationDetail',
      'getRejectEdit',
      'firstLevelAuthorize'
    ]),
    ...mapMutations(['setIsRefreshMultistageExamineMessageBell']),
    refuseFormChange(e){
        let str=""
        e.forEach((item,index)=>{
          if(this.refuseForm.anotherRemarks.includes(item)){
            str +=`${index+1}、${item}。\n`
          }
        })
        this.refuseForm.anotherRemarks+=str
    },
    withdrawFormChange(e){
      let str=""
        e.forEach((item,index)=>{
          if(this.withdrawForm.selectRemark.includes(item)){
            str +=`${index+1}、${item}。\n`
          }
        })
        this.withdrawForm.selectRemark+=str
    },
    // 获取当前驳回原因列表
  async onRejectshow(str,isform){
       let params={}
          params.jailId=JSON.parse(localStorage.getItem('user')).jailId
          params.type=1
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
        this.show.rejectEdit=false
        // if(this.content[0]){
        //   this.remarks.push(this.content[0])
        //   //判断打开的是驳回还是撤回
        //   if(isform){
        //     this.withdrawForm.selectRemark=`1、${this.content[0]}。`
        //   }else{
        //     this.refuseForm.selectRemark=`1、${this.content[0]}。`
        //   }
        // }
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
        type:1,
        content:this.content,
        updateer:JSON.parse(localStorage.getItem('user')).realName,
        jailId:JSON.parse(localStorage.getItem('user')).jailId
        }
        let res = await http.setRejectEdit(params)
        if(res){
          let params={}
              params.jailId=JSON.parse(localStorage.getItem('user')).jailId
              params.type=1
          let res = await http.getRejectEdit( params )
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
    onAuthorizeFirstLevelGoBack() {
      this.$refs['multistageExamineForm'].clearValidate()

      this.$nextTick(function() {
        this.$set(this.multistageExamineForm, 'remarks', '')
      })

      this.show.multistageExamine = false
    },

    onFirstLevelClose() {
      this.$nextTick(function() {
        this.$set(this.multistageExamineForm, 'remarks', '')
      })

      this.$refs['multistageExamineForm'].clearValidate()

      this.show.authorize = false
    },

    async getDatas() {
      if (this.tabs !== 'first') {
        if (this.tabs !== 'DENIED,WITHDRAW' || !this.filter.status) {
          this.filter.status = this.tabs
        }
      }

      const params = { ...this.filter, ...this.pagination }

      if (this.hasAllPrisonQueryAuth) {
        await this.getRegistrationsAll(params)
      }
      else {
        await this.getRegistrations(params)
      }
    },

    async onSearch() {
      if (helper.isEmptyObject(this.sortObj)) this.filter = Object.assign(this.filter, this.sortObj)

      else {
        this.$refs.elTable && this.$refs.elTable.clearSort()
        delete this.filter.direction
        delete this.filter.orderby
      }

      await this.$refs.pagination.handleCurrentChange(1)
    },

    // 获取家属注册详情信息
    async onGetRegistrationDetail(id) {
      let result = {}

      let _authorizeDetData = await http.getRegistrationsDetail({ id })

      if ( _authorizeDetData ) result = this.set_relationalProofUrls(_authorizeDetData)

      return result
    },

    // 点击授权按钮
     async handleAuthorization(e) {
      const { id } = e

      this.toAuthorize = await this.onGetRegistrationDetail(id)

      this.show.agree = false

      this.show.disagree = false

      this.show.callback = false

      this.show.multistageExamine = false

      this.onRejectshow(false,false)
      this.isform=false
     // this.remarks = this.content[0]

      this.show.authorize = true

      this.dialogTitle = '授权'
    },
    onAuthorization(e) {
      this.btnDisable = true
      let params = { id: this.toAuthorize.id, status: e }
      if ((e === 'DENIED' || e === 'WITHDRAW')) {
        if(e === 'DENIED'){
          this.$refs.refuseForm.validate(valid => {
            console.log(this.refuseForm.selectRemark + this.refuseForm.anotherRemarks)
            if (valid) params.remarks =this.refuseForm.selectRemark + this.refuseForm.anotherRemarks.replace(/\s*/g, '')
            else this.btnDisable = false
          })
        }
        if(e === 'WITHDRAW'){
          this.$refs.withdrawForm.validate(valid => {
            if (valid) params.withdrawReason  =this.withdrawForm.selectRemark + this.withdrawForm.withdrawReason.replace(/\s*/g, '')
            else this.btnDisable = false
          })
        }
        if (this.btnDisable) this.handleSubmit(params)
      }
      else this.handleSubmit(params)
    },

    handleSubmit(params) {
      this.authorizeRegistrations(params).then(res => {
        this.btnDisable = false
        if (res) {
          this.onCloseWithdrawDialog()
          this.setIsRefreshMultistageExamineMessageBell(true)
        }
      })
    },

    onCloseWithdrawDialog() {
      this.closeWithdraw()

      this.toAuthorize = {}

      this.getDatas()
    },

    // 提交到二级审批
    async onAuthorizeFirstLevel() {
      try {
        const { id } = this.toAuthorize

        const { remarks } = this.multistageExamineForm

        await this.$refs.multistageExamineForm.validate() &&  (this.btnDisable = true) && await this.firstLevelAuthorize({
          params: {
            id,
            remarks
          },

          url: '/registrations/firstLevelAuthorize',

          mutationName: 'setIsSuccessFirstLevelAuthorize'
        })

        this.btnDisable = false

        if (this.isSuccessFirstLevelAuthorize) this.onCloseWithdrawDialog()
      } catch (err) {
        Promise.reject(err)
      }
    },

    set_relationalProofUrls(authorizeDetData) {
      if ( authorizeDetData ) {
        let _relationalProofUrls = []
        for (let index = 0; index < 4; index++) {
          if (index === 0 && authorizeDetData.relationalProofUrl) _relationalProofUrls.push({ url: authorizeDetData.relationalProofUrl })
          else {
            const num = `relationalProofUrl${ index + 1 }`
            authorizeDetData[num] && _relationalProofUrls.push({ url: authorizeDetData[num] })
          }
        }
        authorizeDetData.relationalProofUrls = _relationalProofUrls
        return authorizeDetData
      }
      return {}
    },

    async handleAuthorDetail(id) {
      this.authorizeDetData = await this.onGetRegistrationDetail(id)

      this.showDetail = true
    },

    // 点击撤回按钮
    async handleCallback(e) {
      const { id } = e

      this.toAuthorize = await this.onGetRegistrationDetail(id)

      this.show.authorize = true

      this.show.agree = false

      this.show.disagree = false

      this.show.callback = true
      this.onRejectshow(false,true)
      this.isform=true

      this.dialogTitle = '撤回'

      if (this.$refs.withdrawForm) this.$refs.withdrawForm.clearValidate()
    },

    closeWithdraw() {
      this.show.authorize = false
      this.remarks = []
      this.withdrawForm.selectRemark=""
      this.refuseForm.selectRemark=""
      this.$set(this.multistageExamineForm, 'remarks', '')
      this.withdrawForm.withdrawReason = this.registrationWithdrawOrAnthorinputReason
      this.refuseForm.anotherRemarks = this.registrationWithdrawOrAnthorinputReason
      if (this.$refs.refuseForm) this.$refs.refuseForm.clearValidate()
      if (this.$refs.withdrawForm) this.$refs.withdrawForm.clearValidate()
      if (this.$refs.multistageExamineForm) this.$refs.multistageExamineForm.clearValidate()
    },

    showSign(row) {
      const { status } = row
      if (status === 'PENDING') {
        const { id } = row
        this.getRegistrationNotificationDetail({ id }).then(res => {
          if (!res) return
          this.notificationShow = true
        })
      }
      else {
        const {
          notifyId,
          id
        } = row

        this.getNotification({
          id: notifyId,
          rid: id
        }).then(res => {
          if (!res) return
          this.notificationShow = true
        })
      }
    },

    onView(e) {
      this.toAuthorize = e
      this.dialogTitle = '查看'
      this.show.authorize = true
    },

    // 下载
    async onDownload(contents) {
      let params,
        type = 'pdf',
        basicMenuName = '关系证明电子文档',
        menuName

      // 下载当前页的
      if (contents === 'all') {
        const dayNow = moment(Date.now()).format('YYYYMMDDHHmmss')

        const passedData = this.registrations.contents.filter(content => content.status == 'PASSED')

        params = this.filterDownloadParams(passedData)

        type = 'zip',

        menuName = `${ basicMenuName }${ dayNow }`
      }

      // 下载单条的
      else {
        const { name } = contents

        params = this.filterDownloadParams([contents])

        menuName = `${ name }${ basicMenuName }`
      }

      await tokenExcel({
        actionName: 'downloadRelationshipFile',
        menuName,
        params,
        type
      })
    },

    // 过滤参数
    filterDownloadParams(data) {
      const paramsKeys = [
        'avatarUrl',
        'idCardBack',
        'idCardFront',
        'meetNoticeUrl',
        'name',
        'prisonerName',
        'relationalProofUrl',
        'relationalProofUrl2',
        'relationalProofUrl3',
        'relationalProofUrl4',
        'relationship'
      ]

      return data.map(item => {
        let filterParams = {}

        paramsKeys.forEach(key => {
          filterParams[key] = item[key]
        })

        return filterParams
      })
    },

    async sortChange({ column, prop, order }) {
      const propOrderByOptions = {
        prisonerName: 'prisoner_name'
      }

      if (!prop || !order) {
        this.sortObj = {}

        delete this.filter.direction

        delete this.filter.orderby
      }
      else {
        if (order === 'descending') this.sortObj.direction = 'desc'

        else if (order === 'ascending') this.sortObj.direction = 'asc'

        this.sortObj.orderby = propOrderByOptions[prop] || prop

        this.filter = Object.assign({}, this.filter, this.sortObj)
      }
      await this.getDatas()
    }
  }
}
</script>

<style lang="stylus">
.borderNone .el-form-item__content{
    display: flex;
    flex-direction: column;
}
</style>
<style type="text/stylus" lang="stylus" scoped>
.cell img
  width 126.8px
  cursor pointer
.withdraw-box
  margin-bottom 8px
.flex-dialog
  display: flex;
  flex-wrap: wrap;
  line-height: 32px;
  label
    display: inline-block;
    width: 120px;
    text-align: right;
.authorize-dialog
  .img-box
    .el-image
      width: 32%;
      height: 110px;
      margin-bottom: 5px;
      >>> img
           width: 100%;
           height: 100%;
           cursor: pointer;
.button-box
  .el-button
    &:first-of-type
      margin-left: 0px !important;
.multistage-examine_button_box
  .el-button
    &:first-of-type
      width: 31% !important;
.view-box
  display: flex;
  flex-direction: row-reverse;
.registration-table
  >>> .el-button + .el-button
        margin-left: 0px;
        margin-top: 5px;
.block__meetingNotificationUrl
  width: 100%;
  display: flex;
  >>> .el-image
    height: auto;


</style>

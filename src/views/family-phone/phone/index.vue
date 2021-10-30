<template>
  <el-row class="row-container" :gutter="0">
    <m-search
      ref="search"
      :items="searchItems"
      @search="onSearch"
    >
      <template v-if="show.isAdd">
        <template slot="append">
          <el-button type="primary" @click="onNewFamily">新增</el-button>
          <m-excel-download
            :path="prisonerHref"
            text="模板"
          />
          <m-excel-upload ref="mExcelUpload" :configs="excelUploadConfigs" />
        </template>
      </template>
       <template slot="append">
        <el-button
          type="primary"
          :loading="downloading"
          @click="onDownloadExcel"
        >导出 Excel</el-button>
       </template>
    </m-search>

    <el-col :span="24">
      <el-tabs v-model="tabs" type="card">
        <template v-for="tab in tabsItems">
          <el-tab-pane
            :key="tab.name"
            :label="tab.label"
            :name="tab.name"
          />
        </template>
      </el-tabs>

      <m-table-new stripe
         :data="tabledate.list"
         :cols="tableCols">
          <template #familyName="{ item, scope }">
                    <template v-if="!scope.row.isReg">
                      <span>{{ item.familyName | asteriskDisplay('asterisk_name') }}</span>
                    </template>
                    <template v-if="scope.row.isReg">
                      <el-button
                        type="text"
                        size="mini"
                        @click="handleQueryFamilyDet(scope.row, item.familyId)"
                      >{{ item.familyName | asteriskDisplay('asterisk_name') }}</el-button>
                    </template>
                </template>

        <template #applyReason="{row}">
           <span style="color:#409EFF;cursor: pointer;" @click="messageDetail(row)">申请理由</span>
        </template>

        <template #operation="{row}">
          <el-button size="mini" v-if="row.aduitDetail=='待审核'&&row.isCheck"  @click="onAuthorize(row)">审核</el-button>
          <el-button type="text" @click="getDetail(row,true)">详情</el-button>
        </template>
      </m-table-new>
    </el-col>

    <m-pagination
      ref="pagination"
      :size="true"
      @onPageChange="getDatas" 
      :total="tabledate.size"
    />

    <el-dialog
      class="authorize-dialog"
      ref="familyInformationDialog"
      :visible.sync="familyInformationVisible"
      :close-on-click-modal="false"
      title="新增亲情电话信息"
      width="40%"
      @close="onCloseFamilyInformationDialog"
    >
      <m-form
        ref="familyInformationDialogForm"
        :items="familyInformationDialogFormItems"
        :values="familyInformationDialogFormValues"
        @cancel="familyInformationVisible = false"
        @submit="onFamilyInformationDialogFormSubmit"
      />
    </el-dialog>
     <el-dialog
      :visible.sync="show.authorize"
      class="authorize-dialog"
      title="审核"
      width='780px'
      @close="closeWithdraw"
      :close-on-click-modal="false"
    >
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
            <p class="detail-message-family" v-if="item.checkState &&index==toShow.logs.length-1">
              <span class="family-name">审核状态</span>
              <span class="family-nameDetail" v-if="item.checkState==1">已通过</span>
              <span class="family-nameDetail" v-if="item.checkState==2">已拒绝</span>
              <span class="family-nameDetail" v-if="item.checkState==3">已提交{{item.nextCheckRole}}审核</span>
            </p>
          </div>
          <div class="detail-content">
            <p class="detail-message-family" >
              <span class="family-name">审核人姓名</span>
              <span class="family-nameDetail">{{item.createName}}</span></p>
              <p class="detail-message-family" >
              <span class="family-name">审核人意见</span>
              <span class="family-nameDetail">{{item.remarks}}</span></p>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
          <div
          v-if="!show.agree&&!show.disagree">
          <repetition-el-buttons :buttonItems="authorizeButtons" />
        </div>
        <div v-if="show.agree" >


          <template v-if="!show.process"> 
          <el-button
            size="mini"
            plain
            @click="onAuthorization('false')">确定通过？</el-button>
          <el-button
            size="mini"
            plain
            @click="goBackAuth()">返回</el-button>
          <el-button
            type="danger"
            size="mini"
            plain
            @click="show.authorize = false">关闭</el-button>
          </template>
            <!--    判断是否是最后一岗位 如果不是最后一岗位 在判断是否有通过结束权限 -->
            <template v-if="show.process">
            
              <el-form ref="form" :model="authApplePhone" label-width="20px">
                 <el-form-item  style="text-align:left;font-size:16px">
                 <el-link :underline="false" style="text-align:left;font-size:15px">审核意见</el-link>
                </el-form-item>
                <el-form-item>
                   <el-input type="textarea" v-model="authApplePhone.remarks"></el-input>
                </el-form-item>
      
              </el-form>
                <label style="display: inline-block;float: left; padding-left: 20px;">
                  <span style="padding-right: 12px;">选择流程节点:</span>
                    <el-select v-model="authApplePhone.nextCheckCode" @change="selectTask" placeholder="请选择流程节点">
                    <el-option
                      v-for="item in selectProcessOption"
                      :key="item.taskCode"
                      :label="item.taskName"
                      :value="item.taskCode">
                    </el-option>
                  </el-select>
                </label>
                  <el-button
                    size="mini"
                    plain
                    @click="onAuthorization(true)">提交审核？</el-button>
                  <el-button
                    size="mini"
                    plain
                    @click="goBackAuth()">返回</el-button>
                  <el-button
                    type="danger"
                    size="mini"
                    plain
                    @click="show.authorize = false">关闭</el-button>
          </template>
        </div>
           <div
        v-if="show.disagree"
        class="button-box logMgCls">
        <div style="margin-bottom: 10px;padding-left: 20px;">请选择驳回原因</div>
      <div style="display: flex;padding-left: 20px;">
            <el-select v-model="remarks" :multiple="true" :multiple-limit='5'  collapse-tags @change="refuseFormChange" style="width:70%;margin-right:10px">
            <el-option
            class="select_edit"
              v-for="(remark,index) in content"
              :value="remark"
              :label="(index+1)+'、'+remark"
              :key="index"/>
          </el-select>
           <el-button
            type="primary"
            :loading="btnDisable"
            @click="onRejectshow('PASSED')">编辑驳回原因</el-button>
          </div>
          <el-form
          style="padding-left:20px"
            :model="refuseForm"
            :rules="withdrawRule"
            ref="refuseForm"
            class="withdraw-box">
            <el-form-item prop="anotherRemarks"  >
               <el-input
                :autosize="{ minRows: 6 ,maxRows:8 }"
                type="textarea"
                show-word-limit
                maxlength="1000"
                placeholder="请输入驳回原因..."
                v-model="refuseForm.anotherRemarks"
              />
            </el-form-item>
          </el-form>
          <el-button
          size="mini"
            :loading="btnDisable"
            @click="deniedAuthorization()">提交</el-button>
          <el-button
            size="mini"
            @click="goBackAuth()">返回</el-button>
          <el-button
            type="danger"
            size="mini"
            @click="show.authorize = false">关闭</el-button>
        </div>
      </span>
    </el-dialog>


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
            <p class="detail-message-family" v-if="item.checkState &&index==toShow.logs.length-1">
              <span class="family-name">审核状态</span>
              <span class="family-nameDetail" v-if="item.checkState==1">已通过</span>
              <span class="family-nameDetail" v-if="item.checkState==2">已拒绝</span>
              <span class="family-nameDetail" v-if="item.checkState==3">已提交{{item.nextCheckRole}}审核</span>
            </p>
          </div>
          <div class="detail-content">
            <p class="detail-message-family" >
              <span class="family-name">审核人姓名</span>
              <span class="family-nameDetail">{{item.createName}}</span></p>
              <p class="detail-message-family" >
              <span class="family-name">审核人意见</span>
              <span class="family-nameDetail">{{item.remarks}}</span></p>
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
  <el-dialog
      class="authorize-dialog upload-dialog"
      ref="uploadDialog"
      title="亲情电话申请信息导入"
      :visible.sync="uploadDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      @open="onOpenUploadDialog"
    >
      <el-row class="el-row__process">
        <el-col :span="20" :offset="2">
          <el-steps
            class="el-steps__upload-process"
            :active="status"
            finish-status="success"
          >
            <template v-for="(tag, index) in $_uploadStepsTabOptions">
              <el-step :key="index" :title="tag.label" />
            </template>
          </el-steps>
        </el-col>

        <el-col class="process-col_tips">
          <span>准备导入数据总计：{{ validatePhoneResult.total }}条</span>

          <span>已用时：{{ spendTime }}秒</span>

          <span>进度：{{ percent }}%</span>
        </el-col>

        <el-col class="process-col_waiting">请稍后...</el-col>
      </el-row>

      <el-dialog
        class="authorize-dialog"
        append-to-body
        custom-class="upload-dialog__inner"
        ref="uploadInnerDialog"
        title="导入结果提示"
        :visible.sync="uploadInnerDialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="onUploadInnerDialogClose"
      >
        <div style="line-height: 30px; margin-top: 10px;">
          <i class="el-icon-success green" style="font-size: 20px;margin-right: 10px;"></i>成功：{{ validatePhoneResult.add_total }}条<br>

          <template v-if="!!validatePhoneResult.error_total">
            <i class="el-icon-error red" style="font-size: 20px; margin-right: 10px;"></i>失败：{{ validatePhoneResult.error_total }}条

            <p style="padding-left: 30px;">原因：上传的Excel文件内容格式有误，请检查文件内容，仔细对照下载的模版数据。</p>

            <p style="padding-left: 30px;">导入失败数据：
              <m-excel-download
                path="/download/localfile"
                :params="{ filepath: validatePhoneResult.filePath }"
                :buttonsProps="excelExportButtonProps"
                text="导入失败的数据.xls"
              />
            </p>
          </template>
        </div>

        <div slot="footer">
          <el-button type="primary" @click="uploadInnerDialogVisible = false">确 定</el-button>
        </div>        
      </el-dialog>
    </el-dialog>

     <el-dialog
      :visible.sync="show.message"
      title="申请理由"
      width="530px"
      class="authorize-dialog">
      <div class="flex-dialog">
        <div class="infinite-list" style="padding:0 20px;min-height:400px;width:100%;text-align:justify;">
          {{ messageContent }}
        </div>
      </div>
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
 <!-- 家属详情 -->
        <family-detail-modal v-model="show.familyModalVisible" :familyData="familyData" />
  </el-row>
</template>

<script>
import prisonFilterCreator from '@/mixins/prison-filter-creator'
import { DateFormat, batchDownloadPublicImageURL } from '@/utils/helper'
import { tokenExcel } from '@/utils/token-excel'
import { mapActions, mapState } from 'vuex'
import familyDetailModal from '@/components/family/family-detail-modal.vue'

import registrationDialogCreator from '@/mixins/registration-dialog-creator'
import Moment from 'moment'
import http from '@/service'

import {
  $likeName,
  $likePrisonerNumber,
  $likePhone
} from '@/common/constants/const'
export default {
  name: 'FamilyPhone_Families',

  mixins: [prisonFilterCreator,registrationDialogCreator],

  components: {
    familyDetailModal
  },

  data() {
   const authApplePhoneInfo={
        applyId:"",
        processInstanceId:"",
        checkState:"",
        remarks:"同意！呈上审批。",
        nextCheckRole:"",
        nextCheckCode:''
      }
     const todayDate = Moment().format('YYYY-MM-DD')
    const oneMonthLater = Moment().add(-7, 'days').format('YYYY-MM-DD')
    const tabsItems = [
      {
        label: '亲情电话申请',
        name: '0'
      },
      {
        label: '已通过',
        name: '1'
      },
      {
        label: '未通过',
        name: '2'
      },
      {
        label: '待审核',
        name: '3'
      }
    ]

    const clearable = true
    return {
      tabsItems,
      familyData: {},
      messageContent:"",
      prisonerHref:`/download/downloadfile?filepath=family_phone_apply_template.xls`,
      src:"",
      tabs: '3',
      todayDate,
      oneMonthLater,
      tabledate:{},
      toShow:{},
      downloading: false,
      selectProcessOption:[],
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

        state: {
          type: 'select',
          label: '审核状态',
          options:[{label: '待审核', value: '0'},{label: '已通过', value: '1'},{label: '未通过', value: '2'}],
          miss: true,
          value:"",
        },
      },

      familyInformationVisible: false,

      familyInformationDialogFormItems: {
        buttons: ['add', 'cancel'],
        formConfigs: {
          labelWidth: '120px'
        },
        criminalNumber: {
          type: 'input',
          label: '罪犯编号',
          rules: ['required'],
          value:'',
          clearable
        },
        criminalName: {
          type: 'input',
          label: '罪犯姓名',
          rules: ['required'],
          value:'',
          clearable
        },
        familyName: {
          type: 'input',
          label: '家属姓名',
          rules: ['required'],
          value:'',
          clearable
        },
         applyReason: {
          type: 'input',
          label: '申请理由',
          rules: ['required'],
          value:'',
          clearable
        }
      },

      authorizeDialogVisible: false,

      excelUploadConfigs: {
        attrs: {
          autoUpload: false,
          limit: 1,
          beforeUpload: this.beforeUpload,
          onChange: this.onChange
        }
      },

      uploadDialogVisible: false,

      status: 0,

      spendTime: 0,

      percent: 0,
      show:{
        isAdd:false,
        message:false,
        disagree: false,
        authorize:false,
        agree: false,
        process:false,
        editRebut:true,
        familyModalVisible:false,
        dialog:false
      },

       refuseForm: {
        selectRemark:"",
        anotherRemarks: ""
      },
      content:[],
      remarks:'',
      updateer:'',
      contentId:"",
      btnDisable: false, // 按钮禁用与启用
      uploadInnerDialogVisible: false,
       withdrawRule: {
        anotherRemarks: [
          {
            validator:(rule,value,callback)=>{
              if(this.refuseForm.anotherRemarks&&this.authApplePhone.remarks){
                  callback()
              }else{
                  callback(new Error('请填写驳回原因'))
              }
            }
          }
        ]
      },
      excelExportButtonProps: {
        attrs: {
          type: 'text'
        }
      },

      familyInformationDialogFormValues: {},
      authApplePhone:{
        applyId:"",
        processInstanceId:"",
        checkState:"",
        remarks:"同意！呈上审批。",
        nextCheckRole:"",
        nextCheckCode:''
      },
      authApplePhoneInfo
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
          prop: 'prisonArea'
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
          label: '申请时间',
           minWidth: 120,
          prop: 'applyTime'
        },
        {
          label: '申请月份',
          prop: 'applyMonth'
        },
        {
          label: '家属姓名',
          prop: 'families',
          ...$likeName,
          className: '',
          desensitizationColsConfigs: {
            keyWord: 'familyId',
            prop: 'familyName',
            desensitizationColSlotName: 'familyName'
          }
        },
        {
          label: '家属电话',
          minWidth: 120,
          prop: 'familyPhone',
          ...$likePhone
        },
        {
          label: '关系',
          prop: 'relationship'
        },
        {
          label: '申请理由',
          slotName: 'applyReason'
        },
        {
          label: '申请状态',
          prop: 'aduitDetail'
        },
        {
          label: '操作',
          slotName: 'operation',
           minWidth: 140,
        }
      ], onlySuperAdminCols = [
        {
          label: '省份',
          prop: 'provinceName'
        },
        {
          label: '监狱名称',
          prop: 'jailName',
          showOverflowTooltip: true
        }
      ]

      if (this.isSuperAdmin) return [ ...onlySuperAdminCols, ...cols ]

      return cols
    }
  },

  watch: {
    tabs(val) {
      delete this.filter.state
      if( val=='0') {
          this.searchItems.state.miss = false
          this.searchItems.state.value= ''
      }else{
        this.searchItems.state.miss = true
      }
      this.onSearch()
    }
  },

  methods: {
    ...mapActions(['uploadFile','resetState']),
     ...mapActions('familyPhone', ['validateUploadPhone']),
        async handleQueryFamilyDet({ criminalNumber, meetingId }, familyId) {
                let _params = {
                    meetingId,
                    criminalNumber,
                    familyId
                }
                    let { data } = await http.getIntraFamilyInfo(_params)

                    if (data && data.family) {
                      const {
                        familyIdCardBack,
                        familyIdCardFront,
                        familyRelationalProofUrl,
                        familyRelationalProofUrl2,
                        familyRelationalProofUrl3,
                        familyRelationalProofUrl4,
                        meetNoticeUrl
                      } = data.family

                      const urls = {
                        familyIdCardBack,
                        familyIdCardFront,
                        familyRelationalProofUrl,
                        familyRelationalProofUrl2,
                        familyRelationalProofUrl3,
                        familyRelationalProofUrl4,
                        meetNoticeUrl
                      }

                      const _key = `familyId_${ familyId }`

                      const URLS = await batchDownloadPublicImageURL(urls, _key)

                      data.family = {
                        ...data.family,
                        ...URLS
                      }
                    }
                    this.familyData = data.family || {}
                    this.show.familyModalVisible = true
            },
      refuseFormChange(e){
        let str=""
         if(!this.refuseForm.anotherRemarks){
            this.refuseForm.anotherRemarks=""
          }
        e.forEach((item,index)=>{
          if(!this.refuseForm.anotherRemarks.includes(item)){
            str +=`${item}。\n`
          }
        })
        this.refuseForm.anotherRemarks+=str
    },
    withdrawFormChange(e){
      let str=""
       if(!this.withdrawForm.withdrawReason){
            this.withdrawForm.withdrawReason=""
          }
        e.forEach((item,index)=>{
          if(!this.withdrawForm.withdrawReason.includes(item)){
            str +=`${item}。\n`
          }
        })
        this.withdrawForm.withdrawReason+=str
    },
    // 获取当前驳回原因列表
  async onRejectshow(str,isform){
       let params={}
          params.jailId=JSON.parse(localStorage.getItem('user')).jailId
          params.type=5
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
        type:5,
        content:this.content,
        updateer:JSON.parse(localStorage.getItem('user')).realName,
        jailId:JSON.parse(localStorage.getItem('user')).jailId
        }
        let res = await http.setIntraRejectEdit(params)
        if(res){
          let params={}
              params.jailId=JSON.parse(localStorage.getItem('user')).jailId
              params.type=5
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
    onAuthorize(e){
       this.getDetail(e)
       this.show.authorize = true
    },
      //覆盖mixin 授权对话框的关闭操作
      onCloseAuthorize() {
        this.show.authorize = false
      },
      //覆盖mixin 授权对话框的同意操作
      onAgreeAuthorize() {
        this.show.agree = true
        this.getSubtask(this.toShow)
        this.buttonLoading = false
      },
      //覆盖mixin 授权对话框的不同意操作
      onDisagreeAuthorize() {
        this.show.disagree = true
        this.getSubtask(this.toShow)
        this.onRejectshow(false)
        this.buttonLoading = false
      },
     closeWithdraw() {
       this.show.disagree = false
       this.remarks=''
       this.show.agree = false
       this.show.authorize=false
       this.toShow={}
       this.authApplePhone=Object.assign( {} ,this.authApplePhone,  this.authApplePhoneInfo)
       this.refuseForm.anotherRemarks=""
       this.refuseForm.anotherRemarks=""
       this.refuseForm.selectRemark=""
        if (this.$refs.refuseForm) this.$refs.refuseForm.clearValidate()
      },
      goBackAuth(){
      this.show.agree = false
      this.show.disagree = false
      this.remarks=''
      this.authApplePhone=Object.assign( {} ,this.authApplePhone,  this.authApplePhoneInfo)
       this.refuseForm.anotherRemarks=""
       this.refuseForm.selectRemark=""
       },
      selectTask(select){
        let obj= this.selectProcessOption.filter(item=>item.taskCode==select)
        this.authApplePhone.nextCheckRole=obj[0].taskName
      },
    async  onAuthorization(type,state=""){
      if(type){
        if(this.authApplePhone.nextCheckCode =='visit.approve.end'){
            this.authApplePhone.checkState=1
        }else{
           if(this.show.process){
             this.authApplePhone.checkState=3
              if(!this.authApplePhone.nextCheckCode){
                  this.$message({
                    showClose: true,
                    message: '请选择流程节点',
                    duration: 2000,
                    type: 'error'
                  })
                return false
                }
            }else{
                 this.authApplePhone.checkState=1
            }
        }
      }else{
           this.authApplePhone.checkState=1
      }
       this.handleSubmit(this.authApplePhone)
      },
      deniedAuthorization(){
           this.authApplePhone.checkState=2
           this.$refs.refuseForm.validate(valid => {
            if(!this.refuseForm.anotherRemarks){
              this.refuseForm.anotherRemarks=""
            }
            if (valid){
              this.authApplePhone.remarks =this.refuseForm.anotherRemarks.replace(/\s*/g, '')
            this.handleSubmit(this.authApplePhone)
           }
          })
      },
     async handleSubmit(authApplePhone){
        let params=authApplePhone
        params.processInstanceId= this.toShow.processInstanceId
       params.applyId=this.toShow.id
       let res= await  http.authPhone(params)
          if (!res) return
          this.getDatas()
          this.closeWithdraw()
      },
     async getSubtask ( e ) {
       this.toShow = e
        let res= await http.getSubtaskPhone({processInstanceId: e.processInstanceId})
          if (!res) return
          this.selectProcessOption = res
          if (this.selectProcessOption.length) {
            this.show.process = true
            this.authApplePhone.nextCheckCode = this.selectProcessOption[0].taskCode
            this.authApplePhone.nextCheckRole = this.selectProcessOption[0].taskCode
          } else {
             this.show.process=false
          }
      },
    async getDetail(e,type=false){
       let res= await http.familyPhoneDetail({ id: e.id })
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
     let res = await http.familyPhoneList({
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

    onNewFamily() {
      this.familyInformationVisible = true
    },

    onOpenUploadDialog() {
      this.$nextTick(() => {
        this.$refs.mExcelUpload.onManualUpload()
      })
    },
      // 导出excel
    async onDownloadExcel() {
     this.downloading = true

      const times = DateFormat(Date.now(),'YYYYMMDDHHmmss'),
        tabItem = this.tabsItems.filter(tabItem => tabItem.name === this.tabs),
        TABName = tabItem[0]['label'],
        actionName = 'familyPhone/exportFamilyPhone',
        params = {
          url: "/msg/parse/familyphone/apply/exportFamilyPhoneApply",
          methods:'post',
          params: { ...this.filter, tab: this.tabs },
          isPrisonInternetGetUrlWay: "getHyUrl"
        }
      await tokenExcel({
        params,
        actionName,
        menuName: `亲情电话申请管理-${ TABName }-${ times }`,
      })

      setTimeout(() => {
        this.downloading = false
      }, 300)
    },

    beforeUpload(file) {
      this.resetState({ validatePhoneResult: {
        add_total: 0,
        error_total: 0,
        filePath: '',
        total: 0
      }})

      let count = 0, index = 0

      // 上次文件的定时器
      const uploadInterver = setInterval(async () => {
        this.status += 1

        this.percent += 15

        this.spendTime += .5

        if (this.status === 4) {
          clearInterval(uploadInterver)

          // 上次文件到服务器
          const isSuccess = await this.uploadFile(file)

          if (!isSuccess) {
            this.onResetAndcloseUploadDialog()

            return
          }

          // 验证excel的定时器
          const validateInterver = setInterval(async () => {
            count ++

            if (count === 1) {
              this.spendTime += 1

              // 验证excel
              const isSuccess = await this.validateUploadPhone(this.uploadResult.path)

              clearInterval(validateInterver)

              if (!isSuccess) {
                this.onResetAndcloseUploadDialog()

                return
              }

              // 模拟完成最后两步
              const processInterver = setInterval(() => {
                index ++

                if (index === 1) {
                  this.percent += 20

                  this.spendTime += 1

                  this.status = this.status + 1

                  clearInterval(processInterver)

                  this.spendTime += 1

                  this.status += 1

                  this.percent = 100
                  setTimeout(() => {
                    this.uploadInnerDialogVisible = true
                  }, 1500)
                } else this.spendTime += 1
              }, 1000)
            } else this.spendTime += 1
          }, 1000)
        } else this.spendTime += 1
      }, 500)

      return false
    },

    onChange(file) {
      if (this.uploadDialogVisible) return

      if (file) {
        this.uploadDialogVisible = true
      }
    },


    // 关闭对话框
    onCloseFamilyInformationDialog() {
      this.$refs.familyInformationDialogForm && this.$refs.familyInformationDialogForm.onCancel()
    },

    // 重制上传的参数关闭对话框
    onResetAndcloseUploadDialog() {
      this.spendTime = 0

      this.percent = 0

      this.status = 0

      this.uploadDialogVisible = false
    },
      // 内层提示对话框关闭的回调方法
    onUploadInnerDialogClose() {
      setTimeout(() => {
        this.onResetAndcloseUploadDialog()
      }, 1000)
    },
    async onFamilyInformationDialogFormSubmit(data) {
      if (data) {
        let res= await http.familyPhoneAdd(data)
          if (!res) return
          setTimeout(() =>{
            this.onCloseFamilyInformationDialog()
            this.getDatas()
          }, 1000)
      }else{
        this.$message({
            showClose: true,
            message: '未编辑信息，无须提交审批！',
            duration: 2000,
            type: 'error'
          })
      }
    },
  },
  created() {
      this.filterInit = Object.assign({}, this.filterInit, {
        startTime: this.oneMonthLater,
        endTime: this.todayDate
      })
    },
  mounted() {
    this.show.isAdd=this.$store.state.account.authorities.findIndex(item=>item==`visit.family-phone.phone-jail.add`)==-1?false:true
     this.$set(this.searchItems.applicationDate, 'value', [this.oneMonthLater, this.todayDate])
    this.getDatas()
  }
}
</script>
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

<style lang="scss" scoped>
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

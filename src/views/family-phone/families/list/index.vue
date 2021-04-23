<template>
  <el-row class="row-container" :gutter="0">
    <m-search
      ref="search"
      :items="searchItems"
      @searchSelectChange="searchSelectChange"
      @search="onSearch"
    >
      <template v-if="!isSuperAdmin">
        <template slot="append">
          <el-button
            v-permission="$_operationAuthorizations['_familyPhoneFamiliesSubPrisonAreaAuth']"
            type="primary"
            @click="onNewFamily"
          >新增</el-button>

          <m-excel-download
            v-permission="$_operationAuthorizations['_familyPhoneFamiliesSubPrisonAreaAuth']"
            path="/download/downloadfile"
            :params="{ filepath: 'family_phone_manage_template.xls' }"
            text="模板"
            :apiConfigs="{
              apiHostKey: 'jailApiHost',
              apiPathKey: 'temp'
            }"
          />

          <m-excel-upload
            v-permission="$_operationAuthorizations['_familyPhoneFamiliesSubPrisonAreaAuth']"
            ref="mExcelUpload"
            :configs="excelUploadConfigs"
          />   
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

      <m-table-new
        stripe
        :cols="tableCols"
        :data="familiesPaged.content"
      >
        <template #familyName="{ row }">
          <el-button
            v-if="!!row.status"
            type="text"
            @click="onViewAuthorizeFamily(row)"
          >{{ row.familyName }}</el-button>

          <span v-else>{{ row.familyName }}</span>
        </template>

        <template #status="{ row }">
          <span :class="[{ 'own-primary': !!row.status }]">{{ row.status | familyPhoneAuthenticationType }}</span>
        </template>

        <template #familyType="{ row }">
          <span v-if="!!row.status">{{ row.familyType | familyTypeOptions }}</span>
        </template>

        <template #aduitDetail="{ row }">{{ row.aduitDetail | familyPhoneCheckType }}</template>

        <template #isPhoneSms="{ row }">{{ row.isPhoneSms | isTrue }}</template>

        <template #operation="{ row }">
          <!-- 待审核/亲情电话标签页 && 审批流过程中的时候 -->
          <template v-if="!isSuperAdmin">
            <!-- 审批流程的最后一级已通过的标签还能再编辑一次 -->
            <!-- isEdit: 当前用户编辑类型 0 未审核编辑 1 已通过最后一个审核人员角色编辑 2 已通过非最后一个审核人员角色编辑 3 不可编辑 -->
            <el-button
              v-if="row.isEdit !== 3"
              type="text"
              @click="onEdit(row)"
            >编辑</el-button>

            <el-button
              v-if="!!row.isCheck"
              type="text"
              @click="onAuthFamily(row)"
            >审核</el-button>
          </template>

          <!-- 详情: 待审核的情况 且当前审批用户 -->
          <el-button
            v-if="!(row.aduitDetail === 0 && !!row.isCheck)"
            type="text"
            @click="onGetDetail(row.id)"
          >详情</el-button>
        </template>
      </m-table-new>
    </el-col>

    <m-pagination
      ref="pagination"
      :total="familiesPaged.totalCount"
      @onPageChange="getDatas"
    />

    <el-dialog
      class="authorize-dialog"
      ref="familyInformationDialog"
      :visible.sync="familyInformationVisible"
      :close-on-click-modal="false"
      title="亲情电话家属信息"
      width="40%"
      @close="onCloseFamilyInformationDialog"
      @open="onOpenFamilyInformationDialog"
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
      title="家属信息"
      class="authorize-dialog"
      :visible.sync="authorizeDialogVisible"
    >
      <el-row :gutter="0">
        <el-col :span="12">
          <el-col :span="24">
            <label>姓名：</label>
            <span>{{ authorizeFamilyDetail.familyName }}</span>
          </el-col>
          <el-col :span="24">
            <label>关系：</label>
            <span>{{ authorizeFamilyDetail.relationship }}</span>
          </el-col>
        </el-col>
      </el-row>

      <div style="margin-bottom: 10px;">家属信息:</div>

      <div class="img-box">
        <m-img-viewer
          isRequired
          :url="authorizeFamilyDetail.idCardFront"
          :toolbar="{ prev: 1, next: 1 }"
          title="身份证正面照"
        />

        <m-img-viewer
          isRequired
          :url="authorizeFamilyDetail.idCardBack"
          :toolbar="{ prev: 1, next: 1 }"
          title="身份证背面照"
        />

        <m-img-viewer
          isRequired
          :url="authorizeFamilyDetail.avatarUrl"
          :toolbar="{ prev: 1, next: 1 }"
          title="头像"
        />
      </div>

      <template v-if="
        authorizeFamilyDetail.relationalProofUrl ||
        authorizeFamilyDetail.relationalProofUrl2 ||
        authorizeFamilyDetail.relationalProofUrl3 ||
        authorizeFamilyDetail.relationalProofUrl4"
      >
        <div style="margin-bottom: 10px;">关系证明:</div>

        <div class="img-box">
          <m-img-viewer
            v-if="authorizeFamilyDetail.relationalProofUrl"
            class="relation_img"
            :url="authorizeFamilyDetail.relationalProofUrl"
            title="关系证明图"
          />

          <m-img-viewer
            v-if="authorizeFamilyDetail.relationalProofUrl2"
            class="relation_img"
            :url="authorizeFamilyDetail.relationalProofUrl2"
            title="关系证明图"
          />

          <m-img-viewer
            v-if="authorizeFamilyDetail.relationalProofUrl3"
            class="relation_img"
            :url="authorizeFamilyDetail.relationalProofUrl3"
            title="关系证明图"
          />

          <m-img-viewer
            v-if="authorizeFamilyDetail.relationalProofUrl4"
            class="relation_img"
            :url="authorizeFamilyDetail.relationalProofUrl4"
            title="关系证明图"
          />
        </div>
      </template>

      <template v-if="authorizeFamilyDetail.meetNoticeUrl">
        <div style="margin-bottom: 10px;">可视电话通知单:</div>

        <div class="img-box">
          <m-img-viewer :url="authorizeFamilyDetail.meetNoticeUrl" title="可视电话通知单" />
        </div>
      </template>
    </el-dialog>

    <el-dialog
      class="authorize-dialog upload-dialog"
      ref="uploadDialog"
      title="亲情电话家属信息导入"
      :visible.sync="uploadDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      @open="onOpenUploadDialog"
    >
      <el-row>
        <el-col :span="20" :offset="2">
          <el-steps
            :active="status"
            finish-status="success"
            style="margin: 20px 0px"
          >
            <el-step
              v-for="(tag, index) in tabMapOptions"
              :key="index"
              :title="tag.label"
            />
          </el-steps>
        </el-col>

        <el-col class="process-col_tips">
          <span>准备导入数据总计：{{ validateFamiliesResult.total }}条</span>

          <span>已用时：{{ spendTime }}秒</span>

          <span>进度：{{ percent }}%</span>
        </el-col>

        <el-col class="process-col_waiting">请稍后...</el-col>
      </el-row>

      <el-dialog
        class="authorize-dialog"
        append-to-body
        ref="uploadInnerDialog"
        title="导入结果提示"
        :visible.sync="uploadInnerDialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="onUploadInnerDialogClose"
      >
        <div style="line-height: 30px; margin-top: 10px;">
          <i class="el-icon-success green" style="font-size: 20px;margin-right: 10px;"></i>成功：{{ validateFamiliesResult.add_total }}条<br>

          <template v-if="!!validateFamiliesResult.error_total">
            <i class="el-icon-error red" style="font-size: 20px; margin-right: 10px;"></i>失败：{{ validateFamiliesResult.error_total }}条

            <p style="padding-left: 30px">原因：上传的Excel文件内容格式有误，请检查文件内容，仔细对照下载的模版数据。</p>

            <p style="padding-left: 30px">导入失败数据：
              <m-excel-download
                path="/download/localfile"
                :params="{ filepath: validateFamiliesResult.filePath }"
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
      class="authorize-dialog detail-dialog"
      ref="detailOrAuthDialog"
      :visible.sync="detailOrAuthDialog.dialogVisible"
      :title="detailOrAuthDialogTitle"
      :close-on-click-modal="!!detailOrAuthDialogType"
    >
      <m-multistage-records
        :basicValues="multistageRecordsBasicValues"
        :values="multistageRecordsValues"
        :hasSlot="!isEmpty(multistageRecordsLastValue)"
        :recordContentItems="multistageRecordContentItems"
        :keys="multistageRecordKeys"
      >
        <template v-if="!isEmpty(multistageRecordsLastValue)" #append> 
          <div class="multistage_examine-item">
            <div class="detail-index">{{ multistageRecordsValues.length + 1 }}</div>

            <div class="detail-content">
              <p class="detail-message-family detail-audit">
                <span class="family-name audit-label label">审核员账号</span>

                <span class="family-nameDetail audit-value">{{ multistageRecordsLastValue['createRole'] }}</span>
              </p>

              <p class="detail-message-family detail-advices">
                <span class="family-name advices-label">审核意见</span>

                <span class="family-nameDetail advices-value">{{ multistageRecordsLastValue['remarks'] }}</span>
              </p>

              <p class="detail-message-family item-no-bottom detail-audit">
                <span class="family-name audit-label label">审核状态</span>

                <span class="family-nameDetail audit-value">{{ multistageRecordsLastValue['remarks'] }}</span>
              </p>
            </div>

            <div class="detail-content time-status">
              <p class="detail-message-family detail-audit-time">
                <span class="family-name audit-time-label">审核人姓名</span>

                <span class="family-nameDetail audit-time-value">{{ multistageRecordsLastValue['createUser'] }}</span>
              </p>

              <p class="detail-message-family detail-status">
                <span class="family-name status-label">审核时间</span>

                <span class="family-nameDetail status-value">{{ multistageRecordsLastValue['createAt'] }}</span>
              </p>

              <p class="detail-message-family item-no-bottom detail-advices">
                <span class="family-name advices-label">&nbsp;</span>

                <span class="family-nameDetail advices-value" />
              </p>
            </div>
          </div>
        </template>
      </m-multistage-records>

      <div v-if="!detailOrAuthDialogType && !detailOrAuthDialog.agree && !detailOrAuthDialog.disAgree" class="button-box">
        <repetition-el-buttons :buttonItems="authorizeButtons" />
      </div>

      <!-- 同意的情况 -->
      <template v-if="detailOrAuthDialog.agree">
        <!-- 审批结束 -->
        <div v-if="!isSubtask" class="button-box">
          <repetition-el-buttons :buttonItems="showAgreeButtons" />
        </div>

        <!-- 审批流程中 -->
        <div v-else class="button-box">
          <m-form
            ref="agreeHasSubTaskForm"
            :items="agreeHasSubTaskFormItems"
            :values="agreeHasSubTaskFormValues"
            @submit="onAgreeHasSubTaskFormSubmit"
          >
            <template #agreeButtons>
              <repetition-el-buttons :buttonItems="showAgreeHasSubTaskButtons" />
            </template>
          </m-form>
        </div>
      </template>

      <!-- 不同意的情况 -->
      <div v-if="detailOrAuthDialog.disAgree" class="button-box logMgCls">
        <div style="margin-bottom: 10px;text-align: left;">请选择驳回原因</div>

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

        <repetition-el-buttons :buttonItems="showDisagreebuttons" />
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="show.rejectEdit"
      title="编辑"
      width="530px"
      @close="changeClose"
      class="authorize-dialog">
      <div class="flex-dialog" v-if="show.editRebut">
        <ul class="infinite-list" style="margin-left:20px;min-height:400px;width:100%">
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

  </el-row>
</template>

<script>
import {
  mapGetters,
  mapActions,
  mapState
} from 'vuex'

import prisonFilterCreator from '@/mixins/prison-filter-creator'

import isEqual from 'lodash/isEqual'

import cloneDeep from 'lodash/cloneDeep'

import validator from '@/utils'

import http from '@/service'

import { tokenExcel } from '@/utils/token-excel'

import { DateFormat } from '@/utils/helper'

import registrationDialogCreator from '@/mixins/registration-dialog-creator'

import isEmpty from 'lodash/isEmpty'
export default {
  name: 'FamilyPhone_Families_List',

  mixins: [prisonFilterCreator, registrationDialogCreator],

  data() {
    const tabsItems = [
      {
        label: '亲情电话',
        name: 'first'
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
        name: '0'
      }
    ]

    const clearable = true
    return {
      tabsItems,

      tabs: '0',

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

        status: {
          type: 'select',
          label: '认证情况',
          options: this.$store.state.familyPhoneAuthenticationType
        },

        aduitDetail: {
          type: 'select',
          label: '审核状态',
          options: this.$store.state.familyPhoneCheckType,
          miss: false
        },

        isPhoneSms: {
          type: 'select',
          label: '可否接听亲情电话',
          noPlaceholder: true,
          options: this.$store.state.isTrue,
          miss: false
        },

        isMore: {
          type: 'select',
          label: '是否超3位家属',
          noPlaceholder: true,
          options: this.$store.state.isTrue,
          miss: false
        }
      },

      familyInformationVisible: false,

      familyInformationDialogFormItems: {
        buttons: ['add', 'cancel'],

        formConfigs: {
          labelWidth: '120px'
        },

        familyName: {
          type: 'input',
          label: '家属姓名',
          rules: ['required'],
          clearable
        },

        familyPhone: {
          type: 'input',
          label: '家属电话',
          rules: ['required'],
          clearable
        },

        criminalName: {
          type: 'input',
          label: '罪犯姓名',
          rules: ['required'],
          clearable
        },

        criminalNumber: {
          type: 'input',
          label: '罪犯编号',
          rules: ['required'],
          clearable
        },

        relationship: {
          type: 'input',
          label: '关系',
          rules: ['required'],
          clearable
        },

        isReplace: {
          type: 'select',
          label: '是否替换已有家属',
          rules: ['required'],
          options: this.$store.state.isTrue,
          value: 1,
          controlTheOther: true,
          controlProps: ['replaceName'],
          func: this.onReplaceFamilyChange
        },

        replaceName: {
          type: 'input',
          label: '被替换家属姓名',
          dependingRelation: false,
          disableDependingProp: 'isReplace',
          changeRules: [{
            message: '请输入被替换家属姓名',
            validator: validator.required,
            required: true
          }],
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

      tabMapOptions: [
        { label: '读取excel' },
        { label: '解析excel' },
        { label: '初始化数据' },
        { label: '校验数据' },
        { label: '导入数据' },
        { label: '导入完成' }
      ],

      uploadInnerDialogVisible: false,

      excelExportButtonProps: {
        attrs: {
          type: 'text'
        }
      },

      familyInformationDialogFormValues: {},

      familyInformationDialogOperationType: 0, // 0: 新增 1: 编辑

      authorizeFamilyDetail: {},

      downloading: false,

      originalFamilyInformationDialogFormValues: {},

      detailOrAuthDialog: {
        dialogVisible: false,
        agree: false,
        disAgree: false
      },

      multistageRecordsBasicValues: [],

      agreeText: '确定通过？',

      multistageRecordsValues: [],

      multistageRecordsLastValue: {},

      familiesRow: {},

      agreeHasSubTaskFormValues: {},

      multistageRecordContentItems: [
        {
          className: [],

          pItem: {
            className: [],

            items: [
              {
                label: '审核员账号',
                key: 'createRole'
              },

              {
                label: '审核意见',
                key: 'reamrks'
              }
            ]
          }
        },

        {
          className: [],

          pItem: {
            className: [],

            items: [
              {
                label: '审核人姓名',
                key: 'createUser'
              },

              {
                label: '审核时间',
                key: 'createAt'
              }
            ]
          }
        }
      ],
      show:{
        editRebut:true,
        dialog:false
      },
      multistageRecordKeys: {
        createUser: 'createUser',
        createAt: 'createAt',
        createRole: 'createRole',
        reamrks: 'reamrks'
      },
      refuseForm: {
        anotherRemarks: ""
      },
      content: [],
      disArgeeRemarks: "",
      updateer: "",
      contentId: "",
      btnDisable: false, // 按钮禁用与启用
      uploadInnerDialogVisible: false,
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

      detailOrAuthDialogType: 0, // 0: 审核 1： 详情

      agreeHasSubTaskFormFields: {}
    }
  },

  computed: {
    ...mapGetters(['isSuperAdmin', 'isPrisonInternetGetUrlWay']),

    ...mapState({
      uploadResult: state => state.global.uploadResult,
      processInstanceIdSubtaskOptions: state => state.global.processInstanceIdSubtaskOptions
    }),

    ...mapState('familyPhone', [
      'familiesPaged',
      'validateFamiliesResult',
      'familyPhoneFamiliesDetail'
    ]),

    tableCols() {
      const cols = [
        {
          label: '家属姓名',
          slotName: 'familyName'
        },
        {
          label: '家属电话',
          prop: 'familyPhone'
        },
        {
          label: '罪犯姓名',
          prop: 'criminalName'
        },
        {
          label: '罪犯编号',
          prop: 'criminalNumber'
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
          label: '新增或编辑时间',
          minWidth: 120,
          prop: 'updateTime'
        },
        {
          label: '认证情况',
          slotName: 'status'
        },
        {
          label: '家属类型',
          slotName: 'familyType'
        },
        {
          label: '审核状态',
          slotName: 'aduitDetail'
        },
        {
          label: '是否接听电话和发送短信',
          slotName: 'isPhoneSms'
        },
        {
          label: '操作',
          width: '130px',
          slotName: 'operation'
        }
      ], onlySuperAdminCols = [
        {
          label: '省份',
          prop: 'provincesName'
        },
        {
          label: '监狱名称',
          prop: 'jailName',
          showOverflowTooltip: true
        }
      ]

      if (this.isSuperAdmin) return [ ...onlySuperAdminCols, ...cols ]

      return cols
    },

    apiUrls() {
      const urls = {
        pagedUrl: this.isSuperAdmin ? '/familyPhone/findpage' : '/familyPhoneManage/page',

        exportUrl: this.isSuperAdmin ? '/familyPhone/export' : '/parse/familyphone/exportFamilyPhone',

        newOrEditUrl: this.familyInformationDialogOperationType ? '/familyPhoneManage/edit' : '/familyPhoneManage/save',

        detailUrl: this.isSuperAdmin ? '/familyPhone/getDetail' : '/familyPhoneManage/detail'
      }

      return urls
    },

    showAgreeHasSubTaskButtons() {
      return [
        {
          text: '提交审核',

          attrs: {
            plain: true,
            loading: this.buttonLoading
          },

          events: {
            click: this.onPassedAuthorize
          }
        },

        { ...this.goBackButton,
          events: {
            click: this.onAgreeHasSubTaskGoBack
          }
        },

        this.closeButton
      ]
    },

    isSubtask() {
      return !!(this.processInstanceIdSubtaskOptions && Array.isArray(this.processInstanceIdSubtaskOptions) && this.processInstanceIdSubtaskOptions.length)
    },

    agreeHasSubTaskFormItems() {
      return {
        formConfigs: {
          labelWidth: '85px'
        },

        remarks: {
          type: 'textarea',
          noLabel: true,
          placeholder: '请输入审核意见',
          customClass: ['none_margin-left']
        },

        nextCheckCode: {
          type: 'select',
          label: '请选择审核人',
          placeholder: '请选择审核人',
          options: this.processInstanceIdSubtaskOptions,
          customClass: ['inline_block', 'el-form_item-nextCheckCode'],
          props: {
            label: 'taskName',
            value: 'taskCode'
          }
        },

        agreeButtons: {
          slotName: 'agreeButtons',
          customClass: [
            'none_margin-left',
            'inline_block',
            'el-form_item-agreeButtons'
          ]
        }
      }
    },

    detailOrAuthDialogTitle() {
      return this.detailOrAuthDialogType ? '详情' : '审核'
    }
  },

  watch: {
    tabs(tab) {
      const temp = ['1', '0'], hiddenItems = [
        'aduitDetail',
        'isPhoneSms',
        'isMore'
      ]

      if (temp.includes(tab)) {
        hiddenItems.forEach(key => {
          this.$set(this.searchItems[key], 'miss', true)

          delete this.searchItems[key].value

          delete this.filter[key]
        })
      } else if (tab === '2') {
        hiddenItems.forEach(key => {
          this.$set(this.searchItems[key], 'miss', false)
        })

        this.$set(this.searchItems['isMore'], 'miss', true)

        this.$set(this.searchItems['aduitDetail'], 'options', this.$store.state.familyPhoneCheckType.slice(-2))

        delete this.filter['isMore']

        delete this.searchItems['isMore'].value
      } else if (tab === 'first') {
        hiddenItems.forEach(key => {
          this.$set(this.searchItems[key], 'miss', false)
        })

        this.$set(this.searchItems['aduitDetail'], 'options', this.$store.state.familyPhoneCheckType)
      }

      this.$refs.search.onGetFilter()

      this.onSearch()
    }
  },

  methods: {
    ...mapActions([
      'uploadFile',
      'resetState',
      'getSubtaskPhone'
    ]),

    ...mapActions('familyPhone', [
      'getFamiliesPaged',
      'operateFamilyPhoneFamilies',
      'validateUploadFamilies',
      'getFamilyPhoneFamiliesDetail',
      'authFamilyPhoneFamilies'
    ]),

    async getDatas() {
      if (this.tabs !== 'first' && !this.filter.aduitDetail) this.filter.aduitDetail = +this.tabs

      const inputs = {
        url: this.apiUrls['pagedUrl'],
        params: {
          ...this.filter,
          ...this.pagination
        },
        isPrisonInternetGetUrlWay: this.isPrisonInternetGetUrlWay
      }

      await this.getFamiliesPaged(inputs)
    },

    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },

    onEdit(row) {
      this.originalFamilyInformationDialogFormValues = Object.assign({}, row)

      this.familyInformationDialogOperationType = 1

      this.familyInformationVisible = true
    },

    onNewFamily() {
      this.familyInformationDialogOperationType = 0

      this.familyInformationVisible = true
    },

    onOpenUploadDialog() {
      this.$nextTick(() => {
        this.$refs.mExcelUpload.onManualUpload()
      })
    },

    beforeUpload(file) {
      this.resetState({validateUploadFamilies: {
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
              const isSuccess = await this.validateUploadFamilies(this.uploadResult.path)

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

    // 是否替换已有家属 change事件触发
    onReplaceFamilyChange(e, prop, item) {
      this.$set(this.familyInformationDialogFormItems['replaceName'],  'disabled', !e)

      this.$refs.familyInformationDialogForm.resetFieldValue(e, prop, item)
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

    // 提交
    onFamilyInformationDialogFormSubmit(values) {
      const hasNoChange = isEqual(this.originalFamilyInformationDialogFormValues, values)

      if (hasNoChange) {
        this.$message({
          showClose: true,
          message: '未编辑信息，无须提交审批！',
          duration: 2000,
          type: 'error'
        })
      } else {
        (async () => {
          const url = this.apiUrls['newOrEditUrl'], {
            familyPhone,
            relationship,
            id,
            isPhoneSms,
            isEdit
          } = values

          let params = values

          if (this.familyInformationDialogOperationType) {
            params = {
              familyPhone,
              relationship,
              id,
              isPhoneSms,
              isEdit
            }
          }

          await this.operateFamilyPhoneFamilies({ url, params })
        })()
      }

      setTimeout(() =>{
        this.onCloseFamilyInformationDialog()
      }, 1000)
    },

    onOpenFamilyInformationDialog() {
      this.$nextTick(() => {
        let disabledItemKeys = [
          'familyName',
          'criminalName',
          'criminalNumber',
          'relationship'
        ]

        if (this.familyInformationDialogOperationType) {
          // 编辑
          const isPassed = [1, 2]

          const { isEdit } = this.originalFamilyInformationDialogFormValues

          this.familyInformationDialogFormValues = cloneDeep(this.originalFamilyInformationDialogFormValues)

          this.$set(this.familyInformationDialogFormItems, 'buttons', [{
            add: true,
            text: '提交审批'
          }, 'cancel'])

          if (isPassed.includes(isEdit) && disabledItemKeys.includes('relationship')) {
            const index = disabledItemKeys.findIndex(key => key === 'relationship')

            disabledItemKeys.splice(index, 1)

            this.$set(this.familyInformationDialogFormItems['relationship'], 'disabled', false)
          }

          if (isEdit === 1) {
            this.familyInformationDialogFormItems = Object.assign({}, this.familyInformationDialogFormItems, {
              isPhoneSms: {
                type: 'select',
                label: '是否接听亲情电话',
                options: this.$store.state.isTrue,
                value: 1
              }
            })
          }

          delete this.familyInformationDialogFormItems['isReplace']

          delete this.familyInformationDialogFormItems['replaceName']
        } else {
          // 新增
          disabledItemKeys = [...disabledItemKeys, 'replaceName']

          this.familyInformationDialogFormValues = {
            isReplace: 1
          }

          this.familyInformationDialogFormItems = Object.assign({}, this.familyInformationDialogFormItems, {
            isReplace: {
              type: 'select',
              label: '是否替换已有家属',
              rules: ['required'],
              options: this.$store.state.isTrue,
              value: 1,
              controlTheOther: true,
              controlProps: ['replaceName'],
              func: this.onReplaceFamilyChange
            },

            replaceName: {
              type: 'input',
              label: '被替换家属姓名',
              dependingRelation: false,
              disableDependingProp: 'isReplace',
              changeRules: [{
                message: '请输入被替换家属姓名',
                validator: validator.required,
                required: true
              }],
              clearable: true
            }
          })

          this.$set(this.familyInformationDialogFormItems, 'buttons', ['add', 'cancel'])

          delete this.familyInformationDialogFormItems['isPhoneSms']
        }

        disabledItemKeys.forEach(key => {
          if (['replaceName'].includes(key))
            this.$set(
              this.familyInformationDialogFormItems[key],
              'disabled',
              !!this.familyInformationDialogOperationType && !this.familyInformationDialogFormValues['isReplace']
            )

          else this.$set(this.familyInformationDialogFormItems[key], 'disabled', !!this.familyInformationDialogOperationType)
        })

        this.$refs.familyInformationDialogForm && this.$refs.familyInformationDialogForm.onClearValidate()
      })
    },

    // 查看已认证家属的信息
    async onViewAuthorizeFamily(familyInformation) {
      const {
        registrationsId,
        familyName,
        relationship
      } = familyInformation

      const data = await http.getRegistrationsDetail({ id: registrationsId })

      this.authorizeFamilyDetail = Object.assign({}, data, { familyName, relationship })

      this.authorizeDialogVisible = true
    },

    // 导出excel
    async onDownloadExcel() {
      this.downloading = true

      const times = DateFormat(Date.now(),'YYYYMMDDHHmmss'),
        tabItem = this.tabsItems.filter(tabItem => tabItem.name === this.tabs),
        TABName = tabItem[0]['label'],
        actionName = 'familyPhone/exportFamilyPhone',
        params = {
          url: this.apiUrls['exportUrl'],
          params: this.isSuperAdmin ? this.filter : { ...this.filter, tab: this.tabs },
          isPrisonInternetGetUrlWay: this.isPrisonInternetGetUrlWay
        }
      if (this.isSuperAdmin) params['methods'] = 'get'
    console.log(params)
      await tokenExcel({
        params,
        actionName,
        menuName: `亲情电话家属管理-${ TABName }-${ times }`,
      })
      setTimeout(() => {
        this.downloading = false
      }, 300)
    },

    async onInitFamilyDetails(id) {
      const inputs = {
        url: this.apiUrls['detailUrl'],
        params: { id },
        isPrisonInternetGetUrlWay: this.isPrisonInternetGetUrlWay
      }

      await this.getFamilyPhoneFamiliesDetail(inputs)

      const {
        familyName,
        relationship,
        criminalName,
        remarks,
        logs = []
      } = this.familyPhoneFamiliesDetail

      this.multistageRecordsBasicValues = new Array(1).fill({
        familyName,
        relationship,
        criminalName,
        remarks
      })

      this.multistageRecordsValues = this.detailOrAuthDialogType ? logs.slice(1) : logs

      this.multistageRecordsLastValue = this.detailOrAuthDialogType ? (logs.slice(-1)[0] || {}) : {}

      this.$set(this.detailOrAuthDialog, 'dialogVisible', true)
    },

    async onGetDetail(id) {
      this.detailOrAuthDialogType = 1

      await this.onInitFamilyDetails(id)
    },

    async onAuthFamily(row) {
      const { id } = row

      this.familiesRow = Object.assign({}, row)

      this.detailOrAuthDialogType = 0

      await this.onInitFamilyDetails(id)
    },

    async onAgreeAuthorize() {
      const { processInstanceId } = this.familiesRow

      await this.getSubtaskPhone({ processInstanceId })

      if (this.isSubtask) {
        this.agreeHasSubTaskFormValues = {
          remarks: '同意',
          nextCheckCode: this.processInstanceIdSubtaskOptions[0]['taskCode'] || ''
        }
      }

      this.$set(this.detailOrAuthDialog, 'agree', true)
    },

    onCloseAuthorize() {
      this.$refs.agreeHasSubTaskForm && this.$refs.agreeHasSubTaskForm.onClearValidate()

      this.$refs.refuseForm && this.$refs.refuseForm.clearValidate()

      this.$set(this.detailOrAuthDialog, 'dialogVisible', false)

      setTimeout(() => {
        this.$set(this.detailOrAuthDialog, 'agree', false)

        this.$set(this.detailOrAuthDialog, 'disAgree', false)
      }, 200)
    },

    onAgreeAuthorizeGoBack() {
      this.$set(this.detailOrAuthDialog, 'agree', false)
    },

    onDisagreeAuthorizeGoBack() {
      this.$set(this.detailOrAuthDialog, 'disAgree', false)
    },

    isEmpty(input) {
      return isEmpty(input)
    },

    // 同意 提交审批：同意并结束
    async onPassedAuthorize() {
      let inputs = {}

      if (this.isSubtask) {
        this.$refs.agreeHasSubTaskForm && this.$refs.agreeHasSubTaskForm.onSubmit()

        const { remarks, nextCheckCode } = this.agreeHasSubTaskFormFields

        const { taskName = '' } = this.processInstanceIdSubtaskOptions.filter(subtask => subtask.taskCode === nextCheckCode)[0] || {}

        inputs = {
          remarks,
          nextCheckRole: taskName,
          nextCheckCode,
          checkState: nextCheckCode === 'visit.approve.end' ? 1 : 3
        }
      } else {
        inputs = {
          checkState: 1
        }
      }

      await this.onAuthorization(inputs)
    },

    onDeniedSubmit() {
      const { anotherRemarks } = this.refuseForm

      const remarks = anotherRemarks.replace(/\s*/g, '')

      this.$refs.refuseForm.validate(async valid => {
        if (valid) {
          const inputs = {
            checkState: 2,
            remarks
          }

          await this.onAuthorization(inputs)
        }
      })
    },

    onAgreeHasSubTaskGoBack() {
      this.$set(this.detailOrAuthDialog, 'agree', false)
    },

    onDisagreeAuthorize() {
      //获取驳回列表
      this.onRejectshow(false)

      this.disArgeeRemarks = ''

      this.refuseForm.anotherRemarks = ''

      this.buttonLoading = false

      this.$set(this.detailOrAuthDialog, 'disAgree', true)
    },

    refuseFormChange(e){
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
    async onRejectshow(str,isform) {
      let params={}

      params.jailId = JSON.parse(localStorage.getItem('user')).jailId

      params.type = 6

      let res = await http.getIntraRejectEdit( params )

      if (res.content) {
        this.content = res.content

        this.contentId = res.id

        this.updateer = res.updateEr
      } else {
        this.content = []
      }

      if(str === 'PASSED') {
        this.show.rejectEdit = true
      } else {
        this.show.rejectEdit = false
      }
    },

    addReject() {
      this.content.push('')
    },

    removeReject(index) {
      this.content.splice(index,1)
    },

    onRejectEditshow() {
      this.show.editRebut = false
    },

    changeClose() {
      this.onRejectshow(false, this.isform)

      this.show.editRebut = true
    },

    async onSubmitReject() {
      this.content = this.content.filter((res)=>res && res.trim())

      if (this.content.length < 1) {
        this.$message({
          message: '新增编辑内容不能为空',
          type: 'error'
        })

        return false
      } else {
        let params = {
          id: this.contentId,
          type:6,
          content:this.content,
          updateer:JSON.parse(localStorage.getItem('user')).realName,
          jailId:JSON.parse(localStorage.getItem('user')).jailId
        }

        let res = await http.setIntraRejectEdit(params)

        if (res) {
          let params = {}

          params.jailId = JSON.parse(localStorage.getItem('user')).jailId

          params.type = 6

          let res = await http.getIntraRejectEdit(params)

          if (res.content) {
            this.content = res.content
            this.contentId = res.id
            this.updateer = es.updateEr
          } else {
            this.content = []
          }
        }
        this.show.editRebut=true
      }
    },

    async onAuthorization(inputs = {}) {
      const { id, processInstanceId } = this.familiesRow

      const params = {
        ...inputs,
        id,
        processInstanceId
      }

      this.buttonLoading = true

      const result = await this.authFamilyPhoneFamilies(params)

      this.buttonLoading = false

      if (result) {
        this.onCloseAuthorize()

        this.getDatas()
      }
    },

    onAgreeHasSubTaskFormSubmit(value) {
      this.agreeHasSubTaskFormFields = Object.assign({}, value)
    }
  },

  async mounted() {
    await this.getDatas()
  }
}
</script>

<style lang="scss" scoped>
$border-style: 1px solid #E4E7ED;

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
}

.el-upload__excel {
  margin-right: 0px !important;
}

.m-excel-download {
  float: none;
}

.authorize-dialog {
  /deep/ .el-dialog__footer {
    padding: 0px 20px 20px 0px;
  }

  /deep/ .button-box {
    padding-bottom: 0px;
  }
}

.detail-dialog {
  /deep/ .button-box {
    text-align: right;
  }
}

.img-box {
  /deep/ .el-image {
    width: 32%;
    height: 110px;
    margin-bottom: 5px;

    img {
      width: 100%;
      height: 100%;
      cursor: pointer;
    }

    &.relation_img {
      width: 24% !important;
    }
  }
}


.detail-index {
  display: flex;
  width: 12%;
  align-items:center;
  justify-content: center;
  font-size: 13px;
}

.detail-message {
  width: 52%;
}

.detail-message-family {
  display: flex;
  font-size: 12px;
  border-bottom: $border-style;
  .family-name {
    width: 35%;
    background: #F5F7FA;
    text-align: right;
    padding-right: 10px;
    border-right: $border-style;
    border-left: $border-style;
  }
  .family-nameDetail {
    flex: 1;
    padding-left: 10px;
  }

}

.detail-content {
  flex: 1;
  font-size: 12px;
  .family-name {
    background: #F5F7FA;
    padding-right: 10px;
    text-align: right;
    border-right: $border-style;
  }
}

.multistage_examine-main {
  display: flex;
  flex-direction: column;
  border: $border-style;
  margin-bottom: 10px;

  .multistage_examine-item {
    display: flex;
    width: 100%;
  }

  .detail-content {
    flex: 1;
  }

  .item-no-bottom {
    border-bottom: none;
  }

  span {
    font-size: 12px;

    padding: 10px;

    display: flex;

    align-items: center;

    justify-content: center;
  }

  .time-status {
    display: flex;

    flex-direction: column;
    .detail-status {
      flex: 1;
    }
  }

  .border-bottom {
    border-bottom: $border-style;
  }
}

.yt-form {
  /deep/ .none_margin-left {
    .el-form-item__content {
      margin-left: 0px !important;
    }
  }

  /deep/ .inline_block {
    display: inline-block;
    margin-bottom: 0px;
  }

  /deep/ .el-form_item-agreeButtons {
    width: 63.5%;

    button {
      width: 31% !important;
    }
  }

  /deep/ .el-form_item-nextCheckCode {
    width: 36%;
  }
}
</style>

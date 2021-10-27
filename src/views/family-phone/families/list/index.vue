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
        <template v-if="!isSuperAdmin && tabs === '1' && familiesPaged.isCancel">
          <el-button type="primary" @click="onInvalid">作废</el-button>
        </template>

        <el-button
          type="primary"
          :loading="downloading"
          @click="onDownloadExcel"
        >导出 Excel</el-button>

        <template v-if="!isSuperAdmin && tabs === '0'">
          <el-button type="primary" @click="onBatchAuth">审核</el-button>
        </template>
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
        @selection-change="onSelectionChange"
      >
        <template #family="{ row }">
          <el-button
            v-if="!!row.status"
            type="text"
            @click="onViewAuthorizeFamily(row)"
          >{{ row.familyName | asteriskDisplay('asterisk_name') }}</el-button>

          <span v-else>{{ row.familyName | asteriskDisplay('asterisk_name') }}</span>
        </template>

        <template #status="{ row }">
          <span :class="[{ 'own-primary': !!row.status }]">{{ row.status | familyPhoneAuthenticationType }}</span>
        </template>

        <template #familyType="{ row }">
          <span v-if="!!row.status && (row.familyType || row.familyType === 0)">{{ row.familyType | familyTypeOptions }}</span>
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
            :isLazy="false"
          />

          <m-img-viewer
            v-if="authorizeFamilyDetail.relationalProofUrl2"
            class="relation_img"
            :url="authorizeFamilyDetail.relationalProofUrl2"
            title="关系证明图"
            :isLazy="false"
          />

          <m-img-viewer
            v-if="authorizeFamilyDetail.relationalProofUrl3"
            class="relation_img"
            :url="authorizeFamilyDetail.relationalProofUrl3"
            title="关系证明图"
            :isLazy="false"
          />

          <m-img-viewer
            v-if="authorizeFamilyDetail.relationalProofUrl4"
            class="relation_img"
            :url="authorizeFamilyDetail.relationalProofUrl4"
            title="关系证明图"
            :isLazy="false"
          />
        </div>
      </template>

      <template v-if="authorizeFamilyDetail.meetNoticeUrl">
        <div style="margin-bottom: 10px;">可视电话通知单:</div>

        <div class="img-box">
          <m-img-viewer
            :url="authorizeFamilyDetail.meetNoticeUrl"
            title="可视电话通知单"
            :isLazy="false"
          />
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
      :close-on-click-modal="[1].includes(detailOrAuthDialogType)"
      @close="onCloseAuthorize"
    >
      <template v-if="!([2].includes(detailOrAuthDialogType))">
        <m-multistage-records :basicValues="multistageRecordsBasicValues" :hasSlot="!!multistageRecordsValues.length">
          <template v-if="multistageRecordsValues.length" #append>
            <template v-for="(item, index) in multistageRecordsValues">
              <div class="multistage_examine-item" :key="item.id">
                <div :class="['detail-index', { 'border-bottom': index + 1 !== multistageRecordsValues.length }]">{{ index + 1 }}</div>

                <!-- logType: 日志类型 1、审核(作废) 2、修改编辑 -->
                <div class="detail-content">
                  <p class="detail-message-family detail-audit">
                    <template v-if="item.logType === 1">
                      <span class="family-name audit-label label">审核员账号</span>

                      <span class="family-nameDetail audit-value">{{ item['createUser'] }}</span>
                    </template>

                    <template v-else>
                      <span class="family-name audit-label label">操作人姓名</span>

                      <span class="family-nameDetail audit-value">{{ item['createName'] }}</span>
                    </template>
                  </p>

                  <p :class="[
                    'detail-message-family',
                    'detail-advices',
                    { 'item-no-bottom': 
                      index + 1 === multistageRecordsValues.length &&
                      !(item.logType === 1 && ([1, 2].includes(item.checkState) || ([3].includes(item.checkState) && index + 1 === multistageRecordsValues.length))) }
                  ]">
                    <template v-if="item.logType === 1">
                      <template v-if="[1, 2, 3].includes(item.checkState)">
                        <span class="family-name advices-label">审核意见</span>

                        <span class="family-nameDetail advices-value">{{ item['remarks'] }}</span>
                      </template>

                      <template v-else>
                        <span class="family-name advices-label">审核时间</span>

                        <span class="family-nameDetail advices-value">{{ item['createAt'] }}</span>
                      </template>
                    </template>

                    <template v-else>
                      <span class="family-name advices-label">修改内容</span>

                      <span class="family-nameDetail advices-value">{{ item['remarks'] }}</span>
                    </template>
                  </p>

                  <p v-if="item.logType === 1 && ([1, 2].includes(item.checkState) || ([3].includes(item.checkState) && index + 1 === multistageRecordsValues.length))" :class="
                    [
                      'detail-message-family',
                      {'item-no-bottom': index + 1 === multistageRecordsValues.length },
                      'detail-audit'
                    ]"
                  >
                    <span class="family-name audit-label label">审核状态</span>

                    <template v-if="item['checkState'] === 3 && index === multistageRecordsValues.length - 1">
                      <span class="family-nameDetail audit-value">提交{{ item['nextCheckRole'] }}审核</span>
                    </template>

                    <template v-else>
                      <span class="family-nameDetail audit-value">{{ item['checkState'] | familyPhoneDetailTypes }}</span>
                    </template>
                  </p>
                </div>

                <div class="detail-content time-status">
                  <p class="detail-message-family detail-audit-time">
                    <template v-if="item.logType === 1">
                      <span class="family-name audit-time-label">审核人姓名</span>

                      <span class="family-nameDetail audit-time-value">{{ item['createName'] }}</span>
                    </template>

                    <template v-else>
                      <span class="family-name audit-time-label">修改时间</span>

                      <span class="family-nameDetail audit-time-value">{{ item['createAt'] }}</span>
                    </template>
                  </p>

                  <p :class="[
                    'detail-message-family',
                    'detail-status',
                    { 'item-no-bottom':
                      index + 1 === multistageRecordsValues.length &&
                      !(item.logType === 1 && ([1, 2].includes(item.checkState) || ([3].includes(item.checkState) && index + 1 === multistageRecordsValues.length))) }
                  ]">
                    <template v-if="item.logType === 1">
                      <template v-if="[1, 2, 3].includes(item.checkState)">
                        <span class="family-name status-label">审核时间</span>

                        <span class="family-nameDetail status-value">{{ item['createAt'] }}</span>
                      </template>

                      <template v-else>
                        <span class="family-name status-label">审核状态</span>

                        <span class="family-nameDetail audit-value">{{ item['checkState'] | familyPhoneDetailTypes }}</span>
                      </template>
                    </template>

                    <template v-else>
                      <span class="family-name status-label">&nbsp;</span>

                      <span class="family-nameDetail status-value" />
                    </template>
                  </p>

                  <p v-if="item.logType === 1 && ([1, 2].includes(item.checkState) || ([3].includes(item.checkState) && index + 1 === multistageRecordsValues.length))" :class="
                    [
                      'detail-message-family',
                      {'item-no-bottom': index + 1 === multistageRecordsValues.length },
                      'detail-advices',
                      'detail-logType_one'
                    ]"
                  >
                    <span class="family-name advices-label">&nbsp;</span>

                    <span class="family-nameDetail advices-value" />
                  </p>
                </div>
              </div>
            </template>
          </template>
        </m-multistage-records>
      </template>

      <!-- 审核 -->
      <!-- 批量审核: 1.选择的数据是相同的审批流 和直接审核一样的交互 2.不同的审核流 就是后端根据该数据申请时候的审批流 去处理 交互不同 -->
      <!-- 直接审核: 审批逻辑保持不变 -->
      <template v-if="!([1].includes(detailOrAuthDialogType))">
        <div
          v-if="!detailOrAuthDialog.agree && !detailOrAuthDialog.disAgree"
          class="button-box"
          :style="{ textAlign: detailOrAuthDialogType === 2  ? 'center' : 'right' }"
        >
          <repetition-el-buttons :buttonItems="authorizeButtons" />
        </div>

        <!-- 同意的情况 -->
        <template v-if="detailOrAuthDialog.agree">
          <!-- 审批结束 -->
          <!-- 这个交互 -->
          <!-- 单条审批 没有子流程 -->
          <!-- 批量审核 相同审批流数据 没有子流程-->
          <div
            v-if="!isSubtask && !isBatchAuthAndIsNoneSameProcessDefinition"
            class="button-box"
            :style="{ textAlign: (isBatchAuthAndIsNoneSameProcessDefinition || detailOrAuthDialogType === 2 && !isSubtask) ? 'center' : 'right' }"
          >
            <repetition-el-buttons :buttonItems="showAgreeButtons" />
          </div>

          <!-- 审批流程中 -->
          <!-- 单条审核/批量审核 相同审批流 -->
          <!-- 批量审批 不同审批流数据 -->
          <div v-else class="button-box">
            <m-form
              ref="agreeHasSubTaskForm"
              :items="agreeHasSubTaskFormItems"
              :values="agreeHasSubTaskFormValues"
              @submit="onAgreeHasSubTaskFormSubmit"
            >
              
              <template #nextCheckCodeAgreeButtons>
                <template v-if="!isBatchAuthAndIsNoneSameProcessDefinition">
                  <el-select v-model="agreeHasSubTaskFormData.nextCheckCode" placeholder="请选择审核人">
                    <template v-for="item in processInstanceIdSubtaskOptions">
                      <el-option
                        :key="item.taskCode"
                        :label="item.taskName"
                        :value="item.taskCode"
                      />
                    </template>
                  </el-select>
                </template>

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

          <repetition-el-buttons :buttonItems="showDisagreebuttons" />
        </div>
      </template>
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

import { DateFormat, batchDownloadPublicImageURL } from '@/utils/helper'

import registrationDialogCreator from '@/mixins/registration-dialog-creator'

import {
    $likeName,
    $likePrisonerNumber,
    $likePhone
  } from '@/common/constants/const'
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
        name: '-1'
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
          miss: true
        },

        isPhoneSms: {
          type: 'select',
          label: '可否接听亲情电话',
          noPlaceholder: true,
          options: this.$store.state.isTrue,
          miss: true
        },

        isMore: {
          type: 'select',
          label: '是否超3位家属',
          noPlaceholder: true,
          options: this.$store.state.isTrue,
          miss: true
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

      show:{
        editRebut:true,
        dialog:false
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
            validator: (rule, value, callback) => {
              if (this.refuseForm.anotherRemarks) callback()

              else callback(new Error('请填写驳回原因'))
            }
          }
        ]
      },

      detailOrAuthDialogType: 0, // 0: 审核 1： 详情 2: 批量审核

      agreeHasSubTaskFormFields: {},

      agreeHasSubTaskFormData: {
        nextCheckCode: ''
      },

      // 批量审核的数据
      selectionData: []
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

    ...mapState('account', ['publicUserInfo']),

    tableCols() {
      const cols = [
        {
          label: '家属姓名',
          ...$likeName,
          className: '',
          prop: 'familyName',
          desensitizationColSlotName: 'family'
        },
        {
          label: '家属电话',
          prop: 'familyPhone',
          ...$likePhone
        },
        {
          label: '罪犯姓名',
          prop: 'criminalName',
          ...$likeName
        },
        {
          label: '罪犯编号',
          prop: 'criminalNumber',
          ...$likePrisonerNumber
        },
        {
          label: '监区',
          prop: 'prisonArea',
          showOverflowTooltip: true
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
      ], selectCol = {
          type: 'selection',
          selectable: this.selectableFunction
        }

      if (this.isSuperAdmin) return [ ...onlySuperAdminCols, ...cols ]

      else return [ selectCol, ...cols ]
    },

    apiUrls() {
      const urls = {
        pagedUrl: this.isSuperAdmin ? '/familyPhone/findpage' : '/msg/familyPhoneManage/page',

        exportUrl: this.isSuperAdmin ? '/familyPhone/export' : '/parse/familyphone/exportFamilyPhone',

        newOrEditUrl: this.familyInformationDialogOperationType ? '/msg/familyPhoneManage/edit' : '/msg/familyPhoneManage/save',

        detailUrl: this.isSuperAdmin ? '/familyPhone/getDetail' : '/msg/familyPhoneManage/detail'
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
            click: this.onAgreeAuthorizeGoBack
          }
        },

        this.closeButton
      ]
    },

    isSubtask() {
      return !!(this.processInstanceIdSubtaskOptions && Array.isArray(this.processInstanceIdSubtaskOptions) && this.processInstanceIdSubtaskOptions.length)
    },

    agreeHasSubTaskFormItems() {
      let items = {
        formConfigs: {
          labelWidth: '90px'
        },

        remarks: {
          type: 'textarea',
          noLabel: true,
          placeholder: '请输入审核意见',
          customClass: ['none_margin-left']
        },

        // 单条审核/批量审核 相同审批流 才显示
        nextCheckCodeAgreeButtons: {
          slotName: 'nextCheckCodeAgreeButtons',
          customClass: ['el-from_item-nextCheckCodeAgreeButtons'],
          attrs: {
            label: '请选择审核人'
          }
        }
      }

      if (this.isBatchAuthAndIsNoneSameProcessDefinition) this.$set(items['nextCheckCodeAgreeButtons']['attrs'], 'label', ' ')

      return items
    },

    detailOrAuthDialogTitle() {
      const titleTypes = {
        0: '审核',
        1: '详情',
        2: '批量审核'
      }

      return titleTypes[this.detailOrAuthDialogType]
    },

    // 是批量审批操作 并且 审批数据审批流配置不相同
    isBatchAuthAndIsNoneSameProcessDefinition() {
      return (!this.isSameProcessDefinition && this.detailOrAuthDialogType === 2)
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
      } else if (tab === '-1') {
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
      'getSubtaskPhone',
      'getIsSameProcessDefinition'
    ]),

    ...mapActions('familyPhone', [
      'getFamiliesPaged',
      'operateFamilyPhoneFamilies',
      'validateUploadFamilies',
      'getFamilyPhoneFamiliesDetail',
      'authFamilyPhoneFamilies',
      'batchAuthFamilyPhone',
      'batchInvalidFamilyPhone'
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

      this.$refs.familyInformationDialogForm.reclearValidate(e, prop, item)
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
    async onFamilyInformationDialogFormSubmit(values) {
      const _origin_temp = {
        familyPhone: this.originalFamilyInformationDialogFormValues['familyPhone'],
        relationship: this.originalFamilyInformationDialogFormValues['relationship'],
        id: this.originalFamilyInformationDialogFormValues['id'],
        isPhoneSms: this.originalFamilyInformationDialogFormValues['isPhoneSms'],
        isEdit: this.originalFamilyInformationDialogFormValues['isEdit']
      }

      const _values_temp = {
        familyPhone: values['familyPhone'],
        relationship: values['relationship'],
        id: values['id'],
        isPhoneSms: values['isPhoneSms'],
        isEdit: values['isEdit']
      }

      const hasNoChange = isEqual(_values_temp, _origin_temp)

      let isSuccess = false

      if (hasNoChange) {
        this.$message({
          showClose: true,
          message: '未编辑信息，无须提交审批！',
          duration: 2000,
          type: 'error'
        })
      } else {
        let params = values

        const url = this.apiUrls['newOrEditUrl']

        if (this.familyInformationDialogOperationType = 1) {
          const roleName =
            this.publicUserInfo
            && this.publicUserInfo.userRoles
            && Array.isArray(this.publicUserInfo.userRoles)
            && this.publicUserInfo.userRoles.length
            ? this.publicUserInfo.userRoles[0].roleName
            : ''

          params = {
            ...params,
            taskName: this.originalFamilyInformationDialogFormValues['taskName'],
            roleName
          }
        }

        isSuccess = await this.operateFamilyPhoneFamilies({ url, params })
      }

      this.onCloseFamilyInformationDialog()

      if (isSuccess) this.getDatas()
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
          // isEdit: 2 是重新走审批流程的
          // 1，2 是审核通过后的编辑
          // 0 是未授权的编辑
          const isRelationshipEdit = [0, 1]

          const { isEdit } = this.originalFamilyInformationDialogFormValues

          this.familyInformationDialogFormValues = cloneDeep(this.originalFamilyInformationDialogFormValues)

          if (isEdit === 2) {
            this.$set(this.familyInformationDialogFormItems, 'buttons', [{
              add: true,
              text: '提交审批'
            }, 'cancel'])
          } else {
            this.$set(this.familyInformationDialogFormItems, 'buttons', [{
              add: true,
              text: '保存'
            }, 'cancel'])
          }

          if (isRelationshipEdit.includes(isEdit) && disabledItemKeys.includes('relationship')) {
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
          } else delete this.familyInformationDialogFormItems['isPhoneSms']

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

      let data = await http.getRegistrationsDetail({ id: registrationsId })

      if (data) {
        const {
          idCardBack,
          idCardFront,
          relationalProofUrl,
          relationalProofUrl2,
          relationalProofUrl3,
          relationalProofUrl4,
          meetNoticeUrl
        } = data

        const urls = {
          idCardBack,
          idCardFront,
          relationalProofUrl,
          relationalProofUrl2,
          relationalProofUrl3,
          relationalProofUrl4,
          meetNoticeUrl
        }

        const _key = `registrationId_${ registrationsId }`

        const URLS = await batchDownloadPublicImageURL(urls, _key)

        data = {
          ...data,
          ...URLS
        }
      }

      this.authorizeFamilyDetail = Object.assign({}, data || {}, { familyName, relationship })

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

      this.multistageRecordsValues = logs

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
      // 单条审核/批量审核 相同审批流 需要去获取流程
      if (!this.isBatchAuthAndIsNoneSameProcessDefinition) {
        const [child] = this.selectionData

        const { processInstanceId } = this.detailOrAuthDialogType === 2 ? child : this.familiesRow

        await this.getSubtaskPhone({ processInstanceId })

        if (this.isSubtask) this.$set(this.agreeHasSubTaskFormData, 'nextCheckCode' , this.processInstanceIdSubtaskOptions[0]['taskCode'] || '')
      }

      this.agreeHasSubTaskFormValues = {
        remarks: '同意'
      }

      this.$set(this.detailOrAuthDialog, 'agree', true)
    },

    onCloseAuthorize() {
      this.$refs.agreeHasSubTaskForm && this.$refs.agreeHasSubTaskForm.onClearValidate()

      this.$refs.refuseForm && this.$refs.refuseForm.clearValidate()

      this.$set(this.detailOrAuthDialog, 'dialogVisible', false)

      setTimeout(() => {
        this.onAgreeAuthorizeGoBack()

        this.onDisagreeAuthorizeGoBack()
      }, 200)
    },

    onAgreeAuthorizeGoBack() {
      this.$set(this.detailOrAuthDialog, 'agree', false)
    },

    onDisagreeAuthorizeGoBack() {
      this.$set(this.detailOrAuthDialog, 'disAgree', false)
    },

    // 同意 提交审批：同意并结束
    // 不同审批流 批量审批 同意并结束 checkState：1 确定通过 checkState： 3
    async onPassedAuthorize() {
      let inputs = {}

      // 批量审批 不同审批流程
      if (this.isBatchAuthAndIsNoneSameProcessDefinition) {
        const { checkState } = this.agreeHasSubTaskFormValues, { remarks } = this.agreeHasSubTaskFormFields

        inputs = {
          remarks,
          checkState: checkState ? checkState : 3
        }
      } else {
        if (this.isSubtask) {
          this.$refs.agreeHasSubTaskForm && this.$refs.agreeHasSubTaskForm.onSubmit()

          const { remarks } = this.agreeHasSubTaskFormFields

          const { nextCheckCode } = this.agreeHasSubTaskFormData

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

    async onDisagreeAuthorize() {
      //获取驳回列表
      await this.onRejectshow(false)

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
      let params = {}

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

    async changeClose() {
      await this.onRejectshow(false, this.isform)

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
          type: 6,
          content: this.content,
          updateer: JSON.parse(localStorage.getItem('user')).realName,
          jailId: JSON.parse(localStorage.getItem('user')).jailId
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
        this.show.editRebut = true
      }
    },

    // 审批/批量审批
    async onAuthorization(inputs = {}) {
      this.buttonLoading = true

      let result

      // 批量
      if (this.detailOrAuthDialogType === 2) {
        const familyPhoneIdProcessInstanceIdList = this.selectionData.reduce((accumulator, selection) => {
          const {
            id,
            processInstanceId,
            taskName
          } = selection

          const _temp = {
            processInstanceId,
            familyPhoneId: id,
            taskName
          }

          accumulator.push(_temp)

          return accumulator
        } ,[])

        const params = {
          ...inputs,
          familyPhoneIdProcessInstanceIdList
        }

        result = await this.batchAuthFamilyPhone(params)
      }

      // 审核
      if (this.detailOrAuthDialogType === 0) {
        const {
          id,
          processInstanceId,
          taskName
        } = this.familiesRow

        const params = {
          ...inputs,
          familyPhoneId: id,
          processInstanceId,
          taskName
        }

        result = await this.authFamilyPhoneFamilies(params)
      }

      this.buttonLoading = false

      if (result) {
        this.onCloseAuthorize()

        this.getDatas()
      }
    },

    onAgreeHasSubTaskFormSubmit(value) {
      this.agreeHasSubTaskFormFields = Object.assign({}, value)
    },

    // 未选择数据时候的提示文字
    onWarning(message = '请选择要审核的记录') {
      this.$message({
        showClose: true,
        message,
        type: 'warning'
      })
    },

    // 批量审核
    async onBatchAuth() {
      // 审核类型
      if (!this.selectionData.length) this.onWarning()

      else {
        if (this.selectionData.length > 1) {
          const instanceIds = this.selectionData.reduce((accumulator, selection) => {
            const { processInstanceId } = selection

            accumulator = accumulator ? (accumulator + ',' + processInstanceId) : processInstanceId

            return accumulator
          }, '')

          await this.getIsSameProcessDefinition(instanceIds)
        } else this.$store.commit('setIsSameProcessDefinition', true) // 批量选择一条数据 肯定是同一审批流 就不调接口了

        this.detailOrAuthDialogType = 2

        this.$set(this.detailOrAuthDialog, 'dialogVisible', true)
      }
    },

    // 筛选可审核的数据
    // 待审核标签 需要筛选
    // 未通过/亲情电话标签 都不可选择
    // 已通过标签 都可以选择
    selectableFunction(row) {
      const { isCheck } = row

      return (!!isCheck && this.tabs !== 'first') || this.tabs === '1'
    },

    onSelectionChange(selection) {
      this.selectionData = selection
    },

    // 批量作废
    onInvalid() {
      if (!this.selectionData.length) this.onWarning('请选择要作废的记录')

      else {
        this.$confirm('所选数据确认作废吗？', '提示', {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: 'warning',
          closeOnClickModal: false,
          callback: async action => {
            if (action === 'confirm') {
              const params = this.selectionData.reduce((accumulator, selection) => {
                const { id } = selection

                accumulator['list'].push(id)

                return accumulator
              }, { list: [] })

              const result = await this.batchInvalidFamilyPhone(params)

              if (result) await this.getDatas()
            }
          }
        })
      }
    },

    // 批量审批 不同审批流数据 同意并结束按钮
    onBatchAuthHaveDifferentProcessPassedEnd() {
      this.agreeHasSubTaskFormValues = {
        remarks: '同意',
        checkState: 1
      }

      this.$set(this.detailOrAuthDialog, 'agree', true)
    }
  },

  async mounted() {
    await this.getDatas()
  }
}
</script>

<style lang="stylus">
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

.detail-logType_one {
  flex: 1;
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

  /deep/ .el-from_item-nextCheckCodeAgreeButtons {
    .el-form-item__content {
      display: flex;
      .el-row {
        flex: 1 0 72%;

        button {
          width: 30% !important;
          margin-left: 3% !important;
        }
      }
    }
  }
}
</style>

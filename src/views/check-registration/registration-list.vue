<template>
  <el-row class="row-container" :gutter="0">
    <m-excel-download
      v-if="hasAllPrisonQueryAuth"
      path="/download/exportRegistrations"
      :params="filter"
    />

    <m-search
      :items="searchItems"
      ref="search"
      @searchSelectChange="searchSelectChange"
      @search="onSearch"
    >
      <template #append >
        <el-button
          v-if="!hasAllPrisonQueryAuth && ['first', 'PASSED'].includes(tabs)"
          type="primary"
          @click="onDownload('all')"
        >下载关系证明</el-button>
      </template>
    </m-search>

    <el-col :span="24">
      <el-tabs v-model="tabs" type="card">
        <el-tab-pane label="家属注册" name="first" />

        <el-tab-pane label="审核已通过" name="PASSED" />

        <el-tab-pane label="审核未通过" name="DENIED,WITHDRAW" />

        <el-tab-pane label="未授权" name="PENDING" />
      </el-tabs>

      <el-table
        ref="elTable"
        :data="registrations.contents"
        stripe
        class="mini-td-padding registration-table"
        style="width: 100%"
        @sort-change="sortChange"
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
          label="家属姓名"
          show-overflow-tooltip
          min-width="50"
        >
          <template #default="{ row }">
            <el-popover
              popper-class="is-asterisk_display"
              placement="top-start"
              trigger="hover"
              :content="row.name + (row.businessType == 3 ? '（附）' : '')">
              <span slot="reference">{{ row.name | asteriskDisplay('asterisk_name') }}</span>
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column
          v-if="isShowPhone"
          prop="phone"
          min-width="90"
          label="家属电话"
        >
         <template #default="{ row }">
           <el-popover
            popper-class="is-asterisk_display"
            placement="top-start"
            trigger="hover"
            :content="row.phone">
            <span slot="reference">{{ row.phone | asteriskDisplay('asterisk_phone') }}</span>
          </el-popover>
         </template>
        </el-table-column>

        <el-table-column
          label="家属类型"
          prop="domicileName"
          show-overflow-tooltip
          min-width="70"
        />

        <el-table-column label="申请时间" min-width="120">
          <template #default="{ row }"> {{ row.createdAt | Date }} </template>
        </el-table-column>

        <el-table-column
          label="罪犯姓名"
          prop="prisonerName"
          show-overflow-tooltip
          min-width="55"
          sortable="custom"
        >
          <template #default="{ row }">
           <el-popover
              popper-class="is-asterisk_display"
              placement="top-start"
              trigger="hover"
              :content="row.prisonerName">
              <span slot="reference">{{ row.prisonerName | asteriskDisplay('asterisk_name') }}</span>
          </el-popover>
         </template>
        </el-table-column>

        <el-table-column
          label="罪犯编号"
          prop="prisonerNumber"
          show-overflow-tooltip
          min-width="50"
        >
          <template #default="{ row }">
           <el-popover
              popper-class="is-asterisk_display"
              placement="top-start"
              trigger="hover"
              :content="row.prisonerNumber">
              <span slot="reference">{{ row.prisonerNumber | asteriskDisplay('asterisk_prisonerNumber') }}</span>
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column label="管教级别" min-width="70">
          <template #default="{ row }">
           <span v-if="row.level === 1">宽管级</span>

           <span v-if="row.level === 2">普管级</span>

           <span v-if="row.level === 3">考察级</span>

           <span v-if="row.level === 4">严管级</span>
          </template>
        </el-table-column>

        <el-table-column
          label="监区"
          prop="prisonArea"
          show-overflow-tooltip
          min-width="50"
        />

        <el-table-column
          label="关系"
          prop="relationship"
          min-width="50"
          show-overflow-tooltip
        />

        <el-table-column label="家属可视电话告知书" min-width="65">
          <template #default="{ row }">
            <span
              :class="[
                'bold',
                { 'red' : row.notifyId === null },
                { 'green' : row.notifyId !== null }
            ]">{{ row.notifyId !== null ? '已签订' : '未签订' }}</span>

            <el-button
              v-if="row.notifyId !== null"
              type="text"
              size="small"
              @click="showSign(row)"
            >点击查看</el-button>
          </template>
        </el-table-column>

        <el-table-column
          label="申请状态"
          min-width="60"
          class-name="orange"
        >
          <template #default="{ row }"> {{ row.status | registStatus }} </template>
        </el-table-column>

        <el-table-column
          label="审核信息"
          prop="auditRealName"
          min-width="60"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <template v-if="row.auditAt">
              {{ row.auditRealName }} ({{ row.auditUserName }})<br >
              {{ row.auditAt | Date }}
            </template>
          </template>
        </el-table-column>

        <el-table-column label="操作" min-width="60">
          <template #default="{ row }">
            <template v-if="!hasAllPrisonQueryAuth">
              <el-button
                v-if="row.status == 'PENDING' && !(haveMultistageExamine && row.authorizeLevel === 1 && !isAdvancedAuditor)"
                size="mini"
                @click="handleAuthorization(row)"
              >授权</el-button>

              <template v-if="row.status == 'PASSED'">
                <el-button
                  v-if="!!row.canWithdraw"
                  size="mini"
                  @click="handleCallback(row)"
                >撤回</el-button>

                <el-button size="mini" @click="onDownload(row)">下载</el-button>
              </template>

              <el-button
                v-if="!!row.showDetail"
                size="mini"
                @click="handleAuthorDetail(row)">详情
              </el-button>
            </template>

            <el-button
              v-if="hasProvinceQueryAuth"
              size="mini"
              @click="handleAuthorDetail(row)">查看</el-button>
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
      <registration-detail
        :basicContentItems="basicContentItems"
        :basicValues="multistageRecordsBasicValues"
        :toAuthorize="authorizeDetData"
      />

      <div class="button-box view-box">
        <el-button
          type="danger"
          plain
          @click="showDetail = false"
        >关闭</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="show.authorize"
      class="authorize-dialog detail-dialog"
      :title="dialogTitle"
      @close="closeWithdraw"
      :close-on-click-modal="false"
    >
      <div style="margin-bottom: 10px;">请核对申请人信息:</div>

      <div class="img-box" :style="{'margin-bottom': toAuthorize.relationalProofUrls && toAuthorize.relationalProofUrls.length || toAuthorize.meetNoticeUrl ? '10px' : '40px'}">
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

      <m-multistage-records
        :basicValues="multistageRecordsBasicValues"
        :basicContentItems="basicContentItems"
        :values="toAuthorize.changeList"
      />

      <template v-if="!hasAllPrisonQueryAuth">
        <div v-if="!show.agree && !show.disagree && !show.callback && !show.multistageExamine" class="button-box">
          <el-button plain  @click="show.agree = true">同意</el-button>

          <el-button plain @click="show.disagree = true">不同意</el-button>

          <!-- 这个监狱开启多级审批并且是初级审核人员 -->
          <el-button
            v-if="!isAdvancedAuditor && haveMultistageExamine"
            plain
            @click="show.multistageExamine = true"
          >提交</el-button>

          <el-button
            type="danger"
            plain
            @click="show.authorize = false"
          >关闭</el-button>
        </div>

        <!-- 提交到二级审批 -->
        <div v-if="show.multistageExamine" class="button-box multistage-examine_button_box el-row_callback">
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
            :loading="buttonLoading"
            @click="onAuthorizeFirstLevel"
          >确认提交二级审批吗？</el-button>

          <el-button plain @click="onAuthorizeFirstLevelGoBack">返回</el-button>

          <el-button
            type="danger"
            plain
            @click="onFirstLevelClose"
          >关闭</el-button>
        </div>

        <!-- 同意 -->
        <template v-if="show.agree">
          <div class="button-box">
            <el-button
              plain
              :loading="buttonLoading"
              @click="onAuthorization('PASSED')"
            >确定申请通过？</el-button>

            <el-button plain @click="show.agree = false">返回</el-button>

            <el-button
              type="danger"
              plain
              @click="show.authorize = false"
            >关闭</el-button>
          </div>
        </template>

        <!-- 不同意 -->
        <div v-if="show.disagree" class="button-box logMgCls el-row_callback">
          <div style="margin-bottom: 10px;">请选择驳回原因</div>

          <div>
            <el-select
              v-model="remarks"
              style="width:70%; margin-right:10px;"
              :multiple="true"
              :multiple-limit="5"
              collapse-tags
              @change="refuseFormChange"
            >
              <el-option
              class="select_edit"
                v-for="(remark,index) in content"
                :value="remark"
                :label="(index + 1) + '、'+remark"
                :key="index"
              />
            </el-select>

            <el-button type="primary" @click="onRejectshow('PASSED')">编辑驳回原因</el-button>
          </div>

          <el-form
            class="withdraw-box"
            ref="refuseForm"
            :model="refuseForm"
            :rules="withdrawRule"  
          >
            <el-form-item prop="anotherRemarks">
               <el-input
                v-model="refuseForm.anotherRemarks"
                :autosize="{ minRows: 3 ,maxRows:8 }"
                type="textarea"
                show-word-limit
                maxlength="1000"
                placeholder="请输入驳回原因..."
              />
            </el-form-item>
          </el-form>

          <el-button
            plain
            :loading="buttonLoading"
            @click="onAuthorization('DENIED')"
          >提交</el-button>

          <el-button plain @click="show.disagree = false">返回</el-button>

          <el-button
            type="danger"
            plain
            @click="closeWithdraw('refuseForm')"
          >关闭</el-button>
        </div>

        <!-- 撤回 -->
        <div v-if="show.callback" class="button-box logMgCls el-row_callback">
          <div style="margin-bottom: 10px;">请选择撤回原因</div>

          <div>
            <el-select
              v-model="remarks"
              :multiple="true"
              :multiple-limit='5'
              collapse-tags
              @change="withdrawFormChange"
              style="width:70%;margin-right:10px"
            >
              <el-option
              class="select_edit"
                v-for="(remark,index) in content"
                :value="remark"
                :label="(index+1)+'、'+remark"
                :key="index"
              />
            </el-select>

            <el-button type="primary" @click="onRejectshow('PASSED')">编辑驳回原因</el-button>
          </div>

          <el-form
            ref="withdrawForm"
            class="withdraw-box"
            :model="withdrawForm"
            :rules="withdrawRule"
          >
            <el-form-item prop="withdrawReason">
              <el-input
                v-model="withdrawForm.withdrawReason"
                type="textarea"
                show-word-limit
                maxlength="1000"
                :autosize="{ minRows: 3 ,maxRows:8 }"
                placeholder="请输入撤回理由..."
              />
            </el-form-item>
          </el-form>

          <el-button
            plain
            :loading="buttonLoading"
            @click="submitReject"
          >提交</el-button>

          <el-button
            type="danger"
            plain
            @click="closeWithdraw('withdrawForm')"
          >关闭</el-button>
        </div>
      </template>

      <template v-if="hasAllPrisonQueryAuth">
        <div class="button-box view-box">
          <el-button
            type="danger"
            plain
            @click="show.authorize = false"
          >关闭</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      :visible.sync="notificationShow"
      class="authorize-dialog"
      title="可视电话告知书"
      width="530px"
    >
      <div class="flex-dialog">
        <div style="width: 100%;"><label>家属姓名：</label><span>{{ notification.familyName }}</span></div>

        <div style="width: 100%;"><label>家属身份证号：</label><span>{{ notification.familyUuid }}</span></div>

        <div style="width: 100%;"><label>与服刑人员关系：</label><span>{{ notification.familyRelationship }}</span></div>

        <div style="width: 100%;"><label>协议编号：</label><span>{{ notification.protoNum }}</span></div>

        <div style="width: 100%;"><label>签署日期：</label><span>{{ notification.signDate }}</span></div>

        <div v-show="notification.meetingNotificationUrl" class="block__meetingNotificationUrl">
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
          @click="notificationShow = false"
        >关闭</el-button>
      </el-row>
    </el-dialog>

    <el-dialog
      :visible.sync="show.rejectEdit"
      class="authorize-dialog"
      title="编辑"
      width="530px"
      @close="changeClose"
    >
      <div v-if="show.editRebut" class="flex-dialog">
        <ul class="infinite-list" style="margin-left:20px; min-height:400px; width:100%;">
          <li v-for="(item,index) in content"
            :key='index'
            class="infinite-list-item">
            {{ index + 1 }}.{{ item }}
          </li>
        </ul>

        <p style="margin-left:20px;">编辑用户:{{updateer}}</p>
      </div>

      <div
        v-else
        class="infinite-list"
        style="margin-left:20px; min-height:400px"
      >
        <span v-for="(item,index) in content" :key="index">
          <el-input
            v-model="content[index]"
            style="margin-bottom:10px"
            maxlength="200"
            placeholder="请输入内容"
            clearable
          >
            <el-button slot="append" icon="el-icon-close" @click="removeReject(index)" />
          </el-input>
        </span>
      </div>

      <el-row :gutter="0">
        <el-button
          v-if='show.editRebut'
          class="button-add"
          type="primary"
          size="mini"
          @click="onRejectEditshow"
        >编辑</el-button>

        <span v-else>
          <el-button
            v-if='content.length >= 1'
            class="button-add"
            type="primary"
            size="mini"
            @click="onSubmitReject"
          >保存</el-button>

          <el-button
            v-if='content.length<10'
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
  mapActions,
  mapState,
  mapGetters,
  mapMutations
} from 'vuex'
import prisonFilterCreator from '@/mixins/prison-filter-creator'
import prisons from '@/common/constants/prisons'
import { saveAs } from 'file-saver'
import { DateFormat } from '@/utils/helper'
import registrationDetail from './registration-detail'
import http from '@/service'

import { tokenExcel } from '@/utils/token-excel'

//import { registrationWithdrawOrAnthorinputReason } from '@/common/constants/const'

import moment from 'moment'

import { helper } from '@/utils'
import { Message } from 'element-ui'

import registrationDialogCreator from '@/mixins/registration-dialog-creator'
export default {
  components: {
    registrationDetail
  },

  mixins: [prisonFilterCreator, registrationDialogCreator],

  data() {
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
          options: this.$store.state['nationality'],
          value: ''
        },
        level:{
          type: 'select',
          label: '管教级别',
          options: [
            { label: '宽管级', value: 1 },
            { label: '普管级', value: 2 },
            { label: '考察级', value: 3 },
            { label: '严管级', value: 4 }
          ],
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
            validator: (rule,value,callback) => {
              if (this.refuseForm.anotherRemarks) callback()

              else callback(new Error('请填写驳回原因'))
            }
          }
        ],

        withdrawReason: [
          {
            validator:(rule,value,callback) => {
              if (this.withdrawForm.withdrawReason) callback()

              else callback(new Error('请填撤回原因'))
            }
          }
        ]
      },
      remarks: [],
      downloading: false,
      tabs: 'PENDING',
      notificationShow: false,
      dialogTitle: '',

      sortObj: {},
      content:[],
      updateer:'',
      contentId:"",
      isform:false,

      multistageRecordsBasicValues: [],

      basicContentItems: [
        {
          className: [],

          pItem: {
            className: [],

            items: [
              {
                label: '家属姓名',
                key: 'familyName'
              },

              {
                label: '关系',
                key: 'relationship'
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
                label: '罪犯姓名',
                key: 'criminalName'
              },

              {
                label: '',
                key: ''
              }
            ]
          }
        }
      ],

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
      }
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

  async mounted() {
    await this.getDatas()
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
      'firstLevelAuthorize',
      'getSubtaskPhone',
      'getProcessTask'
    ]),

    ...mapMutations(['setIsRefreshMultistageExamineMessageBell']),

    async handleExportExcel() {
      if (this.downloading) return

      this.downloading = true

      const params = Object.assign( { status: this.tab }, { ...this.filter } )

      try {
        let data = await http.exportFamilyRegJails(params)

        saveAs(data, `家属注册列表-${ DateFormat(Date.now(),'YYYYMMDDHHmmss') }.xls`)

        this.downloading = false
      } catch (error) {
        this.downloading = false
      }
    },

    refuseFormChange(e) {
      let str=""

      if(!this.refuseForm.anotherRemarks) this.refuseForm.anotherRemarks = ""

      e.forEach((item,index)=>{
        if(!this.refuseForm.anotherRemarks.includes(item)) str += `${item}。\n`
      })

      this.refuseForm.anotherRemarks+=str
    },

    withdrawFormChange(e){
      let str=""

      if(!this.withdrawForm.withdrawReason) this.withdrawForm.withdrawReason = ""

      e.forEach((item,index)=>{
        if(!this.withdrawForm.withdrawReason.includes(item)) str +=`${item}。\n`
      })

      this.withdrawForm.withdrawReason+=str
    },

    // 获取当前驳回原因列表
    async onRejectshow(str, isform){
      let params = {}
          params.jailId = JSON.parse(localStorage.getItem('user')).jailId
          params.type = 1

      let res = await http.getRejectEdit(params)

      if(res.content) {
        this.content = res.content
        this.contentId = res.id
        this.updateer = res.updateEr
      } else this.content = []

      if(str === 'PASSED') this.show.rejectEdit = true

      else this.show.rejectEdit = false
    },

    addReject(){
      this.content.push('')
    },

    removeReject(index){
      this.content.splice(index,1)
    },

    onRejectEditshow(){
      this.show.editRebut = false
    },

    async changeClose(){
      this.remarks = []

      await this.onRejectshow(false, this.isform)

      this.show.editRebut = true
    },

    async onSubmitReject(){
      this.content=this.content.filter(res=> res && res.trim())

      if(this.content.length < 1) {
        this.$message({
          message: '新增编辑内容不能为空',
          type: 'error'
        });

        return false
      } else {
        let params= {
          id: this.contentId,
          type: 1,
          content: this.content,
          updateer: JSON.parse(localStorage.getItem('user')).realName,
          jailId: JSON.parse(localStorage.getItem('user')).jailId
        }

        let res = await http.setRejectEdit(params)

        if(res) {
          let params={}
              params.jailId=JSON.parse(localStorage.getItem('user')).jailId
              params.type=1

          let res = await http.getRejectEdit(params)

          if(res.content) {
            this.content = res.content
            this.contentId = res.id
            this.updateer = res.updateEr
          } else this.content = []
        }
        this.show.editRebut=true
      }
    },

    async getDatas() {
      if (this.tabs !== 'first') {
        if (this.tabs !== 'DENIED,WITHDRAW' || !this.filter.status) {
          this.filter.status = this.tabs
        }
      }

      const params = { ...this.filter, ...this.pagination }

      if (this.hasAllPrisonQueryAuth) await this.getRegistrationsAll(params)

      else await this.getRegistrations(params)
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
    async onGetRegistrationDetail(row) {
      const {
        id,
        name,
        relationship,
        prisonerName,
        remarks
      } = row

      this.multistageRecordsBasicValues = new Array(1).fill({
        familyName: name,
        relationship,
        criminalName: prisonerName,
        remarks
      })

      let result = {
        changeList: []
      }

      let _authorizeDetData = await http.getRegistrationsDetail({ id })

      if ( _authorizeDetData ) {
        const {
          idCardBack,
          idCardFront,
          relationalProofUrl,
          relationalProofUrl2,
          relationalProofUrl3,
          relationalProofUrl4
        } = _authorizeDetData

        const urls = {
          idCardBack,
          idCardFront,
          relationalProofUrl,
          relationalProofUrl2,
          relationalProofUrl3,
          relationalProofUrl4
        }

        const _key = `registration_${ id }`

        const URLS = await helper.batchDownloadPublicImageURL(urls, _key)

        const input = {
          ..._authorizeDetData,
          ...URLS
        }

        result = this.set_relationalProofUrls(input)
      }

      return result
    },

    // 点击授权按钮
     async handleAuthorization(e) {
      this.toAuthorize = await this.onGetRegistrationDetail(e)

      this.show.agree = false

      this.show.disagree = false

      this.show.callback = false

      this.show.multistageExamine = false

      await this.onRejectshow(false,false)

      this.isform = false
     // this.remarks = this.content[0]

      this.show.authorize = true

      this.dialogTitle = '授权'
    },

    submitReject() {
      this.$confirm('撤回该家属认证后，该家属的所有预约均将取消，请问确认撤回吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          this.onAuthorization('WITHDRAW')
        }).catch(() => {
          this.$message({
          type: 'info',
          message: '已取消撤回'
        });
      });
    },

    onAuthorization(e) {
      this.buttonLoading = true

      let params = { id: this.toAuthorize.id, status: e }

      if ((e === 'DENIED' || e === 'WITHDRAW')) {
        if(e === 'DENIED') {
          this.$refs.refuseForm.validate(valid => {
            if(!this.refuseForm.anotherRemarks) this.refuseForm.anotherRemarks = ""

            if (valid) params.remarks =this.refuseForm.anotherRemarks.replace(/\s*/g, '')

            else this.buttonLoading = false
          })
        }

        if(e === 'WITHDRAW') {
          this.$refs.withdrawForm.validate(valid => {
            if(!this.withdrawForm.withdrawReason) this.withdrawForm.withdrawReason = ""

            if (valid) params.withdrawReason  =this.withdrawForm.withdrawReason.replace(/\s*/g, '')

            else this.buttonLoading = false
          })
        }

        if (this.buttonLoading) this.handleSubmit(params)
      }

      else this.handleSubmit(params)
    },

    handleSubmit(params) {
      this.authorizeRegistrations(params).then(res => {
        this.buttonLoading = false
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

        if (!authorizeDetData.changeList || !Array.isArray(authorizeDetData.changeList)) authorizeDetData.changeList = []

        return authorizeDetData
      }
      return {
        changeList: []
      }
    },

    async handleAuthorDetail(row) {
      this.authorizeDetData = await this.onGetRegistrationDetail(row)

      this.showDetail = true
    },

    // 点击撤回按钮
    async handleCallback(e) {
      this.toAuthorize = await this.onGetRegistrationDetail(e)

      this.show.authorize = true

      this.show.agree = false

      this.show.disagree = false

      this.show.callback = true

      await this.onRejectshow(false, true)

      this.isform=true

      this.dialogTitle = '撤回'

      if (this.$refs.withdrawForm) this.$refs.withdrawForm.clearValidate()
    },

    closeWithdraw() {
      this.show.authorize = false
      this.remarks = []
      this.withdrawForm.selectRemark = ""
      this.refuseForm.selectRemark = ""
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
    },

    // 提交到二级审批
    async onAuthorizeFirstLevel() {
      try {
        const { id } = this.toAuthorize

        const { remarks } = this.multistageExamineForm

        await this.$refs.multistageExamineForm.validate() &&  (this.buttonLoading = true) && await this.firstLevelAuthorize({
          params: {
            id,
            remarks
          },

          url: '/registrations/firstLevelAuthorize',

          mutationName: 'setIsSuccessFirstLevelAuthorize'
        })

        this.buttonLoading = false

        if (this.isSuccessFirstLevelAuthorize) this.onCloseWithdrawDialog()
      } catch (err) {
        Promise.reject(err)
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
    }
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

<style lang="scss" scoped>
.detail-dialog {
  /deep/ .button-box {
    text-align: right;
  }

  /deep/ .el-row_callback {
    text-align: left;
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
          margin-left: 2% !important;
        }
      }
    }
  }
}
</style>

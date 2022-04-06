<template>
  <el-row class="row-container" :gutter="0">
    <template v-if="hasAllPrisonQueryAuth && selectPrisoners.length > 0">
      <m-excel-export
        :filename="prisonerExcelConfig.filename"
        :jsonData="selectPrisoners"
        :header="prisonerExcelConfig.header"
        :filterFields="prisonerExcelConfig.filterFields"
      />
    </template>

    <template v-if="hasAllPrisonQueryAuth && selectPrisoners.length === 0 && filter.jailId">
      <m-excel-download path="/download/exportPrisoners" :params="filter" />
    </template>

    <m-search
      ref="search"
      :items="searchItems"
      @searchSelectChange="searchSelectChange"
      @search="onSearch"
    >
      <template #append>
        <el-row style="margin-bottom: 0px">
          <el-button
            v-if="hasAllPrisonQueryAuth && isPrisonerTabVal"
            type="primary"
            @click="onPreChangePrisonConfigs(7)"
          >转监</el-button>

          <el-button
            v-if="!hasAllPrisonQueryAuth && !isPrisonerTabVal"
            type="primary"
            @click="onMultipleAccept(8)"
          >接收</el-button>
          </el-row>
      </template>
    </m-search>

    <el-row type="flex" style="margin-bottom: 10px">
      <template v-if="!hasAllPrisonQueryAuth && isPrisonerTabVal">
        <m-excel-download
          path="/download/downloadfile"
          :params='{ filepath:"prisoner__leave_import_template.xls" }'
          text="离监模板" style="margin-left: 10px;"
        />

        <m-excel-upload
          ref="mExcelUpload"
          text='导入离监数据'
          @click.native="one(true)"
          :configs="excelUploadConfigs"
          style="margin-left: 10px;"
        />

        <m-excel-download
          path="/download/downloadfile"
          :params='{ filepath:"prisoner__transfer_import_template.xls" }'
          text="转监模板"
          style="margin-left: 10px;"
        />

        <m-excel-upload
          ref="mExcelUploadConfig"
          text='导入转监数据'
          @click.native="one(false)"
          :configs="excelUploadConfigs"
          style="margin-left: 10px;"
        />

        <span style="margin-left: 10px;">
          <el-button type="primary" @click="onPreChangePrisonConfigs(10)">转监</el-button>
          <el-button type="primary" @click="showDelPrionser">离监</el-button>
          <el-button type="primary" @click="onPreChangePrisonConfigs(5)">更换监区</el-button>
          <el-button type="primary" @click="showAddPrisoner">新增</el-button>
        </span>
      </template>
    </el-row>

    <el-col :span="24" class="el-col__no-tabs__margin">
      <el-tabs v-model="tabs" type="card">
        <template v-for="(tab, index) in tabsItems">
          <el-tab-pane
            :key="index"
            :label="tab.label"
            :name="tab.name"
          />
        </template>
      </el-tabs>

        <!-- 自己手写的 不要删了-->
        <!-- <el-table-column>
          <template
            slot="header"
            slot-scope="scope">
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="allSelectionvalue"
              :key="scope.$index"
              @change="handleCheckAllChange"/>
          </template>
          <template slot-scope="scope">
              <el-checkbox 
                v-model="multipleSelection[scope.$index]"
                @change="handleCheckedChange($event, scope)"/>
          </template>
        </el-table-column> -->
      <m-table-new
        stripe
        :data="prisoners.contents"
        @selection-change="handleSelectionChange"
        :cols="tableCols"
        :cell-style="cellRed"
        @sort-change="sortChange"
      >
        <template #accessTime="{ row }">
          <div>
            {{ row.accessTime }}
            <template v-if="!hasAllPrisonQueryAuth">
              <el-button
                :disabled="!row.sysFlag"
                size="small"
                type="text"
                style="margin-left: 5px;"
                @click="onTimeEdit(row, 'accessTime')"
              >修改</el-button>
            </template>
          </div>
        </template>

        <template #smsNum="{ row }">
          <div>
            <span>{{ row.smsNum }}</span>

            <template v-if="!hasAllPrisonQueryAuth">
              <el-button
                :disabled="!row.sysFlag"
                size="small"
                type="text"
                style="margin-left: 5px;"
                @click="onTimeEdit(row, 'smsNum')"
              >修改</el-button>
            </template>
          </div>
        </template>
        
       <template #level="{ row }">
         {{ row.level | level }}
        </template>

        <template #prisonTerm="{ row }">
          <span class="separate">{{ row.prisonTermStartedAt | dateFormate }}</span>

          <span class="separate">{{ row.prisonTermEndedAt | dateFormate }}</span>
        </template>

        <template #prisonerStatus="{ row }">
          <template v-if="!row.sysFlag">
            <span>删除原因：{{ row.deleteReason }}</span>
          </template>

          <template v-else-if="row.isBlacklist">
            <span>黑名单原因：{{ row.reason }}</span>
          </template>
        </template>

        <template #families="{ item }">
          <el-button
            type="text"
            size="small"
            style="margin-left: 0px; margin-right: 8px;"
            @click="showFamilyDetail(item)"
          >{{ item.familyName | asteriskDisplay('asterisk_name') }}</el-button>
        </template>

        <template #notifyId="{ row }">
          <span :class="[
            'bold',
            { 'red' : !row.notifyId },
            { 'green' : row.notifyId }]">{{ row.notifyId ? '已签订' : '未签订' }}</span>

          <el-button
            type="text"
            size="small"
            :disabled="!row.sysFlag"
            @click="handleSign(row.notifyId, row)"
          >{{ row.notifyId ? '点击查看' : '点击签约' }}</el-button>
        </template>

        <template #type="{ row }">
          {{ row.type | transferOutPrisonersTypeOptions}}
        </template>

        <template #operations="{ row }">
          <template v-if="isPrisonerTabVal">
            <template v-if="!hasAllPrisonQueryAuth">
              <template v-if="!row.isBlacklist">
                <el-button
                  type="text"
                  size="small"
                  :disabled="!row.sysFlag"
                  @click="showPrisonerDet(row)"
                >详情</el-button>

                <el-button
                  type="text"
                  size="small"
                  :disabled="!row.sysFlag"
                  @click="showBlackList(row)"
                >加入黑名单</el-button>
              </template>

              <template v-else>
                <el-button
                  type="text"
                  size="small"
                  :disabled="!row.sysFlag" 
                  @click="removeBlackList(row)"
                >移出黑名单</el-button>
              </template>

              <el-button
                type="text"
                size="small"
                :disabled="!row.sysFlag"
                @click="onShowPrisonConfig(row, 2)"
              >更换监区</el-button>
            </template>

            <template v-else>
              <el-button
                type="text"
                size="small"
                :disabled="!row.sysFlag"
                @click="onShowPrisonConfig(row, 6)"
              >更换监狱</el-button>
            </template>
          </template>

          <template v-else>
            <el-button
              v-if="row.type === 2"
              type="text"
              size="small"
              @click="onAbortChangePrisoners(row.prisonerId)"
            >取消</el-button>

            <el-button
              v-else
              type="text"
              size="small"
              @click="onSingleAccept(9, row)"
            >接收</el-button>
          </template>
        </template>
      </m-table-new>
    </el-col>

    <m-pagination
      ref="pagination"
      :total="prisoners.total"
      @onPageChange="getDatas"
    />

    <el-dialog
      :title="timesDialogTitle"
      :visible.sync="isEditTime"
      :close-on-click-modal="false"
      class="authorize-dialog"
      @open="onTimeOpen"
    >
      <el-form
        ref="form"
        :model="prisoner"
        label-width="100px"
      >
        <el-form-item label="罪犯">{{ prisoner.name }}</el-form-item>

        <el-form-item
          v-if="timesDialogType === 'accessTime'"
          label="通话次数"
          :rules="[{ required: true, message: '请输入通话次数' }]"
          prop="accessTime"
        >
          <el-input-number
            :min="0"
            v-model="prisoner.accessTime"
            controls-position="right"
            @change="onTimesChange"
          />
        </el-form-item>

        <!-- <el-form-item
          v-if="timesDialogType === 'smsNum'"
          label="短信次数"
          :rules="[{ required: true, message: '请输入短信次数' }]"
          prop="smsNum"
        >
          <el-input-number
            :min="0"
            v-model="prisoner.smsNum"
            controls-position="right"
            @change="onTimesChange"
          />
        </el-form-item> -->
      </el-form>
       <template >
        <el-row :gutter="0">
         <el-button
          class="button-add"
          size="mini"
          type="danger"
          @click="onTimeClose"
        >取消</el-button>

          <el-button
          class="button-add"
          size="mini"
          type="primary" 
          @click="onTime">
        确定</el-button>
        </el-row>
      </template>
    </el-dialog>

    <el-dialog
      title="家属信息"
      class="authorize-dialog"
      :visible.sync="dialogTableVisible"
    >
      <el-row :gutter="0">
        <el-col :span="12">
          <el-col :span="24">
            <label for="">姓名：</label>
            <span>{{ family.familyName }}</span>
          </el-col>
          <el-col :span="24">
            <label for="">关系：</label>
            <span>{{ family.relationship }}</span>
          </el-col>
        </el-col>
      </el-row>

      <div style="margin-bottom: 10px;">家属信息:</div>

      <div class="img-box">
        <m-img-viewer
          isRequired
          :url="family.familyIdCardFront"
          :toolbar="{ prev: 1, next: 1 }"
          title="身份证正面照"
        />

        <m-img-viewer
          isRequired
          :url="family.familyIdCardBack"
          :toolbar="{ prev: 1, next: 1 }"
          title="身份证背面照"
        />

        <m-img-viewer
          isRequired
          :joinUrl="family.familyAvatarUrl"
          :toolbar="{ prev: 1, next: 1 }"
          title="头像"
        />
      </div>

      <template v-if="family.familyRelationalProofUrl || family.familyRelationalProofUrl2 || family.familyRelationalProofUrl3 || family.familyRelationalProofUrl4">
        <div style="margin-bottom: 10px;">关系证明:</div>

        <div class="img-box">
          <m-img-viewer
            v-if="family.familyRelationalProofUrl"
            class="relation_img"
            :url="family.familyRelationalProofUrl"
            title="关系证明图"
            :isLazy="false"
          />

          <m-img-viewer
            v-if="family.familyRelationalProofUrl2"
            class="relation_img"
            :url="family.familyRelationalProofUrl2"
            title="关系证明图"
            :isLazy="false"
          />

          <m-img-viewer
            v-if="family.familyRelationalProofUrl3"
            class="relation_img"
            :url="family.familyRelationalProofUrl3"
            title="关系证明图"
            :isLazy="false"
          />

          <m-img-viewer
            v-if="family.familyRelationalProofUrl4"
            class="relation_img"
            :url="family.familyRelationalProofUrl4"
            title="关系证明图"
            :isLazy="false"
          />
        </div>
      </template>

      <template v-if="family.meetNoticeUrl">
        <div style="margin-bottom: 10px;">可视电话通知单:</div>

        <div class="img-box">
          <m-img-viewer
            :url="family.meetNoticeUrl"
            title="可视电话通知单"
            :isLazy="false"
          />
        </div>
      </template>
    </el-dialog>

    <el-dialog
      :visible.sync="notificationShow"
      class="authorize-dialog notification-dialog"
      :title="'可视电话告知书-' + notificationPrisoner.name"
      width="530px"
      @close="onCloseNotificationDialog"
    >
      <div class="el-form el-form--inline">
        <div class="el-form-item">
          <label class="el-fotm-item__label">可选家属</label>

          <div class="el-form-item__content" style="width: 100%;">
            <el-select
              placeholder="可选家属"
              v-model="notificationFamily"
              filterable
              clearable
              value-key="familyId"
              :loading="selectLoading"
              @change="onSelectChange"
            >
              <el-option
                v-for="item in notificationFamilies"
                :key="item.familyId"
                :label="item.familyName"
                :value="item"
              />
            </el-select>
          </div>
        </div>
      </div>

      <m-form
        ref="notification"
        :items="formItems"
        @submit="onSubmit"
        :values="notificationForm"
      />

      <!-- 有告知书图片的才显示 -->
      <div v-show="notificationForm.meetingNotificationUrl" class="notification__content">
        <label>告知书：</label>

        <m-img-viewer
          :url="notificationForm.meetingNotificationUrl"
          :isLazy="false"
          title="告知书"
        />
      </div>

      <template v-if="!notificationForm.protoNum">
        <el-row :gutter="0">
          <el-button
            class="button-add"
            size="mini"
            type="danger"
            @click="onCloseNotificationDialog"
          >取消</el-button>

          <el-button
            class="button-add"
            :loading="submitting"
            size="mini"
             type="primary" 
            @click="handleSureSign"
          >确定</el-button>
        </el-row>
      </template>

      <template v-else>
        <el-row :gutter="0">
          <el-button
            class="button-add"
            size="mini"
            @click="onCloseNotificationDialog"
          >返回</el-button>
        </el-row>
      </template>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      @close="handleCloseDialog"
      :visible.sync="visible"
      :title="dialogContent['title']"
      :class="['authorize-dialog', 'all-dialog__style', isJailOperationType ? 'change-jail__dialog' : '']"
      @open="onOpenDialog"
      width="530px"
    >
      <template v-if="operationType === 4">
        <div class="el-message-box__container" style="margin:24px 0 24px  71px;">
          <div class="el-message-box__status el-icon-warning" />
          <div class="el-message-box__message">
            <p> 提示：如果是转监，请使用转监功能，不要做离监操作！</p>
          </div>
        </div>
      </template>

      <m-form
        v-if="!(isPrisonAreaIdType && prisonConfigs.length < 1)"
        :items="dialogContent['items']"
        @submit="handleSubmit"
        :values="dialogFormValues"
        ref="dialogForm"
        @response="onDialogFormResponse"
        @cancel="visible = false"
      />

      <div v-else style="text-align: center;color: red;font-size: 16px">没有可更换的监区</div>
    </el-dialog>

    <el-dialog
      class="authorize-dialog upload-dialog"
      ref="uploadDialog"
      title="信息数据导入中"
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
          <span>准备导入数据总计：{{ validatePrisonerLeaveResult.total }}条</span>

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
          <i class="el-icon-success green" style="font-size: 20px;margin-right: 10px;"></i>成功：{{ validatePrisonerLeaveResult.successTotal }}条<br>

          <template v-if="!!validatePrisonerLeaveResult.failTotal">
            <i class="el-icon-error red" style="font-size: 20px; margin-right: 10px;"></i>失败：{{ validatePrisonerLeaveResult.failTotal }}条

            <p style="padding-left: 30px;">导入失败数据：
              <m-excel-download
                path="/download/localfile"
                :params="{ filepath: validatePrisonerLeaveResult.filePath }"
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

    <prisoner-detail-modal v-model="detailDetVisible" :prisonerDetData="prisonerDetData">
      <template #dialogFooter>
        <el-button
          v-if="!!prisonerDetData.faceUrl"
          type="primary"
          @click="onReSubmit"
        >重新提交</el-button>
      </template>
    </prisoner-detail-modal>
  </el-row>
</template>

<script>
import {
  mapActions,
  mapState,
  mapGetters
} from 'vuex'
import prisonerDetailModal from './components/prisoner-detail-modal.vue'
import validator from '@/utils'

import { prisonerExcelConfig } from '@/common/excel-config'

import prisonFilterCreator from '@/mixins/prison-filter-creator'

import prisons from '@/common/constants/prisons'

import {
  provinceJailLevelConfigsParamsName,
  prisonerInsideWhiteLists,
  $likeName
  // $likePrisonerNumber
} from '@/common/constants/const'

import moment from 'moment'

import { Message } from 'element-ui'
// import roleAuthCreator from '@/mixins/role-auth-creator'

import { batchDownloadPublicImageURL } from '@/utils/helper'
export default {
  mixins: [prisonFilterCreator],

  components: {
    prisonerDetailModal
  },

  beforeRouteLeave(to, from, next) {
    this.$store.commit('setLoginHavePrisonerIn', false)

    next()
  },

  data() {
    const tabsItems = [
      {
        label: '服刑人员列表',
        name: 'prisoner'
      },
      {
        label: '转监',
        name: 'change'
      }
    ]
    const prisonerStatus = [
      {
        label: '正常状态',
        value: 1
      },
      {
        label: '黑名单',
        value: 2
      },
      {
        label: '已离监',
        value: 4
      },
    ]
    const notifyOptions = [
      {
        label: '已签订',
        value: 1
      },
      {
        label: '未签订',
        value: 0
      }
    ]
    const { belong } = prisons.PRISONAREA
    return {
      detailDetVisible: false, // 详情弹窗
      prisonerDetData: {},
      uploadDialogVisible: false,// 导入数据弹窗
      status: 0,
      spendTime: 0,
      percent: 0,
      uploadInnerDialogVisible: false,
      UploadType: false,
      searchItems: {
          address: {
          type: 'input',
          label: '户籍'
        },
        prisonerNumber: {
          type: 'input',
          label: '罪犯编号'
        },

        name: {
          type: 'input',
          label: '罪犯姓名'
        },
        status: {
          type: 'select',
          label: '服刑人员状态',
          options: prisonerStatus,
          value: 1,
          miss: false,
          
        },
        isNotify: {
          type: 'select',
          label: '可视电话告知书',
          noPlaceholder: true,
          options: notifyOptions,
          miss: false
        },
        familyName: {
          type: 'input',
          label: '家属姓名',
          miss: false
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
        },
        accessTime: {
          type: 'number',
          label: '通话次数',
          miss: false
        }
      },

      formItems: {
        formConfigs: {
          inline: true,
          labelPosition: 'top'
        },
        familyName: {
          type: 'input',
          label: '家属姓名',
          disabled: false,
          rules: ['required']
        },
        familyUuid: {
          type: 'input',
          label: '身份证号',
          disabled: false
        },
        familyRelationship: {
          type: 'input',
          label: '与服刑人员关系',
          disabled: false,
          rules: ['required']
        },
        protoNum: {
          type: 'input',
          label: '协议编号',
          rules: ['required']
        },
        signDate: {
          type: 'date',
          label: '签署日期',
          rules: ['required'],
          pickerOptions: {
            disabledDate: time => time.getTime() > Date.now()
          }
        }
      },
      dialogTableVisible: false,
      family: {},
      isEditTime: false,
      prisoner: {},
      thePrisoner: {},
      notificationShow: false,
      notificationPrisoner: {},
      notificationForm: {},
      notificationFamily: {},
      selectLoading: true,
      submitting: false,
      prisonConfigData: [], // 可更换的监区数据
      visible: false, // 对话框的显示
      showReasonValue: '刑满释放', // 删除框的value
      // allSelectionvalue: false, 删除罪犯全选的控制 不要删掉
      selectPrisoners: [], // 删除的罪犯数据
      // isIndeterminate: false, // 单选框的样式控制 不要删掉
      // multipleSelection: [], // 多选数据 不要删掉
      operationType: 0, // 默认是0就是不操作 1为加入黑名单 2为更换监区 3 为新增服刑人员 4为删除服刑人员 5批量更换监区 6为转监 7为批量转监 8为批量接收 9为单个接收 10为非ywt_Admin批量转监

      prisonerExcelConfig,

      dialogFormResponseValues: {},

      prisonConfigIdKey: '',

      prisonJailConfigData: [],

      dialogFormValues: {},

      tabsItems,

      tabs: 'prisoner',
      excelUploadConfigs: {
        attrs: {
          autoUpload: false,
          limit: 1,
          beforeUpload: this.beforeUpload,
          onChange: this.onChange
        }
      },

      timesDialogType: '' // accessTime: 通话次数 smsNum; 短信次数
    }
  },
  computed: {
    ...mapState([
      'prisoners',
      'notification',
      'notificationFamilies',
      'prisonConfigs',
      'jailPrisonAreas'
    ]),

    ...mapGetters(['isSuperAdmin', 'hasPrisonArea']),

    ...mapState({
      user: state => state.global.user,
      uploadResult: state => state.global.uploadResult,
      validatePrisonerLeaveResult: state => state.familyPhone.validatePrisonerLeaveResult
    }),

    ...mapState('account', ['publicUserInfo']),

    dialogContent() {
      const genderOptions = [
        {
          label: '男',
          value: 'm'
        },
        {
          label: '女',
          value: 'f'
        }
      ]

      const genderProps = {
        label: 'label',
        value: 'value'
      }

      const delReason = [
        {
          label: '刑满释放',
          value: '刑满释放'
        },
        {
          label: '假释',
          value: '假释'
        },
        {
          label: '病亡',
          value: '病亡'
        },
        {
          label: '死亡',
          value: '死亡'
        },
        {
          label: '错误数据',
          value: '错误数据'
        },
        {
          label: '其他（特赦释放、无罪释放、改判释放等等）',
          value: '其他（特赦释放、无罪释放、改判释放等等）'
        }
      ]

      const otherDelReasonDetail = {
        contents: {
          type: 'input',
          label: '删除原因',
          noLabel: true,
          placeholder: '请输入删除原因',
          rules: ['required']
        }
      }

      const changePrisonConfigsProps = {
        label: 'name',
        value: 'id'
      }

      const dissMissConfigs = provinceJailLevelConfigsParamsName.slice(3)

      const changePrisonDissMissConfigs = provinceJailLevelConfigsParamsName.slice(2)

      const filterable = true

      let title,
        items = {},
        formButton = { buttons: [] }
      switch(this.operationType) {
        case 1:
          title = '加入黑名单'
          formButton.buttons = [
            {
              add: 'add',
              text: '确认'
            },
            {
              cancel: 'cancel',
              type: 'danger'
            }
          ]
          items = Object.assign({},{
            reason: {
              type: 'textarea',
              maxlength: 200,
              showWordLimit: true,
              noLabel: true,
              placeholder: '请输入加入黑名单理由',
              autosize: { minRows: 5 },
              rules: [
                'required',
                'lengthRange-200'
              ],
              label: '加入黑名单的原因'
            }
          }, formButton)
          break
        case 5:
        case 2:
          title = '更换监区'

          formButton.buttons = []

          items = Object.assign({}, {
            prisonAreaId: {
              type: 'select',
              noLabel: true,
              placeholder: '请选择监区',
              filterable,
              options: this.prisonConfigData,
              label: '监区',
              props: changePrisonConfigsProps,
              invokeFuncAuto: true,
              func: this.onGetNextLevelPrisonConfigsData
            },

            prisonBranchId: {
              type: 'select',
              noLabel: true,
              placeholder: '请选择分监区',
              filterable,
              label: '分监区',
              props: changePrisonConfigsProps,
              invokeFuncAuto: true,
              func: this.onGetNextLevelPrisonConfigsData
            },

            prisonBuildingId: {
              type: 'select',
              noLabel: true,
              placeholder: '请选择楼栋',
              label: '楼栋',
              props: changePrisonConfigsProps,
              invokeFuncAuto: true,
              func: this.onGetNextLevelPrisonConfigsData,
              filterable
            },

            prisonLayerId: {
              type: 'select',
              noLabel: true,
              placeholder: '请选择楼层',
              label: '楼层',
              props: changePrisonConfigsProps,
              invokeFuncAuto: true,
              func: this.onGetNextLevelPrisonConfigsData,
              filterable
            }
          }, { dissMissConfigs }, formButton)
          break
        case 3:
          title = '新增服刑人员'
          formButton.buttons = [
            'add',
            'cancel'
          ]
          items = Object.assign({}, {
            formConfigs: { labelWidth: '120px' },

            name: {
              type: 'input',
              label: '服刑人员姓名',
              rules: ['required'],
              clearable: true
            },
             address: {
              type: 'input',
              label: '户籍',
              clearable: true
            },

            prisonerNumber: {
              type: 'input',
              label: '服刑人员编号',
              rules: ['required'],
              clearable: true
            },

            prisonAreaId: {
              type: 'select',
              label: '监区',
              rules: !JSON.parse(localStorage.getItem('user')).branch_prison ? [] : ['required'],
              disabled: !JSON.parse(localStorage.getItem('user')).branch_prison,
              customClass: !JSON.parse(localStorage.getItem('user')).branch_prison ? 'input_required__show' : '',
              func: this.onGetNextLevelPrisonConfigsData,
              filterable
            },

            prisonBranchId: {
              type: 'select',
              label: '分监区',
              rule: [{
                message: '请选择分监区',
                required: true,
                trigger: 'change'
              }],
              props: changePrisonConfigsProps,
              invokeFuncAuto: true,
              func: this.onGetNextLevelPrisonConfigsData,
              filterable
            },

            prisonBuildingId: {
              type: 'select',
              label: '楼栋',
              rule: [{
                message: '请选择楼栋',
                required: true,
                trigger: 'change'
              }],
              props: changePrisonConfigsProps,
              invokeFuncAuto: true,
              func: this.onGetNextLevelPrisonConfigsData,
              filterable
            },

            prisonLayerId: {
              type: 'select',
              label: '楼层',
              rule: [{
                message: '请选择楼层',
                required: true,
                trigger: 'change'
              }],
              props: changePrisonConfigsProps,
              invokeFuncAuto: true,
              func: this.onGetNextLevelPrisonConfigsData,
              filterable
            },

            gender: {
              type: 'select',
              label: '性别',
              rules: ['required'],
              options: genderOptions,
              props: genderProps,
              value: 'm'
            },

            crimes: {
              type: 'input',
              label: '犯罪事实',
              clearable: true
            },

            additionalPunishment: {
              type: 'input',
              label: '附加刑',
              clearable: true
            },

            prisonTermStartedAt: {
              type: 'date',
              label: '刑期起日',
              clearable: true,
              pickerOptions: {
                disabledDate: {
                  prop: 'prisonTermEndedAt',
                  name: 'start'
                }
              }
            },

            prisonTermEndedAt: {
              type: 'date',
              label: '刑期止日',
              clearable: true,
              pickerOptions: {
               disabledDate: {
                 prop: 'prisonTermStartedAt',
                 name: 'end'
                }
              }
            },

            originalSentence: {
              type: 'input',
              label: '原判刑期',
              clearable: true
            },

            level: {
              type: 'select',
              label: '管教级别',
              options: [
                {
                  label: '宽管级',
                  value: '1'
                },
                {
                  label: '普管级',
                  value: '2'
                },
                {
                  label: '考察级',
                  value: '3'
                },
                {
                  label: '严管级',
                  value: '4'
                }
              ],
              props: genderProps,
              value: '2'
            },
          }, { dissMissConfigs }, formButton)
          break
        case 4:
          title = '请选择离监原因'
          formButton.buttons = [
            {
              add: 'add',
              text: '确认'
            },
            'cancel'
          ]
          items = Object.assign({}, {
            formConfigs: { labelWidth: '110px' },
            deleteReason: {
              type: 'select',
              options: delReason,
              label: '原因',
              props:
              {
                label: 'label',
                value: 'label'
              },
              value: this.showReasonValue,
              func: this.handleChangeDelReason
            }
          }, formButton)
          if(this.showReasonValue === '其它') items = Object.assign({}, items, otherDelReasonDetail)
          else Reflect.deleteProperty(items, 'content')
          break
        case 6:
        case 7:
          title = '转监'

          formButton.buttons = [
            {
              cancel: true,

              className: ['prisoner-list__change-jail_button']
            },

            {
              attrs: {
                size: 'small',
                type: 'primary',
                disabled: false
              },

              events: {
                click: this.onChangePrisonJailOrBatch
              },

              text: '转监',

              className: ['prisoner-list__change-jail_button']
            }
          ]

          items = Object.assign({}, {
            formConfigs: {
              inline: true,
              labelPosition: 'right',
              labelWidth: 'auto'
            },

            provincesId: {
              type: 'select',
              label: '省份',
              options: this.$store.state.provincesAll,
              props: { label: 'name', value: 'id' },
              invokeFuncAuto: true,
              func: this.onGetNextLevelPrisonConfigsData,
              filterable
            },

            jailId: {
              type: 'select',
              label: '监狱',
              props: { label: 'title', value: 'id' },
              invokeFuncAuto: true,
              func: this.onGetNextLevelPrisonConfigsData,
              filterable
            },

            prisonAreaId: {
              type: 'select',
              label: '监区',
              invokeFuncAuto: true,
              props: changePrisonConfigsProps,
              func: this.onGetNextLevelPrisonConfigsData,
              filterable
            },

            prisonBranchId: {
              type: 'select',
              label: '分监区',
              invokeFuncAuto: true,
              props: changePrisonConfigsProps,
              func: this.onGetNextLevelPrisonConfigsData,
              filterable
            },

            prisonBuildingId: {
              type: 'select',
              label: '楼栋',
              invokeFuncAuto: true,
              props: changePrisonConfigsProps,
              func: this.onGetNextLevelPrisonConfigsData,
              filterable
            },

            prisonLayerId: {
              type: 'select',
              label: '楼层',
              invokeFuncAuto: true,
              props: changePrisonConfigsProps,
              func: this.onGetNextLevelPrisonConfigsData,
              filterable
            }
          }, { dissMissConfigs: changePrisonDissMissConfigs }, formButton)
          break
        case 8:
        case 9:
          title = '接收'

          formButton.buttons = [
            {
              cancel: true,

              className: ['prisoner-list__change-jail_button']
            },

            {
              attrs: {
                size: 'small',
                type: 'primary',
                disabled: false
              },

              events: {
                click: this.onAcceptPrisoners
              },

              text: '确定',

              className: ['prisoner-list__change-jail_button']
            }
          ]

          items = Object.assign({}, {
            formConfigs: {
              inline: true,
              labelPosition: 'right',
              labelWidth: 'auto'
            },

            prisonAreaId: {
              type: 'select',
              label: '监区',
              options: this.prisonConfigs,
              invokeFuncAuto: true,
              props: changePrisonConfigsProps,
              func: this.onGetNextLevelPrisonConfigsData,
              filterable
            },

            prisonBranchId: {
              type: 'select',
              label: '分监区',
              invokeFuncAuto: true,
              props: changePrisonConfigsProps,
              func: this.onGetNextLevelPrisonConfigsData,
              filterable
            },

            prisonBuildingId: {
              type: 'select',
              label: '楼栋',
              invokeFuncAuto: true,
              props: changePrisonConfigsProps,
              func: this.onGetNextLevelPrisonConfigsData,
              filterable
            },

            prisonLayerId: {
              type: 'select',
              label: '楼层',
              invokeFuncAuto: true,
              props: changePrisonConfigsProps,
              func: this.onGetNextLevelPrisonConfigsData,
              filterable
            }
          }, { dissMissConfigs }, formButton)
          break
        case 10:
          title = '转监'

          formButton.buttons = [
            {
              cancel: true,

              className: ['prisoner-list__change-jail_button']
            },

            {
              attrs: {
                size: 'small',
                type: 'primary',
                disabled: false
              },

              events: {
                click: this.onChangePrisonJailOrBatch
              },

              text: '转监',

              className: ['prisoner-list__change-jail_button']
            }
          ]

          items = Object.assign({}, {
            formConfigs: {
              inline: true,
              labelPosition: 'right',
              labelWidth: 'auto'
            },

            provincesId: {
              type: 'select',
              label: '省份',
              options: this.$store.state.provincesAll,
              props: { label: 'name', value: 'id' },
              invokeFuncAuto: true,
              func: this.onGetNextLevelPrisonConfigsData,
              filterable
            },

            jailId: {
              type: 'select',
              label: '监狱',
              props: { label: 'title', value: 'id' },
              invokeFuncAuto: true,
              func: this.onGetNextLevelPrisonConfigsData,
              filterable
            }
          }, { dissMissConfigs: changePrisonDissMissConfigs }, formButton)
          break
        default:
          break
      }
      return { title, items }
    },

    tableCols() {
      const familiesCol = {
        label: '对应家属',
        prop: 'families',
        ...$likeName,
        className: 'aa',
        desensitizationColsConfigs: {
          keyWord: 'id',
          prop: 'familyName',
          desensitizationColSlotName: 'families'
        }
      }

      const hasAllPrisonQueryAuthCols = [
        {
          type: 'selection',
          selectable: this.handleControlSelect
        },
        {
          label: '省份',
          prop: 'provinceName',
          showOverflowTooltip: true
        },
        {
          label: '监狱名称',
          prop: 'jailName',
          showOverflowTooltip: true
        }
      ]

      const transferOutPrisonersCols = [
        {
          label: '原监区名称',
          prop: 'sourcePrisonArea',
          showOverflowTooltip: true
        },
        {
          label: '原监狱名称',
          prop: 'sourceJailName',
          showOverflowTooltip: true
        },
        {
          label: '目标监狱名称',
          prop: 'targetJailName',
          showOverflowTooltip: true
        },
        {
          label: '转监状态',
          slotName: 'type'
        }
      ]

      const operationCol = {
        label: '操作',
        slotName: 'operations',
        minWidth: 150,
        align: 'center'
      }

      const commonCols = [
        {
          label: '罪犯姓名',
          prop: 'name',
          minWidth: 75
          // ...$likeName
        },
        {
          label: '罪犯编号',
          prop: 'prisonerNumber'
          // ...$likePrisonerNumber
        },
        {
          label: '性别',
          prop: 'gender'
        }
      ]

      let prisonerCols = [
        ...hasAllPrisonQueryAuthCols,

        ...commonCols,

        {
          label: '监区',
          prop: 'prisonArea',
          showOverflowTooltip: true
        },
        {
          label: '户籍',
          minWidth: 130,
          prop: 'address'
        },

        {
          label: '通话次数/月',
          minWidth: 85,
          sortable: 'custom',
          slotName: 'accessTime'
        },

        // {
        //   label: '短信次数/月',
        //   minWidth: 85,
        //   slotName: 'smsNum'
        // },
        {
          label: '管教级别',
          minWidth: 85,
          slotName: 'level'
        },
        {
          label: '服刑人员状态',
          minWidth: 90,
          showOverflowTooltip: true,
          slotName: 'prisonerStatus'
        },

        familiesCol,

        {
          label: '家属可视电话告知书',
          minWidth: 125,
          slotName: 'notifyId'
        },

        operationCol
      ]

      let transferOutPrisonersAllCols = [
        ...hasAllPrisonQueryAuthCols,
        ...commonCols,
        ...transferOutPrisonersCols,
        familiesCol,
        operationCol
      ]

      if (this.isPrisonerTabVal) {
        if (!this.isSuperAdmin) prisonerCols.splice(1, 2)

        return prisonerCols
      } else {
        if (this.hasAllPrisonQueryAuth) {
          transferOutPrisonersAllCols.splice(2, 1)

          transferOutPrisonersAllCols.splice(10, 1)
        }

        else transferOutPrisonersAllCols.splice(1, 2)

        return transferOutPrisonersAllCols
      }
    },

    // 需要排除的监狱的值
    // 单个更换监狱/带有监狱搜索条件
    currentJailId() {
      const { jailId } = this.user

      const noneIsSuperAdminJailId = this.isSuperAdmin ? '' : jailId

      return this.prisoner.jailId || this.filter.jailId || noneIsSuperAdminJailId
    },

    currentProvincesId() {
      return this.prisoner.provincesId || this.filter.provincesId || this.$store.state.provincesAll[0].id
    },

    isJailOperationType() {
      const jailIdTypes = [6, 7, 10, 8, 9]

      return jailIdTypes.includes(this.operationType)
    },

    isPrisonAreaIdType() {
      const prisonAreaIdType = [2, 5]

      return prisonAreaIdType.includes(this.operationType)
    },

    isPrisonerTabVal() {
      const prisonerTabVal = ['prisoner']

      return prisonerTabVal.includes(this.tabs)
    },

    timesDialogTitle() {
      const titles = {
        accessTime: '修改通话次数',
        smsNum: '修改短信次数'
      }

      return titles[this.timesDialogType]
    }
  },

  watch: {
    notificationFamily: {
      handler: function(val) {
        const disabled = !!(val && val.familyId)

        const otherDisabled = !!(val && val.protoNum)

        this.formItems.familyName.disabled = disabled

        this.formItems.familyRelationship.disabled = disabled

        this.formItems.familyUuid.disabled = disabled

        this.formItems.protoNum.disabled = otherDisabled

        this.formItems.signDate.disabled = otherDisabled
      },

      deep: true,

      immediate: true
    },

    tabs(val) {
      const searchItemKeys = [
        'prisonArea',
        'address',
        'status',
        'isNotify',
        'familyName'
      ]

      let minReactInChainKey = 'jailId'

      const mountedKeys = ['provincesId', 'jailId', 'prisonArea']

      this.$refs.search.onSearch('tabs')

      const filterKeys = Object.keys(this.filter)

      if (this.isPrisonerTabVal) {
        searchItemKeys.forEach(key => {
          this.searchItems[key].miss = false
        })

        this.searchItems.status.value = 1

        this.filter = Object.assign({}, this.filter, {
          status: 1
        })

        if (filterKeys.includes(minReactInChainKey)) (async() => await this.searchSelectChange(minReactInChainKey, this.filter[minReactInChainKey]))()
      } else {
        searchItemKeys.forEach(key => {
         this.searchItems[key].miss = true
        // this.$set( this.searchItems,this.searchItems[key], "" )
        // this.searchItems[key].value = ''

          if (key === 'prisonArea') delete this.filter['prisonConfigId']

          else delete this.filter[key]
        })

         this.clearSubPrisonArea('prisonSubArea')

         const result = mountedKeys.filter(key => Object.keys(this.searchItems).includes(key) && !this.searchItems[key].miss)

         minReactInChainKey = result[result.length - 1] || 'jailId'
      }

      this.onSearch()
    }
  },

  methods: {
    ...mapActions([
      'getPrisoners',
      'getPrisonersAll',
      'updatePrisonerTime',
      'addPrisonerBlacklist',
      'getNotification',
      'updateNotification',
      'addNotification',
      'getNotificationFamilies',
      'getPrisonConfigs',
      'changePrisonArea',
      'removePrisonerBlacklist',
      'deletePrisonerData',
      'addPrionser',
      'changePrisonAreaBatch',
      'changePrisonJailOrBatch',
      'acceptPrisoners',
      'abortChangePrisoners',
      'getTransferOutPrisonersPagedData',
      'getJailPrisonAreas',
      'rejectPrisonerFaceUrl'
    ]),

    ...mapActions(["uploadFile", "resetState"]),

    ...mapActions('familyPhone', ['validateUploadPrisonerLeave']),

    sortChange({ column, prop, order }) {
      this.sortObj = {}

      delete this.filter.sortDirection
      delete this.filter.orderField

      this.sortObj.orderField = "accessTime"
      if (order === 'descending') this.sortObj.sortDirection = 'desc'
      else if (order === 'ascending') this.sortObj.sortDirection = 'asc'

      this.filter = Object.assign(this.filter, this.sortObj)
      this.getDatas('sortChange')
    },

    one(type){
      this.UploadType = type
    },

    // 重制上传的参数关闭对话框
    onResetAndcloseUploadDialog() {
      this.spendTime = 0;
      this.percent = 0;
      this.status = 0;
      this.uploadDialogVisible = false;
    },

      // 内层提示对话框关闭的回调方法
    onUploadInnerDialogClose() {
      setTimeout(() => {
        this.onResetAndcloseUploadDialog();
      }, 1000);
    },

     onOpenUploadDialog() {
      this.$nextTick(() => {
        this.$refs.mExcelUpload.onManualUpload();
        this.$refs.mExcelUploadConfig.onManualUpload();
      });
    },

    beforeUpload(file) {
      this.resetState({ validatePrisonerLeaveResult: {
        successTotal: 0,
        failTotal: 0,
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
              const isSuccess = await this.validateUploadPrisonerLeave({ filepath: this.uploadResult.path, type: this.UploadType})

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

    cellRed({row, column, rowIndex, columnIndex}){
      if (!(row.address&&row.address.includes("中国"))) {
        if (row.address) {
          return 'color:red'
        }
      }
    },

    async getDatas() {
      // this.allSelectionvalue = false // 不要删除
      // await this.getPrisoners({ ...this.filter, ...this.pagination })
      // this.multipleSelection = new Array(this.prisoners.contents.length).fill(false) // 不要删除
      // this.isIndeterminate = false 不要删除
      const params = {
        ...this.filter,
        ...this.pagination
      }

      if (this.hasAllPrisonQueryAuth) {
        if (this.isPrisonerTabVal) await this.getPrisonersAll(params)
        else await this.getTransferOutPrisonersPagedData({ url: '/prisoners/change/findPages', params })
      } else {
        if (this.isPrisonerTabVal) await this.getPrisoners(params)
        else await this.getTransferOutPrisonersPagedData({ url: '/prisoners/change/findPage', params })
      }
    },

    onSearch(isCurrent) {
      delete this.filter.sortDirection
      delete this.filter.orderField
      this.$refs.pagination.handleCurrentChange(!!isCurrent ? this.pagination.page : 1)
      // this.$refs.pagination.handleCurrentChange(1)
    },

    onTimeEdit(e, type) {
      this.prisoner = Object.assign({}, e)
      this.thePrisoner = e
      this.timesDialogType = type
      this.isEditTime = true
    },

    onTimesChange(e) {
      if (!e) this.prisoner[this.timesDialogType] = 0
    },

    onTimeClose() {
      this.isEditTime = false
    },

    onTimeOpen() {
      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.clearValidate()
      })
    },

    onTime() {
      if (this.prisoner[this.timesDialogType] === this.thePrisoner[this.timesDialogType]) {
        this.isEditTime = false
        return
      }

      this.$refs.form.validate(async valid => {
        if (!valid) return

        const { id } = this.prisoner
        const params = { id, [this.timesDialogType]: this.prisoner[this.timesDialogType] }
        const urls = {
          accessTime: '/prisoners/updateAccessTime',
          smsNum: '/prisoners/updateSmsNum'
        }

        const res = await this.updatePrisonerTime({ params, url: urls[this.timesDialogType] })

        if (!res) return

        await this.onSearch(true)

        this.isEditTime = false
      })
    },

    async showFamilyDetail(family) {
      const {
        familyIdCardBack,
        familyIdCardFront,
        familyRelationalProofUrl,
        familyRelationalProofUrl2,
        familyRelationalProofUrl3,
        familyRelationalProofUrl4,
        meetNoticeUrl
      } = family

      const urls = {
        familyIdCardBack,
        familyIdCardFront,
        familyRelationalProofUrl,
        familyRelationalProofUrl2,
        familyRelationalProofUrl3,
        familyRelationalProofUrl4,
        meetNoticeUrl
      }

      const _key = `familyId_${ family.familyId }`
      const URLS = await batchDownloadPublicImageURL(urls, _key)

      this.family = {
        ...family,
        ...URLS
      }

      this.dialogTableVisible = true
    },

    // 打开详情弹窗
    async showPrisonerDet(data) {
      let { faceUrl, id } = data

      if (faceUrl) {
        const URLS = await batchDownloadPublicImageURL({
          faceUrl
        }, `prisonId_${ id }`)

        data.faceUrl = URLS.faceUrl
      }

      this.prisonerDetData = Object.assign({}, data)
      this.detailDetVisible = true
    },

    // 展示黑名单对话框
    showBlackList(e) {
      this.prisoner = Object.assign({}, e)
      this.operationType = 1
      this.visible = true
    },

    removeBlackList(e) {
      this.$confirm(`是否将${ e.name }移出黑名单？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        let params = new FormData()
        params.append('prisonerId', e.id)
        this.removePrisonerBlacklist(params).then(res => {
          if (!res) return
          this.onSearch(true)
        })
      })
    },

    onSelectChange(e) {
      if (e && e.familyId) {
        const { protoNum, signDate } = e

        const initSignDate = protoNum ? signDate : moment(Date.now()).format('YYYY-MM-DD')

        this.notificationForm = Object.assign({}, e, { signDate: initSignDate})
      } else {
        this.notificationForm.familyId = ''
        this.notificationForm.familyName = ''
        this.notificationForm.familyRelationship = ''
        this.notificationForm.familyUuid = ''
        this.notificationForm.meetingNotificationUrl = ''
        this.notificationForm.protoNum = ''
        this.notificationForm.signDate = ''
      }

      this.$refs.notification && this.$refs.notification.onClearValidate()
    },

    // 家属可视电话告知书 查看/签订
    handleSign(e, prisoner) {
      // e: 告知书id prisoner: 当前行信息
      // 告知书罪犯信息
      this.notificationPrisoner = prisoner

      this.selectLoading = true
      // 获取对应罪犯家属列表
      this.getNotificationFamilies({ prisonerId: prisoner.id }).then(res => {
        this.selectLoading = false
      })
      // 查看告知书
      if (e) {
        // 告知书详情
        this.getNotification({ id: e }).then(res => {
          if (!res) return
          // 表单组件初始化的数值
          this.notificationForm = this.notification
          this.notificationFamily = Object.assign({}, this.notification)
          this.notificationShow = true
        })
      } else {
        this.notificationForm = {}
        this.notificationShow = true

        this.$refs.notification && this.$refs.notification.onClearValidate()
      }
    },

    handleSureSign() {
      this.$refs.notification.onSubmit()
    },

    onSubmit(e) {
      this.submitting = true
      if (e.id) {
        this.updateNotification(e).then(res => {
          this.submitting = false
          if (!res) return
          this.notificationShow = false
        })
      } else {
        let params = Object.assign({}, {
          prisonerId: this.notificationPrisoner.id
        }, e)
        this.addNotification(params).then(res => {
          this.submitting = false

          if (!res) return

          this.notificationPrisoner.notifyId = res.id
          this.notificationShow = false
        })
      }
    },

    // 获取监狱/监区数据
    async onInitPrisonConfigs(filterParams, operationType) {
      this.operationType = operationType

      // 更换监区
      if (this.isPrisonAreaIdType) {
        await this.getPrisonConfigs({ jailId: JSON.parse(localStorage.getItem('user')).jailId })

        this.prisonConfigData = this.prisonConfigs.filter(val => !(val.id === filterParams && !(+val.hasChildren)))
      } else {
        // 转监
        // 省份的默认初始值
        if (!this.hasAllPrisonQueryAuth) await this.$store.dispatch('getProvincesAll')

        this.dialogFormValues = {
          provincesId: this.currentProvincesId
        }
      }

      this.visible = true
    },

    // dialog组件 获取ref
    onOpenDialog() {
      this.$nextTick(function() {
        const provincesIdItem = _.cloneDeep(this.dialogContent['items']['provincesId'])

        if (provincesIdItem) this.onGetNextLevelPrisonConfigsData(this.currentProvincesId, 'provincesId', provincesIdItem)
      })
    },

    // 展示更换监区对话框
    async onShowPrisonConfig(e, operationType) {
      let filterParams

      this.prisoner = Object.assign({}, e)

      if ([2].includes(operationType)) {
        const { prisonConfigId } = e

        filterParams = prisonConfigId
      }

      await this.onInitPrisonConfigs(filterParams, operationType)
    },

    // 展示删除罪犯对话框
    showDelPrionser() {
      if(!this.selectPrisoners.length) {
        this.$message({
          showClose: true,
          message: '提示：请选择要离监的数据！！',
          type: 'warning'
        })
      } else {
        this.operationType = 4
        this.visible = true
      }
    },

    // 展示新增罪犯对话框
    async showAddPrisoner() {
      this.operationType = 3

      await this.handleRolePrisonArea(this.dialogContent['items'], 'prisonAreaId', 'props', 'add')

      this.visible = true
    },

    // 关闭对话框
    handleCloseDialog() {
     let props, configs

     if (this.isJailOperationType) {
       props = 'jailId'

       configs = {
         prisonAreaId: ''
       }
     }

     if(this.showReasonValue !== '刑满释放') this.showReasonValue = '刑满释放'

     this.onResetMulitpPrisonConfigsForm(props, configs)

     this.$refs.dialogForm && this.$refs.dialogForm.onCancel()
    },

    // 加入黑名单 新增罪犯 删除罪犯的确认操作
    handleSubmit(val) {
      // 加入黑名单
      if (this.operationType === 1) {
        let params = new FormData()

        params.append('prisonerId', this.prisoner.id)
        params.append('reason', val.reason)

        this.addPrisonerBlacklist(params).then(res => {
          if (!res) return

          this.onCloseDialogAndRefreshen()
        })
      }

      // 删除罪犯
      if (this.operationType === 4) {
        let deleteReason = val.contents || val.deleteReason, prisonerId = (this.selectPrisoners.map(val => val.id)).join(',')

        this.deletePrisonerData({deleteReason, prisonerId}).then(res => {
          if(!res) return
          this.onCloseDialogAndRefreshen()
        })
      }

      // 新增罪犯
      if (this.operationType === 3) {
        const { jailId } = JSON.parse(localStorage.getItem('user'))

        let prisonArea, temp = { jailId }

        if (JSON.parse(localStorage.getItem('user')).branch_prison) {
          // 暂时默认租户管理员
          if (this.user.role === '-1') prisonArea = (this.prisonConfigs.filter(prisonArea => prisonArea.id === val.prisonAreaId))[0].name
          // 其他角色就是本身
          else prisonArea = (this.jailPrisonAreas.filter(value => value.id === val.prisonAreaId))[0].name

          temp = { jailId, prisonArea }
        }

        val = Object.assign({}, val, temp, {
          prisonConfigId: val[this.prisonConfigIdKey]
        })

        let prisonConfigs = provinceJailLevelConfigsParamsName.slice(2)

        prisonConfigs.forEach(item => {
          delete val[item]
        })

        this.addPrionser(val).then(res => {
          if(!res) return
          this.onCloseDialogAndRefreshen()
        })
      }
    },

    // 清空下面的数据并且获取下一层的数据
    async onGetNextLevelPrisonConfigsData(parentId, prop, item) {
      const otherStoresParams = {
        actionName: 'getChildPrisonConfigs',

        paramsName: {
          parentId
        }
      }

      const storesParams = {
        provincesId: {
          actionName: 'getJailByProvincesNoAuth',

          paramsName: {
            provincesId: parentId
          }
        },

        jailId: {
          actionName: 'getPrisonConfigs',

          paramsName: {
            jailId: parentId
          }
        },

        prisonAreaId: otherStoresParams,
        prisonBranchId: otherStoresParams,
        prisonBuildingId: otherStoresParams
      }

      this.prisonConfigIdKey = prop

      const lastProp = this.operationType === 10 ? 'jailId' : 'prisonLayerId'

      if (prop !== lastProp) {
        let itemConfigs = {},
          setValueConfigs = [],
          localProvinceJailLevelConfigsParamsName = this.operationType === 10 ? provinceJailLevelConfigsParamsName.slice(0, 2) : provinceJailLevelConfigsParamsName

        const _list = localProvinceJailLevelConfigsParamsName.slice(localProvinceJailLevelConfigsParamsName.findIndex(l => l === prop) + 1)

        // 清空数据
        _list.forEach(t => {
          this.$set(this.dialogContent['items'], t, {
            ...this.dialogContent['items'][t],
            options: []
          })

          setValueConfigs.push({
            props: t,
            setValue: ''
          })
        })

        // 隐藏的选项
        _list.slice(1).forEach(t =>{
          itemConfigs = {
            ...itemConfigs,
            [t]: ''
          }
        })

        // 隐藏选项的配置
        let configs = [
          {
            value: parentId,
            itemConfigs
          }
        ]

        // 获取数据
        await this.$store.dispatch(storesParams[prop]['actionName'], storesParams[prop]['paramsName'])

        // 数据默认值
        let data = this.isPrisonAreaIdType ? _.cloneDeep(this.$store.state.multiPrisonConfigs.filter(val => {
          const { prisonConfigId } = this.prisoner

          return !(val.id === prisonConfigId && !(+val.hasChildren))
        })) : _.cloneDeep(this.$store.state.multiPrisonConfigs)

        // 筛选监狱数据
        if (prop === 'provincesId') data = _.cloneDeep(this.$store.state.prisonAll).filter(val => val.id !== this.currentJailId)
        // 监区数据
        if (prop === 'jailId') data = _.cloneDeep(this.prisonConfigs)

        // 如果没有数据 则隐藏该选项
        if (!data || (Array.isArray(data) && !data.length)) {
          // 没有下一层了
          // 如果只有省份 那么就禁止转监
          // 如果不是省份 那么当前自动不选择数据也是空
          if (this.isJailOperationType) {
            if (prop === 'provincesId') {
              this.$set(this.dialogContent['items']['buttons'][1], 'attrs', {
                ...this.dialogContent['items']['buttons'][1]['attrs'],
                disabled: true
              })
            } else {
              this.dialogFormResponseValues = Object.assign({}, _.cloneDeep(this.dialogFormResponseValues), {
                ...itemConfigs,
                [_list[0]]: ''
              })

              this.$set(this.dialogContent['items']['buttons'][1], 'attrs', {
                ...this.dialogContent['items']['buttons'][1]['attrs'],
                disabled: !this.dialogFormResponseValues[prop]
              })
            }
          }
          const nextProp = _list[0]

          configs[0].itemConfigs = {
            ...(configs[0].itemConfigs),
            [nextProp]: ''
          }
        } else {
          if (this.isJailOperationType) {
            this.dialogFormResponseValues = Object.assign({}, this.dialogFormResponseValues, {
              ...itemConfigs,
              [_list[0]]: ''
            })

            this.$set(this.dialogContent['items']['buttons'][1], 'attrs', {
              ...this.dialogContent['items']['buttons'][1]['attrs'],
              disabled: !this.dialogFormResponseValues[_list[0]]
            })
          }
        }

        this.$set(this.dialogContent['items'], _list[0], {
          ...this.dialogContent['items'][_list[0]],
          options: data || []
        })

        // 当前元素的配置
        this.$set(this.dialogContent['items'][prop], 'configs', configs)
        this.$set(this.dialogContent['items'][prop], 'setValueConfigs', setValueConfigs)

        this.$refs['dialogForm'].radioChangeEvent(parentId, prop, item)
        this.$refs['dialogForm'].setFieldValue(parentId, prop, item)

        if (!data || (Array.isArray(data) && !data.length)) {
          if (this.isPrisonAreaIdType) {
            const prisonAreaId = this.dialogFormResponseValues[prop]

            this.handleChangePrisonConfig(prisonAreaId)
          }
        }
      } else {
        if (this.isJailOperationType) {
          this.$set(this.dialogContent['items']['buttons'][1], 'attrs', {
            ...this.dialogContent['items']['buttons'][1]['attrs'],
            disabled: !parentId
          })

          this.$refs['dialogForm'].radioChangeEvent(parentId, prop, item)
          this.$refs['dialogForm'].setFieldValue(parentId, prop, item)
        }

        if (this.isPrisonAreaIdType) this.handleChangePrisonConfig(parentId)
      }
    },

    onDialogFormResponse(values) {
      this.$nextTick(function() {
        this.dialogFormResponseValues = _.cloneDeep(values)
      })
    },

    // 更换监区
    handleChangePrisonConfig(prisonAreaId) {
      if (prisonAreaId) {
        this.$confirm('若预约日期无法在新监区当日分配时间段，系统将自动取消通话申请，并以短信形式通知相关家属，请确认是否继续操作？', '提示：修改服刑人员监区后，将重新分配通话时间段，调整后会以短信形式通知相关家属', {
          type: 'warning',
          customClass: 'prisonConfigMessage',
          closeOnClickModal: false
        }).then(async () => {
          this.$refs.dialogForm && this.$refs.dialogForm.handleFormMethods(this.prisonConfigIdKey, 'blur')

          let params = {
            prisonAreaId
          }, result
          // 更换监区
          if (this.operationType === 2) {
            const { id, jailId } = this.prisoner

            params = {
              ...params,
              prisonerId: id,
              jailId
            }

            const { code } = await this.changePrisonArea(params)

            result = code === 200
          }

          if (this.operationType === 5) {
            const temp = this.selectPrisoners.map(prisoner => prisoner.id)
            const prisonerIds = temp.join(',')

            params = {
              ...params,
              prisonerIds
            }

            result = await this.changePrisonAreaBatch(params)
          }

          if (result) {
            setTimeout(() => {
              this.onCloseDialogAndRefreshen()
            }, 500)
          }
        }).catch(() => {
          this.onResetMulitpPrisonConfigsForm()

          this.$refs.dialogForm && this.$refs.dialogForm.handleResetField()

          this.$refs.dialogForm && this.$refs.dialogForm.handleFormMethods(this.prisonConfigIdKey, 'blur')
        })
      }
    },

    // 弹性化
    onResetMulitpPrisonConfigsForm(prop = 'prisonAreaId', configs = {}) {
      if (this.dialogContent['items'] && this.dialogContent['items'][prop]) {
        this.$set(this.dialogContent['items'][prop], 'configs', [
          {
            value: undefined,

            itemConfigs: {
              ...configs,
              prisonBranchId: '',
              prisonBuildingId: '',
              prisonLayerId: ''
            }
          }
        ])

        this.$refs['dialogForm'] && this.$refs['dialogForm'].radioChangeEvent('', prop, this.dialogContent['items'][prop])
      }
    },

    // 更换删除原因
    handleChangeDelReason(e) {
      this.showReasonValue = e
    },

    // 筛选已经删除的罪犯不可选择
    handleControlSelect(row, index) {
      return this.hasAllPrisonQueryAuth ? true : (this.isPrisonerTabVal ? row.sysFlag : true)
    },

    // 选择删除的罪犯
    handleSelectionChange(val) {
      this.selectPrisoners = val
    },

    // 根据角色来区分监区数据
    // 其实现在数据都是从user里面读取 暂时不修改了
    async handleRolePrisonArea(element, prop, type = 'props',operation = 'search', role = this.user.role) {
      if (role === '-1') {
        // 租户管理员
        const options = operation === 'search' ? { value: 'name', label: 'name' } : { value: 'id', label: 'name' }

        await this.getPrisonConfigs({ jailId: JSON.parse(localStorage.getItem('user')).jailId })

        this.$set(element[prop], 'options', this.prisonConfigs)

        this.$set(element[prop], type, options)
      } else {
        // 其他角色
        const options = { value: 'id', label: 'name' }

        await this.getJailPrisonAreas({ url: '/prison_config/getAuthChildPrisonConfigs' })

        this.$set(element[prop], 'options', (this.jailPrisonAreas || []))

        this.$set(element[prop], type, options)
      }
    },

    // 关闭可视电话告知对话框
    onCloseNotificationDialog() {
      // 告知书家属信息
      this.notificationFamily = {}

      if (this.$refs.notification) {
        const item = {
          controlProps: [
            'familyName',
            'familyRelationship',
            'familyUuid',
            'protoNum',
            'signDate'
          ]
        }
        this.$refs.notification.selectChangeEvent('', '', item)

        this.$refs.notification.onClearValidate()
      }

      this.notificationShow = false

      this.notificationForm = {}
    },

    // 批量更换 监狱/监区
    onPreChangePrisonConfigs(operationType) {
      const word = [7, 10].includes(operationType) ? '监狱' : '监区'

      if(!this.selectPrisoners.length) {
        this.$message({
          showClose: true,
          message: `请选择要更换${ word }的数据！`,
          type: 'warning'
        })
      } else {
        // 初始化数据
        // 省份/监狱是必定显示的 其余根据当前的情况来显示
        // 单个转监：初始化参数就是它本身的参数
        // 批量转监：1.搜索条件没有的 那就默认第一个的省份的第一个监狱的 2.有省份监狱等搜索条件的时候 初始化就是用这个数据 如果有监区数据那就用
        (async () => {
          this.prisoner = {}

          const params = [2, 6].includes(operationType) && this.selectPrisoners.length === 1 ? this.selectPrisoners[0]['prisonConfigId'] : undefined

          await this.onInitPrisonConfigs(params, operationType)
        })()
      }
    },

    onChangePrisonJailOrBatch() {
      const currentDialogFormResponseValues = _.cloneDeep(this.dialogFormResponseValues)

      this.$confirm('更换监狱后，该服刑人员的可视电话申请和现场探视申请都将取消，您确认更换吗？', {
        closeOnClickModal: false,
        type: 'warning'
      }).then(async () => {
        const { jailId } = currentDialogFormResponseValues

        const { id } = this.prisoner

        const temp = this.selectPrisoners.map(prisoner => prisoner.id)

        const prisonerIds = temp.join(',')

        const requestArgs = {
          // 转监
          6: {
            url: '/prisoners/changePrisonJails',
            params: {
              jailId,
              prisonerId: id
            }
          },

          // 批量转监
          7: {
            url: '/prisoners/changePrisonJailBatch',
            params: {
              jailId,
              prisonerIds
            }
          },

          // 转出(非ywt_admin)不需要筛选出已删除/黑名单的人员
          10: {
            url: '/prisoners/prisonersTransferOut',
            params: {
              jailId,
              prisonerIds
            }
          }
        }

        const { params } = requestArgs[this.operationType]

        if (!['jailId'].includes(this.prisonConfigIdKey)) {
          requestArgs[this.operationType]['params'] = {
            ...params,
            prisonAreaId: currentDialogFormResponseValues[this.prisonConfigIdKey]
          }
        }

        const args = requestArgs[this.operationType]

        const result = await this.changePrisonJailOrBatch(args)

        if (result) {
          Message.closeAll()

          this.$message({
            showClose: true,
            message: '转监操作已完成，等待对方监狱接收！',
            type: 'warning'
          })

          setTimeout(() => {
            this.onCloseDialogAndRefreshen()
          }, 1500)
        }

      }).catch(() => {
        this.handleCloseDialog()
      })
    },

    onCloseDialogAndRefreshen() {
      this.handleCloseDialog()
      this.onSearch(true)
    },

    // 原监狱 - 取消转监
    onAbortChangePrisoners(prisonerIds) {
      this.$confirm('确定取消更换监狱吗？', {
        type: 'warning',
        closeOnClickModal: false
      }).then(async () => {
        const isSuccess = await this.abortChangePrisoners({ prisonerIds })

        if (isSuccess) this.onSearch(true)
      })
    },

    // 批量接收
    onMultipleAccept(type) {
      const haveNoneAcceptData = !this.selectPrisoners.length ||
        this.selectPrisoners.every(prisoner => prisoner.type === 2)

      if(haveNoneAcceptData) {
        this.$message({
          showClose: true,
          message: '请选择要接收的记录！',
          type: 'warning'
        })
      } else {
        (async () => {
          this.prisoner = {}

          await this.onhandlerAccept(type)
        })()
      }
    },

    // 单个接收
    async onSingleAccept(type, row) {
      this.prisoner = Object.assign({}, row)

      await this.onhandlerAccept(type)
    },

    // 接收
    async onhandlerAccept(type) {
      this.operationType = type

      if (this.hasPrisonArea) {
        // 分监区
        await this.getPrisonConfigs({ jailId: JSON.parse(localStorage.getItem('user')).jailId })

        this.visible = true
      } else {
        // 不分监区
        this.$confirm('确认接收该服刑人员吗？', {
          closeOnClickModal: false,
          type: 'warning'
        }).then(async () => {
          await this.onAcceptPrisoners()
        })
      }
    },

    async onAcceptPrisoners() {
      const currentDialogFormResponseValues = _.cloneDeep(this.dialogFormResponseValues)
      const { jailId } = this.user
      let params = {
        jailId
      }

      // 批量接收 只处理接收的数据
      if (this.operationType === 8) {
        params['prisonerIds'] = (this.selectPrisoners.reduce((accumulator, prisoner) => {
          prisoner.type === 1 && accumulator.push(prisoner.prisonerId)

          return accumulator
        }, [])).join(',')
      }

      // 单个接收
      if (this.operationType === 9) params['prisonerIds'] = this.prisoner['prisonerId']

      if (this.hasPrisonArea) {
        params = {
          ...params,
          prisonConfigId: currentDialogFormResponseValues[this.prisonConfigIdKey]
        }
      }

      const result = await this.acceptPrisoners(params)

      if (result) {
        Message.closeAll()

        this.$message({
          showClose: true,
          message: '转监已完成！',
          type: 'warning'
        })

        setTimeout(() => {
          this.onCloseDialogAndRefreshen()
        }, 1500)
      }
    },

    async _mixinsInitMethods() {
      if (this.$store.state.global.loginHavePrisonerIn) this.tabs = 'change'
      else await this.getDatas()
    },

    // 重新提交
    onReSubmit() {
      this.$confirm('确认驳回该人脸信息吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false,
        callback: async action => {
          if (action === 'confirm') {
            const { id } = this.prisonerDetData

            const result = await this.rejectPrisonerFaceUrl(id)

            if (result) {
              setTimeout(() => {
                this.detailDetVisible = false
              }, 500)
            }
          }
        }
      })
    }

    // 自定义的全选操作 不要删除
    // handleCheckAllChange(val) {
    //   if(!val) {
    //     this.deletePrisoners = []
    //     this.multipleSelection = new Array(this.prisoners.contents.length).fill(false)
    //   }
    //   else {
    //     this.multipleSelection = new Array(this.prisoners.contents.length).fill(true)
    //     this.deletePrisoners = this.prisoners.contents
    //   }
    //   this.isIndeterminate = false
    // },
    // 自定义的单选操作 不要删除
    // handleCheckedChange(value, scope) {
    //   const { $index, row } = scope
    //   this.$set(this.multipleSelection, $index, value)
    //   if(value) this.deletePrisoners.push(row)
    //   else this.deletePrisoners.splice(this.deletePrisoners.indexOf(row), 1)
    //   if([...new Set(this.multipleSelection)].length === 1 && [...new Set(this.multipleSelection)][0]) this.allSelectionvalue = true
    //   else this.allSelectionvalue = false
    //   this.isIndeterminate = this.deletePrisoners.length > 0 && this.deletePrisoners.length < this.prisoners.contents.length
    // }
  },
  
}
</script>

<style type="text/stylus" lang="stylus" scoped>
.red{
  color:red
}
.row-container
  .el-dialog__body
    img
      display: block;
    img.avatar
      width: 200px
      height: 200px
.img-idCard
  min-width: 350px;
.row-flex
  flex-wrap: wrap;
// .el-button
//   &+.el-button
//     margin-left 0px !important
.only-select
  width 100%
.el-dialog__body
  padding-bottom: 20px !important
.img-box
  .el-image
    width: 32%;
    height: 110px;
    margin-bottom: 5px;
    >>> img
      width: 100%;
      height: 100%;
      cursor: pointer;
.el-image.relation_img
  width: 24% !important;
.notification__content
  display: flex;
  >>> .el-image
    height: auto;
.change-jail__dialog
  >>> .el-form
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .el-form-item
      margin-right: 0px;
  >>> .button-box
    button
      width: 15% !important;
</style>

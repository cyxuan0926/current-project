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
        style="width: 100%">
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
      @onPageChange="getDatas" />
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
          <el-select v-model="remarks">
            <el-option
              v-for="(remark,index) in registRemarks"
              :value="remark"
              :label="remark"
              :key="index"/>
          </el-select>
          <el-form
            v-if="remarks === '其他'"
            :model="refuseForm"
            :rules="withdrawRule"
            ref="refuseForm"
            class="withdraw-box">
            <el-form-item prop="anotherRemarks">
              <el-input
                :autosize="{ minRows: 2 }"
                type="textarea"
                show-word-limit
                maxlength="200"
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
          <el-select v-model="remarks">
            <el-option
              v-for="(remark,index) in registRemarks"
              :value="remark"
              :label="remark"
              :key="index"/>
          </el-select>
          <!-- <el-form
            v-if="remarks === '其他'"
            :model="refuseForm"
            :rules="withdrawRule"
            ref="refuseForm"
            class="withdraw-box">
            <el-form-item prop="anotherRemarks">
              <el-input
                type="textarea"
                show-word-limit
                maxlength="200"
                placeholder="请选择撤回原因..."
                v-model.trim="refuseForm.anotherRemarks" />
            </el-form-item>
          </el-form> -->
          <el-form
            v-if="remarks === '其他'"
            :model="withdrawForm"
            :rules="withdrawRule"
            ref="withdrawForm"
            class="withdraw-box">
            <el-form-item prop="withdrawReason">
              <el-input
                type="textarea"
                show-word-limit
                maxlength="200"
                :autosize="{ minRows: 4 }"
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

import { registrationWithdrawOrAnthorinputReason } from '@/common/constants/const'

import moment from 'moment'

export default {
  components: {
    registrationDetail
  },
  mixins: [prisonFilterCreator],
  data() {
    const { belong } = prisons.PRISONAREA
    const { options } = this.$store.getters.prisonAreaOptions
    return {
      registrationWithdrawOrAnthorinputReason,
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
        multistageExamine: false
      },
      withdrawForm: {
        withdrawReason: registrationWithdrawOrAnthorinputReason
      },
      refuseForm: {
        anotherRemarks: registrationWithdrawOrAnthorinputReason
      },
      withdrawRule: {
        anotherRemarks: [
          {
            required: true,
            message: '请填写驳回原因'
          }
        ],
        withdrawReason: [
          {
            required: true,
            message: '请填写撤回理由'
          }
        ]
      },
      remarks: '身份信息错误',
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
        if ( val === '' ) {
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
      'firstLevelAuthorize'
    ]),

    ...mapMutations(['setIsRefreshMultistageExamineMessageBell']),

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

    getDatas() {
      if (this.tabs !== 'first') {
        if (this.tabs !== 'DENIED,WITHDRAW' || !this.filter.status) {
          this.filter.status = this.tabs
        }
      }

      const params = { ...this.filter, ...this.pagination }

      if (this.hasAllPrisonQueryAuth) {
        this.getRegistrationsAll(params)
      }
      else {
        this.getRegistrations(params)
      }
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
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

      this.remarks = '身份信息错误'

      this.show.authorize = true

      this.dialogTitle = '授权'
    },

    onAuthorization(e) {
      this.btnDisable = true
      let params = { id: this.toAuthorize.id, status: e }
      if ((e === 'DENIED' || e === 'WITHDRAW')) {
        if (this.remarks === '其他' && e !== 'WITHDRAW') {
          this.$refs.refuseForm.validate(valid => {
            if (valid) params.remarks = this.refuseForm.anotherRemarks.replace(/\s*/g, '')
            else this.btnDisable = false
          })
        }
        else params.remarks = this.remarks
        if (e === 'WITHDRAW' && this.remarks === '其他') {
          this.$refs.withdrawForm.validate(valid => {
            if (valid) params.withdrawReason = this.withdrawForm.withdrawReason.replace(/\s*/g, '')
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

      this.dialogTitle = '撤回'

      if (this.$refs.withdrawForm) this.$refs.withdrawForm.clearValidate()
    },

    closeWithdraw() {
      this.show.authorize = false
      this.remarks = '身份信息错误'
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
    }
  }
}
</script>

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

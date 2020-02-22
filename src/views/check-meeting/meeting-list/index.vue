<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-excel-download
      v-if="hasAllPrisonQueryAuth"
      path="/download/exportMettings"
      :params="filter" />
    <m-search
      :items="searchItems"
      ref="search"
      @searchSelectChange="searchSelectChange"
      @search="onSearch" >
      <template #append>
        <template v-if="!hasAllPrisonQueryAuth && tabs === 'PENDING'">
          <el-button
            type="primary"
            :disabled="authorizeButtonDisabledStatus"
            plain
            @click="handleAuthorizationMeetions">授权</el-button>
        </template>
      </template>
    </m-search>
    <el-col :span="24">
      <el-tabs
        v-model="tabs"
        type="card">
        <template v-for="(tab, index) in tabsItems">
          <el-tab-pane
            :key="index"
            :label="tab.label"
            :name="tab.name" />
        </template>  
      </el-tabs>
      <m-table-new
        stripe
        :data="meetings.contents"
        @sort-change="sortChange"
        @selection-change="onSelectionChange"
        :cols="tableCols" >
        <template
          slot-scope="scope"
          slot="meetingTime">
          <span >{{ scope.row.meetingTime || scope.row.applicationDate }}</span>
        </template>
        <template
          slot-scope="scope"
          slot="families">
          <div v-if="scope.row.filterFamilies && scope.row.filterFamilies.length">
            <el-button
              type="text"
              size="small"
              v-for="family in scope.row.filterFamilies"
              :key="family.familyId"
              style="margin-left: 0px; margin-right: 8px;"
              @click="showFamilyDetail(family.familyId, scope.row.id)">{{ family.familyName }}</el-button>
          </div>
        </template>
        <template
          slot-scope="scope"
          slot="content">
          <span v-if="!scope.row.content">
            <template v-if="scope.row.status === 'PENDING' && scope.row.isLock === 1">处理中</template>
            <template v-else>{{ scope.row.status | applyStatus }}</template>
          </span>
          <el-tooltip
            v-else
            :content="scope.row.content"
            placement="top" >
            <span v-if="scope.row.status === 'PENDING' && scope.row.isLock === 1">处理中</span>
            <span v-else>{{ scope.row.status | applyStatus }}</span>
          </el-tooltip>
        </template>
        <template
          slot-scope="scope"
          slot="operate">
          <el-button
            v-if="scope.row.status == 'PENDING' && scope.row.isLock !== 1"
            size="mini"
            @click="handleAuthorization(scope.row)">授权</el-button>
          <el-button
            v-else-if="scope.row.status === 'PASSED' && scope.row.isWithdrawFlag === 1"
            size="mini"
            @click="handleWithdraw(scope.row)">撤回</el-button>
          <el-button
            v-if="scope.row.status != 'PENDING'"
            type="text"
            size="mini"
            class="button-detail"
            @click="onDetail(scope.row)">详情</el-button>
        </template>
      </m-table-new>
    </el-col>
    <m-pagination
      ref="pagination"
      :total="meetings.total"
      :pageSizes="paginationPageSizes"
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
        <repetition-el-buttons :buttonItems="authorizeButtons" />
      </div>
      <div
        v-if="show.agree"
        class="button-box">
        <repetition-el-buttons :buttonItems="showAgreeButtons" />
      </div>
      <div
        v-if="show.disagree"
        class="button-box">
        <div style="margin-bottom: 10px;">请选择驳回原因</div>
        <el-select
          v-if="authorizeMeetingStatus.operation"
          v-model="remarks" >
          <el-option
            v-for="(remark,index) in frontRemarks"
            :value="remark"
            :label="remark"
            :key="index"/>
        </el-select>
        <m-form
          v-if="remarks === '其他' || authorizeMeetingStatus.batch"
          class="withdraw-box"
          ref="refuseForm"
          :items="authorizeFormItems"
          @submit="onAuthorization('DENIED', $event)" />
        <repetition-el-buttons :buttonItems="showDisagreebuttons" />
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="show.withdraw"
      @close="closeWithdraw"
      class="authorize-dialog"
      title="撤回"
      width="530px">
      <m-form
        ref="dialogForm"
        class="withdraw-form"
        :items="withdrawFormItems"
        @submit="onWithdraw"
        @cancel=" show.withdraw = false " />
    </el-dialog>
    <el-dialog
      :visible.sync="toShow.id ? true : false"
      :title="'家属：' + toShow.name"
      width="530px"
      class="authorize-dialog"
      @close="onCloseShow">
      <family-to-show
        :elItems="familyShows"
        :showData="toShow">
        <template #auditAt="{ toShow }">{{ toShow.auditAt | Date }}</template>
        <template #status="{ toShow }">{{ toShow.status | applyStatus }}</template>
        <template #duration="{ toShow }">{{ toShow.duration | time }}</template>
      </family-to-show>
    </el-dialog>
    <el-dialog
      title="家属信息"
      class="authorize-dialog"
      :visible.sync="show.familiesDetialInform"
      @close="closeFamilyDetail">
      <family-detial-information
        :elItems="familyDetailInformationItems"
        :detailData="family">
        <template #familyIdCardFront="{ scope }">
          <m-img-viewer
            v-if="scope.familyIdCardFront"
            :url="scope.familyIdCardFront"
            title="身份证正面"/>
        </template>
        <template #familyIdCardBack="{ scope }">
          <m-img-viewer
            v-if="scope.familyIdCardBack"
            :url="scope.familyIdCardBack"
            title="身份证背面"/>
        </template>
        <template #familyRelationalProofUrl="{ scope }">
          <m-img-viewer 
            v-if="scope.familyRelationalProofUrl"
            :url="scope.familyRelationalProofUrl"
            title="关系证明图"/>
        </template>
      </family-detial-information>
    </el-dialog>
    <el-dialog
      title="请选择会见时间段"
      class="authorize-dialog"
      :width="'88%'"
      :visible.sync="show.meetingTime"
      @close="onCloseMeetingTimeDialog">
      <meeting-time
        v-model="meetingConfigs"
        :tableProps="meetingTimeProps.tableProps"/>
      <template #footer>
        <el-button
          type="primary"
          size="medium"
          :loading="meetingTimeBtnLoading"
          :disabled="meetingConfigs.isSelected"
          @click="handleAuthorizeSingleMeeting">确定</el-button>
        <el-button
          type="warning"
          size="medium"
          @click="onCloseMeetingTimeDialog">取消</el-button>
      </template>
    </el-dialog>
  </el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import validator, { helper } from '@/utils'
import prisonFilterCreator from '@/mixins/prison-filter-creator'
import prisons from '@/common/constants/prisons'
import MeetingTime from './meeting-time'
import cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'meetingList',

  mixins: [prisonFilterCreator],

  data() {
    // 标签元素
    const tabsItems = [
      {
        label: '会见申请',
        name: 'first' },
      {
        label: '未授权',
        name: 'PENDING'
      }
    ]
    // 证件照片class
    const idCardClassName = 'img-idCard'
    // 授权对话框的返回按钮
    const goBackButton = {
      text: '返回',
      attrs: { plain: true }
    }
    // 授权对话框的关闭按钮
    const closeButton = {
      text: '关闭',
      attrs: {
               plain: true,
               type: 'danger'
             },
      events: { click: this.onCloseAuthorize }
    }
    const { belong } = prisons.PRISONAREA
    const { options } = this.$store.getters.prisonAreaOptions
    return {
      tabsItems,
      tabs: 'PENDING',
      searchItems: {
        name: {
                type: 'input',
                label: '家属姓名'
              },
        prisonerNumber: {
                          type: 'input',
                          label: '罪犯编号'
                        },
        prisonArea: {
                      type: 'select',
                      label: '监区',
                      options,
                      belong
                    },
        applicationDate: {
                           type: 'date',
                           label: '会见时间'
                         },
        auditName: {
                     type: 'input',
                     label: '审核人',
                     miss: true
                   },
        status: {
                  type: 'select',
                  label: '审核状态',
                  options: this.$store.state.applyStatus,
                  miss: true,
                  value: ''
                },
        auditAt: {
                   type: 'date',
                   label: '审核时间',
                   miss: true
                 }
      },
      show: {
        authorize: false,
        agree: false,
        disagree: false,
        withdraw: false,
        detail: false,
        familiesDetialInform: false,
        meetingTime: false
      },
      toAuthorize: {},
      toShow: {},
      remarks: '您的身份信息错误',
      family: {},
      sortObj: {},
      buttonLoading: false,
      familyShows: [],
      // 撤回对话框表单组件
      withdrawFormItems: {
        remarks: {
          type: 'textarea',
          autosize: { minRows: 6 },
          rules: ['required'],
          noLabel: true,
          label: '撤回理由'
        },
        buttons: [
          {
            add: 'add',
            text: '确定'
          },
          {
            cancel: 'cancel',
            type: 'danger'
          }
        ]
      },
      // 授权对话框表单组件
      authorizeFormItems: {
        refuseRemark: {
          type: 'textarea',
          autosize: { minRows: 5 },
          rules: [
            'required',
            'lengthRange-200'
          ],
          noLabel: true,
          label: '驳回原因'
        }
      },
      // 家属详情信息组件
      familyDetailInformationItems: [
        {
          label: '姓名',
          prop: 'familyName'
        },
        {
          label: '关系',
          prop: 'relationship'
        },
        {
          label: '身份证正面',
          prop: 'familyIdCardFront',
          definedClass: idCardClassName
        },
        {
          label: '身份证背面',
          prop: 'familyIdCardBack',
          definedClass: idCardClassName
        },
        {
          label: '关系证明图',
          prop: 'familyRelationalProofUrl',
          definedClass: idCardClassName
        }
      ],
      // 授权不同意情况下的按钮元素
      showDisagreebuttons: [
        {
          text: '提交',
          attrs: {
            plain: true,
            loading: this.buttonLoading
          },
          events: { click: this.onDeniedSubmit }
        },
        {
          ...goBackButton,
          events: { click: this.onDisagreeAuthorizeGoBack } },
          closeButton
      ],
      // 授权按钮元素
      authorizeButtons: [
        {
          text: '同意',
          attrs: { plain: true },
          events: { click: this.onAgreeAuthorize }
        },
        {
          text: '不同意',
          attrs: { plain: true },
          events: { click: this.onDisagreeAuthorize }
        },
        closeButton
      ],
      // 授权同意情况下按钮元素
      showAgreeButtons: [
        {
          text: '确定申请通过？',
          attrs: {
            plain: true,
            loading: this.buttonLoading
          },
          events: { click: this.onPassedAuthorize }
        },
        { ...goBackButton,
          events: { click: this.onAgreeAuthorizeGoBack } },
          closeButton
      ],

      // 授权按钮的禁/启用状况
      authorizeButtonDisabledStatus: true,

      // 授权操作的数据
      authorizeMeetingData: [],

      // 授权的方法：批量审核、普通审核(单条)
      authorizeMeetingStatus: {
        // 批量
        batch: false,

        // 普通
        operation: false
      },
      meetingConfigs: {
        isSelected: true,
        terminalId: null,
        meetingTime: ''
      },
      meetingTimeProps: {
        tableProps: []
      },
      meetingTimeBtnLoading: false
    }
  },
  components: {
    // 操作列-详情组件
    'family-to-show': {
      methods: {
        renderItems(h) {
          return this.elItems.map(elItem => {
            const contents = elItem['slotName'] && this.$scopedSlots[elItem['slotName']] ?
            this.$scopedSlots[elItem['slotName']]({
              toShow: this.showData}) : this.showData[elItem['prop']]
            return h('div', {
              style: elItem.style || { width: '50%' },
              key: elItem.label + this.showData.id
            }, [ h('label', elItem.label + '：'), h('span', contents)])
          })
        }
      },
      render(h) {
        return h('div', {
          attrs: {
            class: 'flex-dialog'
          }
        }, this.renderItems(h))
      },
      props: {
        elItems: {
          type: Array,
          default: () => []
        },
        showData: {
          type: Object,
          default: () => ({})
        }
      }
    },
    // 家属详细信息组件
    'family-detial-information': {
      template:
        `<div>
          <el-row
            :gutter="20"
            v-for="(item, index) in elItems"
            :key="'id-family-detail-information-item-' + index">
            <el-col :class="item.definedClass">
              <label>{{ item.label }}：</label>
              <template>
                <slot
                  :name="item.prop"
                  :scope="detailData">
                  <span>{{ detailData[item['prop']] }}</span>
                </slot>
              </template>
            </el-col>
          </el-row>
        </div>`,
      props: {
        elItems: {
          type: Array,
          default: () => []
        },
        detailData: {
          type: Object,
          default: () => ({})
        }
      }
    },
    // 多次复用的el-button组件
    'repetition-el-buttons': {
      template:
        `<el-row>
          <el-button
            v-bind="button.attrs"
            v-on="button.events"
            v-for="(button, index) in buttonItems"
            :key="'id-repetition-el-button-' + index">
            {{ button.text }}
          </el-button>
        </el-row>`,
      props: {
        buttonItems: {
          type: Array,
          default: () => []
        }
      }
    },
    MeetingTime
  },
  computed: {
    ...mapState([
      'meetings',
      'frontRemarks',
      'meetingRefresh',
      'meetingTimes'
    ]),
    tableCols() {
      const basicCols = [
        {
          label: '罪犯编号',
          prop: 'prisonerNumber'
        },
        {
          label: '监区',
          prop: 'prisonArea'
        },
        {
          label: '申请时间',
          prop: 'createdAt',
          width: 150
        },
        {
          label: '会见时间',
          slotName: 'meetingTime',
          sortable: 'custom',
          width: 150
        },
        {
          label: '罪犯姓名',
          prop: 'prisonerName'
        },
        {
          label: '家属',
          slotName: 'families'
        },
        {
          label: '申请状态',
          slotName: 'content',
          width: 110,
          className: 'orange'
        }
      ],
        allPrisonQueryAuthLeadingCols = [
          {
            label: '监狱名称',
            prop: 'jailName'
          }
        ],
        noAllPrisonQueryAuthLeadingCols = [
          {
            label: '操作',
            slotName: 'operate',
            width: 160,
            align: 'center'
          }
        ]
        const selectionCol = [{ type: 'selection' }]
        if (this.hasAllPrisonQueryAuth) return [
          ...allPrisonQueryAuthLeadingCols,
          ...basicCols
        ]
        else {
          const noAllPrisonQueryAuthCols = [
            ...basicCols,
            ...noAllPrisonQueryAuthLeadingCols
          ]
          if (this.tabs === 'PENDING') return [
            ...selectionCol,
            ...noAllPrisonQueryAuthCols
          ]
          else return noAllPrisonQueryAuthCols
        }
    },
    paginationPageSizes () {
      if (!this.hasAllPrisonQueryAuth && this.tabs === 'PENDING') return [10]
    }
  },
  watch: {
    meetingRefresh(val) {
      if (val) {
        if (!this.show.authorize && !this.show.withdraw && !this.toShow.id && !this.show.familiesDetialInform) this.getDatas('meetingRefresh')
      }
    },
    tabs(val) {
      this.$refs.search.onSearch('tabs')
      if (val !== 'first') {
        this.searchItems.status.miss = true
        this.searchItems.auditAt.miss = true
        this.searchItems.auditName.miss = true
        delete this.filter.auditAt
        delete this.filter.auditName
        this.searchItems.auditName.value = ''
        this.searchItems.auditAt.value = ''
        this.searchItems.status.value = ''
      }
      else {
        delete this.filter.status
        this.searchItems.status.miss = false
        this.searchItems.auditName.miss = false
        this.searchItems.auditAt.miss = false
      }
      this.onSearch()
    },
    toShow: {
      handler: function(val) {
        if (val.id) this.show.detail = true
        else this.show.detail = false
      },
      deep: true
    }
  },
  mounted() {
    this.getDatas('mounted')
  },
  methods: {
    ...mapActions([
      'getMeetings',
      'getMeetingsAll',
      'authorizeMeeting',
      'withdrawMeeting',
      'getMeetingsFamilyDetail',
      'getMeettingsDetail',
      'meetingApplyDealing',
      'authorizeBatchMeetings',
      'getMeetingTimes',
      'authorizeSingleMeeting'
    ]),
    getDatas(e) {
      if (this.tabs !== 'first') this.filter.status = this.tabs
      const params = {
        ...this.filter,
        ...this.pagination
      }

      if (this.hasAllPrisonQueryAuth) this.getMeetingsAll(params)
      else {
        this.getMeetings(params).then(res => {
          if (!res) return
          if (this.meetingRefresh) this.meetingApplyDealing()
        })
      }
    },
    onSearch() {
      if (helper.isEmptyObject(this.sortObj)) this.filter = Object.assign(this.filter, this.sortObj)
      else {
        this.$refs.elTable && this.$refs.elTable.clearSort()
        delete this.filter.sortDirection
        delete this.filter.orderField
      }
      this.$refs.pagination.handleCurrentChange(1)
    },
    // 单条审核
    handleAuthorization(e) {
      this.toAuthorize = e
      this.onShowAuthorizationDialog()
      this.$set(this.authorizeMeetingStatus, 'operation', true)
      this.$set(this.authorizeMeetingStatus, 'batch', false)
    },
    handleWithdraw(e) {
      this.toAuthorize = e
      this.show.withdraw = true
    },
    onDetail(e) {
      const constFamilyShows = [
        {
          label: '与囚犯关系',
          prop: 'relationship',
          style: { width: '100%' }
        },
        {
          label: '预约时间',
          prop: 'meetingTime'
        },
        {
          label: '终端号',
          prop: 'terminalNumber'
        },
        {
          label: '审核人账号',
          prop: 'auditUserName'
        },
        {
          label: '审核人姓名',
          prop: 'auditRealName'
        },
        {
          label: '审核时间',
          slotName: 'auditAt'
        },
        {
          label: '审核状态',
          slotName: 'status'
        },
        {
          label: '会见时长',
          slotName: 'duration'
        },
        {
          label: '拒绝原因',
          prop: 'content',
          style: { width: '100%' }
        }
      ],
      params = { meetingId: e.id }
      this.getMeettingsDetail(params).then(res => {
        if (!res) return
        this.toShow = Object.assign({}, res)
        this.familyShows = this.toShow.status !== 'DENIED'
          ? constFamilyShows.slice(0, constFamilyShows.length - 1)
          : constFamilyShows
      })
    },
    onCloseShow() {
      this.toShow.id = ''
      if (this.meetingRefresh) this.getDatas('onCloseShow')
    },
    closeFamilyDetail() {
      this.family = {}
      this.show.familiesDetialInform = false
      if (this.meetingRefresh) this.getDatas('closeFamilyDetail')
    },
    // 授权不同意情况下的提交操作
    onDeniedSubmit() {
      if (this.$refs.refuseForm) this.$refs.refuseForm.onSubmit()
      else this.onAuthorization('DENIED')
    },
    // 授权对话框的关闭操作
    onCloseAuthorize() {
      this.show.authorize = false
    },
    // 授权对话框的同意操作
    onAgreeAuthorize() {
      if (this.authorizeMeetingStatus.batch) {
        // 批量审核操作
        this.show.agree = true
        this.buttonLoading = false
      }
      if (this.authorizeMeetingStatus.operation) {
        // 单条审核
        // 这里传递数据给子组件
        (async() => {
          const { id, name } = this.toAuthorize
          await this.getMeetingTimes({ id })
          const { meetingQueue, meetings, terminals, applicationDate } = this.meetingTimes
          // 列名
          const meetingTimeTableProps = meetingQueue.map(queue => ({ label: queue, prop: queue }))
          const meetingTimeTableQueueData = meetingQueue.reduce((total, value) => {
            total = Object.assign({},  total, { [value]: ''})
            return total
          }, {[meetingQueue[0]]: ''})
          // 数据 需要根据列明来初始话数据样式
          const meetingTimeTableData = terminals.map((terminal, index) => {
            // 终端id 是要传给后台的 终端号是要显示出来的
            const { id, terminalNumber } = terminal
            let meetingTimeTableQueueCopyData = helper.deepCopy(meetingTimeTableQueueData)

            meetings.map(meetingItem => {
              // 时间段 家属姓名 终端号
              const { meetingTime, name, terminalId } = meetingItem
              const meetingTimeProp = meetingTime.replace(`${applicationDate} `, '')
              if (terminalId === id) meetingTimeTableQueueCopyData[meetingTimeProp] = name
              return meetingItem
            })

            return { terminalId: id, terminalNumber, ...meetingTimeTableQueueCopyData, indexNumber: index }
          })
          this.$set(this.meetingTimeProps, 'tableProps', meetingTimeTableProps)
          this.$set(this.meetingConfigs, 'tableData', cloneDeep(meetingTimeTableData))
          this.$set(this.meetingConfigs, 'originTableData', cloneDeep(meetingTimeTableData))
          this.$set(this.meetingConfigs, 'familyName', name)
          this.show.meetingTime = true
        })()
      }
    },
    // 授权对话框的不同意操作
    onDisagreeAuthorize() {
      this.show.disagree = true
      this.buttonLoading = false
    },
    // 授权对话框同意情况下的确认操作
    onPassedAuthorize() {
      this.onAuthorization('PASSED')
    },
    // 授权对话框同意情况下的返回操作
    onAgreeAuthorizeGoBack() {
      this.show.agree=false
    },
    // 授权对话框不同意情况下的返回操作
    onDisagreeAuthorizeGoBack() {
      this.closeAuthorize('back')
    },
    onAuthorization(e, args) {
      // let params = { id: this.toAuthorize.id, status: e }
      let params = { status: e }
      if (e === 'DENIED') {
        if (this.remarks === '其他' || this.authorizeMeetingStatus.batch) {
          const { refuseRemark } = args
          params.remarks = refuseRemark
        }
        else params.remarks = this.remarks
        if (params.remarks) this.handleSubmit(params)
      }
      else this.handleSubmit(params)
    },

    async handleSubmit(params) {
      this.buttonLoading = true
      if (this.authorizeMeetingStatus.batch) {
        // 批量审核多条同意
        const ids = (this.authorizeMeetingData.map(meeting => meeting.id)).join(',')
        const meetings = Object.assign({}, { ids }, params)
        await this.authorizeBatchMeetings(meetings)
         this.loading = false
      }
      if (this.authorizeMeetingStatus.operation) {
        // 普通审核
        const meeting = Object.assign({}, { id: this.toAuthorize.id }, params)
        const res = await this.authorizeMeeting(meeting)
         this.loading = false
        if (!res) return
        this.toAuthorize = {}
      }
      this.closeAuthorize()
      this.getDatas('handleSubmit')
    },
    onWithdraw(arg) {
      const { remarks } = arg
      const params = {
        id: this.toAuthorize.id,
        status: 'CANCELED',
        remarks
      }
      this.withdrawMeeting(params).then(res => {
        if (!res) return
        this.closeWithdraw(true)
        this.toAuthorize = {}
        this.getDatas('onWithdraw')
      })
    },
    closeAuthorize(e) {
      if (e === 'back') this.show.disagree = false
      else {
        this.show.authorize = false
        if (this.meetingRefresh) this.getDatas('closeAuthorize')
      }
      this.remarks = '您的身份信息错误'
    },
    closeWithdraw(e) {
      this.$refs.dialogForm && this.$refs.dialogForm.onCancel()
      if (e !== true && this.meetingRefresh) this.getDatas('closeWithdraw')
    },
    showFamilyDetail(...args) {
      const [ familyId, meetingId ] = args
      this.show.familiesDetialInform = true
      this.getMeetingsFamilyDetail({ meetingId, familyId }).then(res => {
        if (!res.family) return
        this.family = Object.assign({}, res.family)
      })
    },
    sortChange({ column, prop, order }) {
      if (!prop && !order) {
        this.sortObj = {}
        delete this.filter.sortDirection
        delete this.filter.orderField
      }
      else {
        this.sortObj.orderField = prop
        if (order === 'descending') this.sortObj.sortDirection = 'desc'
        else if (order === 'ascending') this.sortObj.sortDirection = 'asc'
        this.filter = Object.assign(this.filter, this.sortObj)
      }
      this.getDatas('sortChange')
    },

    // 复选框选中内容变化时
    onSelectionChange(meetings) {
      this.authorizeButtonDisabledStatus = meetings && meetings.length ? false : true

      this.authorizeMeetingData = meetings
    },

    // 点击授权按钮时候的方法
    handleAuthorizationMeetions() {
      this.onShowAuthorizationDialog()

      this.$set(this.authorizeMeetingStatus, 'operation', false)

      this.$set(this.authorizeMeetingStatus, 'batch', true)

    },

    // 显示授权对话框
    onShowAuthorizationDialog() {
      this.show.agree = false
      this.show.disagree = false
      this.show.authorize = true
    },
    onCloseMeetingTimeDialog() {
      this.show.meetingTime = false
      this.$set(this.meetingConfigs, 'isSelected', true)
    },
    // 单条审核通过
    async handleAuthorizeSingleMeeting() {
      const { id } = this.toAuthorize
      const { meetingTime, terminalId } = this.meetingConfigs
      const { prisonArea, jailId, applicationDate, isBranchprison } = this.meetingTimes
      this.meetingTimeBtnLoading = true
      await this.authorizeSingleMeeting({
        meetingId: id,
        prisonArea,
        jailId,
        applicationDate,
        isBranchprison,
        terminalId,
        meetingTime: `${applicationDate} ${meetingTime}` })
      this.meetingTimeBtnLoading = false
      this.onCloseMeetingTimeDialog()
      this.closeAuthorize()
      await this.getDatas('authorizeSingleMeeting')
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../assets/css/list";
.el-table /deep/ {
  th {
    padding: 5px 0 3px !important;
  }
}
</style>

<style type="text/stylus" lang="stylus" scoped>
.cell img
  width: 126.8px;
  cursor: pointer;
.button-detail
  display: block;
  margin-left: 0;
  width: 56px;
.flex-dialog
  display: flex;
  flex-wrap: wrap;
  >>> label
        display: inline-block;
        width: 90px;
        text-align: right;
.withdraw-box
  margin-bottom: 20px;
img
  display: block;
.img-idCard
  min-width: 350px;
.withdraw-form
 >>> .button-box
       padding-bottom: 0px
.el-image
  display: block;
  width: 342.4px;
  height: 216px;
  >>> img
        width: 100%;
        height: 100%;
</style>

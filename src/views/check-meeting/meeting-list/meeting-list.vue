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
      @search="onSearch" />
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
        <el-select v-model="remarks">
          <el-option
            v-for="(remark,index) in frontRemarks"
            :value="remark"
            :label="remark"
            :key="index"/>
        </el-select>
        <m-form
          v-if="remarks === '其他'"
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
      class="family-dialog"
      :visible.sync="show.familiesDetialInform"
      @close="closeFamilyDetail">
      <family-detail-information
        :elItems="familyDetailInformationItems"
        :detailData="family">
        <template #familyInformation="{ scope }">
          <div class="img-items">
            <m-img-viewer
            v-if="scope.familyIdCardFront"
            :url="scope.familyIdCardFront"
            title="身份证正面"
            />
            <m-img-viewer
            v-if="scope.familyIdCardBack"
            :url="scope.familyIdCardBack"
            title="身份证背面"
            />
            <m-img-viewer
            v-if="scope.familyAvatarUrl"
            :url="scope.familyAvatarUrl"
            title="头像"
            />
          </div>       
        </template>
        <template #familyRelationalInformation="{ scope }">
          <div class="img-items">
            <m-img-viewer
              v-if="scope.familyRelationalProofUrl"
              class="relation_img"
              :url="scope.familyRelationalProofUrl"
              title="关系证明图"
            />
            <m-img-viewer
              v-if="scope.familyRelationalProofUrl2"
              class="relation_img"
              :url="scope.familyRelationalProofUrl2"
              title="关系证明图"
            />
            <m-img-viewer
              v-if="scope.familyRelationalProofUrl3"
              class="relation_img"
              :url="scope.familyRelationalProofUrl3"
              title="关系证明图"
            />
            <m-img-viewer
              v-if="scope.familyRelationalProofUrl4"
              class="relation_img"
              :url="scope.familyRelationalProofUrl4"
              title="关系证明图"
            />
          </div>
        </template>
        <template #familyMeetNoticeInformation="{ scope }">
          <div class="img-items">
            <m-img-viewer
              v-if="scope.meetNoticeUrl"
              :url="scope.meetNoticeUrl"
              title="会见通知单"
            />
          </div>
        </template>
        <!-- <template #familyIdCardFront="{ scope }">
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
        </template> -->
      </family-detail-information>
    </el-dialog>
  </el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import validator, { helper } from '@/utils'
import prisonFilterCreator from '@/mixins/prison-filter-creator'
import prisons from '@/common/constants/prisons'
import registrationDialogCreator from '@/mixins/registration-dialog-creator'

export default {
  mixins: [prisonFilterCreator, registrationDialogCreator],
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
    // const idCardClassName = 'img-idCard'
    const { belong } = prisons.PRISONAREA
    const { options } = this.$store.getters.prisonAreaOptions
    const freeMeetingsOptions = [
      {
        label: '是',
        value: 1
      },
      {
        label: '否',
        value: 0
      }
    ]
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
          belong,
          value: ''
        },
        // applicationDate: {
        //   type: 'date',
        //   label: '会见时间',
        //   miss: true,
        //   value: ''
        // },
        applicationDate: {
          type: 'dateRange',
          unlinkPanels: true,
          startPlaceholder: '会见开始时间',
          endPlaceholder: '会见结束时间',
          start: 'applicationStartDate',
          end: 'applicationEndDate',
          startPlaceholder: '会见开始时间',
          endPlaceholder: '会见结束时间'
          // miss: true,
          // value: ''
        },
        auditName: {
          type: 'input',
          label: '审核人',
          miss: true,
          value: ''
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
          miss: true,
          value: ''
        },
        isFree: {
          type: 'select',
          label: '免费会见',
          options: freeMeetingsOptions,
          miss: true,
          value: ''
        }
      },
      show: {
        authorize: false,
        agree: false,
        disagree: false,
        withdraw: false,
        detail: false,
        familiesDetialInform: false
      },
      toAuthorize: {},
      toShow: {},
      family: {},
      sortObj: {},
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
          label: '家属信息',
          prop: 'familyInformation',
          definedClass: 'img-box'
        },
        {
          label: '关系证明',
          prop: 'familyRelationalInformation',
          definedClass: 'img-box'
        },
        {
          label: '会见通知单',
          prop: 'familyMeetNoticeInformation',
          definedClass: 'img-box'
        }
        // {
        //   label: '身份证正面',
        //   prop: 'familyIdCardFront',
        //   definedClass: idCardClassName
        // },
        // {
        //   label: '身份证背面',
        //   prop: 'familyIdCardBack',
        //   definedClass: idCardClassName
        // },
        // {
        //   label: '关系证明图',
        //   prop: 'familyRelationalProofUrl',
        //   definedClass: idCardClassName
        // }
      ]
    }
  },
  computed: {
    ...mapState([
      'meetings',
      'frontRemarks',
      'meetingRefresh'
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
          minWidth: 130
        },
        {
          label: '会见时间',
          slotName: 'meetingTime',
          sortable: 'custom',
          minWidth: 135
        },
        {
          label: '罪犯姓名',
          prop: 'prisonerName',
          showOverflowTooltip: true
        },
        {
          label: '家属',
          slotName: 'families',
          minWidth: 115
        },
        {
          label: '申请状态',
          slotName: 'content',
          minWidth: 80,
          className: 'orange'
        }
      ],
        allPrisonQueryAuthLeadingCols = [
          {
            label: '监狱名称',
            prop: 'jailName',
            minWidth: 100,
            showOverflowTooltip: true
          }
        ],
        noAllPrisonQueryAuthLeadingCols = [
          {
            label: '操作',
            slotName: 'operate',
            minWidth: 105,
            align: 'center'
          }
        ]

        const terminaUniquelId = {
          label: '终端唯一标识',
          prop: 'terminalNo',
          minWidth: 100
        }

        if (this.hasAllPrisonQueryAuth || this.hasProvinceQueryAuth) {
          let cols = [
            {
              label: '省份',
              prop: 'provinceName'
            },
            ...allPrisonQueryAuthLeadingCols,
            ...basicCols
          ]

          if (this.tabs === 'first') cols = [ ...cols, terminaUniquelId ]

          return cols
        }
        else return [
          ...basicCols,
          ...noAllPrisonQueryAuthLeadingCols
        ]
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
        this.searchItems.isFree.miss = true
        this.searchItems.status.miss = true
        this.searchItems.auditAt.miss = true
        this.searchItems.auditName.miss = true
        delete this.filter.auditAt
        delete this.filter.auditName
        delete this.filter.isFree
        this.searchItems.auditName.value = ''
        this.searchItems.auditAt.value = ''
        this.searchItems.status.value = ''
        this.searchItems.isFree.value = ''
      }
      else {
        if (this.hasAllPrisonQueryAuth || this.hasProvinceQueryAuth) {
          this.searchItems.isFree.miss = false
        } else {
          this.searchItems.isFree.miss = true
          delete this.filter.isFree
          this.searchItems.isFree.value = ''
        }
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
    // if (this.hasAllPrisonQueryAuth || this.hasProvinceQueryAuth) {
    //   this.$set(this.searchItems.applicationDate, 'miss', true)
    //   this.$set(this.searchItems.applicationDateAdmin, 'miss', false)
    // } else {
    //   this.$set(this.searchItems.applicationDate, 'miss', false)
    //   this.$set(this.searchItems.applicationDateAdmin, 'miss', true)
    // }
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
      'meetingApplyDealing'
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
    handleAuthorization(e) {
      this.toAuthorize = e
      this.show.agree = false
      this.show.disagree = false
      this.show.authorize = true
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
      this.show.familiesDetialInform = false
      if (this.meetingRefresh) this.getDatas('closeFamilyDetail')
    },
    //覆盖mixin 授权不同意情况下的提交操作
    onDeniedSubmit() {
      if (this.$refs.refuseForm) this.$refs.refuseForm.onSubmit()
      else this.onAuthorization('DENIED')
    },
    //覆盖mixin 授权对话框的关闭操作
    onCloseAuthorize() {
      this.show.authorize = false
    },
    //覆盖mixin 授权对话框的同意操作
    onAgreeAuthorize() {
      this.show.agree = true
      this.buttonLoading = false
    },
    //覆盖mixin 授权对话框的不同意操作
    onDisagreeAuthorize() {
      this.show.disagree = true
      this.buttonLoading = false
    },
    //覆盖mixin 授权对话框同意情况下的确认操作
    onPassedAuthorize() {
      this.onAuthorization('PASSED')
    },
    //覆盖mixin 授权对话框同意情况下的返回操作
    onAgreeAuthorizeGoBack() {
      this.show.agree=false
    },
    //覆盖mixin 授权对话框不同意情况下的返回操作
    onDisagreeAuthorizeGoBack() {
      this.closeAuthorize('back')
    },
    onAuthorization(e, args) {
      let params = { id: this.toAuthorize.id, status: e }
      if (e === 'DENIED') {
        if (this.remarks === '其他') {
          const { refuseRemark } = args
          params.remarks = refuseRemark
        }
        else params.remarks = this.remarks
        if (params.remarks) this.handleSubmit(params)
      }
      else this.handleSubmit(params)
    },
    handleSubmit(params) {
      this.buttonLoading = true
      this.authorizeMeeting(params).then(res => {
        this.buttonLoading = false
        if (!res) return
        this.closeAuthorize()
        this.toAuthorize = {}
        this.getDatas('handleSubmit')
      })
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
      this.getMeetingsFamilyDetail({ meetingId, familyId }).then(res => {
        if (res.family) this.family = Object.assign({}, res.family)
        else this.family = {}
        this.show.familiesDetialInform = true
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
.withdraw-form
 >>> .button-box
       padding-bottom: 0px
.img-box
  display: flex;
  flex-direction: column !important;
  .img-items
    padding-top: 10px;
    .el-image
      width: 32%;
      height: 110px;
      margin-bottom: 5px;
      box-shadow: 0 0 5px #ddd;
      >>> img
        width: 100%;
        height: 100%;
        cursor: pointer;
.el-image.relation_img
  width: 24% !important;
.family-dialog
  >>> .el-dialog__body
    padding: 10px 20px !important;
  >>> .el-dialog__header
    border-bottom: 1px solid #f4f4f4 !important;
.button-box
  >>> .el-button
    &:first-of-type
      margin-left: 0px !important;
</style>

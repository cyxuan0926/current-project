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
        :data="meetingsDiplomats.contents"
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
          slot="status">
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
      :total="meetingsDiplomats.total"
      @onPageChange="getDatas" />
    <el-dialog
      :visible.sync="show.authorize"
      class="authorize-dialog"
      @close="closeAuthorize"
      title="授权"
      width="800px">
      <div>
        审批单：
        <div class="img-items">
          <m-img-viewer
            url="toshow.approvalImageUrl"
            title="审批单"
          />
        </div>
      </div>
      <div
        v-if="!show.agree && !show.disagree"
        class="button-box">
        <repetition-el-buttons :buttonItems="authorizeButtons" />
      </div>
      <div
        v-if="show.agree"
        class="button-box">

        <el-form  label-width="180px">
          <el-form-item label="请设置可视电话时间段：">
            <el-time-picker
              style="width: 150px;margin-right: 15px"
              v-model="valueTime"
              format="HH:mm"
              @change="timeChange"
              placeholder="选择时间">
            </el-time-picker>
            至<el-input style="width: 150px;margin-left: 15px" v-model="this.endTime" :disabled="true" placeholder="请输入内容"></el-input>

          </el-form-item>
          <el-form-item label="请选择可视频终端：">
            <el-select v-model="selectValue"  placeholder="请选择视频终端" style="width: 350px">
              <el-option
                v-for="item in selectOptions"
                :key="item.terminalId"
                :label="item.terminalNumber"
                :value="item.terminalId">
              </el-option>
            </el-select>
          </el-form-item>
          <p style="margin-bottom: 22px;height: 40px;line-height: 40px"><label style="margin-right: 4px;color:#f56c6c ">*</label>提示：当前监狱家属可视电话时间段为"{{clashTime}}",外交领事馆可视电话时间请勿与之冲突</p>
        </el-form>
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
      width="650px">
      <m-form
        ref="dialogForm"
        class="withdraw-form"
        :items="withdrawFormItems"
        @submit="onWithdraw"
        @cancel=" show.withdraw = false " />
    </el-dialog>
    <el-dialog
      :visible.sync="toShow.id ? true : false"
      :title="'姓名：' + toShow.name"
      width="650px"
      class="authorize-dialog"
      @close="onCloseShow">
      <el-form  label-width="120px">
        <el-form-item label="所在机构/馆名:">
          {{toShow.orgName}}
        </el-form-item>
        <div style="display: flex">
          <div  style="flex: 1">
            <el-form-item label="预约时间:">
              {{toShow.meetingTime}}
            </el-form-item>
            <el-form-item label="审核人账号:">
              {{toShow.auditUserName}}
            </el-form-item>
            <el-form-item label="审核时间:">
              {{toShow.applicationDate}}
            </el-form-item>
            <el-form-item label="通话时长:">
              {{toShow.duration}}
            </el-form-item>
          </div>
          <div style="flex: 1">
            <el-form-item label="终端号:">
              {{toShow.terminalNumber}}
            </el-form-item>
            <el-form-item label="审核人姓名:">
              {{toShow.auditRealName}}
            </el-form-item>
            <el-form-item label="审核状态:">
              <span v-if="toShow.status=='PENDING'">
                待审核
              </span>
              <span v-if="toShow.status=='CANCELED'">
                已取消
              </span>
              <span v-if="toShow.status=='DENIED'">
                已拒绝
              </span>
              <span v-if="toShow.status=='EXPIRED'">
                已过期
              </span>
              <span v-if="toShow.status=='FINISHED'">
                已完成
              </span>
              <span v-if="toShow.status=='MEETING_ON'">
                会见中
              </span>
              <span v-if="toShow.status=='PASSED'">
                审核通过
              </span>
            </el-form-item>
          </div>
        </div>
        <el-form-item>
          审批单：
          <div class="img-items">
            <m-img-viewer
              url="toshow.approvalImageUrl"
              title="审批单"
            />
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      title="查看信息"
      class="authorize-dialog"
      :visible.sync="show.familiesDetialInform"
      @close="closeFamilyDetail">
      <family-detail-information
        :elItems="familyDetailInformationItems"
        :detailData="family">
        <template #familyInformation="{ scope }">
          <div class="img-items">
          <m-img-viewer
            isRequired
            :url="scope.familyAvatarUrl"
            title="人脸照片"
          />
          <m-img-viewer
            isRequired
            :url="scope.familyIdCardFront"
            title="身份证正面"
          />
          <m-img-viewer
            isRequired
            :url="scope.familyIdCardBack"
            title="身份证背面"
          />
        </div>
        </template>
        <template #approvalImageUrl="{ scope }">
          <div class="img-items">
          <m-img-viewer 
            :url="scope.approvalImageUrl"
            title="审批单"
          />
          </div>
        </template>
      </family-detail-information>
    </el-dialog>
  </el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import validator, { helper } from '@/utils'
import prisonFilterCreator from '@/mixins/prison-filter-creator'
import prisons from '@/common/constants/prisons'
import http from '@/service'
import { Message } from 'element-ui'

export default {
  mixins: [prisonFilterCreator],
  data() {
    // 标签元素
    const tabsItems = [
      {
        label: '可视电话申请',
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
      valueTime:new Date(),
      startTime:"",
      endTime:"",
      selectValue:"",
      clashTime:"",
      selectOptions: [],
      tabs: '',
      searchItems: {
        name: {
          type: 'input',
          label: '姓名'
        },
        applicationDate: {
          type: 'dateRange',
          unlinkPanels: true,
          start: 'applicationStartDate',
          end: 'applicationEndDate',
          startPlaceholder: '通话开始时间',
          endPlaceholder: '通话结束时间',
          miss: false,
          // value: ''
        },
        auditName: {
          type: 'input',
          label: '审核人',
          miss: false,
          value: ''
        },
        status: {
          type: 'select',
          label: '审核状态',
          options: this.$store.state.applyStatus,
          miss: false,
          value: ''
        },
        auditAt: {
          type: 'date',
          label: '审核时间',
          value: ''
        },

        // prisonerNumber: {
        //   type: 'input',
        //   miss: true,
        //   label: '罪犯编号'
        // },
        // prisonArea: {
        //   type: 'select',
        //   miss: true,
        //   label: '监区',
        //   options,
        //   belong,
        //   value: ''
        // },
        // applicationDate: {
        //   type: 'date',
        //   label: '会见时间',
        //   miss: true,
        //   value: ''
        // },


        isFree: {
          type: 'select',
          label: '免费会见',
          miss: true,
          options: freeMeetingsOptions,
          value: ''
        }
      },
      show: {
        authorize: false,
        agree: false,
        disagree: false,
        withdraw: false,
        detail: false,
        familiesDetialInform: false,
        timer:false
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
          autosize: { minRows: 2 },
          rules: [
            'required',
            'lengthRange-15'
          ],
          maxlength: 15,
          showWordLimit: true,
          isTrim: true,
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
          label: '所属机构/馆名',
          prop: 'orgName'
        },
        { label: '家属信息',
          prop: 'familyInformation',
          definedClass: 'img-box'
        },
        // {
        //   label: '人脸照片',
        //   prop: 'familyAvatarUrl',
        //   definedClass: idCardClassName
        // },
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
        {
          label: '会见审批单',
          prop: 'approvalImageUrl',
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
          events: { click: this.onDisagreeAuthorize}
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
      ]
    }
  },
  components: {
    // 家属详细信息组件
    'family-detail-information': {
      template:
        `<div>
          <el-row
            :gutter="20"
            v-for="(item, index) in elItems"
            :key="'id-family-detail-information-item-' + index">
            <el-col
              :class="item.definedClass"
              :style="item.definedStyles"
            >
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
    }
  },
  computed: {
    ...mapState([
      'meetingsDiplomats',
      'frontRemarks',
      'meetingRefresh'
    ]),
    tableCols() {
      const basicCols = [
          {
            label: '姓名',
            slotName: 'families'
          },
        // {
        //   label: '罪犯编号',
        //   prop: 'prisonerNumber'
        // },
        {
          label: '所在机构/馆名',
          prop: 'orgName'
        },
        {
          label: '申请时间',
          prop: 'applicationDate',
          minWidth: 130
        },
        {
          label: '申请通话时间',
          slotName: 'meetingTime',
          minWidth: 135
        },
        {
          label: '申请时长',
          prop: 'applyTimes',
          showOverflowTooltip: true
        },

        {
          label: '申请状态',
          slotName: 'status',
          minWidth: 80,
          className: 'orange'
        }
      ],
        allPrisonQueryAuthLeadingCols = [
          {
            label: '监狱名称',
            prop: 'jailName',
            minWidth: 110,
            showOverflowTooltip: true
          }
        ],
        noAllPrisonQueryAuthLeadingCols = [
          {
            label: '操作',
            slotName: 'operate',
            minWidth: 160,
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
  created(){
   this.tabs="PENDING"
  },
  methods: {
    ...mapActions([
      'getMeetingsDiplomats',//表格数据
      'getMeetingsAll',
      'authorizeDiplomatsMeeting',//授权同意接口
      'authorizeMeeting',//授权拒绝接口
      'withdrawMeeting',//撤回操作
      'getMeetingsDiplomatsDetail',//身份证正反面照片
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
        this.getMeetingsDiplomats(params).then(res => {
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
    timeChange(){
      this.startTime=`${this.valueTime.getHours()>9?this.valueTime.getHours():'0'+this.valueTime.getHours()}:${this.valueTime.getMinutes()>9?this.valueTime.getMinutes():'0'+this.valueTime.getMinutes()}`
      let  minutes=parseInt(this.toAuthorize.applyTimes);
      let   interTimes=parseInt(minutes*60*1000);
      let date=new  Date(Date.parse(this.valueTime)+interTimes);
      this.endTime=`${date.getHours()>9?date.getHours():'0'+date.getHours()}:${date.getMinutes()>9?date.getMinutes():'0'+date.getMinutes()}`
      let params={jailId:this.toAuthorize.jailId,meetingDay:this.toAuthorize.applicationDate,start:this.startTime,end:this.endTime}
      this.getUsableTerminal(params)
    },
    getUsableTerminal(params){
      http.getMeetingsUsableTerminal(params).then(res => {
        this.selectOptions=''
        this.selectValue=''
        if(res.status=="success"){
          this.selectOptions=res.list
        }
      })
    },
    getClashTime(){
      let params={jailId:this.toAuthorize.jailId,meetingDay:this.toAuthorize.applicationDate}
        this.clashTime=""
      http.getMeetingsDiplomatsfamilyMeetingTimes(params).then(res => {
        this.clashTime=res
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
     //this.show.timer=true
       this.show.agree = true
       this.timeChange();
       this.getClashTime()
       this.buttonLoading = false
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
      let params = { id: this.toAuthorize.id,terminalId:this.selectValue, start: this.startTime,end:this.endTime,status:""}
      if (e === 'DENIED') {
        params.status='DENIED'
        if (this.remarks === '其他') {
          const { refuseRemark } = args
          params.remarks = refuseRemark
        }
        else params.remarks = this.remarks
        if (params.remarks){
          console.log(params)
          this.buttonLoading = true
          this.authorizeMeeting(params).then(res => {
            this.buttonLoading = false
            if (!res) return
            this.closeAuthorize()
            this.toAuthorize = {}
            this.getDatas('handleSubmit')
          })
        }
      }
      else{
        if(params.id && params.terminalId&&params.start&&params.end){
          this.handleSubmit(params)
        }else{
          Message("请选择时间或视频终端")
        }
      }
    },
    handleSubmit(params) {
      this.buttonLoading = true
      this.authorizeDiplomatsMeeting(params).then(res => {
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
      this.show.familiesDetialInform = true
      this.getMeetingsDiplomatsDetail({ meetingId, familyId }).then(res => {
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

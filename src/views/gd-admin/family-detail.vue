<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-search
      :items="searchItems"
      @searchSelectChange="searchSelectChange"
      @search="onSearch">
      <m-excel-download
        slot="append"
        path="/download/export/meeting/by-province"
        :params="filter" />
    </m-search>
    <el-col :span="24">
      <m-table-new
        :data="tableDatas"
        :cols="tableCols"
        @sort-change="sortChange"
        class="mini-td-padding">
        <!--<template #rank="{ row, $index }">-->
          <!--<span v-if="row.jailId">{{ $index | handleGetIndex(pagination.rows, pagination.page) }}</span>-->
        <!--</template>-->
        <template #meetingTime="{ row }">
          <span >{{ row.meetingTime || row.applicationDate }}</span>
        </template>
        <template
          slot-scope="scope"
          slot="operate">
          <el-button
            type="text"
            size="mini"
            class="button-detail"
            @click="onDetail(scope.row)">详情</el-button>
        </template>
      </m-table-new>
    </el-col>
    <m-pagination
      ref="pagination"
      :total="total"
      @onPageChange="getDatas"/>
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
              <span class="family-name">家属</span>

              <span class="family-nameDetail">{{toShow.familyName}}</span>
            </p>

            <p class="detail-message-family" style="border: none">
              <span class="family-name">预约时间</span>

              <span class="family-nameDetail">{{toShow.createTime}}</span>
            </p>
          </div>

          <div class="detail-content">
            <p class="detail-message-family">
              <span class="family-name">与罪犯关系</span>

              <span class="family-nameDetail">{{toShow.relation}}</span>
            </p>

            <p class="detail-message-family" style="border: none">
              <span class="family-name">终端号</span>

              <span class="family-nameDetail">{{toShow.terminalNumber}}</span>
            </p>
          </div>
        </div>

        <div
          v-for="(item,index) in toShow.changeLogs"
          :key=index
          style="display: flex;border: 1px solid #E4E7ED;border-top: none"
        >
          <div class="family-detail">{{index+1}}</div>

          <div class="detail-message">
            <p class="detail-message-family" v-if="item.operateAccount">

              <span class="family-name" v-if="item.status!='CANCELED'">审核人员账号</span>

              <span class="family-name" v-if="item.status=='CANCELED'" >取消人账号</span>

              <span class="family-nameDetail">{{item.operateAccount}}</span>
            </p>

            <template v-if="item.meetingCalls" >
              <label v-for="(val,keys) in item.meetingCalls" :key=keys >
                <p class="detail-message-family" >
                  <span class="family-name">通话时间</span>

                  <span class="family-nameDetail">{{ val.callTime }}</span>
                </p>

                <p class="detail-message-family" v-if="isDevelop(val,keys )"  >
                  <span class="family-name">结束原因</span>

                  <span
                    class="family-nameDetail"
                    :ref="`itemHeigh+${keys}`"
                    style="padding: 10px;text-align: justify;line-height: 15px;">
                    {{ val.remark }}
                  </span>
                </p>
              </label>
            </template>

            <p class="detail-message-family" style="border: none" >
              <span class="family-name" v-if="item.status!='CANCELED'&&item.status!='EXPIRED'&&item.status!='FINISHED'&&item.status!='MEETING_ON'">审核时间</span>

              <span class="family-name" v-if="item.status=='CANCELED'">取消时间</span>

              <span class="family-name" v-if="item.status=='EXPIRED'">过期时间</span>

              <span class="family-nameDetail" v-if="!item.meetingCalls ||item.status=='EXPIRED'">{{ item.operateTime | Date }}</span>
            </p>

            <p
              v-if="item.remark && item.status=='DENIED'"
              class="detail-message-family"
              style="border-top:  1px solid #E4E7ED;border-bottom: none;text-align: justify;line-height: 18px">
              <span class="family-name" style="line-height: 40px">拒绝原因</span>

              <span class="family-nameDetail" style="padding: 10px;text-align: justify;line-height: 15px;">{{ item.remark }}</span>
            </p>

            <p
              v-if="item.remark && item.status=='CANCELED'"
              class="detail-message-family"
              style="border-top:  1px solid #E4E7ED;border-bottom: none;text-align: justify;line-height: 18px"
            >
              <span class="family-name"  style="line-height: 40px">取消原因</span>

              <span class="family-nameDetail" style="padding: 10px;text-align: justify;line-height: 15px;">{{ item.remark }}</span>
            </p>
            <p
              v-if="item.remark && item.status=='SUBMIT'"
              class="detail-message-family"
              style="border-top:  1px solid #E4E7ED;border-bottom: none;text-align: justify;line-height: 18px"
            >
              <span class="family-name"  style="line-height: 40px">初审意见</span>

              <span class="family-nameDetail" style="padding: 10px;text-align: justify;line-height: 15px;">{{ item.remark }}</span>
            </p>
          </div>

          <div class="detail-content">
            <p class="detail-message-family"  v-if="item.operateName">
              <span class="family-name" v-if="item.status!='CANCELED'">审核人姓名</span>

              <span class="family-name" v-if="item.status=='CANCELED'" >取消人姓名</span>

              <span class="family-nameDetail">{{item.operateName}}</span></p>

              <template v-if="item.meetingCalls">
                <label v-for="(val,keys) in item.meetingCalls" :key=keys  >
                  <p class="detail-message-family" >
                    <span class="family-name">通话时长</span>

                    <span class="family-nameDetail">{{ val.callDuration | time }}</span>
                  </p>

                  <label v-if="val.remark">
                    <p
                      v-if="keys!=item.meetingCalls.length-1"
                      class="detail-message-family"
                      :style="{height:parseInt( val.itemHeigh+1)+'px'}"
                    >
                      <span class="family-name">&nbsp;</span>

                      <span class="family-nameDetail">&nbsp;</span>
                    </p>
                  </label>
                </label>
              </template>

            <p class="detail-message-family">
              <span class="family-name">申请状态</span>

              <span class="family-nameDetail" v-if="item.status=='PASSED'">已通过</span>

              <span class="family-nameDetail" v-if="item.status=='CANCELED'">已取消</span>

              <span class="family-nameDetail" v-if="item.status=='DENIED'">已拒绝</span>

              <span class="family-nameDetail" v-if="item.status=='EXPIRED'">已过期</span>
              
              <span class="family-nameDetail" v-if="item.status=='FINISHED'">已完成</span>

              <span class="family-nameDetail" v-if="item.status=='MEETING_ON'">通话中</span>
              <span class="family-nameDetail" v-if="item.status=='SUBMIT'">已提交二级审核</span>
            </p>
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer"></span>
    </el-dialog>
  </el-row>
</template>
<script>

import { mapActions, mapState } from 'vuex'
import prisonFilterCreator from '@/mixins/prison-filter-creator'
import registrationDialogCreator from '@/mixins/registration-dialog-creator'

export default {
  mixins: [prisonFilterCreator,registrationDialogCreator],
  data () {
    const { options } = this.$store.getters.prisonAreaOptions
    const createEndDate = this.$_dateNow
    const createStartDate = this.$_dateOneWeekAgo
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
      total: 0,
      filter: {},
      filterInit: {
        createStartDate,
        createEndDate
      },
      loading: true,
      searchItems: {
        time: {
          type: 'dateRange',
          unlinkPanels: true,
          start: 'createStartDate',
          end: 'createEndDate',
          clearable:"true",
          value: [createStartDate, createEndDate],
          // miss: true,
          // value: ''
        },
        applicationDate: {
          type: 'dateRange',
          unlinkPanels: true,
          start: 'applicationStartDate',
          end: 'applicationEndDate',
          startPlaceholder: '通话开始时间',
          endPlaceholder: '通话结束时间'
          // miss: true,
          // value: ''
        },
        status: {
          type: 'select',
          label: '审核状态',
          options: this.$store.state.applyStatus,
          miss: false,
          value: ''
        }
      },
      tableCols: [
        {
          label: '监狱名称',
          prop: 'jailName',
          showOverflowTooltip: true
        },
        {
          label: '罪犯编号',
          prop: 'prisonerNumber',
          showOverflowTooltip: true
        },
        {
          label: '监区',
          prop: 'prisonArea',
          showOverflowTooltip: true
        },
        {
          label: '申请时间',
          prop: 'createdAt',
          sortable: 'custom',
          minWidth: 110
        },
        {
          label: '申请通话时间',
          prop: 'meetingTime',
          slotName: 'meetingTime',
          minWidth: 120
        },
        {
          label: '罪犯姓名',
          prop: 'prisonerName',
          showOverflowTooltip: true
        },
        {
          label: '家属',
          prop: 'names',
          showOverflowTooltip: true,
        },
        {
          label: '申请状态',
          prop: 'statusStr',
        }, {
          label: '操作',
          slotName: 'operate',
          align: 'center'
        }

      ],
      barData: [],
      barXAxisData: [],
      tableDatas: [],
      familyShows: [],
      toShow:{},
      sortObj:{},
      show: {
        familiesDetialInform: false,
        detail:false,
        dialog:false
      },
    }
  },
  methods: {
    ...mapActions(['getMeettingsDetail','gdGetFamilyMeetingDetail','getMeettingsChangelogDetail']),
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
    filterBarData() {
      const count = this.getFamilyMeetingDetail.length > 10 ? 10 : this.getFamilyMeetingDetail.length
      this.barData = this.getFamilyMeetingDetail.slice(0, count).map(data => [data.jailName, data.cnt])
      this.barXAxisData = this.getFamilyMeetingDetail.slice(0, count).map(data => data.jailName)
      this.loading = false
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
            label: '通话时长',
            slotName: 'duration'
          },
          {
            label: '拒绝原因',
            prop: 'content',
            style: { width: '100%' }
          }
        ], params = { meetingId: e.id}
      this.getMeettingsChangelogDetail(params).then(res => {
        if (!res) return
        this.toShow = Object.assign({}, res)
        this.show.dialog = true
        this.familyShows = this.toShow.status !== 'DENIED'
          ? constFamilyShows.slice(0, constFamilyShows.length - 1)
          : constFamilyShows
      })
    },
    onCloseShow() {
      this.toShow.id = ''
      if (this.meetingRefresh) this.getDatas('onCloseShow')
    },
    async onSearch() {
      const { rows } = this.pagination
      this.loading = true
      this.$refs.pagination.currentPage = 1
      this.pagination = Object.assign({}, { page: 1, rows })
      await this.getDatas()
      this.filterBarData()
    },
    getDatas: async function () {
      const {page, rows} = this.pagination
      this.filter.provincesId = `20`
      this.filter.orderField = 'createTime'
      const total = await this.gdGetFamilyMeetingDetail({
        ...this.filter,
        ...this.pagination
      })
      this.total = total
      this.tableDatas = this.getFamilyMeetingDetail.slice(0)
    }
  },
  async mounted() {
    await this.getDatas()
    this.filterBarData()
  },
  created(){
    this.provincesIdQuery=20
  },
  computed: {
    ...mapState([
      'meetingRefresh',
      'getFamilyMeetingDetail',
      'gdmeetingStatisticTotalItem'
    ])
    },
  watch: {
    meetingRefresh(val) {
      if (val) {
        if (!this.show.authorize && !this.show.withdraw && !this.toShow.id && !this.show.familiesDetialInform) this.getDatas('meetingRefresh')
      }
    },
    toShow: {
      handler: function(val) {
        if (val.id) this.show.detail = true
        else this.show.detail = false
      },
      deep: true
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.flex-dialog {
  display: flex;
  flex-wrap: wrap;
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


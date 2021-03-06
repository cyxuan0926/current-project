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
  </el-row>
</template>
<script>

import { mapActions, mapState } from 'vuex'
import prisonFilterCreator from '@/mixins/prison-filter-creator'
import registrationDialogCreator from '@/mixins/registration-dialog-creator'
import Moment from 'moment'

export default {
  mixins: [prisonFilterCreator,registrationDialogCreator],
  data () {
    const { options } = this.$store.getters.prisonAreaOptions
    const createEndDate = Moment().format('YYYY-MM-DD')
    const createStartDate = Moment().subtract(7, 'days').format('YYYY-MM-DD')
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
        detail:false
      },
    }
  },
  methods: {
    ...mapActions(['getMeettingsDetail','gdGetFamilyMeetingDetail']),
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
</style>


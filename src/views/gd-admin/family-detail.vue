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

export default {
  mixins: [prisonFilterCreator, registrationDialogCreator],
  data () {
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
      total: 0,
      filter: {},
      loading: true,
      searchItems: {
        time: {
          type: 'dateRange',
          unlinkPanels: true,
          start: 'createStartDate',
          end: 'createEndDate',
          clearable:"true",
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
          // minWidth: '15%',
          showOverflowTooltip: true
        },
        {
          label: '罪犯编号',
          prop: 'prisonerNumber',
          // minWidth: '20',
          showOverflowTooltip: true
        },
        {
          label: '监区',
          prop: 'prisonArea',
          // minWidth: '15'
        },
        {
          label: '申请时间',
          prop: 'createdAt',
          sortable: 'custom',
          minWidth: 110
          // minWidth: '40'
        },
        {
          label: '申请通话时间',
          prop: 'meetingTime',
          slotName: 'meetingTime',
          minWidth: 120
          // minWidth: '40'
        },
        {
          label: '罪犯姓名',
          prop: 'prisonerName',
          // minWidth: '30'
        },
        {
          label: '家属',
          prop: 'names',
          showOverflowTooltip: true
          // minWidth: '30'
        },
        {
          label: '申请状态',
          prop: 'statusStr',
          // minWidth: '20'
        }, {
          label: '操作',
          slotName: 'operate',
          // minWidth: 40,
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
    ...mapActions(['getMeettingsDetail','getFamilyDetail']),
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
            label: '会见时长',
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
      this.toShow.id= ''
    },
    currentDate(type) {
            var now = new Date();
            if(type){
              now.setTime(now.getTime()-7*24*60*60*1000);
            }
            var year = now.getFullYear(); //得到年份
            var month = now.getMonth();//得到月份
            var date = now.getDate();//得到日期
                month = month + 1;
              if (month < 10) month = "0" + month;
              if (date < 10) date = "0" + date;
               var time = "";
            return  time = year + "-" + month + "-" + date

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
      if ( !this.filter.createStartDate ) {
        this.filter.createStartDate = this.currentDate(true)
        this.searchItems.time.value=[this.currentDate(true),this.currentDate(false)]
      }
      if ( !this.filter.createEndDate ) {
        this.filter.createEndDate = this.currentDate(false)
        //this.searchItems.time.=this.currentDate(false)
      }
      const total = await this.getFamilyDetail({
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

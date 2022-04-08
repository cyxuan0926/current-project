<template>
  <el-row class="row-container" :gutter="0">
    <m-search ref="search" :items="searchItems" @searchSelectChange="searchSelectChange" @search="onSearch">
      <el-button
        slot="append"
        v-if="show.call"
        type="primary"
        @click="onDownloadExcel(1)"
        >导出 Excel</el-button
      >
      <el-button
        slot="append"
        v-if="show.freecall"
        type="primary"
        @click="onDownloadExcel(2)"
        >导出 Excel</el-button
      >
    </m-search>
    <el-col :span="24">
      <el-tabs v-model="tabs" type="card">
        <el-tab-pane label="家属免费通话记录" name="familyFreeMeetings" />
        <el-tab-pane label="警员家属免费通话记录" name="jailerFamilyFreeMeetings" />
      </el-tabs>
      <m-table-new stripe :data="freeMeetings.contents" :cols="tableCols">
        <template slot="duration" slot-scope="scope">
          {{ scope.row.duration | time }}
        </template>
        <template slot="select" slot-scope="scope">
          {{ scope.row.select | value }}
        </template>
        <template #type="{row}">
        <span v-if="row.type=='1'">可视电话</span>
        <span v-if="row.type=='2'">系统电话</span>
        </template>
      </m-table-new>
      <!-- <template #isMsg="{ row }">{{ row.isMsg | isTrue }}</template> -->
    </el-col>
    <m-pagination
      ref="pagination"
      :total="freeMeetings.total"
      @onPageChange="getDatas"
    />
  </el-row>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import prisons from "@/common/constants/prisons";
import prisonFilterCreator from "@/mixins/prison-filter-creator";
import { DateFormat } from "@/utils/helper";
import { tokenExcel } from "@/utils/token-excel";
import Moment from "moment";
export default {
  mixins: [prisonFilterCreator],
  data() {
    const { belong } = prisons.PRISONAREA;
    const { options } = this.$store.getters.prisonAreaOptions;
    const tabOptions = {
      FAMILY_FREE_MEETINGS: "familyFreeMeetings",
      JAILER_FAMILY_FREE_MEETINGS: "jailerFamilyFreeMeetings",
    };
    return {
      tabOptions,
      options,
      downloading: false,
      tabs: tabOptions.FAMILY_FREE_MEETINGS,
      show: {
        call: true,
        freecall: false,
      },
      searchItems: {
        name: {
          type: "input",
          label: "家属姓名",
          miss: false,
        },

        prisonerNumber: {
          type: "input",
          label: "罪犯编号",
          miss: false,
        },

        familyName: {
          type: "input",
          label: "家属姓名",
          miss: true,
        },
        policeName: {
          type: "input",
          label: "警员姓名",
          miss: true,
        },
        policeNumber: {
          type: "input",
          label: "警员编号",
          miss: true,
        },
        type: {
          type: "select",
          label: "通话类型",
          options: this.$store.state.type,
          miss: true,
        },
          applicationDate: {
          type: "dateRange",
          unlinkPanels: true,
          start: "startTime",
          end: "endTime",
          startPlaceholder: "申请开始时间",
          endPlaceholder: "申请结束时间",
           range: {
            max: Moment().format("YYYY-MM"),
            maxMonthRange: 24,
          },
          value: [this.$_oneMonthAgo, this.$_dateNow],
        },
      },
      filter: {},
    };
  },
  computed: {
    ...mapState(["freeMeetings"]),
    ...mapGetters(["isSuperAdmin"]),
    tableCols() {
      // 警员家属免费通话记录
      const jailerFamilyFreeMeetingstableCols = [
        {
          label: "家属姓名",
          prop: "familyName",
        },

        {
          label: "警员姓名",
          prop: "policeName",
        },
        {
          label: "警员编号",
          prop: "policeNumber",
        },
        {
          label: "通话类型",
          slotName: "type",
        },
        
        {
          label: "通话时间",
          prop: "meetingTime",
          minWidth: 140,
        },
        {
          label: "通话时长",
          slotName: "duration",
          minWidth: 110,
        },
        {
          label: "终端号",
          prop: "terminalNumber",
        },
        {
          label: "家属所在省",
          prop: "province",
          showOverflowTooltip: true,
        },
        {
          label: "家属所在市",
          prop: "city",
          showOverflowTooltip: true,
        },
      ];

      const familyFreeMeetings = [
        {
          label: "省份",
          prop: "provincesName",
        },

        {
          label: "监狱名称",
          prop: "jailName",
        },
      ];
      // 家属免费通话记录
      const familyFreeMeetingstableCols = [
        {
          label: "家属姓名",
          prop: "name",
        },
        {
          label: "罪犯姓名",
          prop: "prisonerName",
        },
        {
          label: "罪犯编号",
          prop: "prisonerNumber",
          minWidth: 92,
        },
        {
          label: "通话时间",
          prop: "meetingTime",
          showOverflowTooltip: true,
          minWidth: 140,
        },
        {
          label: "监区",
          prop: "prisonArea",
          minWidth: 92,
          showOverflowTooltip: true,
        },
        {
          label: "通话时长",
          slotName: "duration",
          minWidth: 110,
          showOverflowTooltip: true,
        },
        {
          label: "终端号",
          prop: "terminalNumber",
        },
        {
          label: "家属所在省",
          prop: "province",
          showOverflowTooltip: true,
        },
        {
          label: "家属所在市",
          prop: "city",
          showOverflowTooltip: true,
        },
      ];
      if (this.tabs === this.tabOptions.FAMILY_FREE_MEETINGS) {
        if (this.isSuperAdmin) {
          // 家属列表
          return [...familyFreeMeetings, ...familyFreeMeetingstableCols];
        } else {
          return familyFreeMeetingstableCols;
        }
      } else {
        //  预警列表
        if (this.isSuperAdmin) {
          return [...familyFreeMeetings, ...jailerFamilyFreeMeetingstableCols];
        } else {
          return jailerFamilyFreeMeetingstableCols;
        }
      }
    },
  },

  watch: {
    tabs(val) {
      this.show.call = false;
      this.show.freecall = false;
      if (val === this.tabOptions.FAMILY_FREE_MEETINGS) {
        this.resetSearchFilters(["familyName", "policeName", "policeNumber"]);
        this.$set(this.searchItems.name, "miss", false);
        this.$set(this.searchItems.prisonerNumber, "miss", false);
        this.$set(this.searchItems.type, "miss", true);
        this.$set(this.searchItems.familyName, "miss", true);
        this.$set(this.searchItems.policeName, "miss", true);
        this.$set(this.searchItems.policeNumber, "miss", true);
        this.show.call = true;
      } else {
        this.$set(this.searchItems.prisonerNumber, "miss", true);
        this.$set(this.searchItems.policeName, "miss", false);
        this.$set(this.searchItems.policeNumber, "miss", false);
        this.$set(this.searchItems.type, "miss", false);
        this.show.freecall = true;
      }

      this.$refs.search.onGetFilter();

      this.onSearch();
    },
  },

  methods: {
    ...mapActions(["getFreeMeetings", "getPoliceFamilyFreeMeetings"]),
    // 导出excel
    async onDownloadExcel(type) {
      this.downloading = true;
      const times = DateFormat(Date.now(), "YYYYMMDDHHmmss"),
        actionName = "familyPhone/exportFamilyPhone",
        params = {
          url:
            type == 1 ? "/freeMeetings/export" : "/freeMeetings/police/export",
          methods: "get",
          params: { ...this.filter },
          isPrisonInternetGetUrlWay: "getHyUrl",
        };
      await tokenExcel({
        params,
        actionName,
        menuName: type == 1 ? "家属免费通话记录-" : "狱警免费通话记录-" + times,
      });
    },

    getDatas() {
      if (this.tabs === this.tabOptions.FAMILY_FREE_MEETINGS) {
        this.getFreeMeetings({
          ...this.filter,
          ...this.pagination,
        });
      } else {
        this.getPoliceFamilyFreeMeetings({
          ...this.filter,
          ...this.pagination,
        });
      }
    },

    onSearch() {
      this.$refs.pagination.handleCurrentChange(1);
    },

    // 重置搜索组件的filter
    resetSearchFilters(filters = []) {
      filters.map((filter) => {
        this.$set(this.searchItems[filter], "value", "");
        delete this.filter[filter];
      });
    },
  },
};
</script>

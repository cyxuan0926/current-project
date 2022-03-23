<template>
  <el-row class="row-container" :gutter="0">
    <m-search ref="search" :items="searchItems" @search="onSearch">
      <el-button
        slot="append"
        type="primary"
        :loading="downloading"
        @click="onDownloadExcel"
        >导出 Excel</el-button
      ></m-search
    >
    <el-col :span="24">
      <el-tabs v-model="tabs" type="card">
        <el-tab-pane label="家属免费通话记录" name="familyFreeMeetings" />
        <el-tab-pane
          label="警员家属免费通话记录"
          name="jailerFamilyFreeMeetings"
        />
      </el-tabs>
      <m-table-new stripe :data="freeMeetings.contents" :cols="tableCols">
        <template slot="duration" slot-scope="scope">
          {{ scope.row.duration | time }}
        </template>
      </m-table-new>
    </el-col>
    <m-pagination
      ref="pagination"
      :total="freeMeetings.total"
      @onPageChange="getDatas"
    />
  </el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import prisons from '@/common/constants/prisons'
import prisonFilterCreator from '@/mixins/prison-filter-creator'
import Moment from 'moment'
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
      downloading: false,
      tabs: tabOptions.FAMILY_FREE_MEETINGS,
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
        // applicationDate: {
        //   type: "monthRangeSelector",
        //   canNotClear: true,
        //   startKey: "startDate",
        //   endKey: "endDate",
        //   range: {
        //     max: Moment().format("YYYY-MM"),
        //     maxMonthRange: 24,
        //   },
        //   value: [startDate, endDate],
        // },
         applicationDate: {
          type: "dateRange",
          unlinkPanels: true,
          start: "startDate",
          canNotClear: true,
          startKey: "startDate",
          endKey: "endDate",
          range: {
            max: Moment().format("YYYY-MM"),
            maxMonthRange: 24,
          },
          value: [this.$_dateNow, this.$_dateNow]
        },
      },
      filter: {},
    };
  },
  computed: {
    ...mapState(["freeMeetings"]),

    tableCols() {
      const jailerFamilyFreeMeetingsTableCols = [
        {
          label: "家属姓名",
          prop: "familyName",
          // ...$likeName,
        },
        {
          label: "省份",
          prop: "provincesName",
        },

        {
          label: "监狱名称",
          prop: "jailName",
        },
        {
          label: "警员姓名",
          prop: "policeName",
          // ...$likeName,
        },
        {
          label: "警员编号",
          prop: "policeNumber",
          // ...$likePrisonerNumber,
        },
        {
          type: "input",
          label: "通话类型",
          miss: false
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
      const familyFreeMeetingstableCols = [
        {
          label: "家属姓名",
          prop: "name",
          // ...$likeName,
        },
        {
          label: "罪犯姓名",
          prop: "prisonerName",
          // ...$likeName,
        },
        {
          label: "罪犯编号",
          prop: "prisonerNumber",
          minWidth: 92,
          // ...$likePrisonerNumber,
        },
        {
          label: "省份",
          prop: "provincesName",
        },

        {
          label: "监狱名称",
          prop: "jailName",
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
      if (this.tabs === this.tabOptions.FAMILY_FREE_MEETINGS)
        return familyFreeMeetingstableCols;
      else return jailerFamilyFreeMeetingsTableCols;
    },
  },

  watch: {
    tabs(val) {
      if (val === this.tabOptions.FAMILY_FREE_MEETINGS) {
        this.resetSearchFilters(["familyName", "policeName", "policeNumber"]);
        this.$set(this.searchItems.name, "miss", false);
        this.$set(this.searchItems.prisonerNumber, "miss", false);
        this.$set(this.searchItems.prisonArea, "miss", false);
        this.$set(this.searchItems.type, "miss", true);
        this.$set(this.searchItems.familyName, "miss", true);
        this.$set(this.searchItems.policeName, "miss", true);
        this.$set(this.searchItems.policeNumber, "miss", true);
      } else {
        this.resetSearchFilters(["name", "prisonerNumber", "prisonArea"]);
        this.$set(this.searchItems.name, "miss", true);
        this.$set(this.searchItems.prisonerNumber, "miss", true);
        this.$set(this.searchItems.prisonArea, "miss", true);
        this.$set(this.searchItems.familyName, "miss", false);
        this.$set(this.searchItems.policeName, "miss", false);
        this.$set(this.searchItems.policeNumber, "miss", false);
        this.$set(this.searchItems.type, "miss", false);
      }

      this.$refs.search.onGetFilter();

      this.onSearch();
    },
  },

  methods: {
    ...mapActions(["getFreeMeetings", "getPoliceFamilyFreeMeetings"]),

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

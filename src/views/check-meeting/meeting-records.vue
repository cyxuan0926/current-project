<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-search
      :items="searchItems"
      @sizeChange="sizeChange"
      @search="onSearch" />
    <el-col :span="24">
      <el-tabs
        v-model="tabs"
        type="card"
        @tab-click="onTabClick" >
        <el-tab-pane
          label="家属免费会见记录"
          name="familyFreeMeetings" />
        <el-tab-pane
          label="狱警家属免费会见记录"
          name="jailerFamilyFreeMeetings" />
      </el-tabs>
      <m-table-new
        stripe
        :data="freeMeetings.contents"
        :cols="tableCols">
        <template
          slot="duration"
          slot-scope="scope">
          {{ scope.row.duration | time }}
        </template>
      </m-table-new>
    </el-col>
    <m-pagination
      ref="pagination"
      :total="freeMeetings.total"
      @onPageChange="getDatas" />
  </el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import prisons from '@/common/constants/prisons'

export default {
  data() {
    const { options, belong } = prisons.PRISONAREA

    const tabOptions = {
      FAMILY_FREE_MEETINGS: 'familyFreeMeetings',
      JAILER_FAMILY_FREE_MEETINGS: 'jailerFamilyFreeMeetings'
    }

    return {
      options,
      belong,
      tabOptions,
      tabs: tabOptions.FAMILY_FREE_MEETINGS
    }
  },
  computed: {
    ...mapState(['freeMeetings']),

    tableCols() {
      const jailerFamilyFreeMeetingsTableCols = [
        {
          label: '家属姓名',
          prop: 'familyName'
        },
        {
          label: '狱警姓名',
          prop: 'policeName'
        },
        {
          label: '狱警编号',
          prop: 'policeNumber'
        },
        {
          label: '会见时间',
          prop: 'meetingTime',
          minWidth: 140
        },
        {
          label: '会见时长',
          slotName: 'duration',
          minWidth: 110
        },
        {
          label: '终端号',
          prop: 'terminalNumber'
        },
        {
          label: '家属所在省',
          prop: 'province'
        },
        {
          label: '家属所在市',
          prop: 'city'
        }
      ]
      const familyFreeMeetingstableCols = [
        {
          label: '家属姓名',
          prop: 'name'
        },
        {
          label: '罪犯姓名',
          prop: 'prisonerName'
        },
        {
          label: '罪犯编号',
          prop: 'prisonerNumber',
          minWidth: 92
        },
        {
          label: '会见时间',
          prop: 'meetingTime',
          showOverflowTooltip: true,
          minWidth: 140
        },
        {
          label: '监区',
          prop: 'prisonArea',
          minWidth: 92
        },
        {
          label: '会见时长',
          slotName: 'duration',
          minWidth: 110,
          showOverflowTooltip: true,
        },
        {
          label: '终端号',
          prop: 'terminalNumber'
        },
        {
          label: '家属所在省',
          prop: 'province'
        },
        {
          label: '家属所在市',
          prop: 'city'
        }
      ]
      if (this.tabs === this.tabOptions.FAMILY_FREE_MEETINGS) return familyFreeMeetingstableCols
      else return jailerFamilyFreeMeetingsTableCols
    },

    searchItems() {
      const familyFreeMeetingsSearchItems = {
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
          options: this.options,
          belong: this.belong
        }
      }
      const jailerFamilyFreeMeetingsSearchItems = {
        familyName: {
          type: 'input',
          label: '家属姓名'
        },
        policeName: {
          type: 'input',
          label: '狱警姓名'
        },
        policeNumber: {
          type: 'input',
          label: '狱警编号'
        }
      }
      if (this.tabs === this.tabOptions.FAMILY_FREE_MEETINGS) return familyFreeMeetingsSearchItems
      else return jailerFamilyFreeMeetingsSearchItems
    }
  },
  mounted() {
    this.getDatas()
  },
  methods: {
    ...mapActions([
      'getFreeMeetings',
      'getPoliceFamilyFreeMeetings'
    ]),
    sizeChange(rows) {
      this.$refs.pagination.handleSizeChange(rows)
      this.getDatas()
    },
    getDatas() {
      if (this.tabs === this.tabOptions.FAMILY_FREE_MEETINGS) {
        this.getFreeMeetings({
          ...this.filter,
          ...this.pagination
        })
      }
      else {
        this.getPoliceFamilyFreeMeetings({
          ...this.filter,
          ...this.pagination
        })
      }
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },

    onTabClick() {
      this.getDatas()
    }
  }
}
</script>

<style scoped>
</style>

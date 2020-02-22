<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-search
      :items="searchItems"
      @sizeChange="sizeChange"
      @search="onSearch" />
    <el-col :span="24">
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
    const { belong } = prisons.PRISONAREA
    const { options } = this.$store.getters.prisonAreaOptions
    return {
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
        }
      },
      tableCols: [
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
    }
  },
  computed: {
    ...mapState(['freeMeetings'])
  },
  mounted() {
    this.getDatas()
  },
  methods: {
    ...mapActions(['getFreeMeetings']),
    sizeChange(rows) {
      this.$refs.pagination.handleSizeChange(rows)
      this.getDatas()
    },
    getDatas() {
      this.getFreeMeetings({
        ...this.filter,
        ...this.pagination
      })
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    }
  }
}
</script>

<style type="text/stylus" lang="stylus" scoped>
</style>

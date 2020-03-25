<template>
<el-row
    class="row-container"
    :gutter="0">
    <m-search
      :items="searchItems"
      @search="onSearch"
      @sizeChange="sizeChange"/>
    <el-col
      :span="24"
      class="el-col__no-tabs__margin">
      <m-table-new
        stripe
        :data="prisonersInsideJailsCosts.contents"
        :cols="tableCols">
        <template slot="consume" slot-scope="scope">
          {{ scope.row.consume | fixedNumber }}
        </template>
        <template slot="balance" slot-scope="scope">
          {{ scope.row.balance | fixedNumber }}
        </template>
        <template slot="consumeAt" slot-scope="scope">
          {{ scope.row.consumeAt | Date }}
        </template>
        <template slot="createdAt" slot-scope="scope">
          {{ scope.row.createdAt | Date }}
        </template>
      </m-table-new>
    </el-col>
    <m-pagination
      :total="prisonersInsideJailsCosts.total"
      ref="pagination" 
      @onPageChange="getDatas"/>
  </el-row>
</template>
<script>
import commonTableColsMixins from './mixins/common-table-cols'
import prisons from '@/common/constants/prisons'

export default {
  mixins: [commonTableColsMixins],
  data () {
    const { belong } = prisons.PRISONAREA
    const { options } = this.$store.getters.prisonAreaOptions
    return {
      selfOwnSearchItems: {
        time: {
          type: 'dateRange',
          start: 'startDate',
          end: 'endDate',
          unlinkPanels: true
        },
        prisonArea: JSON.parse(localStorage.getItem('user')).prisonConfigList && JSON.parse(localStorage.getItem('user')).prisonConfigList.length === 1
          ? {
              label: '监区',
              type: 'input',
              value: `${ JSON.parse(localStorage.getItem('user')).prisonConfigList[0].prisonConfigName }`,
              disabled: true
            }
          : {
              label: '监区',
              type: 'select',
              options,
              belong
            }
      }
    }
  },
  methods: {
    getDatas() {
      this.getPrisonersInsideJailsCosts({
        ...this.filter,
        ...this.pagination
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

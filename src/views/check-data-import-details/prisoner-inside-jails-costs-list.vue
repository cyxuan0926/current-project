<template>
  <el-row class="row-container" :gutter="0">
    <m-search
      ref="search"
      :items="searchItems"
      @search="onSearch"
    />

    <el-col class="el-col__no-tabs__margin" :span="24">
      <m-table-new
        stripe
        :data="prisonersInsideJailsCosts.contents"
        :cols="tableCols"
      >
        <template #consume="{ row }">
          {{ row.consume | fixedNumber }}
        </template>

        <template #balance="{ row }">
          {{ row.balance | fixedNumber }}
        </template>

        <template #consumeAt="{ row }">
          {{ row.consumeAt | Date }}
        </template>

        <template #createdAt="{ row }">
          {{ row.createdAt | Date }}
        </template>
      </m-table-new>
    </el-col>

    <m-pagination
      ref="pagination" 
      :total="prisonersInsideJailsCosts.total"
      @onPageChange="getDatas"
    />
  </el-row>
</template>
<script>
import commonTableColsMixins from './mixins/common-table-cols'
import prisons from '@/common/constants/prisons'

export default {
  mixins: [commonTableColsMixins],

  data() {
    const { belong } = prisons.PRISONAREA
    const { options } = this.$store.getters.prisonAreaOptions

    return {
      selfOwnSearchItems: {
        time: {
          type: 'dateRange',
          start: 'startDate',
          end: 'endDate',
          canNotClear: true,
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
        ...{
          ...this.filter,
          startDate: this.$_dateOneWeekAgo,
          endDate: this.$_dateNow
        },
        ...this.pagination
      })
    }
  }
}
</script>

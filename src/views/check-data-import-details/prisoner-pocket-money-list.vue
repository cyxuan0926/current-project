<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-search
      :items="searchItems"
      @search="onSearch"/>
    <el-col :span="24">
      <m-table-new
        stripe
        :data="prisonersPocketMoney.contents"
        :cols="tableCols">
        <template #balance="{ row }">
          {{ row.balance | fixedNumber }}
        </template>
        <template #income="{ row }">
          {{ row.income | fixedNumber }}
        </template>
        <template #expenditure="{ row }">
          {{ row.expenditure | fixedNumber }}
        </template>
        <template #createdAt="{ row }">
          {{ row.createdAt | Date }}
        </template>
      </m-table-new>
    </el-col>
    <m-pagination
      :total="prisonersPocketMoney.total"
      ref="pagination"
      @onPageChange="getDatas" />
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
          type: 'monthrange',
          start: 'start',
          end: 'end'
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
      if (JSON.parse(localStorage.getItem('user')).prisonConfigList && JSON.parse(localStorage.getItem('user')).prisonConfigList.length === 1) this.filter = { prisonArea : `${ JSON.parse(localStorage.getItem('user')).prisonConfigList[0].prisonConfigName }` }
      this.getPrisonersPocketMoney({
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

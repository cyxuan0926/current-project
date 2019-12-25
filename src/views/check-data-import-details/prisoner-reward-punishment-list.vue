<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-search
      :items="searchItems"
      @sizeChange="sizeChange"
      @search="onSearch"/>
    <el-col
      :span="24"
      class="el-col__no-tabs__margin">
      <m-table-new
        stripe
        :data="prisonerRewardPunishments.contents"
        :cols="tableCols">
        <template slot="createdAt" slot-scope="scope">
          {{ scope.row.createdAt | Date }}
        </template>
      </m-table-new>
    </el-col>
    <m-pagination
      :total="prisonerRewardPunishments.total"
      ref="pagination"
      @onPageChange="getDatas" />
  </el-row>
</template>

<script>
import commonTableColsMixins from './mixins/common-table-cols'
export default {
  mixins: [commonTableColsMixins],
  data() {
    return {
      selfOwnSearchItems: {
        operateName: {
          type: 'input',
          label: '数据导入人员姓名',
          noPlaceholder: true
        }
      }
    }
  },
  methods: {
    getDatas() {
      this.getPrisonerRewardPunishments({
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

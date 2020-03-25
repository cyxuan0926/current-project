<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-excel-download path="/download/exportFamilyRemit" :params="filter"/>
    <m-search
      :items="searchItems"
      @search="onSearch" />
    <el-col :span="24">
      <m-table-new
        stripe
        :data="familyRemittanceRecords.contents"
        :cols="tableCols">
        <template
          slot="money"
          slot-scope="scope">{{ scope.row.money | fixedNumber }}</template>
        <template
          slot="createdAt"
          slot-scope="scope">{{ scope.row.createdAt | Date }}</template>
        <template
          slot="status"
          slot-scope="scope">{{ scope.row.status | payStatus }}</template>
      </m-table-new>
    </el-col>
    <m-pagination
      ref="pagination"
      :total="familyRemittanceRecords.total"
      @onPageChange="getDatas" />
  </el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      searchItems: {
        jailId: {
          type: 'select',
          label: '所属监狱',
          canNotClear: true,
          filterable: true,
          getting: true,
          options: [],
          value: '',
          belong: {
            label: 'title',
            value: 'id'
          }
        },
        prisonerName: {
          type: 'input',
          label: '罪犯姓名'
        },
        prisonerNumber: {
          type: 'input',
          label: '罪犯编号'
        },
        familyName: {
          type: 'input',
          label: '汇款家属'
        },
        remitTime: {
          type: 'date',
          label: '汇款时间'
        }
      },
      filter: {},
      tableCols: [
        {
          label: '汇款单号',
          prop: 'remitNum',
          minWidth: 120
        },
        {
          label: '罪犯姓名',
          prop: 'prisonerName'
        },
        {
          label: '罪犯编号',
          prop: 'prisonerNumber'
        },
        {
          label: '汇款家属',
          prop: 'familyName'
        },
        {
          label: '汇款金额(元)',
          slotName: 'money',
          minWidth: 80
        },
        {
          label: '汇款时间',
          slotName: 'createdAt',
          minWidth: 110
        },
        {
          label: '汇款状态',
          slotName: 'status'
        }
      ]
    }
  },
  computed: {
    ...mapState([
      'familyRemittanceRecords',
      'prisonAll'
    ])
  },
  mounted() {
    this.getPrisonAll().then(res => {
      if (!res) return
      this.searchItems.jailId.options = this.prisonAll
      this.searchItems.jailId.value = this.prisonAll[0].id
      this.filter.jailId = this.prisonAll[0].id
      this.searchItems.jailId.getting = false
      this.getDatas()
    })
  },
  methods: {
    ...mapActions([
      'getPrisonAll',
      'getFamilyRemittance'
    ]),
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },
    getDatas() {
      this.getFamilyRemittance({ ...this.filter, ...this.pagination })
    }
  }
}
</script>

<style scoped>

</style>

<template>
  <m-table-new
    stripe
    :data="tenants.contents"
    style="width: 100%"
    :cols="tableCols">
    <template #status="{ row }">{{ row.status | status }}</template>
    <template #isJailCreated="{ row }">
      <span>{{ row.isJailCreated | isJailCreated }}</span>
      <el-button
        v-if="!row.isJailCreated"
        type="primary"
        size="mini"
        style="margin-left: 15%"
        @click="handleCreate(row)">创建</el-button>
    </template>
  </m-table-new>
</template>
<script>
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      tableCols: [
        {
          label: '省',
          prop: 'provinceName'
        },
        {
          label: '市',
          prop: 'cityName'
        },
        {
          label: '街道',
          prop: 'streetDetail'
        },
        {
          label: '租户名称',
          prop: 'name'
        },
        {
          label: '编号',
          prop: 'code'
        },
        {
          label: '租户状态',
          slotName: 'status',
          minWidth: 60
        },
        {
          label: '监狱是否创建',
          slotName: 'isJailCreated',
          minWidth: 100
        }
      ]
    }
  },
  computed: {
    ...mapState(['tenants'])
  },
  methods: {
    ...mapActions(['createJailByBindTenant']),
    handleCreate(val) {
      const {name, code, provinceCode, cityCode, streetDetail} = val
      const params = {name, code, provinceCode, cityCode, streetDetail}
      this.createJailByBindTenant(params).then(res => {
        if (!res) return
        val.isJailCreated = 1
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

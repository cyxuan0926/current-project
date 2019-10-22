<template>
  <el-table
    :data="tenants.contents"
    stripe
    style="width: 100%">
    <el-table-column
      prop="name"
      label="租户名称" />
    <el-table-column
      prop="code"
      label="编号" />
    <el-table-column
      prop="provinceName"
      label="省" />
    <el-table-column
      prop="cityName"
      label="市">
    </el-table-column>
    <el-table-column
      prop="streetDetail"
      label="街道" />
    <el-table-column
      min-width="60"
      prop="status"
      label="租户状态">
      <template slot-scope="scope">
        <span>{{ scope.row.status | status }}</span>
      </template>
    </el-table-column>  
    <el-table-column
      min-width="100"
      label="监狱是否创建">
      <template slot-scope="scope">
        <span>{{ scope.row.isJailCreated | isJailCreated }}</span>
        <el-button
          v-if="!scope.row.isJailCreated"
          type="primary"
          size="mini"
          style="margin-left: 15%"
          @click="handleCreate(scope.row)">创建</el-button>
      </template>
    </el-table-column>  
  </el-table>
</template>
<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState(['tenants'])
  },
  methods: {
    ...mapActions(['createJailByBindTenant']),
    handleCreate(val) {
      let {name, code, provinceCode, cityCode, streetDetail} = val, params = {name, code, provinceCode, cityCode, streetDetail}
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

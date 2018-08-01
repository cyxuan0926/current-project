<template>
  <el-row
    class="row-container"
    :gutter="0">
    <el-button
      size="small"
      type="primary"
      plain
      class="button-add"
      @click="onAdd">添加账户</el-button>
    <m-search
      :items="searchItems"
      @sizeChange="sizeChange"
      @search="onSearch" />
    <el-col :span="24">
      <el-tabs
        value="first"
        type="card">
        <el-tab-pane
          label="监狱用户"
          name="first" />
      </el-tabs>
      <el-table
        :data="prisonUsers.contents"
        border
        stripe
        v-loading="loading"
        style="width: 100%">
        <el-table-column
          prop="username"
          label="用户名" />
        <el-table-column
          prop="role"
          label="角色">
          <template slot-scope="scope">
            {{scope.row.role | role}}
          </template>
        </el-table-column>
        <el-table-column
          prop="jail"
          label="监狱名称" />
        <el-table-column
          prop="prisonAreas"
          label="监区" />
        <el-table-column
          prop="policeNumber"
          label="狱警号" />
        <el-table-column
          prop="realName"
          label="真实姓名" />
        <el-table-column
          width="210px"
          label="操作">
            <template v-if="routeRole != scope.row.role" slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="onEdit(scope.row.id)">编辑</el-button>
              <el-button
                v-if="scope.row.sysFlag == 0"
                size="mini"
                type="success"
                style="margin-left: 5px;"
                @click="onChangeStatus(scope.row, 1)">启用</el-button>
              <el-button
                v-if="scope.row.sysFlag == 1"
                size="mini"
                type="info"
                style="margin-left: 5px;"
                @click="onChangeStatus(scope.row, 0)">禁用</el-button>
              <el-button
                v-if="routeRole === '0'"
                type="danger"
                size="mini"
                style="margin-left: 5px;"
                @click="onDelete(scope.row.id)">删除</el-button>
            </template>
        </el-table-column>
      </el-table>
    </el-col>
    <m-pagination
      ref="pagination"
      :total="prisonUsers.total"
      @onPageChange="getDatas" />
  </el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data() {
    let optionObj = require('@/filters/modules/switches'),
      jail = {}, no = {},
      routeRole = this.$route.matched[this.$route.matched.length - 1].props.default.role
    if (routeRole === '0') jail = { jail: { type: 'input', label: '监狱名称' } }
    if (routeRole === '4') no = { no: [0] }
    return {
      searchItems: Object.assign(
        {
          username: { type: 'input', label: '用户名' },
          role: Object.assign({ type: 'select', label: '角色', options: optionObj.default.role }, no)
        },
        jail
      ),
      routeRole: routeRole,
      loading: true
    }
  },
  computed: {
    ...mapState(['prisonUsers'])
  },
  mounted() {
    this.getDatas()
  },
  methods: {
    ...mapActions(['getPrisonUsers', 'deletePrisonUser', 'enableOrDisablePrisonUser']),
    sizeChange(rows) {
      this.$refs.pagination.handleSizeChange(rows)
      this.getDatas()
    },
    getDatas() {
      this.loading = true
      this.getPrisonUsers({ ...this.filter, ...this.pagination }).then(res => {
        if (!res) return
        this.loading = false
      })
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },
    onEdit(e) {
      if (this.routeRole === '0') this.$router.push(`/prison-user/edit/${ e }`)
      else if (this.routeRole === '4') this.$router.push(`/account/edit/${ e }`)
    },
    onDelete(e) {
      this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deletePrisonUser({ id: e }).then(() => {
          this.getDatas()
        })
      }).catch(() => {})
    },
    onChangeStatus(row, sysFlag) {
      this.enableOrDisablePrisonUser({ id: row.id, status: sysFlag }).then(res => {
        if (!res) return
        row.sysFlag = sysFlag
      })
    },
    onAdd() {
      if (this.routeRole === '0') this.$router.push(`/prison-user/add`)
      else if (this.routeRole === '4') this.$router.push(`/account/add`)
    }
  }
}
</script>

<style type="text/stylus" lang="stylus" scoped>
</style>

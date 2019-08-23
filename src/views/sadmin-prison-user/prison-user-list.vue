<template>
  <el-row
    :syn="rolesList"
    class="row-container"
    :gutter="0">
    <el-button
      v-if="user.role === '-1'"
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
      <el-table
        :data="prisonUsers.contents"
        border
        stripe
        style="width: 100%">
        <el-table-column
          prop="username"
          label="用户名" />
        <el-table-column
          prop="roles"
          label="角色" />
        <el-table-column
          prop="jailName"
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
          v-if="user.role === '-1'"
          width="210px"
          label="操作">
          <!-- v-if="routeRole != scope.row.role && scope.row.role !== 0" -->
          <template
            slot-scope="scope"
            v-if="!scope.row.isAdministrator">
            <el-button
              type="primary"
              size="mini"
              @click="onEdit(scope.row.id)">编辑</el-button>
            <el-button
              v-if="scope.row.status == 'DISABLED'"
              size="mini"
              type="success"
              style="margin-left: 5px;"
              @click="onChangeStatus(scope.row, 1, 'ENABLED')">启用</el-button>
            <el-button
              v-if="scope.row.status == 'ENABLED'"
              size="mini"
              type="info"
              style="margin-left: 5px;"
              @click="onChangeStatus(scope.row, 0, 'DISABLED')">禁用</el-button>
            <!--  v-if="routeRole === '0'" -->
            <el-button
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
    let options = { roleId: { type: 'select', label: '角色', getting: false }, jail: { type: 'select', label: '监狱名称', getting: true, belong: { value: 'id', label: 'name' }, filterable: true } }, { role } = JSON.parse(localStorage.getItem('user')),
      routeRole = this.$route.matched[this.$route.matched.length - 1].props.default.role
    if (routeRole === '0') delete options.roleId
    if (role === '-1') delete options.jail
    if (routeRole === '4' && role !== '-1') options = {}
    return {
      searchItems: Object.assign(
        {
          username: { type: 'input', label: '用户名' }
        },
        options
      ),
      routeRole: routeRole
    }
  },
  computed: {
    ...mapState(['prisonUsers']),
    ...mapState({
      user: state => state.global.user,
      rolesList: state => state.account.rolesList,
      allTenants: state => state.account.allTenants
    })
  },
  async mounted() {
    if (this.routeRole === '0') {
      const res = await this.getAllTenants()
      if (res) {
        this.searchItems.jail.getting = false
        this.searchItems.jail.options = this.allTenants
      }
    }
    await this.getDatas()
    if(this.rolesList && !this.rolesList.length && this.user.role === '-1') {
      this.$set(this.searchItems.roleId, 'getting', true)
      await this.getRolesList()
      this.$set(this.searchItems.roleId, 'getting', false)
    }
    if( this.searchItems.roleId) this.$set(this.searchItems.roleId, 'options', this.rolesList)
  },
  methods: {
    ...mapActions(['getPrisonUsers', 'deletePrisonUser', 'enableOrDisablePrisonUser']),
    ...mapActions('account', ['getRolesList', 'getAllTenants']),
    sizeChange(rows) {
      this.$refs.pagination.handleSizeChange(rows)
      this.getDatas()
    },
    async getDatas() {
      let { page } = this.pagination
      this.$set(this.pagination, 'page', page-1)
      await this.getPrisonUsers({ ...this.filter, ...this.pagination })
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },
    onEdit(e) {
      this.$router.push(`/account/edit/${ e }`)
    },
    onDelete(id) {
      this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deletePrisonUser({ id }).then(res => {
          if (!res) return
          this.getDatas()
        })
      }).catch(() => {})
    },
    onChangeStatus(row, status, sysFlag) {
      const text = status ? '启用' : '禁用'
      this.$confirm(`您确认${text}该用户吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.enableOrDisablePrisonUser({ id: row.id, status }).then(res => {
          if (!res) return
          row.status = sysFlag
        })
      }).catch(() => {})
    },
    onAdd() {
      this.$router.push(`/account/add`)
    }
  }
}
</script>

<style type="text/stylus" lang="stylus" scoped>
</style>

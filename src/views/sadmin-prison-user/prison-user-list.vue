<template>
  <el-row
    class="row-container"
    :gutter="0">
    <el-button
      v-if="user.role === '-1'"
      type="primary"
      plain
      class="button-add button-shift-down"
      @click="onAdd">添加账户</el-button>
    <m-excel-download
      v-if="isSuperAdmin"
      path="/download/exportPrisonuser"
      :params="filter"
    />
    <m-search
      ref="search"
      :items="searchItems"
      @search="onSearch"
      @searchSelectChange="searchSelectChange"
    />
    <el-col :span="24">
      <m-table-new
        stripe
        :data="prisonUsers.contents"
        style="width: 100%"
        :cols="tableCols">
        <template #operation="{ row }">
          <el-button
            type="primary"
            size="mini"
            @click="onEdit(row.id)">编辑</el-button>
          <el-button
            v-if="row.status == 'DISABLED'"
            size="mini"
            type="success"
            style="margin-left: 5px;"
            @click="onChangeStatus(row, 1, 'ENABLED')">启用</el-button>
          <el-button
            v-if="row.status == 'ENABLED'"
            size="mini"
            type="info"
            style="margin-left: 5px;"
            @click="onChangeStatus(row, 0, 'DISABLED')">禁用</el-button>
            <!--  v-if="routeRole === '0'" -->
          <el-button
            type="danger"
            size="mini"
            style="margin-left: 5px;"
            @click="onDelete(row.id)">删除</el-button>
        </template>
      </m-table-new>
    </el-col>
    <m-pagination
      ref="pagination"
      :total="prisonUsers.total"
      @onPageChange="getDatas"
    />
  </el-row>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import prisonFilterCreator from '@/mixins/prison-filter-creator'

import {
  $likeName
  // $likePrisonerNumber,
  // $likePhone
} from '@/common/constants/const'
export default {
  name: 'AccountList',

  // props: {
  //   // 是否有权限查看所有监狱的数据（在路由的 props 中定义）
  //   hasAllPrisonQueryAuth: Boolean
  // },

  mixins: [prisonFilterCreator],

  data() {
    // let options = {
    //   roleId: { type: 'select', label: '角色' },
    //   jail: { type: 'select', label: '监狱名称', belong: { value: 'id', label: 'name' }, filterable: true }
    // },
    let options = {
      roleId: {
        type: 'select',
        label: '角色'
      }
    },
    { role } = JSON.parse(localStorage.getItem('user')),
    routeRole = this.$route.matched[this.$route.matched.length - 1].props.default.role
    if (routeRole === '0') delete options.roleId
    // if (role === '-1') delete options.jail
    if (routeRole === '4' && role !== '-1') options = {}
    return {
      searchItems: Object.assign(
        {
          username: { type: 'input', label: '用户名' }
        },
        options
      ),
      routeRole: routeRole,
      filter: {}
    }
  },
  computed: {
    ...mapState(['prisonUsers']),
    ...mapState({
      user: state => state.global.user,
      rolesList: state => state.account.rolesList,
      allTenants: state => state.account.allTenants
    }),
    tableCols() {
      let cols = [
        {
          label: '用户名',
          prop: 'username',
          minWidth: 85,
          showOverflowTooltip: true
        },

        {
          label: '角色',
          prop: 'roles',
          minWidth: 85,
          showOverflowTooltip: true
        },

        {
          label: '监狱名称',
          prop: 'jailName',
          minWidth: 110
        },

        {
          label: '监区',
          prop: 'prisonAreas',
          showOverflowTooltip: true
        },

        {
          label: '狱警号',
          prop: 'policeNumber',
          minWidth: 90
          // ...$likePrisonerNumber
        },

        {
          label: '真实姓名',
          prop: 'realName',
          ...$likeName
        },

        {
          label: '电话号码',
          prop: 'phoneNumber',
          // ...$likePhone,
          // 不是ywt_admin 下面的列表列
          isNotSuperAdminCol: true
        },

        {
          label: '操作',
          slotName: 'operation',
          minWidth: 130,
          isNotSuperAdminCol: true
        }
      ]

      if (this.user.role !== '-1')  return cols.filter(item => !item.isNotSuperAdminCol)

      return cols
    },

    ...mapGetters(['isSuperAdmin'])
  },

  methods: {
    ...mapActions(['getPrisonUsers', 'deletePrisonUser', 'enableOrDisablePrisonUser']),
    ...mapActions('account', ['getRolesList', 'getAllTenants']),
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
    },

    async _mixinsInitMethods() {
      await this.getDatas()

      if (this.user.role === '-1') {
        this.$set(this.searchItems.roleId, 'getting', true)

        await this.getRolesList()

        this.$set(this.searchItems.roleId, 'options', this.rolesList)

        this.$set(this.searchItems.roleId, 'getting', false)
      }
    }
  }
}
</script>

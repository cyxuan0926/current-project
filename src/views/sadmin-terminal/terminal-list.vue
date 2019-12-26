<template>
  <el-row
    class="row-container"
    :gutter="0">
    <el-button
      size="small"
      class="button-add button-shift-down"
      type="primary"
      plain
      @click="onAdd">添加终端信息</el-button>
    <m-search
      :items="searchItems"
      @search="onSearch" />
    <el-col :span="24">
      <el-table
        :data="terminals.contents"
        stripe
        style="width: 100%">
        <el-table-column
          prop="terminalNumber"
          label="终端号" />
        <el-table-column
          prop="roomNumber"
          label="会议室号" />
        <el-table-column
          min-width="100"
          prop="jailName"
          label="所属监狱" />
        <el-table-column
          prop="prisonConfigName"
          label="分监区" />
        <el-table-column
          min-width="60"
          prop="hostPassword"
          label="主持人密码" />
        <el-table-column
          min-width="60"
          prop="mettingPassword"
          label="参会密码" />
        <el-table-column
          min-width="90"
          label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="onEdit(scope.row.id)">编辑</el-button>
            <el-button
              :type="scope.row.isEnabled ? 'danger': 'primary'"
              size="mini"
              @click="onEnable(scope.row)">{{ scope.row.isEnabled ? '停用' : '启用' }}</el-button>  
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <m-pagination
      ref="pagination"
      :total="terminals.total"
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
          label: '监狱名称',
          getting: true,
          belong: { value: 'id', label: 'title' },
          filterable: true
        }
      }
    }
  },
  computed: {
    ...mapState(['terminals', 'prisonAll'])
  },
  mounted() {
    this.getPrisonAll().then(() => {
      this.searchItems.jailId.options = this.prisonAll
      this.searchItems.jailId.getting = false
      this.getDatas()
    })
  },
  methods: {
    ...mapActions(['getTerminals', 'getPrisonAll', 'updateTerminal', 'enableTerminal']),
    getDatas() {
      this.getTerminals({ ...this.filter, ...this.pagination })
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },
    onAdd() {
      this.$router.push('/terminal/add')
    },
    onEdit(id) {
      this.$router.push(`/terminal/edit/${ id }`)
    },
    onEnable(row) {
      const { id, isEnabled, terminalNumber } = row
      const message = isEnabled ? '停用后终端不可用，确认停用吗？' : '确定启用吗？'
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const status = isEnabled ? 0 : 1
        const res = await this.enableTerminal({ id, isEnabled: status, terminalNumber })
        if (!res) return
        row.isEnabled = status
      }).catch(() => {})
    }
  }
}
</script>

<style type="text/stylus" lang="stylus" scoped>
</style>

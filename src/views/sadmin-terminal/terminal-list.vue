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
      <m-table-new
        stripe
        :data="terminals.contents"
        :cols="tableCols">
        <template #meetingEnabled="{ row }">{{ row.meetingEnabled | isOpened}}</template>
        <template #terminalType="{ row }">{{ row.terminalType | terminalTypes }}</template>
        <template
          slot="operation"
          slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="onEdit(scope.row.id)">编辑</el-button>
          <el-button
            :type="scope.row.isEnabled ? 'danger': 'primary'"
            size="mini"
            @click="onEnable(scope.row)">{{ scope.row.isEnabled ? '停用' : '启用' }}</el-button>  
        </template>
      </m-table-new>
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
  name: 'TerminalList',

  data() {
    return {
      searchItems: {
        jailId: {
          type: 'select',
          label: '监狱名称',
          getting: true,
          belong: { value: 'id', label: 'title' },
          filterable: true
        },
        meetingEnabled: {
          type: 'select',
          label: '狱警通话开关',
          options: this.$store.state.isOpened
        },
        terminalType: {
          type: 'select',
          label: '终端类型',
          options: this.$store.state.terminalTypes
        }
      },
      tableCols: [
        {
          label: '终端号',
          prop: 'terminalNumber'
        },
        {
          label: '终端别名',
          prop: 'terminalName',
          showOverflowTooltip: true,
          minWidth: 70
        },
        {
          label: '终端类型',
          slotName: 'terminalType',
          minWidth: 70
        },
        {
          label: '终端唯一标识',
          prop: 'terminalSn',
          minWidth: 100
        },
        {
          label: '会议室号',
          prop: 'roomNumber'
        },
        {
          label: '所属监狱',
          prop: 'jailName',
          showOverflowTooltip: true,
          minWidth: 90
        },
        {
          label: '监区',
          prop: 'fullname',
          minWidth: 55,
          showOverflowTooltip: true
        },
        {
          label: '主持人密码',
          prop: 'hostPassword'
        },
        {
          label: '参会密码',
          prop: 'mettingPassword'
        },
        {
          label: '狱警通话开关',
          prop: 'meetingEnabled',
          slotName: 'meetingEnabled',
          minWidth: 95
        },
        {
          label: '操作',
          slotName: 'operation',
          minWidth: 120
        }
      ]
    }
  },
  computed: {
    ...mapState(['terminals', 'prisonAll'])
  },

  activated() {
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

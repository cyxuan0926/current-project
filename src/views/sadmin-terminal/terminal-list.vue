<template>
  <el-row class="row-container" :gutter="0">
    <m-search
      ref="search"
      :items="searchItems"
      @search="onSearch"
      @searchSelectChange="searchSelectChange"
    >
      <template #append>
        <el-button
          size="small"
          type="primary"
          plain
          @click="onAdd"
        >添加终端信息</el-button>
      </template>
    </m-search>

    <el-col :span="24">
      <m-table-new
        stripe
        :data="terminals.contents"
        :cols="tableCols"
      >
        <template #meetingEnabled="{ row }">{{ row.meetingEnabled | isOpened}}</template>

        <template #terminalType="{ row }">{{ row.terminalType | terminalTypes }}</template>

        <template #businessType="{ row }">{{ row.businessType | terminalBusinessTypeOptions }}</template>

        <template #operation="{ row }">
          <el-button
            type="primary"
            size="mini"
            @click="onEdit(row.id)"
          >编辑</el-button>

          <el-button
            :type="row.isEnabled ? 'danger': 'primary'"
            size="mini"
            @click="onEnable(row)"
          >{{ row.isEnabled ? '停用' : '启用' }}</el-button>  
        </template>
      </m-table-new>
    </el-col>
    <m-pagination
      ref="pagination"
      :total="terminals.total"
      @onPageChange="onGetDatas" />
  </el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'

import prisonFilterCreator from '@/mixins/prison-filter-creator'

export default {
  name: 'TerminalList',

  mixins: [prisonFilterCreator],

  data() {
    return {
      searchItems: {
        isEnabled: {
          type: 'select',
          label: '设备状态',
          options: this.$store.state.isEnabledOptions
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
        },

        businessType: {
          type: 'select',
          label: '所属业务',
          options: this.$store.state.terminalBusinessTypeOptions
        },

        terminalNumber: {
          type: 'input',
          label: '终端号'
        }
      },

      tableCols: [
        {
          label: '省份',
          prop: 'provinceName',
          showOverflowTooltip: true
        },

        {
          label: '所属监狱',
          prop: 'jailName',
          showOverflowTooltip: true
        },

        {
          label: '监区',
          prop: 'fullname',
          showOverflowTooltip: true
        },

        {
          label: '所属业务',
          slotName: 'businessType'
        },

        {
          label: '终端号',
          prop: 'terminalNumber',
          showOverflowTooltip: true
        },

        {
          label: '终端别名',
          prop: 'terminalName',
          showOverflowTooltip: true
        },

        {
          label: '终端类型',
          slotName: 'terminalType',
          minWidth: 70
        },

        {
          label: '终端唯一标识',
          prop: 'terminalSn',
          showOverflowTooltip: true
        },

        {
          label: '对应权限的用户名',
          prop: 'username',
          showOverflowTooltip: true,
          minWidth: 100
        },

        {
          label: '狱警通话开关',
          prop: 'meetingEnabled',
          slotName: 'meetingEnabled'
        },

        {
          label: '操作',
          slotName: 'operation',
          minWidth: 110
        }
      ]
    }
  },
  computed: {
    ...mapState(['terminals'])
  },

  async activated() {
    this.$refs.search.onGetFilter()

    this.filter = {
      ...this.filter,
      provincesId: '1'
    }

    await this.onGetDatas()
  },

  methods: {
    ...mapActions(['getTerminals', 'updateTerminal', 'enableTerminal']),

    onGetDatas() {
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

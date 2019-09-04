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
      @sizeChange="sizeChange"
      @search="onSearch" />
    <el-col :span="24">
      <el-table
        :data="terminals.contents"
        border
        style="width: 100%">
        <el-table-column
          prop="terminalNumber"
          label="终端号" />
        <el-table-column
          prop="roomNumber"
          label="会议室号" />
        <el-table-column
          prop="jailName"
          label="所属监狱" />
        <el-table-column
          prop="prisonConfigName"
          label="分监区" />
        <el-table-column
          prop="hostPassword"
          label="主持人密码" />
        <el-table-column
          prop="mettingPassword"
          label="参与密码" />
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="onEdit(scope.row.id)">编辑</el-button>
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
    ...mapActions(['getTerminals', 'getPrisonAll']),
    sizeChange(rows) {
      this.$refs.pagination.handleSizeChange(rows)
      this.getDatas()
    },
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
    }
  }
}
</script>

<style type="text/stylus" lang="stylus" scoped>
</style>

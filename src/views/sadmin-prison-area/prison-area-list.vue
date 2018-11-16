<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-search
      :items="roleType !== '4' ? searchItems: null "
      @sizeChange="sizeChange"
      @search="onSearch" />
    <el-col :span="24">
      <el-tabs
        value="first"
        type="card">
        <el-tab-pane
          label="监区管理"
          name="first" />
      </el-tabs>
      <el-table
        :data="prisonAreas.contents"
        border
        stripe
        style="width: 100%">
        <el-table-column
          prop="name"
          label="监区名称" />
        <el-table-column
          prop="jailName"
          label="所属监狱" />
        <el-table-column
          prop="createdAt"
          label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.createdAt | Date }}
          </template>
        </el-table-column>
        <el-table-column
          prop="updatedAt"
          label="更新时间">
          <template slot-scope="scope">
            {{ scope.row.updatedAt | Date }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEdit(scope.row, scope.$index)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="onDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <m-pagination
      ref="pagination"
      :total="prisonAreas.total"
      @onPageChange="getDatas" />
    <el-dialog
      :visible.sync="dialogVisible"
      class="authorize-dialog"
      title="编辑监区"
      width="530px">
      <el-input
        v-model="prisonArea.name"
        placeholder="请输入监区名称" />
      <template slot="footer">
        <el-button
          type="primary"
          size="mini"
          class="button-add"
          :disabled="!prisonArea.name"
          @click="onEdit">更新</el-button>
      </template>
    </el-dialog>
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
      },
      dialogVisible: false,
      prisonArea: {},
      index: ''
    }
  },
  computed: {
    ...mapState(['prisonAreas', 'prisonAll']),
    roleType() {
      if (localStorage['user']) return JSON.parse(localStorage['user']).role
    }
  },
  mounted() {
    this.getDatas()
    if (this.roleType !== '4') {
      this.getPrisonAll().then(() => {
        this.searchItems.jailId.options = this.prisonAll
        this.searchItems.jailId.getting = false
      })
    }
  },
  methods: {
    ...mapActions(['getPrisonAreas', 'getPrisonAll', 'updatePrisonArea', 'deletePrisonArea']),
    sizeChange(rows) {
      this.$refs.pagination.handleSizeChange(rows)
      this.getDatas()
    },
    getDatas() {
      if (this.roleType !== '4') this.getPrisonAreas({ ...this.filter, ...this.pagination })
      else this.getPrisonAreas({ ...{ jailId: JSON.parse(localStorage['user']).jailId }, ...this.pagination })
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },
    handleEdit(e, index) {
      this.prisonArea = Object.assign({}, e)
      this.dialogVisible = true
      this.index = index
    },
    onEdit() {
      this.updatePrisonArea(this.prisonArea).then(res => {
        if (res.code !== 200) return
        this.prisonAreas.contents[this.index].name = this.prisonArea.name
        this.prisonAreas.contents[this.index].updatedAt = res.data.prisonConfig.updatedAt
        this.dialogVisible = false
      })
    },
    onDelete(id) {
      this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deletePrisonArea({ id: id }).then(res => {
          if (!res) return
          this.getDatas()
        })
      }).catch(() => {})
    }
  }
}
</script>

<style type="text/stylus" lang="stylus" scoped>
</style>

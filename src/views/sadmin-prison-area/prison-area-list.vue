<template>
  <el-row
    class="row-container"
    :gutter="0">
    <el-button
      v-if="user.branch_prison"
      size="small"
      type="primary"
      plain
      class="button-add"
      @click="handleAdd">新增监区</el-button>
    <m-search
      :items="user.role !== '4' && user.role !=='-1' ? searchItems: null "
      @sizeChange="sizeChange"
      @search="onSearch" />
    <el-col :span="24">
      <el-table
        :data="prisonAreas.contents"
        border
        stripe
        style="width: 100%">
        <el-table-column
          prop="jailName"
          label="监狱名称" />
        <el-table-column
          prop="name"
          label="监区名称" />
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
        <el-table-column
          label="监区服刑人数"
          prop="prisonerNum"/>
        <el-table-column
          label="操作"
          v-if="user.role !== '0' ">
          <template slot-scope="scope">
            <el-button
              :disabled="!user.branch_prison || scope.row.prisonerNum !== 0"
              size="mini"
              :type=" !user.branch_prison || scope.row.prisonerNum !== 0 ? 'info' : 'danger' "
              @click="onDelete(scope.row.id)">删除</el-button>
            <el-button
              :disabled="!user.branch_prison"
              :type=" !user.branch_prison ? 'info' : 'primary' "
              size="mini"
              @click="handleEdit(scope.row, scope.$index)">编辑</el-button>
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
      :title="showContent['title']"
      width="530px">
      <el-input
        :class="validatingRepetition ? 'input__error' : ''"
        @blur="handleValidate"
        v-model.trim="prisonArea.name"
        placeholder="请输入监区名称" />
        <div
          class="el-input-div__error"
          v-if="validatingRepetition">{{ '“' + prisonArea.name + '”' + ' 已经存在！' }}</div>
      <template slot="footer">
        <el-button
          type="primary"
          size="mini"
          class="button-add"
          :disabled="!prisonArea.name"
          @click="handleOperate">{{ showContent['text'] }}</el-button>
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
      allPrisonAreas: [],
      index: '',
      dialogPermission: '',
      validatingRepetition: false
    }
  },
  computed: {
    ...mapState(['prisonAreas', 'prisonAll']),
    user() {
      if (localStorage['user']) return JSON.parse(localStorage['user'])
    },
    showContent() {
      let title, text
      switch (this.dialogPermission) {
        case 'edit':
          title = '编辑监区'
          text = '更新'
          break;
        case 'add':
          title = '新增监区'
          text = '新增'
          break;
        default:
          title = ''
          text = ''
          break;
      }
      return {title,text}
    }
  },
  async mounted() {
    if (this.user.role !== '4' && this.user.role !== '-1') {
      await this.getPrisonAll()
      this.searchItems.jailId.options = this.prisonAll
      this.searchItems.jailId.getting = false
    }
    await this.getDatas()
  },
  methods: {
    ...mapActions(['getPrisonAreas', 'getPrisonAll', 'updatePrisonArea', 'deletePrisonArea', 'addPrisonArea']),
    sizeChange(rows) {
      this.$refs.pagination.handleSizeChange(rows)
      this.getDatas()
    },
    getDatas() {
      if (this.user.role !== '4' && this.user.role !== '-1') {
        this.getPrisonAreas({ params: {...this.filter, ...this.pagination }})
      }
      else { // 监狱管理员或者租户管理员
        this.getPrisonAreas({ params: {...{ jailId: JSON.parse(localStorage['user']).jailId }, ...this.pagination }})
      }
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },
    handleEdit(e, index) {
      this.prisonArea = Object.assign({}, e)
      this.dialogPermission = 'edit'
      this.validatingRepetition = false
      this.dialogVisible = true
      this.index = index
    },
    handleOperate() {
      const { id, name } = this.prisonArea
      if(this.dialogPermission === 'edit') {
        this.updatePrisonArea({id,name}).then(res => {
          if (res.code !== 200) return
          this.prisonAreas.contents[this.index].name = this.prisonArea.name
          this.prisonAreas.contents[this.index].updatedAt = res.data.prisonConfig.updatedAt
          this.dialogVisible = false
        })
      }
      if(this.dialogPermission === 'add' && !this.validatingRepetition) {
        this.addPrisonArea({name}).then(res => {
          if(!res) return
          this.dialogVisible = false
          this.getDatas()
        })
      }
    },
    onDelete(id) {
      this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deletePrisonArea({ id }).then(res => {
          if (!res) return
          this.getDatas()
        })
      }).catch(() => {})
    },
    async handleAdd() {
      this.$set(this.prisonArea, 'name', '')
      this.dialogPermission = 'add'
      this.validatingRepetition = false
      this.dialogVisible = true
      if(!this.allPrisonAreas.length) {
        const res = await this.getPrisonAreas({ params: {...{ jailId: JSON.parse(localStorage['user']).jailId }, ...{ page: 1, rows: 100 }}, defaultMode: 'all' })
        this.allPrisonAreas = res
      }
    },
    handleValidate(e) {
      if(this.dialogPermission === 'edit') return
      if(this.dialogPermission === 'add') {
        if(this.allPrisonAreas.length) {
          this.validatingRepetition = this.allPrisonAreas.some(val => val.name === this.prisonArea.name)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.cell{
  button{
    margin-right: 6px;
  }
  button+button{
    margin: 5px 6px 0 0;
  }
}

.prison-name {
  margin: 0;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-weight: normal;
  background-color: #e2e2e2;
}
.el-input-div__error {
  font-size: 12px;
  color: #f56c6c;
  line-height: 1;
  padding-top: 4px;
}
</style>

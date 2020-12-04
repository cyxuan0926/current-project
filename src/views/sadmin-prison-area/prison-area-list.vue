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
    <m-excel-download
      v-if="hasAllPrisonQueryAuth"
      path="/download/exportPrison"
      :params="filter" />
    <m-search
      :items="user.role !== '4' && user.role !=='-1' ? searchItems: null "
      @search="onSearch" />
    <el-col :span="24">
      <m-table-new
        stripe
        :data="prisonAreas.contents"
        style="width: 100%"
        :cols="tableCols">
        <template #createdAt="{ row }">{{ row.createdAt | Date }}</template>
        <template #updatedAt="{ row }">{{ row.updatedAt | Date }}</template>
        <template #operation="{ row, $index }">
          <el-button
            :disabled=" row.id === '-1' || row.prisonerNum !== 0 "
            size="mini"
            :type=" row.id === '-1' || row.prisonerNum !== 0  ? 'info' : 'danger' "
            @click="onDelete(row.id)">删除</el-button>
          <el-button
            :disabled="row.id === '-1'"
            :type=" row.id === '-1' ? 'info' : 'primary' "
            size="mini"
            @click="handleEdit(row.id, $index)">编辑</el-button>
        </template>
      </m-table-new>
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
        class="prisonAreas-inp"
        v-if="checkIsShow(1)"
        v-model.trim="prisonArea.name"
        :disabled="checkIsDisabled(1)"
        maxlength="30"
        placeholder="请输入监区名称" />

      <el-input
        class="prisonAreas-inp"
        v-if="checkIsShow(2)"
        v-model.trim="prisonArea.branchname"
        :disabled="checkIsDisabled(2)"
        maxlength="30"
        placeholder="请输入分监区名称" />
      
      <el-input
        class="prisonAreas-inp"
        v-if="checkIsShow(3)"
        v-model.trim="prisonArea.building"
        :disabled="checkIsDisabled(3)"
        maxlength="30"
        placeholder="请输入楼栋名称" />

      <el-input
        class="prisonAreas-inp"
        v-if="checkIsShow(4)"
        v-model.trim="prisonArea.layer"
        :disabled="checkIsDisabled(4)"
        maxlength="30"
        placeholder="请输入楼层名称" />
      
      <div class="el-input-div__error" v-if="!!errTips">（{{ errTips }}）</div>
      <template slot="footer">
        <el-button
          type="primary"
          size="mini"
          class="button-add"
          @click="handleOperate">{{ showContent['text'] }}</el-button>
      </template>
    </el-dialog>
  </el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import http from '@/service'
export default {
  props: {
    // 是否有权限查看所有监狱的数据（在路由的 props 中定义）
    hasAllPrisonQueryAuth: Boolean
  },
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
      validatingError: false,
      filter: {},
      errTips: '',
      maxLevel: 4
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
    },
    tableCols() {
      let cols = [
        {
          label: '监狱名称',
          prop: 'jailName'
        },
        {
          label: '监区名称',
          prop: 'fullName'
        },
        {
          label: '创建时间',
          slotName: 'createdAt'
        },
        {
          label: '更新时间',
          slotName: 'updatedAt'
        },
        {
          label: '监区服刑人数',
          prop: 'prisonerNum'
        },
        {
          label: '操作',
          slotName: 'operation'
        }
      ]
      if (this.user.role === '0') cols.splice(-1, 1)
      return cols
    }
  },
  async mounted() {
    this.getDatas()
    let { data } = await http.queryPrisonAreaMaxlevel()
    if ( data.maxLevel ) {
      this.maxLevel = data.maxLevel
    }
    if (this.user.role !== '4' && this.user.role !== '-1') {
      await this.getPrisonAll()
      this.searchItems.jailId.options = this.prisonAll
      this.searchItems.jailId.getting = false
    }
  },
  methods: {
    ...mapActions([
      'getPrisonAreas',
      'getPrisonAll',
      'updatePrisonArea',
      'deletePrisonArea',
      'addPrisonArea'
    ]),
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
    async handleEdit(id, index) {
      let { data } = await http.queryPrisonArea({ id })
      this.prisonArea = data.prisonConfigs
      this.maxLevel = this.prisonArea.level
      this.dialogPermission = 'edit'
      this.validatingError = false
      this.dialogVisible = true
      this.index = index
      this.errTips = ''
    },
    checkIsShow(level) {
      return this.dialogPermission === 'add' || this.dialogPermission === 'edit' && this.maxLevel && this.maxLevel >= level
    },
    checkIsDisabled(level) {
      return this.dialogPermission === 'edit' && this.maxLevel && this.maxLevel > level
    },
    checkPrisonAreaInputs(val = [], isEdit) {
      let hasvalIndex = 0
      let hasNovalIndex = 'init'
      let tips = ['监区名称', '分监区名称', '楼栋名称', '楼层名称']
      val.forEach((v, i) => {
        if ( !!v ) {
          hasvalIndex = i
        } else {
          (hasNovalIndex === 'init') && (hasNovalIndex = i)
        }
      })
      if (hasNovalIndex === 'init') {
        return
      }
      if ( hasNovalIndex <= hasvalIndex || this.maxLevel && hasNovalIndex <= this.maxLevel - 1 ) {
        this.errTips = `请输入${ tips[hasNovalIndex] }`
        return true
      }
    },
    handleOperate() {
      const { id, name = '', branchname = '', building = '', layer = ''} = this.prisonArea
      const _inputs = []
      if ( !this.maxLevel ) {
        _inputs.push(name, branchname, building, layer)
      } else if (this.maxLevel >= 1) {
        _inputs.push(name)
      } else if (this.maxLevel >= 2) {
        _inputs.push(branchname)
      } else if (this.maxLevel >= 3) {
        _inputs.push(building)
      } else if (this.maxLevel >= 4) {
        _inputs.push(layer)
      }
      if( this.checkPrisonAreaInputs(_inputs) ) {
        return
      }
      let _fullname = _inputs.join('-')
      if( this.handleValidate(_fullname) ) {
        this.errTips = `${ _fullname }，已经存在！`
        return
      }
      if(this.dialogPermission === 'edit') {
        this.updatePrisonArea({
          id,
          name,
          branchname,
          building,
          layer
        }).then(res => {
          if (res.code !== 200) return
          this.getDatas()
          this.dialogVisible = false
        })
      }
      if(this.dialogPermission === 'add') {
        this.addPrisonArea({
          name,
          branchname,
          building,
          layer
        }).then(res => {
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
      this.prisonArea = {}
      this.dialogPermission = 'add'
      this.validatingError = false
      this.dialogVisible = true
      this.maxLevel = null
      this.errTips = ''
      if(!this.allPrisonAreas.length) {
        const res = await this.getPrisonAreas({ params: {...{ jailId: JSON.parse(localStorage['user']).jailId }, ...{ page: 1, rows: 100 }}, defaultMode: 'all' })
        this.allPrisonAreas = res.prisonConfigs || []
      }
    },
    handleValidate(fullname) {
      if(this.dialogPermission === 'edit') return
      if(this.dialogPermission === 'add') {
        if(this.allPrisonAreas.length) {
          return this.allPrisonAreas.some(val => val.fullname === fullname)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// .cell{
//   button{
//     margin-right: 6px;
//   }
//   button+button{
//     margin: 5px 6px 0 0;
//   }
// }

.prison-name {
  margin: 0;
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-weight: normal;
  // background-color: #e2e2e2;
  color: #fff;
  background-color: #3c8dbc;
}
.el-input-div__error {
  font-size: 12px;
  color: #f56c6c;
  line-height: 1;
  padding-top: 10px;
  text-align: center;
}
.prisonAreas-inp {
  margin-bottom: 10px;
}
</style>

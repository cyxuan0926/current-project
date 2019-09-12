<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-search
      ref="search"
      :items="searchItems"
      clearable
      @search="onSearch">
      <template slot="append">
        <el-button
          type="primary"
          @click="() => {
                operationType = 1
                visible = true
              }">
          新增
        </el-button>
        <m-excel-download
          path="/"
          text="模板" />
        <el-button type="primary">导入</el-button>
      </template>
    </m-search> 
    <el-col :span="24">
      <m-table
        :data="roleContents['tableData']"
        :cols="roleContents['cols']"
        class="mini-td-padding">
        <template
          slot-scope="scope"
          slot="operate">
            <el-button
              @click="() => {
                scope.row.isEnabled ? operationType = 2 : operationType = 3
                visible = true
              }"
              type="primary"
              plain>{{ scope.row.isEnabled ? '禁用' : '启用'}}</el-button>
          </template>
      </m-table>
    </el-col>
    <m-pagination
      ref="pagination"
      :total="totalPage"
      @onPageChange="getDatas" />
    <el-dialog
      :visible.sync="visible"
      :title="dialogConent['title']"
      class="authorize-dialog"
      width="530px"
      @close="handleCloseDialog">
      <el-row v-if=" operationType === 4 ">
        <el-col style="line-height: 30px">
          <i
            class="el-icon-success green"
            style="font-size: 20px;margin-right: 10px;" />成功：条<br>
          <i
            class="el-icon-error red"
            style="font-size: 20px; margin-right: 10px;" />失败：条
          <p style="padding-left: 30px">
            原因：上传的Excel文件内容格式有误，请检查文件内容，仔细对照下载的模版数据
          </p>
        </el-col>
        <el-col class="button-box">
          <el-button
            size="small"
            @click="visible = false"
            type="primary">
            确定
          </el-button>
        </el-col>
      </el-row>
      <template v-else>
        <el-row v-if=" operationType === 3 ">
          <el-col>确定启用该用户吗？</el-col>
          <el-col>禁用的原因：</el-col>
        </el-row>
        <m-form
          :items="dialogConent['items']"
          @submit="handleSubmit"
          ref="dialogForm"
          @cancel="visible = false"/>
        </template>
    </el-dialog>  
  </el-row>
</template>
<script>
import { mapActions, mapState } from 'vuex';
export default {
  data () {
    console.log(this.role)
    let searchItems
    if ( this.role === '5') {
      searchItems = {
        ...{zhanghu: { type: 'input', label: '账户' },
        yujinghao: { type: 'input', label: '狱警号' },
        zhengshixingming: { type: 'input', label: '真实姓名' },
        yonghuzhuangtai: { type: 'select', label: '用户状态', options: [], belong: { value: 'value',  label: 'label' } }}
      }
    }
    if (this.role === '6') {
      searchItems = {
        ...{accountName: { type: 'input', label: '账户' },
        isEnabled: {
          type: 'select',
          label: '用户状态',
          options: [ {userLable: '全部', userStatus: '' }, {userLable: '是', userStatus: 1 }, {userLable: '否', userStatus: 0 } ],
          belong: { value: 'userStatus', label: 'userLable' },
          value: '' }}
      }
    }
    return {
      searchItems,
      totalPage: 0,
      visible: false,
      operationType: 0 // 0：无操作 1：新增账户 2：禁用 3：启用 4：账户导入
    }
  },
  mounted() {
    this.getDatas()
  },
  props: {
    role: String
  },
  computed: {
    ...mapState('literature', ['authorFamiles']),
    dialogConent() {
      let title, items = {}, formButton = { buttons: [{ add: 'add', text: '确认' }, 'cancel'] }
      switch(this.operationType) {
        case 1:
          title = '新增账户'
          items = {...{
            formConfigs: { labelWidth: '90px' },
            zhanghu: { type: 'input', label: '账户', rules: ['required'], clearable: true, placeholder: '请输入手机号码' },
            yujinghao: { type: 'input', label: '狱警号', rules: ['required'], clearable: true },
            zhengshixingming: { type: 'input', label: '真实姓名', rules: ['required'], clearable: true },
            xingbie: { type: 'select', label: '性别', rules: ['required'], clearable: true, options: [{ label: '男', value: 'm' }, { label: '女', value: 'f' }], props: { label: 'label', value: 'value' }, value: 'm' }
          }, ...{
            buttons: ['add', 'cancel']
          }}
          break
        case 2:
          title = ''
          items = {...{
            yuanyin: { type: 'textarea', noLabel: true, placeholder: '请输入该用户被禁用的原因', label: '该用户被禁用的原因', autosize: { minRows: 5 }, rules: ['required'] }
          }, ...formButton}
          break
        case 3:
          title = ''
          items = {...{
            yuanyin: { type: 'textarea', noLabel: true, disabled: true, label: '用户被禁用时的原因' }
          }, ...formButton}
          break
        case 4:
          title = '账户导入'
          items = {}
          break
        default:
          break
      }
      return { items, title }
    },
    roleContents() {
      let cols, searchItems, tableData
      switch(this.role) {
        case '5':
          cols = [
            {
              label: '序号',
              type: 'index',
              index: this.handleGetIndex
            },
            {
              label: '账户'

            },
            {
              label: '真实姓名'
            },
            {
              label: '笔名'
            },
            {
              label: '狱警号'
            },
            {
              label: '性别'
            },
            {
              label: '监狱名称'
            },
            {
              label: '省'
            },
            {
              label: '头像'
            },
            {
              label: '操作'
            }
          ]
          break
        case '6':
          cols = [
            {
              label: '序号',
              type: 'index',
              index: this.handleGetIndex
            },
            {
              label: '账户',
              prop: 'accountName'
            },
            {
              label: '笔名',
              prop: 'pseudonym'
            },
            {
              label: '被禁用原因',
              prop: 'disabledReason'
            },
            {
              label: '操作',
              slotName: 'operate',
              align: "center"
            }
          ]
          searchItems = {...{
            accountName: { type: 'input', label: '账户' },
            isEnabled: {
              type: 'select',
              label: '用户状态',
              options: [ {userLable: '全部', userStatus: '' }, {userLable: '是', userStatus: 1 }, {userLable: '否', userStatus: 0 } ],
              belong: { value: 'userStatus', label: 'userLable' },
              value: '' }
          }}
          tableData = this.authorFamiles
          break
        default:
          break
      }
      return { cols, searchItems, tableData }
    }
  },
  mounted() {
    this.getDatas()
  },
  methods: {
    ...mapActions('literature', ['getAuthorFamily']),
    async getDatas() {
      let res
      const params = { ...this.filter, ...this.pagination }
      if (this.role === '6') {
        res = await this.getAuthorFamily(params)
        this.totalPage = res.data.authorsSize
      }
      if (this.role === '5') res = 2
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },
    handleGetIndex(index) {
      return this.pagination.rows * (this.pagination.page - 1) + index + 1
    },
    handleSubmit(params) {
      console.log(params)
    },
    handleCloseDialog() {
      this.$refs.dialogForm && this.$refs.dialogForm.onCancel()
    }
  }
}
</script>

<style scoped lang="scss">
.button-box {
  padding-top: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>

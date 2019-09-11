<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-search
      :items="searchItems"
      @sizeChange="sizeChange"
      @search="onSearch">
      <template slot="append">
        <el-button
          type="primary"
          @click="handleShowDialog">
          新增
        </el-button>
        <m-excel-download
          path="/"
          text="模板" />
        <el-button type="primary">导入</el-button>
      </template>
    </m-search> 
    <el-col :span="24">
      <el-table
        :data="[]"
        border
        style="width: 100%">
        <el-table-column
          :index="handleGetIndex"
          type="index"
          label="序号" />
        <el-table-column label="账户" />
        <el-table-column label="真实姓名" />
        <el-table-column label="笔名">
          <!-- <template slot-scope="scope">
            <span>{{ scope.row-scope.index }}</span>
          </template> -->
        </el-table-column>  
        <el-table-column label="狱警号" />
        <el-table-column label="性别" />
        <el-table-column label="监狱名称" />
        <el-table-column label="省" />
        <el-table-column label="头像" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              plain>{{ scope.row.status ? '禁用' : '启用'}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <m-pagination
      ref="pagination"
      :total="0"
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
export default {
  data () {
    return {
      searchItems: {
        zhanghu: { type: 'input', label: '账户' },
        yujinghao: { type: 'input', label: '狱警号' },
        zhengshixingming: { type: 'input', label: '真实姓名' },
        yonghuzhuangtai: { type: 'select', label: '用户状态', options: [], belong: { value: 'value',  label: 'label' } }
      },
      visible: false,
      operationType: 0 // 0：无操作 1：新增账户 2：禁用 3：启用 4：账户导入
    }
  },
  mounted() {
    this.getDatas()
  },
  computed: {
    dialogConent() {
      let title, items = {}, formButton = { buttons: [{ add: 'add', text: '确认' }, 'cancel'] }
      switch(this.operationType) {
        case 1:
          title = '新增账户'
          items = {...{
            formConfigs: { labelWidth: '120px' },
            zhanghu: { type: 'input', label: '账户', rules: ['required'], clearable: true, placeholder: '请输入手机号码' },
            yujinghao: { type: 'input', label: '狱警号', rules: ['required'], clearable: true },
            zhengshixingming: { type: 'input', label: '真实姓名', rules: ['required'], clearable: true },
            xingbie: { type: 'select', label: '性别', rules: ['required'], clearable: true, options: [{ label: '男', value: 'm' }, { label: '女', value: 'f' }], props: { label: 'label', value: 'value' }, value: 'm' }
          }, ...{
            buttons: ['add', 'cancel']
          }}
        case 2:
          title = ''
          items = {...{
            yuanyin: { type: 'textarea', noLabel: true, placeholder: '请输入该用户被禁用的原因', label: '该用户被禁用的原因', autosize: { minRows: 5 }, rules: ['required'] }
          }, ...formButton}
        case 3:
          title = ''
          items = {...{
            yuanyin: { type: 'textarea', noLabel: true, disabled: true }
          }, ...formButton}
        case 4:
          title = '账户导入'
          items = {}
        default:
          break
      }
      return { items, title }
    }
  },
  methods: {
    getDatas() {
      const params = { ...this.filter, ...this.pagination }
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },
    sizeChange(rows) {
      this.$refs.pagination.handleSizeChange(rows)
      this.getDatas()
    },
    handleShowDialog() {
      this.visible = true
    },
    handleGetIndex(index) {
      return this.pagination.rows * (this.pagination.page - 1) + index + 1
    },
    handleSubmit(params) {
      console.log(params)
    },
    handleCloseDialog() {
      console.log('close')
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

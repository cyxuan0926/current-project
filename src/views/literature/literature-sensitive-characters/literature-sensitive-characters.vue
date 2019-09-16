<template>
  <el-row
    class="row-container"
    :gutter="0">
    <m-search
      :items="searchItems"
      @search="onSearch" >
      <template slot="append">
        <el-button
          type="primary"
          @click="handleDelSensitiveCharacters">
          删除
        </el-button>
        <m-excel-download
          path="/download/downloadfile"
          :params="{ filepath: 'sensitive_words_template.xls' }"
          text="模板" />
        <el-button
          type="primary"
          @click="handleShowAddDialog">
          新增
        </el-button>
        <m-excel-upload
          url="/sensitiveword/upload"
          :get-results="handleGetUploadResults" />
      </template>
    </m-search>  
    <el-col :span="24">
      <m-table
        :selection-change="handleSelectChange"
        :data="sensitiveWords"
        :cols="test"
        class="mini-td-padding">
        <template
          slot="keyWord"
          slot-scope="scope">
          <span v-if="!operationStatus[scope.$index]">{{scope.row.keyWord}}</span>
            <el-input
              v-else
              v-model="operationInput[scope.$index]"/>
        </template>
        <template
          slot="isEnabled"
          slot-scope="scope">
          <span v-if="!operationStatus[scope.$index]">{{scope.row.isEnabled | isTrue}}</span>
            <el-select
              v-else
              v-model="operationSelects[scope.$index]">
              <el-option
                v-for="(val, index) in [{ value: 1, label: '是' }, { value: 0, label: '否' }]"
                :label="val.label"
                :value="val.value"
                :key="index" />
            </el-select>
        </template>
        <template
          slot-scope="scope"
          slot="operate">
            <el-button
              @click="handleOperate(scope)"
              type="primary"
              plain>{{ !operationStatus[scope.$index] ? '修改' : '保存' }}</el-button>
          </template>
      </m-table>
    </el-col>
    <m-pagination
      ref="pagination"
      :total="totalPage"
      @onPageChange="getDatas" />
    <el-dialog
      :visible.sync="visible"
      :title="dialogOperationStatus ? '数据导入' : '新增敏感关键字'"
      class="authorize-dialog"
      width="530px"
      @close="handleCloseDialog">
      <el-row v-if="dialogOperationStatus">
        <el-col style="line-height: 30px">
          <i
            class="el-icon-success green"
            style="font-size: 20px;margin-right: 10px;" />{{!uploadResults.error_total ? `成功导入${uploadResults.success_total}条` : `成功：${uploadResults.success_total}条`}}<br>
          <template v-if="!!uploadResults.error_total">
            <i
            class="el-icon-error red"
            style="font-size: 20px; margin-right: 10px;" />失败：{{uploadResults.error_total}}条
            <p style="padding-left: 30px">原因：上传的Excel文件内容格式有误，请检查文件内容，仔细对照下载的模版数据</p>
          </template>
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
      <m-form
        v-else
        :items="dialogFormItems"
        @submit="handleSubmit"
        ref="dialogForm"
        @cancel="visible = false"/>
    </el-dialog>  
  </el-row>
</template>
<script>
import { mapActions, mapState } from 'vuex';
export default {
  data () {
    const options = [{ value: 1, label: '是' }, { value: 0, label: '否' }]
    return {
      searchItems: {
        keyWord: { type: 'input', label: '关键词' },
        isEnabled: { type: 'select', options, belong: { value: 'value',  label: 'label' }, label: '是否有效' }
      },
      dialogFormItems: {
        formConfigs: { labelWidth: '120px' },
        keyWord: { type: 'input', label: '关键字', rules: ['required'], clearable: true },
        isEnabled: { type: 'select', label: '是否有效', rules: ['required'], options, props: { label: 'label', value: 'value' }, value: 1 },
        buttons: [ 'add', 'cancel' ]
      },
      delSensitiveCharacters: [],
      visible: false,
      totalPage: 0,
      operationStatus: [],
      operationSelects: [],
      operationInput: [],
      dialogOperationStatus: 0,
      uploadResults: {},
      test: [
        {
          type: 'selection'
        },
        {
          type: 'index',
          label: '编号',
          index: this.handleGetIndex
        },
        {
          label: '关键词',
          slotName: 'keyWord'
        },
        {
          label: '是否有效',
          slotName: 'isEnabled'
        },
        {
          label: '操作',
          slotName: 'operate',
          align: "center"
        }
      ]
    }
  },
  mounted() {
    this.getDatas()
  },
  methods: {
    ...mapActions('literature', ['getSensitivewords', 'addSensitiveword', 'delSensitiveword', 'editSensitiveword']),
    // 编号字段
    handleGetIndex(index) {
      return this.pagination.rows * (this.pagination.page - 1) + index + 1
    },
    // 获取数据
    async getDatas() {
      const params = { ...this.filter, ...this.pagination }
      const res = await this.getSensitivewords(params)
      this.totalPage = res.data.wordsSize
      this.operationStatus = new Array(this.totalPage).fill(0)
      this.operationSelects = new Array(this.totalPage).fill(1)
      this.operationInput = new Array(this.totalPage).fill('')
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1)
    },
    // 列表的操作
    async handleOperate(data) {
      const { row, $index } = data
      if (this.operationStatus[$index] === 0 ) {
        this.$set(this.operationStatus, $index, 1)
        this.$set(this.operationInput, $index, row.keyWord)
        this.$set(this.operationSelects, $index, row.isEnabled)
      }
      else {
        const params = { id: row.id, keyWord: this.operationInput[$index], isEnabled: this.operationSelects[$index]}
        const res = await this.editSensitiveword(params)
        if (res) this.getDatas()
      }
    },
    // 展示新增对话框
    handleShowAddDialog() {
      this.dialogOperationStatus = 0
      this.visible = true
    },
    // 关闭新增对话框
    handleCloseDialog() {
      this.$refs.dialogForm && this.$refs.dialogForm.onCancel()
    },
    // 新增
    async handleSubmit(params) {
      const res = await this.addSensitiveword(params)
      this.handleCloseDialog()
      if (res) this.onSearch()
    },
    // 选择删除的数据
    handleSelectChange(data) {
      this.delSensitiveCharacters = data
    },
    // 删除敏感关键字
    handleDelSensitiveCharacters() {
      if (!this.delSensitiveCharacters.length) {
        this.$message({
          showClose: true,
          message: '未选中任何记录',
          type: 'warning'
        })
      }
      else {
        const ids = (this.delSensitiveCharacters.map(item => item.id)).join(',')
        this.$confirm('请问确认删除选择的关键词吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        }).then(async () => {
          await this.delSensitiveword({ ids })
          if(this.delSensitiveCharacters.length === this.sensitiveWords.length) this.$refs.pagination.handleCurrentChange(this.pagination.page - 1)
          else this.getDatas()
        }).catch(() => {})
      }
    },
    handleGetUploadResults(response) {
      this.$message({
        showClose: true,
        message: response.msg,
        duration: 3000,
        type: response.code === 200 ? 'success' : 'error'
      })
      if (response.code === 200) {
        setTimeout(() => {
          this.dialogOperationStatus = 1
          this.visible = true
          this.uploadResults = response.data
        }, 1000)
      }
    }
  },
  computed: {
    ...mapState('literature', ['sensitiveWords']),
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

<template>
  <el-row
    class="row-container"
    :gutter="0">
    <el-row :gutter="0">
      <el-col
        :span="22"
        :offset="2">
        <span>点击下载模板：</span>
        <a :href="prisonerHref">零花钱数据导入模板</a>
      </el-col>
    </el-row>
    <el-row :gutter="0">
      <el-col
        :span="22"
        :offset="2">
        <p>上传数据文件：限制文件后缀名为
          <span class="red">.xls</span>
        </p>
      </el-col>
    </el-row>
    <el-row :gutter="0">
      <el-col
        :span="22"
        :offset="2">
        <el-upload
          class="upload-demo"
          ref="upload"
          action="/prisoners/upload"
          :before-upload="beforeUpload"
          :file-list="fileList"
          :auto-upload="false"
          :limit="1"
          accept=".xls">
          <el-button
            slot="trigger"
            size="small"
            type="primary">选取文件</el-button>
          <el-button
            size="small"
            type="success"
            @click="submitUpload">解析文件</el-button>
          <el-button
            :disabled="!uploadPocketMoneyExcelResult.path"
            size="small"
            type="primary"
            @click="onSubmit">
            导入解析成功数据
          </el-button>
          <div
            slot="tip"
            class="el-upload__tip">只能上传.xls文件</div>
        </el-upload>
      </el-col>
    </el-row>
    <el-row v-if="uploadPocketMoneyExcelResult.error_arrays && uploadPocketMoneyExcelResult.error_arrays.length">
      <el-tag type="danger">解析失败的信息:</el-tag>
      <!--上传模板失败的结果-->
      <el-table :data="uploadPocketMoneyExcelResult.error_arrays">
        <el-table-column
          label="所在行"
          prop="row"
          width="70px" />
        <el-table-column
          label="罪犯编号"
          prop="prisonerNumber" />
        <el-table-column
          label="当前余额（元）"
          prop="balance" />
        <el-table-column
          label="收入金额（元）"
          prop="income" />
        <el-table-column
          label="支出金额（元）"
          prop="expenditure" />
        <el-table-column
          label="日期"
          prop="accountDate" />
        <el-table-column
          label="失败原因"
          min-width="160px">
          <template slot-scope="scope">
            <!-- <span v-html="scope.row.err"></span> -->
            <el-tooltip placement="top">
              <div
                slot="content"
                v-html="scope.row.err"/>
              <div
                v-html="scope.row.err"
                class="showEllipsis"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row v-if="uploadPocketMoneyExcelResult.success_arrays && uploadPocketMoneyExcelResult.success_arrays.length">
      <el-tag type="success">解析成功的信息:</el-tag>
      <!--上传模板文件的结果-->
      <el-table :data="uploadPocketMoneyExcelResult.success_arrays">
        <el-table-column
          label="所在行"
          prop="row"
          width="70px" />
        <el-table-column
          label="罪犯编号"
          prop="prisonerNumber" />
        <el-table-column
          label="当前余额（元）"
          prop="balance" />
        <el-table-column
          label="收入金额（元）"
          prop="income" />
        <el-table-column
          label="支出金额（元）"
          prop="expenditure" />
        <el-table-column
          label="日期"
          prop="accountDate" />
      </el-table>
    </el-row>
  </el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      fileList: [],
      prisonerHref: `${ this.$urls.apiHost }${ this.$urls.apiPath }/download/downloadfile?filepath=pocket_money_template.xls`
    }
  },
  computed: {
    ...mapState(['uploadPocketMoneyExcelResult', 'importPocketMoneyResult'])
  },
  mounted() {
    this.resetState({ uploadPocketMoneyExcelResult: {} })
  },
  methods: {
    ...mapActions(['importPocketMoney', 'uploadPocketMoneyExcel', 'resetState']),
    submitUpload() {
      this.$refs.upload.submit()
    },
    beforeUpload(file) {
      this.resetState({ uploadPocketMoneyExcelResult: {} })
      this.uploadPocketMoneyExcel(file).then(res => {
        if (!res) return
        this.alertParseResult(this.uploadPocketMoneyExcelResult)
      })
      return false
    },
    onSubmit() {
      this.importPocketMoney({ path: this.uploadPocketMoneyExcelResult.path }).then(res => {
        if (!res) return
        this.alertImportResult(this.importPocketMoneyResult)
        this.uploadPocketMoneyExcelResult.path = ''
      })
    },
    // 解析文件成功后执行的方法
    alertParseResult(result) {
      this.$notify({
        title: '解析结果提示',
        dangerouslyUseHTMLString: true,
        message: `<p>成功：${ result.success_total }</p>
                  <p>失败：${ result.error_total }</p>`,
        duration: 8000,
        offset: 100
      })
    },
    // 上传文件成功后执行的方法
    alertImportResult(result) {
      this.$notify({
        title: '导入结果提示',
        dangerouslyUseHTMLString: true,
        message: `<p>新增：${ result.insert }</p>
                  <p>修改：${ result.update }</p>
                  <p>失败：${ result.error }</p>
                  <p>共计：${ result.total }</p>`,
        duration: 8000,
        offset: 100
      })
    }
  }
}
</script>

<style lang="css" scoped>
.row-container {
  min-height: 370px;
  line-height: 40px;
}
.row-container .red {
  color: #F56C6C;
  font-weight: bold;
}
.row-container .showEllipsis{
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>

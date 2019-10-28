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
        <p>限制文件后缀名为
          <span class="red">.xls</span>或<span class="red">.xlsx</span>
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
          accept=".xls, .xlsx">
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
            class="el-upload__tip">请上传.xls或.xlsx文件</div>
        </el-upload>
      </el-col>
    </el-row>
    <el-row v-if="uploadPocketMoneyExcelResult.error_arrays && uploadPocketMoneyExcelResult.error_arrays.length">
      <el-tag type="danger">解析失败的信息:</el-tag>
      <!--上传模板失败的结果-->
      <el-table :data="uploadPocketMoneyExcelResult.error_arrays" stripe>
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
          class-name="tips"
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
      <el-table :data="uploadPocketMoneyExcelResult.success_arrays" stripe>
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
import Utils from './utils'
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
    ...mapActions(['importSuccessfulAnalysisExcel', 'uploadAnalyticExcel', 'resetState']),
    submitUpload() {
      this.$refs.upload.submit()
    },
    beforeUpload(file) {
      this.resetState({ uploadPocketMoneyExcelResult: {} })
      let params = { url: '/pocket_money/examine', values: file, type: 0 }
      this.uploadAnalyticExcel(params).then(res => {
        if (!res) return
        Utils.alertParseResult(this.uploadPocketMoneyExcelResult)
      })
      return false
    },
    onSubmit() {
      let params = { url: '/pocket_money/upload', path: this.uploadPocketMoneyExcelResult.path, type: 0 }
      this.importSuccessfulAnalysisExcel(params).then(res => {
        if (!res) return
        Utils.alertImportResult(this.importPocketMoneyResult)
        this.uploadPocketMoneyExcelResult.path = ''
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
.tips{
  color: #f56c6c;
  font-weight: bold;
  text-align: center;
}
</style>

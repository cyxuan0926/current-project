<template>
 <el-row
    class="row-container"
    :gutter="0">
    <el-row :gutter="0">
      <el-col
        :span="22"
        :offset="2">
        <span>点击下载模板：</span>
        <a :href="ExcelTemplateHref">狱内消费情况导入模板</a>
      </el-col>
    </el-row>
    <el-row :gutter="0">
      <el-col :gutter="0">
        <el-col
          :span="22"
          :offset="2">
          <span>上传模板文件：</span>
          <p>限制文件后缀名为
            <span class="red">.xls</span>或<span class="red">.xlsx</span>
          </p>
        </el-col>
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
          :file-list="fileList"
          :before-upload="beforeUpload"
          :on-change="handleChange"
          :on-remove="handleRemove"
          :auto-upload="false"
          :limit="1"
          accept=".xls, .xlsx">
          <el-button
            slot="trigger"
            size="small"
            type="primary">选取文件</el-button>
          <el-button
            :disabled="!examineValue"
            size="small"
            :type="!examineValue ? 'info': 'success' "
            @click="submitUpload">解析文件</el-button>
          <el-button
            :disabled="importValue"
            size="small"
            @click="onSubmit"
            :type="importValue ? 'info': 'primary'">
            上传服务器
          </el-button>
          <div
            slot="tip"
            class="el-upload__tip">请上传.xls或.xlsx文件</div>
        </el-upload>
      </el-col>
    </el-row>
    <el-row v-if="uploadInsideJailsCostsExcelResult.error_arrays && uploadInsideJailsCostsExcelResult.error_arrays.length">
      <el-tag type="danger">解析失败的信息:</el-tag>
      <!--上传模板失败的结果-->
      <el-table :data="uploadInsideJailsCostsExcelResult.error_arrays">
        <el-table-column
          label="所在行"
          prop="row"
          width="70px" />
        <el-table-column
          label="罪犯编号"
          prop="prisonerNumber" />
        <el-table-column
          label="类型"
          prop="consumeType" />
        <el-table-column
          label="场地"
          prop="address" />
        <el-table-column
          label="交易金额（元）"
          prop="consume" />
        <el-table-column
          label="余额（元）"
          prop="balance" />
        <el-table-column
          label="操作时间"
          min-width="90px"
          prop="consumeAt">
          <template slot-scope="scope">
            {{ scope.row.consumeAt | Date }}
          </template>
        </el-table-column>
        <el-table-column
          label="失败原因"
          min-width="120px">
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
    <el-row v-if="uploadInsideJailsCostsExcelResult.success_arrays && uploadInsideJailsCostsExcelResult.success_arrays.length">
      <el-tag type="success">解析成功的信息:</el-tag>
      <!--上传模板文件的结果-->
      <el-table :data="uploadInsideJailsCostsExcelResult.success_arrays">
        <el-table-column
          label="所在行"
          prop="row"
          width="70px" />
        <el-table-column
          label="罪犯编号"
          prop="prisonerNumber" />
        <el-table-column
          label="类型"
          prop="consumeType" />
        <el-table-column
          label="场地"
          prop="address" />
        <el-table-column
          label="交易金额（元）"
          prop="consume" />
          <el-table-column
          label="余额（元）"
          prop="balance" />
        <el-table-column
          label="操作时间"
          prop="consumeAt">
          <template slot-scope="scope">
            {{ scope.row.consumeAt | Date }}
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </el-row>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import { helper } from '@/utils'
import Utils from './utils'
export default {
  data () {
    return {
      fileList: [],
      examineValue: 0,
      ExcelTemplateHref: `${ this.$urls.apiHost }${ this.$urls.apiPath }/download/downloadfile?filepath=prison_consume_template.xls`
    }
  },
  computed: {
    ...mapState(['uploadInsideJailsCostsExcelResult', 'importInsideJailsCostsResult']),
    importValue() {
      if (!helper.isEmptyObject(this.uploadInsideJailsCostsExcelResult)) return true
      else {
        if (!this.uploadInsideJailsCostsExcelResult.error_total && this.uploadInsideJailsCostsExcelResult.success_total) return false
        else return true
      }
    }
  },
  methods: {
    ...mapActions(['resetState', 'importSuccessfulAnalysisExcel', 'uploadAnalyticExcel']),
    handleChange(file, fileList) {
      this.examineValue = fileList.length
    },
    handleRemove(file, fileList) {
      this.examineValue = fileList.length
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    beforeUpload(file) {
      this.resetState({ uploadInsideJailsCostsExcelResult: {} })
      let params = { url: '/prisonerConsume/examine', values: file, type: 1 }
      this.uploadAnalyticExcel(params).then(res => {
        if (!res) return
        Utils.alertParseResult(this.uploadInsideJailsCostsExcelResult)
      })
      return false
    },
    onSubmit() {
      let params = { url: '/prisonerConsume/upload', path: this.uploadInsideJailsCostsExcelResult.path, type: 1 }
      this.importSuccessfulAnalysisExcel(params).then(res => {
        if (!res) return
        Utils.alertImportResult(this.importInsideJailsCostsResult)
        this.$set(this.uploadInsideJailsCostsExcelResult, 'success_total', 0)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.row-container {
  line-height: 40px;
  .red {
    color: #F56C6C;
    font-weight: bold;
  }
}
.button-group{
  padding-bottom: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  clear: both;
}
.tips-title{
  display: block;
  text-align: center;
  font-weight: bold;
}
.tips{
  color: #f56c6c;
  font-weight: bold;
  text-align: center;
  // font-size: 12px;
}
.table-box{
  margin-left: 20px;
  margin-right: 20px;
}
</style>
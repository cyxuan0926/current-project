<template>
  <el-row
    class="row-container"
    :gutter="0">
    <el-row :gutter="0">
      <el-col
        :span="22"
        :offset="2">
        <span>点击下载模板：</span>
        <a :href="prisonTermHref">刑期变动信息导入模板</a>
      </el-col>
    </el-row>
    <el-row :gutter="0">
      <el-col
        :span="22"
        :offset="2">
        <span>上传模板文件：</span>
        <p>限制文件后缀名为<span class="red">.xls</span></p>
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
            @click="submitUpload">上传到服务器</el-button>
          <div
            slot="tip"
            class="el-upload__tip">只能上传.xls文件</div>
        </el-upload>
      </el-col>
    </el-row>
    <el-row v-if="prisonTermResult.errors && prisonTermResult.errors.length">
      <!--上传模板文件的结果-->
      <el-tag type="danger">失败信息:</el-tag>
      <el-table :data="prisonTermResult.errors">
        <el-table-column
          label="罪犯编号"
          prop="prisonerNumber" />
        <el-table-column
          label="减刑时间"
          prop="changedate" />
        <el-table-column
          label="变动类型"
          prop="changetype" />
        <el-table-column
          label="减刑始日"
          prop="termStart" />
        <el-table-column
          label="减刑止日"
          prop="termFinish" />
        <el-table-column
          label="失败原因"
          show-overflow-tooltip
          prop="reason" />
      </el-table>
    </el-row>
    <el-row v-if="prisonTermResult.prisonTerms && prisonTermResult.prisonTerms.length">
      <!--上传模板文件的结果-->
      <el-tag type="success">成功信息:</el-tag>
      <el-table :data="prisonTermResult.prisonTerms">
        <el-table-column
          label="罪犯编号"
          prop="prisonerNumber" />
        <el-table-column
          label="减刑时间"
          prop="changedate" />
        <el-table-column
          label="变动类型"
          prop="changetype" />
        <el-table-column
          label="减刑始日"
          prop="termStart" />
        <el-table-column
          label="减刑止日"
          prop="termFinish" />
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.createdAt | Date }}
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data() {
    return {
      prisonTermHref: `${ this.$urls.apiHost }${ this.$urls.apiPath }/download/downloadfile?filepath=prison_term_template.xls`, // 下载罪犯刑期模板文件的地址
      fileList: []
    }
  },
  computed: {
    ...mapState(['prisonTermResult', 'uploadResult'])
  },
  methods: {
    ...mapActions(['importPrisonTerm', 'uploadFile', 'resetState']),
    // 上传罪犯刑期模板文件到服务端
    beforeUpload(file) {
      this.resetState({ prisonTermResult: {} })
      this.uploadFile(file).then(res => {
        if (!res) return
        this.importPrisonTerm({ filepath: this.uploadResult.path }).then(res => {
          if (!res) return
          this.alertInformation(this.prisonTermResult)
        })
      })
      return false
    },
    // 点击上传到服务器执行的方法
    submitUpload() {
      this.$refs.upload.submit()
    },
    // 解析文件成功后执行的方法
    alertInformation(information) {
      this.$notify({
        title: '解析结果提示',
        dangerouslyUseHTMLString: true,
        message: `<p>新增：${ information.add_total }</p>
                  <p>成功：${ information.success_total }</p>
                  <p>修改：${ information.update_total }</p>
                  <p>失败：${ information.errors.length }</p>`,
        duration: 8000,
        offset: 100
      })
    }
  },
  mounted() {
    this.resetState({ prisonTermResult: {} })
  }
}
</script>

<style type="text/stylus" lang="stylus" scoped>
.row-container
  min-height: 370px;
  line-height: 40px;
  .red
    color: #F56C6C;
    font-weight: bold;
</style>

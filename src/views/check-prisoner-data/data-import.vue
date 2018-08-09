<template>
  <el-row class="row-container"
    :gutter="0">
    <el-row :gutter="0">
      <el-col :span="22"
        :offset="2">
        <span>点击下载模板：</span>
        <a :href="prisonerHref">罪犯信息导入模板</a>
      </el-col>
    </el-row>
    <el-row :gutter="0">
      <el-col :span="22"
        :offset="2">
        <span>上传模板文件：</span>
        <p>限制文件后缀名为
          <span class="red">.xls</span>
        </p>
      </el-col>
    </el-row>
    <el-row :gutter="0">
      <el-col :span="6"
        :offset="2">
        <el-upload class="upload-demo"
          ref="upload"
          :action="_$agency + '/prisoners/upload'"
          :before-upload="beforeUpload"
          :file-list="fileList"
          :auto-upload="false"
          :limit="1"
          accept=".xls">
          <el-button slot="trigger"
            size="small"
            type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload">上传到服务器</el-button>
          <div slot="tip"
            class="el-upload__tip">只能上传.xls文件</div>
        </el-upload>
      </el-col>
    </el-row>
    <el-row v-if="prisonerDataResult.errors && prisonerDataResult.errors.length">
      <el-tag type="danger">失败信息:</el-tag>
      <!--上传模板失败的结果-->
      <el-table :data="prisonerDataResult.errors">
        <el-table-column label="所在行"
          prop="rowNum"
          width="70px" />
        <el-table-column label="罪犯编号"
          prop="prisonerNumber"
          width="100px" />
        <el-table-column label="罪犯名字"
          prop="name" />
        <el-table-column label="性别"
          width="50px">
          <template slot-scope="scope">
            {{scope.row.gender | gender}}
          </template>
        </el-table-column>
        <el-table-column label="犯罪事实"
          prop="crimes" />
        <el-table-column label="附加刑"
          prop="additionalPunishment" />
        <el-table-column label="现刑期起日"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="separate">{{scope.row.prisonTermStartedAt | dateFormate}}</span>
          </template>
        </el-table-column>
        <el-table-column label="现刑期止日"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="separate">{{scope.row.prisonTermEndedAt | dateFormate}}</span>
          </template>
        </el-table-column>
        <el-table-column label="监区"
          prop="prisonArea" />
        <el-table-column label="原判刑期"
          prop="originalSentence" />
        <el-table-column label="失败原因"
          show-overflow-tooltip
          prop="reason" />
      </el-table>
    </el-row>
    <el-row v-if="prisonerDataResult.prisoners && prisonerDataResult.prisoners.length">
      <el-tag type="success">成功信息:</el-tag>
      <!--上传模板文件的结果-->
      <el-table :data="prisonerDataResult.prisoners">
        <el-table-column label="罪犯编号"
          prop="prisonerNumber"
          width="100px" />
        <el-table-column label="罪犯名字"
          prop="name" />
        <el-table-column label="性别"
          width="50px">
          <template slot-scope="scope">
            {{scope.row.gender | gender}}
          </template>
        </el-table-column>
        <el-table-column label="犯罪事实"
          prop="crimes" />
        <el-table-column label="附加刑"
          prop="additionalPunishment" />
        <el-table-column label="现刑期起日"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="separate">{{scope.row.prisonTermStartedAt | dateFormate}}</span>
          </template>
        </el-table-column>
        <el-table-column label="现刑期止日"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="separate">{{scope.row.prisonTermEndedAt | dateFormate}}</span>
          </template>
        </el-table-column>
        <el-table-column label="监区"
          prop="prisonArea" />
        <el-table-column label="原判刑期"
          prop="originalSentence" />
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            {{scope.row.createdAt | Date}}
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
      fileList: [],
      prisonerHref: `${ this._$baseURL }/download/downloadfile?filepath=prison_template.xls`
    }
  },
  computed: {
    ...mapState(['prisonerDataResult', 'uploadResult'])
  },
  methods: {
    ...mapActions(['importPrisoner', 'uploadFile', 'resetState']),
    submitUpload() {
      this.$refs.upload.submit()
    },
    beforeUpload(file) {
      this.resetState({ prisonerDataResult: {} })
      this.uploadFile(file).then(res => {
        if (!res) return
        this.importPrisoner({ filepath: this.uploadResult.path }).then(res => {
          if (!res) return
          this.alertInformation(this.prisonerDataResult)
        })
      })
      return false
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
    this.resetState({ prisonerDataResult: {} })
  }
}
</script>

<style type="text/stylus" lang="stylus" scoped>
.row-container {
  min-height: 370px;
  line-height: 40px;

  .red {
    color: #F56C6C;
    font-weight: bold;
  }
}
</style>

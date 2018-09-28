<template>
  <el-row
    style="min-height: 370px;"
    :gutter="0">
    <el-col
      :span="22"
      :offset="2">
      <el-tabs
        v-model="tabs"
        type="card">
        <el-tab-pane
          label="罪犯数据导入"
          name="first" />
        <el-tab-pane
          label="狱政科模版罪犯数据导入"
          name="second" />
      </el-tabs>
    </el-col>
    <el-row
      class="row-container"
      :gutter="0">
      <el-col :span="22"
        :offset="2">
        <!-- <el-tabs
          v-model="tabs"
          type="card">
          <el-tab-pane
            label="罪犯数据导入"
            name="first" />
          <el-tab-pane
            label="狱政科模版罪犯数据导入"
            name="second" />
        </el-tabs> -->
        <span>点击下载模板：</span>
        <a :href="prisonerHref">罪犯信息导入模板</a>&nbsp;&nbsp;
        <span
          v-if="tabs === 'second'"
          style="color:#999;">(若需修改监区名，可使用监狱管理员账号登录平台，在监区管理模块中中，修改相应监区名称)</span>
      </el-col>
      <el-col :gutter="0">
        <el-col :span="22"
          :offset="2">
          <span>上传模板文件：</span>
          <p>限制文件后缀名为
            <span class="red">.xls</span>或<span class="red">.xlsx</span>
          </p>
        </el-col>
      </el-col>
      <el-col :span="6"
        :offset="2">
        <el-upload class="upload-demo"
          ref="upload"
          :action="_$agency + '/prisoners/upload'"
          :before-upload="beforeUpload"
          :file-list="fileList"
          :auto-upload="false"
          :limit="1"
          accept=".xls,.xlsx">
          <el-button slot="trigger"
            size="small"
            type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload">上传到服务器</el-button>
          <div slot="tip"
            class="el-upload__tip">请上传.xls或.xlsx文件</div>
        </el-upload>
      </el-col>
    </el-row>
    <el-row v-if="tabs === 'first' && prisonerDataResult.errors && prisonerDataResult.errors.length">
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
    <el-row v-if="tabs === 'first' && prisonerDataResult.prisoners && prisonerDataResult.prisoners.length">
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
    <el-row v-if="tabs === 'second' && prisonerYZKDataResult.errors && prisonerYZKDataResult.errors.length">
      <el-tag type="danger">失败信息:</el-tag>
      <!--上传模板失败的结果-->
      <el-table :data="prisonerYZKDataResult.errors">
        <el-table-column label="所在行"
          prop="rowNum"
          width="70px" />
        <el-table-column label="罪犯编号"
          prop="prisonerNumber"
          width="100px" />
        <el-table-column label="姓名"
          prop="name" />
        <el-table-column label="性别"
          width="50px">
          <template slot-scope="scope">
            {{scope.row.gender | gender}}
          </template>
        </el-table-column>
        <el-table-column label="罪名"
          prop="crimes" />
        <el-table-column label="罚金"
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
    <el-row v-if="tabs === 'second' && prisonerYZKDataResult.prisoners && prisonerYZKDataResult.prisoners.length">
      <el-tag type="success">成功信息:</el-tag>
      <!--上传模板文件的结果-->
      <el-table :data="prisonerYZKDataResult.prisoners">
        <el-table-column label="罪犯编号"
          prop="prisonerNumber"
          width="100px" />
        <el-table-column label="姓名"
          prop="name" />
        <el-table-column label="性别"
          width="50px">
          <template slot-scope="scope">
            {{scope.row.gender | gender}}
          </template>
        </el-table-column>
        <el-table-column label="罪名"
          prop="crimes" />
        <el-table-column label="罚金"
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
      tabs: 'first',
      fileList: [],
      prisonerHref: `${ this._$baseURL }/download/downloadfile?filepath=prison_template.xls`
    }
  },
  computed: {
    ...mapState(['prisonerDataResult', 'uploadResult', 'prisonerYZKDataResult'])
  },
  watch: {
    tabs(val) {
      if (val === 'first') {
        this.prisonerHref = `${ this._$baseURL }/download/downloadfile?filepath=prison_template.xls`
      }
      else if (val === 'second') {
        this.prisonerHref = `${ this._$baseURL }/download/downloadfile?filepath=prison_yzk_template.xlsx`
      }
    }
  },
  methods: {
    ...mapActions(['importPrisoner', 'uploadFile', 'resetState', 'importPrisonerYZK']),
    submitUpload() {
      this.$refs.upload.submit()
    },
    beforeUpload(file) {
      if (this.tabs === 'first') {
        this.resetState({ prisonerDataResult: {} })
      }
      else if (this.tabs === 'second') {
        this.resetState({ prisonerYZKDataResult: {} })
      }
      this.uploadFile(file).then(res => {
        if (!res) return
        if (this.tabs === 'first') {
          this.importPrisoner({ filepath: this.uploadResult.path }).then(res => {
            if (!res) return
            this.alertInformation(this.prisonerDataResult)
          })
        }
        else if (this.tabs === 'second') {
          this.importPrisonerYZK({ filepath: this.uploadResult.path }).then(res => {
            if (!res) return
            this.alertInformation(this.prisonerYZKDataResult)
          })
        }
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
    this.resetState({ prisonerDataResult: {}, prisonerYZKDataResult: {} })
  }
}
</script>

<style type="text/stylus" lang="stylus" scoped>
.row-container {
  line-height: 40px;
  .red {
    color: #F56C6C;
    font-weight: bold;
  }
}
</style>

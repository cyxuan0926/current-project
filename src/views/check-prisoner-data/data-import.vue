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
      <el-col
        :span="22"
        :offset="2">
        <span>点击下载模板：</span>
        <a :href="prisonerHref">罪犯信息导入模板</a>&nbsp;&nbsp;
        <span
          v-if="tabs === 'second'"
          style="color:#999;">(若需修改监区名，可使用监狱管理员账号登录平台，在监区管理模块中，修改相应监区名称)</span>
      </el-col>
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
      <el-col
        :span="6"
        :offset="2">
        <el-upload
          class="upload-demo"
          ref="upload"
          action="/prisoners/upload"
          :before-upload="beforeUpload"
          :file-list="fileList"
          :auto-upload="false"
          :limit="1"
          accept=".xls,.xlsx">
          <el-button
            slot="trigger"
            size="small"
            type="primary">选取文件</el-button>
          <el-button
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload">上传到服务器</el-button>
          <div
            slot="tip"
            class="el-upload__tip">请上传.xls或.xlsx文件</div>
        </el-upload>
      </el-col>
    </el-row>
    <el-row v-if="tabs === 'first' && prisonerDataResult.errors && prisonerDataResult.errors.length">
      <el-tag type="danger">失败信息:</el-tag>
      <!--上传模板失败的结果-->
      <el-table :data="prisonerDataResult.errors">
        <el-table-column
          label="所在行"
          prop="rowNum"
          width="70px" />
        <el-table-column
          label="罪犯编号"
          prop="prisonerNumber"
          width="100px" />
        <el-table-column
          label="罪犯名字"
          prop="name" />
        <el-table-column
          label="性别"
          width="50px">
          <template slot-scope="scope">
            {{ scope.row.gender | gender }}
          </template>
        </el-table-column>
        <el-table-column
          label="犯罪事实"
          prop="crimes" />
        <el-table-column
          label="附加刑"
          prop="additionalPunishment" />
        <el-table-column
          label="刑期起日"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="separate">{{ scope.row.prisonTermStartedAt | dateFormate }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="刑期止日"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="separate">{{ scope.row.prisonTermEndedAt | dateFormate }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="监区"
          prop="prisonArea" />
        <el-table-column
          label="原判刑期"
          prop="originalSentence" />
        <el-table-column
          label="失败原因"
          show-overflow-tooltip
          class-name="tips"
          prop="reason" />
      </el-table>
    </el-row>
    <el-row
      v-if="tabs === 'first' && prisonerDataResult.prisoners && prisonerDataResult.prisoners.length"
      style="margin-top: 10px;">
      <el-tag type="success">成功信息:</el-tag>
      <!--上传模板文件的结果-->
      <el-table :data="prisonerDataResult.prisoners">
        <el-table-column
          label="罪犯编号"
          prop="prisonerNumber"
          width="100px" />
        <el-table-column
          label="罪犯名字"
          prop="name" />
        <el-table-column
          label="性别"
          width="50px">
          <template slot-scope="scope">
            {{ scope.row.gender | gender }}
          </template>
        </el-table-column>
        <el-table-column
          label="犯罪事实"
          prop="crimes" />
        <el-table-column
          label="附加刑"
          prop="additionalPunishment" />
        <el-table-column
          label="刑期起日"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="separate">{{ scope.row.prisonTermStartedAt | dateFormate }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="刑期止日"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="separate">{{ scope.row.prisonTermEndedAt | dateFormate }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="监区"
          prop="prisonArea" />
        <el-table-column
          label="原判刑期"
          prop="originalSentence" />
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.createdAt | Date }}
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row v-if="tabs === 'second' && prisonerYZKDataResult.errors && prisonerYZKDataResult.errors.length">
      <el-tag type="danger">失败信息:</el-tag>
      <!--上传模板失败的结果-->
      <el-table :data="prisonerYZKDataResult.errors">
        <el-table-column
          label="所在行"
          prop="rowNum"
          width="70px" />
        <el-table-column
          label="罪犯编号"
          prop="prisonerNumber"
          width="100px" />
        <el-table-column
          label="姓名"
          prop="name" />
        <el-table-column
          label="性别"
          width="50px">
          <template slot-scope="scope">
            {{ scope.row.gender | gender }}
          </template>
        </el-table-column>
        <el-table-column
          label="罪名"
          prop="crimes" />
        <el-table-column
          label="罚金"
          prop="additionalPunishment" />
        <el-table-column
          label="刑期起日"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="separate">{{ scope.row.prisonTermStartedAt | dateFormate }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="刑期止日"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="separate">{{ scope.row.prisonTermEndedAt | dateFormate }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="监区"
          prop="prisonArea" />
        <el-table-column
          label="原判刑期"
          prop="originalSentence" />
        <el-table-column
          label="失败原因"
          class-name="tips"
          show-overflow-tooltip
          prop="reason" />
      </el-table>
    </el-row>
    <el-row
      v-if="tabs === 'second' && prisonerYZKDataResult.prisoners && prisonerYZKDataResult.prisoners.length"
      style="margin-top: 10px;">
      <el-tag type="success">成功信息:</el-tag>
      <!--上传模板文件的结果-->
      <el-table :data="prisonerYZKDataResult.prisoners">
        <el-table-column
          label="罪犯编号"
          prop="prisonerNumber"
          width="100px" />
        <el-table-column
          label="姓名"
          prop="name" />
        <el-table-column
          label="性别"
          width="50px">
          <template slot-scope="scope">
            {{ scope.row.gender | gender }}
          </template>
        </el-table-column>
        <el-table-column
          label="罪名"
          prop="crimes" />
        <el-table-column
          label="罚金"
          prop="additionalPunishment" />
        <el-table-column
          label="刑期起日"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="separate">{{ scope.row.prisonTermStartedAt | dateFormate }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="刑期止日"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="separate">{{ scope.row.prisonTermEndedAt | dateFormate }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="监区"
          prop="prisonArea" />
        <el-table-column
          label="原判刑期"
          prop="originalSentence" />
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.createdAt | Date }}
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-dialog
      :visible.sync="visible"
      class="authorize-dialog"
      width="640px">
      <span
        slot="title"
        class="tips-title">提醒注意</span>
      <div class="tips">上传文件中部分服刑人员监区与原录入系统中的监区不符</div>
      <div style="text-align: center;">更换监区罪犯的会见申请未审批的将移交至新监区审核，已成功预约会见申请并未会见的视频申请将根据新监区的会见申请排期表重新安排会见时间段，如同日申请会见的排期未有空期则取消当日转移罪犯的会见申请。</div>
      <el-table
        :data="validatePrisonerResult.prisoners"
        size="small"
        border>
        <el-table-column
          prop="prisonerNumber"
          label="囚号" />
        <el-table-column
          prop="name"
          label="姓名" />
        <el-table-column
          prop="crimes"
          label="犯罪事实" />
        <el-table-column
          label="刑期起日">
          <template slot-scope="scope">
            <span class="separate">{{ scope.row.prisonTermStartedAt | dateFormate }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="prisonTermEndedAt"
          label="刑期止日">
          <template slot-scope="scope">
            <span class="separate">{{ scope.row.prisonTermEndedAt | dateFormate }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="originalPrisonArea"
          label="原监区" />
        <el-table-column
          prop="prisonArea"
          label="现监区" />
      </el-table>
      <div
        slot="footer"
        class="button-group"
        style="padding-bottom: 0;">
        <el-button
          type="danger"
          size="mini"
          @click="visible = false">取消上传</el-button>
        <el-button
          type="primary"
          size="mini"
          :loading="loading"
          @click="onSubmit">确定上传</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      tabs: 'first',
      loading: false,
      fileList: [],
      visible: false,
      notify: null,
      prisonerHref: `${ this.$urls.apiHost }${ this.$urls.apiPath }/download/downloadfile?filepath=prison_template.xls`
    }
  },
  computed: {
    ...mapState(['validatePrisonerResult', 'prisonerDataResult', 'uploadResult', 'prisonerYZKDataResult'])
  },
  watch: {
    tabs(val) {
      if (this.notify) {
        this.notify.close()
      }
      if (val === 'first') {
        this.prisonerHref = `${ this.$urls.apiHost }${ this.$urls.apiPath }/download/downloadfile?filepath=prison_template.xls`
      }
      else if (val === 'second') {
        this.prisonerHref = `${ this.$urls.apiHost }${ this.$urls.apiPath }/download/downloadfile?filepath=prison_yzk_template.xlsx`
      }
    }
  },
  mounted() {
    this.resetState({ prisonerDataResult: {}, prisonerYZKDataResult: {} })
  },
  destroyed() {
    if (this.notify) {
      this.notify.close()
    }
  },
  methods: {
    ...mapActions(['validatePrisonerYZK', 'validatePrisoner', 'importPrisoner', 'uploadFile', 'resetState', 'importPrisonerYZK']),
    submitUpload() {
      this.$refs.upload.submit()
    },
    onSubmit() {
      this.loading = true
      if (this.tabs === 'first') {
        this.importPrisoner({ filepath: this.uploadResult.path }).then(res => {
          this.loading = false
          this.visible = false
          if (!res) return
          this.alertInformation(this.prisonerDataResult)
        })
      }
      else if (this.tabs === 'second') {
        this.importPrisonerYZK({ filepath: this.uploadResult.path }).then(res => {
          this.loading = false
          this.visible = false
          if (!res) return
          this.alertInformation(this.prisonerYZKDataResult)
        })
      }
    },
    beforeUpload(file) {
      if (this.notify) {
        this.notify.close()
      }
      if (this.tabs === 'first') {
        this.resetState({ prisonerDataResult: {} })
      }
      else if (this.tabs === 'second') {
        this.resetState({ prisonerYZKDataResult: {} })
      }
      this.resetState({ validatePrisonerResult: {} })
      this.uploadFile(file).then(res => {
        if (!res) return
        if (this.tabs === 'first') {
          this.validatePrisoner({ filepath: this.uploadResult.path }).then(res => {
            if (!res) return
            if (this.validatePrisonerResult.prisoners && this.validatePrisonerResult.prisoners.length > 0) {
              this.visible = true
            }
            else {
              this.onSubmit()
            }
          })
        }
        else if (this.tabs === 'second') {
          this.validatePrisonerYZK({ filepath: this.uploadResult.path }).then(res => {
            if (!res) return
            if (this.validatePrisonerResult.prisoners && this.validatePrisonerResult.prisoners.length > 0) {
              this.visible = true
            }
            else {
              this.onSubmit()
            }
          })
        }
      })
      return false
    },
    // 解析文件成功后执行的方法
    alertInformation(information) {
      if (this.notify) {
        this.notify.close()
      }
      let message = ''
      if (information.error_total !== 0 && information.success_total === 0) {
        message = `<div style="line-height: 30px; margin-top: 10px;">
                    <i class="el-icon-error red" style="font-size: 20px; margin-right: 10px;"></i>失败：${ information.errors.length }条
                    <p style="padding-left: 30px">原因：上传的Excel文件内容格式有误，请检查文件内容，仔细对照下载的模版数据。</p>
                  </div>`
      }
      if (information.error_total !== 0 && information.success_total !== 0) {
        message = `<div style="line-height: 30px; margin-top: 10px;">
                    <i class="el-icon-error red" style="font-size: 20px; margin-right: 10px;"></i>失败：${ information.errors.length }条
                    <p style="padding-left: 30px">原因：数据内容格式有误，请检查导入失败记录，仔细对照下载的模版数据。</p>
                  </div>`
      }
      if (information.success_total !== 0) {
        message += `<div style="line-height: 30px; margin-top: 10px;">
                      <i class="el-icon-success green" style="font-size: 20px; margin-right: 10px;"></i>成功：${ information.success_total }条
                      <p style="padding-left: 30px">其中：新增${ information.add_total }条&nbsp;&nbsp;&nbsp;修改${ information.update_total }条</p>
                    </div>`
      }
      this.notify = this.$notify({
        title: '解析结果提示',
        dangerouslyUseHTMLString: true,
        message: message,
        duration: 0,
        offset: 100
      })
    }
  }
}
</script>

<style lang="scss" scoped>
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
</style>

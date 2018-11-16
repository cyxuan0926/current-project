<template>
  <el-row
    class="row-container"
    :gutter="0">
    <el-row :gutter="0">
      <el-col
        :span="22"
        :offset="2">
        <span>点击下载模板：</span>
        <a :href="prisonerRewardHref">罪犯奖惩信息导入模板</a>
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
        :span="6"
        :offset="2">
        <el-upload
          class="upload-demo"
          ref="upload"
          :action="_$agency + '/prisoner_reward_punishment/upload'"
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
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload">上传到服务器</el-button>
          <div
            slot="tip"
            class="el-upload__tip">只能上传.xls文件</div>
        </el-upload>
      </el-col>
    </el-row>
    <el-row v-if="prisonerRewardPunishmentResult.errors && prisonerRewardPunishmentResult.errors.length">
      <!--上传模板文件的结果-->
      <el-tag type="danger">失败信息:</el-tag>
      <el-table :data="prisonerRewardPunishmentResult.errors">
        <el-table-column
          label="罪犯编号"
          prop="prisonerNumber" />
        <el-table-column
          label="罪犯名字"
          prop="prisonerName" />
        <el-table-column
          label="奖惩内容"
          prop="ndry" />
        <el-table-column
          label="失败原因"
          show-overflow-tooltip
          prop="reason" />
      </el-table>
    </el-row>
    <el-row v-if="prisonerRewardPunishmentResult.prisonerRewardPunishments && prisonerRewardPunishmentResult.prisonerRewardPunishments.length">
      <!--上传模板文件的结果-->
      <el-tag type="success">成功信息:</el-tag>
      <el-table :data="prisonerRewardPunishmentResult.prisonerRewardPunishments">
        <el-table-column
          label="罪犯编号"
          prop="prisonerNumber" />
        <el-table-column
          label="罪犯名字"
          prop="prisonerName" />
        <el-table-column
          label="年份"
          prop="datayear" />
        <el-table-column
          label="奖惩内容"
          prop="ndry" />
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
      prisonerRewardHref: `${ this._$baseURL }/download/downloadfile?filepath=prisoner_reward_punishment_template.xls`,
      fileList: []
    }
  },
  computed: {
    ...mapState(['prisonerRewardPunishmentResult', 'uploadResult'])
  },
  methods: {
    ...mapActions(['importPrisonerRewardPunishment', 'uploadFile', 'resetState']),
    // 上传罪犯奖惩模板文件到服务端
    beforeUpload(file) {
      this.resetState({ prisonerRewardPunishmentResult: {} })
      this.uploadFile(file).then(res => {
        if (!res) return
        this.importPrisonerRewardPunishment({ filepath: this.uploadResult.path }).then(res => {
          if (!res) return
          this.alertInformation(this.prisonerRewardPunishmentResult)
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
    this.resetState({ prisonerRewardPunishmentResult: {} })
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

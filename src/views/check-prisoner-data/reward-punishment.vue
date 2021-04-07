<template>
  <el-row
    style="min-height: 370px;"
    :gutter="0">
    <el-col
      :span="22"
      :offset="2"
      style="margin-top: 20px;">
    </el-col>
    <el-row
      class="row-container"
      :gutter="0">
      <el-col
        :span="22"
        :offset="2">
        <span>点击下载模板：</span>
        <a :href="prisonerHref">罪犯奖惩信息导入模板</a>
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
          accept=".xls,.xlsx">
          <el-button
            slot="trigger"
            size="small"
            type="primary">选取文件</el-button>
          <el-button
            size="small"
            type="success"
            :loading="onProgress"
            @click="submitUpload">上传到服务器</el-button>
          <div
            slot="tip"
            class="el-upload__tip">请上传.xls或.xlsx文件</div>
        </el-upload>
      </el-col>
    </el-row>
    <el-row v-if="showProcessSteps">
      <el-col :span="20" :offset="2">
        <el-steps
          :active="status"
          finish-status="success"
          style="margin: 20px 0px">
          <el-step
            v-for="(tag, index) in tabMapOptions"
            :key="index"
            :title="tag.label" />
        </el-steps>
      </el-col>
      <el-col class="process-col_tips">
        <span>准备导入数据总计：{{validatePrisonerResult.total}}条</span>
        <span>已用时：{{spendTime}}秒</span>
        <span>进度：{{percent}}%</span>
      </el-col>
      <el-col class="process-col_waiting">请稍后...</el-col>
    </el-row>
    <el-row class="table-box fail-box" v-if=" prisonerYZKDataResult.errors && prisonerYZKDataResult.errors.length">
      <img src="../../assets/images/excel.png" alt="excel图片">
      <span class="content">导入失败的数据:</span>
      <m-excel-export
        :filename="prisonerDataImportExcelConfig.filename"
        :jsonData="prisonerYZKDataResult.errors"
        :header="prisonerDataImportExcelConfig.header"
        :filterFields="prisonerDataImportExcelConfig.filterFields" />
    </el-row>
    <el-dialog
      :visible.sync="visible"
      class="authorize-dialog"
      width="640px"
      :close-on-click-modal="false"
      @close="handleDialogClose">
      <span
        slot="title"
        class="tips-title">提醒注意</span>
      <div class="tips">上传文件中部分服刑人员监区与原录入系统中的监区不符</div>
      <div style="text-align: center;">更换监区罪犯的通话申请未审批的将移交至新监区审核，已审核通过通话申请将根据新监区的通话申请排期表重新安排通话时间段，如同日申请的排期没有空闲时间段则取消当日转移罪犯的通话申请。</div>
       <el-table
         :data="validatePrisonerResult.prisonerBonusPenalty"
          style="width: 100%"
          size="small"
          strip>
            <el-table-column
            prop="monthName"
            label="月"
            width="150" />
            <el-table-column
            prop="name"
            label="姓名"
            width="150" />
            <el-table-column
            prop="prisonerNumber"
            label="编号"/>
            <el-table-column
            label="行政奖励">
                  <el-table-column
                    prop="praiseTimes"
                    label="表扬数">
                  </el-table-column>
                  <el-table-column
                    prop="materialAwardTimes"
                    label="物质奖励数">
                  </el-table-column>
                  <el-table-column
                    prop="meritTimes"
                    label="立功个数">
                  </el-table-column>
                  <el-table-column
                    prop="greatMeritTimes"
                    label="重大立功数">
                  </el-table-column>
            </el-table-column>
            <el-table-column
            label="行政处罚">
                  <el-table-column
                    prop="warnTimes"
                    label="警告个数"
                    width="120">
                  </el-table-column>
                  <el-table-column
                    prop="mistakeTimes"
                    label="记过个数"
                    width="120">
                  </el-table-column>
                  <el-table-column
                    prop="confinementTimes"
                    label="禁闭个数"
                    width="100">
                  </el-table-column>
            </el-table-column>
      </el-table>
      <div
        slot="footer"
        class="button-group"
        style="padding-bottom: 0;">
        <el-button
          type="danger"
          size="mini"
          :disabled="loading"
          @click="handleCancelUpload">取消上传</el-button>
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
  import Utils from './utils'
  import http from '@/service'
  import { prisonerDataImportExcelConfig } from '@/common/excel-config'
  export default {
    data() {
      return {
        loading: false,
        fileList: [],
        visible: false,
        onProgress: false,
        prisonerHref: `${ this.$urls.ygApiHost}/download/downloadfile?filepath=prisoner_bonus_penalty_template.xls`,
        active: 1,
        tabMapOptions: [
          { label: '读取excel' },
          { label: '解析excel' },
          { label: '初始化数据' },
          { label: '校验数据' },
          { label: '导入数据' },
          { label: '导入完成' }
        ],
        status: 0,
        showProcessSteps: false,
        spendTime: 0,
        percent: 0,
        uploadResult:{},
        validatePrisonerResult:{},
        prisonerYZKDataResult:{},
        prisonerDataImportExcelConfig
      }
    },
    computed: {
      ...mapState([ 'prisonerDataResult'])
    },
    mounted() {
      this.resetState({ prisonerDataResult: {}, prisonerYZKDataResult: {} })
    },
    destroyed() {
      if (this.$notify) {
        this.$notify.closeAll()
      }
    },
    methods: {
      ...mapActions(['validatePrisonerYZK', 'validatePrisoner', 'importPrisoner', 'uploadFile', 'resetState', 'importPrisonerYZK']),
      submitUpload() {
        this.$refs.upload.submit()
      },
      onSubmit() {
        this.loading = true
        let index = 0
        let interver = setInterval(() => {
          index++
          if (index === 1) {
            this.percent += 20
            this.spendTime += 1
            this.status = this.status + 1
              http.importPrisonerRewardPunishmentlist({ filepath: this.uploadResult.path }).then(res => {
                this.loading = false
                this.visible = false
                this.onProgress = false
                clearInterval(interver)
                if (!res) {
                  this.showProcessSteps = false
                  this.status = 0
                  this.spendTime = 0
                  this.percent = 0
                  return
                }else{
                  this.prisonerYZKDataResult=res.data
                }
                this.spendTime += 1
                this.status += 1
                this.percent = 100
                setTimeout(() => {
                  this.showProcessSteps = false
                  this.status = 0
                  this.spendTime = 0
                  this.percent = 0
                  Utils.alertInformation(this.prisonerYZKDataResult)
                }, 1000)
              })
            }
        }, 1000)
      },
      beforeUpload(file) {
        this.onProgress = true
        this.showProcessSteps = true
        if (this.$notify) {
          this.$notify.closeAll()
        }
          this.resetState({ prisonerYZKDataResult: {} })
        this.resetState({ validatePrisonerResult: {} })
        let uploadInterver = setInterval(() => {
          this.status += 1
          this.percent += 15
          this.spendTime += .5
          if (this.status === 4) {
            clearInterval(uploadInterver)
            http.uploadFileYangGuangHost(file).then(res => {
              if (!res) {
                this.onProgress = false
                this.showProcessSteps = false
                this.spendTime = 0
                this.percent = 0
                this.status = 0
                return
              }else{
                this.uploadResult.path=res.data.path
              }
                let count = 0
                let prisonYZXInterver = setInterval(() =>{
                  count ++
                  if (count === 1) {
                    this.spendTime += 1
                    http.validatePrisonerRewardPunishmentlist({ filepath: this.uploadResult.path }).then(res => {
                      clearInterval(prisonYZXInterver)
                      if (!res) {
                        this.onProgress = false
                        this.showProcessSteps = false
                        this.spendTime = 0
                        this.percent = 0
                        this.status = 0
                        return
                      }else{
                        this.validatePrisonerResult=res.data
                      }
                      if (this.validatePrisonerResult.prisonerBonusPenalty && this.validatePrisonerResult.prisonerBonusPenalty.length > 0) {
                        this.status += 1
                        this.visible = true
                      }
                      else {
                        this.onSubmit()
                      }
                    })
                    }
                }, 1000)
            })
          } else {
            this.spendTime += 1
          }
        }, 500)
        return false
      },
      handleCancelUpload() {
        this.visible = false
      },
      handleDialogClose() {
        this.showProcessSteps = false
        this.spendTime = 0
        this.percent = 0
        this.status = 0
        this.onProgress = false
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
  .table-box{
    margin-left: 20px;
    margin-right: 20px;
  }
  .el-steps {
    /deep/ .el-step__title {
      font-size: 12px;
      line-height: 32px;
    }
  }
  .process-col_tips {
    width: 68%;
    margin-left: 32%;
    span {
      color: #303133;
      font-weight: bold;
      & + span {
        padding-left: 3%;
      }
    }
  }
  .process-col_waiting {
    width: 60%;
    margin-left: 40%;
    color: #303133;
    font-weight: bold;
  }
  .fail-box {
    width: 90%;
    margin-left: 10%;
    margin-top: 1%;
    img {
      width: 26px;
    }
    .content {
      vertical-align: middle;
      padding-left: 2px;
    }
  }
  .m-excel-export {
    float: none;
    margin-left: 2%;
  }
</style>

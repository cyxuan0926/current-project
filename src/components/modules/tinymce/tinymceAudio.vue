<template>
  <el-upload
    ref="uploadAudio"
    :action="action"
    :headers="headers"
    :name="name"
    :before-upload="beforUpload"
    :on-success="handleSuccess"
    :on-error="handleError"
    :accept="accept"
    multiple
    :on-exceed="handleExceed"
    :file-list="fileList"
    :on-remove="handleRemove">
    <i class="mce-ico mce-i-media"></i>
  </el-upload>

</template>

<script>
export default {
  props: {
    action: {
      type: String,
      // default: 'http://39.108.185.51:1339/avatars'
      // default: `https://www.yuwugongkai.com/image-server/avatars`
      default: `http://120.78.190.101:1339/audio-server/audios` // 测试和演示
    },
    name: {
      type: String,
      default: 'audio'
    },
    accept: {
      type: String,
      default: 'audio/*'
    }
  },
  data() {
    return {
      fileList: [],
      headers: {
        Authorization: '523b87c4419da5f9186dbe8aa90f37a3876b95e448fe2a'
      },
      notification: null
    }
  },
  destroyed() {
    if (this.notification) this.notification.close()
    this.notification = null
  },
  methods: {
    handleSuccess(res, file, fileList) {
      switch (res.code) {
        case 200:
          this.$message.success('音频上传成功')
          this.$emit('success', `${ res.url }?token=${ this.headers.Authorization }`)
          this.notification.close()
          break
        default:
          this.$message.error(`上传音频失败:${ res.message }`)
      }
    },
    beforUpload(file) {
      if (file.type.indexOf('audio/') !== 0) {
        this.$message.error(`请上传音频文件`)
        return false
      }
      this.notification = this.$notify({
        title: '提示',
        message: '正在上传音频文件，请耐心等待',
        type: 'warning',
        duration: 0,
        showClose: false
      })
      return true
    },
    handleExceed() {
      this.$message.error('音频数量超出限制')
    },
    handleError(e) {
      this.$message.error(`上传音频失败`)
      this.notification.close()
    },
    handleRemove(file, fileList) {
      this.$emit('success', fileList.length ? fileList : '')
    }
  }
}
</script>

<style lang="css">
  .el-upload__tip{
    margin-top: 0;
    line-height: 20px;
  }
  .red{
    color: #f00;
  }
</style>

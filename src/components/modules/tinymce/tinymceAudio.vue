<template>
  <el-upload
    ref="uploadAudio"
    :action="$urls.audioUrl"
    :headers="headers"
    :name="name"
    :before-upload="beforUpload"
    :on-success="handleSuccess"
    :on-error="handleError"
    :accept="accept"
    multiple
    :on-exceed="handleExceed"
    :file-list="fileList"
    :on-remove="handleRemove"
  >
    <i class="mce-ico mce-i-media" />
  </el-upload>

</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
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
        Authorization: this.$urls.token
      },
      notification: null
    }
  },

  destroyed() {
    if (this.notification) this.notification.close()
    this.notification = null
  },

  methods: {
    ...mapActions(['setUrlStorage', 'setNewUrlStorage']),

    handleSuccess(res, file, fileList) {
      switch (res.code) {
        case 200:
          this.$message.success('音频上传成功')
          this.$emit('success', `${ res.url }?token=${ this.$urls.token }`)
          let urls = localStorage.getItem('urls') ? JSON.parse(localStorage.getItem('urls')) : []
          this.setUrlStorage({ urls: [...urls, res.url] })
          this.setNewUrlStorage({ urls: [res.url] })
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

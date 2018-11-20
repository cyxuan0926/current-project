<template>
  <el-upload
    ref="uploadVideo"
    :action="$urls.videoUrl"
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
    <i class="mce-ico mce-i-media"/>
  </el-upload>

</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: 'video'
    },
    accept: {
      type: String,
      default: 'video/mp4,video/webm,video/ogg'
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
    handleSuccess(res, file, fileList) {
      switch (res.code) {
        case 200:
          this.$message.success('视频上传成功')
          this.$emit('success', `${ res.url }?token=${ this.$urls.token }`)
          this.setImageLocalstorage('images', res.url)
          this.setImageLocalstorage('newImages', res.url)
          this.notification.close()
          break
        default:
          this.$message.error(`上传视频失败:${ res.message }`)
      }
    },
    beforUpload(file) {
      let fileType = this.accept.split(',')
      const isAccept = fileType.indexOf(file.type) > -1
      if (!isAccept) {
        let accept = []
        fileType.forEach(type => { accept.push(type.substr(type.lastIndexOf('/') + 1)) })
        this.$message.error(`请上传${ accept.join('或') }格式的文件`)
        return false
      }
      this.notification = this.$notify({
        title: '提示',
        message: '正在上传视频文件，请耐心等待',
        type: 'warning',
        duration: 0,
        showClose: false
      })
      return true
    },
    handleExceed() {
      this.$message.error('视频数量超出限制')
    },
    handleError(e) {
      this.$message.error(`上传视频失败`)
      this.notification.close()
    },
    handleRemove(file, fileList) {
      this.$emit('success', fileList.length ? fileList : '')
    },
    setImageLocalstorage(key, value) {
      let storage = localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : []
      if (storage.indexOf(value) < 0) storage.push(value)
      localStorage.setItem(key, JSON.stringify(storage))
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

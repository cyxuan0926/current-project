<template>
  <div style="overflow: hidden;">
    <div class="video-box">
      <div
        v-if="!value"
        class="no-video">
        <i class="iconfont icon-video" />
      </div>
      <video
        v-if="jailInformation.videoPath"
        controls
        poster="/static/images/video-cover.png"
        style="max-width: 100%; margin-bottom: 10px; vertical-align: middle;">
        <source
          :src="jailInformation.videoPath + '?token=' + $urls.token"
          type='video/mp4'>
        <source
          :src="jailInformation.videoPath + '?token=' + $urls.token"
          type='video/webm'>
        <source
          :src="jailInformation.videoPath + '?token=' + $urls.token"
          type='video/ogg'>您的浏览器不支持Video标签。
      </video>
      <span
        slot="tip"
        class="el-upload__tip"
        style="line-height: 40px;">
        只能上传<span class="red">mp4/webm/ogg</span>文件
      </span>
    </div>
    <div class="upload-buttons">
      <el-upload
        ref="uploadVideo"
        :action="$urls.videoUrl"
        :headers="headers"
        name="video"
        :show-file-list="false"
        :before-upload="beforUpload"
        :file-list="fileList"
        :on-success="handleSuccess"
        :on-error="handleError"
        accept="video/mp4,video/webm,video/ogg"
        :multiple="false"
        :limit="1"
        :disabled="loading || Boolean(value)"
        :on-exceed="handleExceed"
        :on-remove="handleRemove">
        <el-button
          slot="trigger"
          size="small"
          :disabled="loading || Boolean(value)"
          type="primary">上传视频
        </el-button>
      </el-upload>
      <el-button
        type="danger"
        size="small"
        style="margin-top: 10px;"
        @click="handleDelete">删除</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      headers: {
        Authorization: this.$urls.token
      },
      loading: false,
      changed: false,
      notification: null
    }
  },
  computed: {
    fileList() {
      let files = [], name = ''
      if (this.value) {
        name = this.value.replace(`${ this.$urls.videoUrl }/`, '').replace(/-[0-9]+\./, '.')
        files.push({ name: name, url: this.value })
      }
      return files
    }
  },
  watch: {
    fileList(val) {
      if (!this.changed && val.length) {
        val.forEach(file => {
          this.setImageLocalstorage('images', file.url)
        })
        this.changed = true
      }
    }
  },
  destroyed() {
    if (this.notification) this.notification.close()
    this.notification = null
  },
  methods: {
    handleSuccess(res, file, fileList) {
      this.loading = false
      switch (res.code) {
        case 200:
          this.$message.success('视频上传成功')
          this.$emit('success', res.url)
          this.setImageLocalstorage('images', res.url)
          this.setImageLocalstorage('newImages', res.url)
          this.notification.close()
          break
        default:
          this.$message.error(`上传视频失败:${ res.message }`)
      }
    },
    beforUpload(file) {
      if (['video/mp4', 'video/webm', 'video/ogg'].indexOf(file.type) !== 0) {
        this.$message.error(`请上传视频文件`)
        return false
      }
      this.loading = true
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
      this.loading = false
      this.$message.error('视频数量超出限制')
    },
    handleError(e) {
      this.loading = false
      this.$message.error(`上传视频失败`)
      this.notification.close()
    },
    handleRemove(file, fileList) {
      this.loading = false
      this.$emit('success', fileList.length ? fileList : '')
    },
    handleDelete() {
      console.log(123)
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
  .video-box{
    float: left;
    display: inline-flex;
    flex-direction: column;
    margin-right: 10px;
    width: 160px;
  }
  .no-video{
    height: 90px;
    width: 160px;
    background: #E5E5E5;
    line-height: 90px;
    text-align: center;
    color: #8C8080;
    flex-shrink: 0;
  }
  .no-video .iconfont{
    font-size: 20px;
  }
  .upload-buttons{
    height: 90px;
    float: left;
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
  }
</style>

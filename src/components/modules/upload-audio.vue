<template>
  <div style="overflow: hidden;">
    <div class="audio-box">
      <template v-if="!value">
        <div class="no-video">
          <i class="iconfont icon-yinpinaudio47" />
        </div>
      </template>

      <template v-else>
        <m-audio :value="value" />
      </template>
    </div>

    <div class="upload-buttons">
      <el-upload
        ref="uploadAudio"
        :action="$urls.audioUrl"
        :headers="headers"
        name="audio"
        :show-file-list="false"
        :before-upload="beforUpload"
        :file-list="fileList"
        :on-success="handleSuccess"
        :on-error="handleError"
        accept="audio/*"
        :multiple="false"
        :limit="1"
        :disabled="loading || Boolean(value)"
        :on-exceed="handleExceed"
        :on-remove="handleRemove"
      >
        <el-button
          slot="trigger"
          size="small"
          :disabled="loading || Boolean(value)"
          type="primary"
        >上传音频</el-button>
      </el-upload>

      <el-button
        type="danger"
        size="small"
        style="margin-left: 10px; margin-top: 2px;"
        :disabled="!loading && !Boolean(value)"
        @click="handleDelete"
      >删除</el-button>
    </div>
  </div>
</template>

<script>
import AudioThree from '@/assets/images/audio-icon.png'
import AudioOne from '@/assets/images/audio-no.png'
import audioTwo from '@/assets/images/audio-one.png'
import helper from '@/filters/modules/time'
import { mapActions } from 'vuex'
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
      notification: null,
      leastTime: null,
      progressBarVal: 0,
      audioImgs: [AudioOne, audioTwo, AudioThree],
      audioImg: AudioThree,
      interval: null
    }
  },

  computed: {
    fileList() {
      let files = [], name = ''
      if (this.value) {
        name = this.value.replace(`${ this.$urls.audioUrl }/`, '').replace(/-[0-9]+\./, '.')
        files.push({ name: name, url: this.value })
      }
      return files
    }
  },

  mounted() {
    this.$refs.audio && this.getTotalDuration()
  },

  destroyed() {
    if (this.notification) this.notification.close()
    this.notification = null
  },

  methods: {
    ...mapActions(['setUrlStorage', 'setNewUrlStorage']),

    handleSuccess(res, file, fileList) {
      this.loading = false
      switch (res.code) {
        case 200:
          this.$message.success('音频上传成功')
          this.$emit('success', `${res.url}?token=${this.$urls.token}`)
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
      this.loading = true
      this.notification = this.$notify({
        title: '提示',
        message: '正在上传音频文件，请耐心等待',
        type: 'warning',
        duration: 0,
        showClose: false
      })
      return true
    },

    handleTimeUpdate() {
      if (!this.$refs.audio) return
      let totalTime = parseInt(this.$refs.audio.duration),
        currentTime = parseInt(this.$refs.audio.currentTime)
      this.leastTime = helper.timeNew(totalTime - currentTime)
      if (this.$refs.audio.currentTime / this.$refs.audio.duration === 1 || this.$refs.audio.ended) {
        this.progressBarVal = 0
        this.leastTime = helper.timeNew(totalTime)
      }
      else {
        this.progressBarVal = (currentTime / totalTime * 100)
      }
    },

    handleDelete() {
      this.$refs.uploadAudio.clearFiles()
      this.handleRemove('', [])
      clearInterval(this.interval)
      this.audioImg = AudioThree
      this.progressBarVal = 0
    },

    handleAudio() {
      if (this.$refs.audio.paused) {
        this.$refs.audio.play()
        let index = 0
        this.interval = setInterval(() => {
          this.audioImg = this.audioImgs[index]
          index++
          if (index > 2) index = 0
        }, 1000)
      }
      else {
        this.$refs.audio.pause()
        clearInterval(this.interval)
        this.audioImg = AudioThree
      }
    },

    getTotalDuration() {
      this.leastTime = helper.timeNew(parseInt(this.$refs.audio.duration))
    },

    handleExceed() {
      this.loading = false
      this.$message.error('音频数量超出限制')
    },

    handleError(e) {
      this.loading = false
      this.$message.error(`上传音频失败`)
      this.notification.close()
    },

    handleRemove(file, fileList) {
      this.loading = false
      this.$emit('success', fileList.length ? fileList : '')
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-upload__tip{
    margin-top: 0;
    line-height: 20px;
  }
  .red{
    color: #f00;
  }
  .audio-box{
    float: left;
    display: inline-flex;
    flex-direction: column;
    margin-right: 10px;
    width: 192px;
    /* padding: 4px 0; */
    box-sizing: border-box;
  }
  .audio-box .no-video{
    height: 36px;
    width: $absolutely-measure;
    background: #E5E5E5;
    line-height: 36px;
    text-align: center;
    color: #8C8080;
    flex-shrink: 0;
    border-radius: 4px;
  }
  .audio-box .no-video .iconfont{
    font-size: 20px;
  }
  .audio-box + .upload-buttons{
    height: 34px;
    line-height: 34px;
    float: left;
    display: flex;
    align-items: center;
    /* flex-direction: column;
    justify-content: center;
    align-items: stretch; */
  }
  .audio-box .progress__bar {
      height: .16rem;
      background: #264c90;
      /*margin-left: .4rem*/
  }
</style>

<template>
  <div
    class="audio-container"
    :style="'width:' + width"
    v-show="show">
    <img
      v-if="audioImg === 3"
      src="@/assets/images/audio-icon.png"
      style="width: 16px;vertical-align: middle;cursor: pointer;height: 16px;"
      @click="handlePlay"
      alt="">
    <img
      v-if="audioImg === 1"
      src="@/assets/images/audio-no.png"
      style="width: 16px;vertical-align: middle;cursor: pointer;height: 16px;"
      @click="handlePlay"
      alt="">
    <img
      v-if="audioImg === 2"
      src="@/assets/images/audio-one.png"
      style="width: 16px;vertical-align: middle;cursor: pointer;height: 16px;"
      @click="handlePlay"
      alt="">
    <div class="audio-container-right">
      <div
        class="progress__bar"
        :style="{ width: progressBarVal + '%' }"
        ref="progress-bar"/>
      <audio
        ref="audio"
        @timeupdate="handleTimeUpdate"
        @loadedmetadata="getTotalDuration">
        <source
          :src="value"
          type="audio/mp3">
        <source
          :src="value"
          type="audio/ogg">
        <source
          :src="value"
          type="audio/mpeg">
        您的浏览器不支持Audio标签
      </audio>
    </div>
    <div class="audio-container-time">
      <span>{{ leastTime }}</span>
    </div>
  </div>
</template>
<script>
import { durationFormat } from '@/utils/helper'
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '192px'
    }
  },
  data() {
    return {
      show: false,
      leastTime: null,
      progressBarVal: 0,
      audioImg: 3,
      interval: null
    }
  },
  methods: {
    handleTimeUpdate() {
      if (!this.$refs.audio) return
      let totalTime = parseInt(this.$refs.audio.duration),
        currentTime = parseInt(this.$refs.audio.currentTime)
      this.leastTime = durationFormat(totalTime - currentTime, { format: 'mm:ss' })
      if (this.$refs.audio.currentTime / this.$refs.audio.duration === 1 || this.$refs.audio.ended) {
        this.progressBarVal = 0
        this.interval && clearInterval(this.interval)
        this.audioImg = 3
        this.leastTime = durationFormat(totalTime, { format: 'mm:ss' })
      }
      else {
        this.progressBarVal = (currentTime / totalTime * 100)
      }
    },
    handlePlay() {
      if (this.$refs.audio.paused) {
        this.$refs.audio.play()
        let index = 0
        this.interval = setInterval(() => {
          this.audioImg = index + 1
          index++
          if (index > 2) index = 0
        }, 1000)
      }
      else {
        this.$refs.audio.pause()
        clearInterval(this.interval)
        this.audioImg = 3
      }
    },
    getTotalDuration(e) {
      this.leastTime = durationFormat(parseInt(this.$refs.audio.duration), { format: 'mm:ss' })
      if (!this.show) this.show = true
    }
  }
}
</script>
<style lang="scss" scoped>
.audio-container {
  display: flex;
  width: 192px;
  height: 36px;
  justify-items: flex-start;
  align-items:center;
  background:rgba(235,235,235,1);
  padding: 0 4px;
  border-radius: 4px;
}
.audio-container-right {
  width: calc(100% - 70px);
  height: 10px;
  border: 1px solid #2B569A;
  margin: 0 auto;
  border-radius: 4px;
  display:flex;
  align-items:center;
  padding: 0 4px 0 4px;
}
.progress__bar {
  height: 2px;
  background: #264c90;
  /*margin-left: 4px*/
}
.audio-container-time {
  font-size: 12px;
  font-family:PingFang-SC-Medium;
  font-weight:500;
  color:rgba(51,51,51,1);
}
</style>

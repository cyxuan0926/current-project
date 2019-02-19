<template>
  <div
    class="audio-container"
    :style="'width:' + width"
    v-show="show">
    <img
      :src="audioImg"
      style="width: 16px;vertical-align: middle;cursor: pointer;height: 16px;"
      @click="handleAudio"
      alt="">
    <div class="audio-container-right">
      <div
        class="progress__bar"
        :style="{'width':progressBarVal+'%'}"
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
      <span>0{{ leastTime }}</span>
    </div>
  </div>
</template>
<script>
import AudioThree from '@/assets/images/audio-icon.png'
import AudioOne from '@/assets/images/audio-no.png'
import audioTwo from '@/assets/images/audio-one.png'
import helper from '@/filters/modules/time'
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
      audioImgs: [AudioOne, audioTwo, AudioThree],
      audioImg: AudioThree,
      interval: null
    }
  },
  methods: {
    handleTimeUpdate() {
      if (!this.$refs.audio) return
      let totalTime = parseInt(this.$refs.audio.duration),
        currentTime = parseInt(this.$refs.audio.currentTime)
      this.leastTime = helper.timeNew(totalTime - currentTime)
      if (this.$refs.audio.currentTime / this.$refs.audio.duration === 1 || this.$refs.audio.ended) {
        this.progressBarVal = 0
        this.interval && clearInterval(this.interval)
        this.audioImg = AudioThree
        this.leastTime = helper.timeNew(totalTime)
      }
      else {
        this.progressBarVal = (currentTime / totalTime * 100)
      }
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
    getTotalDuration(e) {
      this.leastTime = helper.timeNew(parseInt(this.$refs.audio.duration))
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

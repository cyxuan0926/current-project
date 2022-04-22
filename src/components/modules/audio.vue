<template>
  <div
    v-show="leastTime"
    class="audio-container"
    :style="'width:' + width"
  >
    <template v-for="(img, index) in audioImgs">
      <template v-if="audioImg === index + 1">
        <img
          :key="img"
          :src="img"
          style="width: 16px;vertical-align: middle;cursor: pointer;height: 16px;"
          @click="handlePlay"
          alt="视频图片"
        >
      </template>
    </template>

    <div class="audio-container-right">
      <div
        class="progress__bar"
        :style="{ width: progressBarVal + '%' }"
        ref="progress-bar"
      />

      <audio
        ref="audio"
        @timeupdate="handleTimeUpdate"
        @loadedmetadata="getTotalDuration"
        @durationchange="getTotalDuration"
      >
        <source :src="value" type="audio/mp3">
        <source :src="value" type="audio/ogg">
        <source :src="value" type="audio/mpeg">
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
import AudioThree from '@/assets/images/audio-icon.png'
import AudioOne from '@/assets/images/audio-no.png'
import audioTwo from '@/assets/images/audio-one.png'

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
      leastTime: null,
      progressBarVal: 0,
      audioImg: 3,
      interval: null,
      audioImgs: [AudioOne, audioTwo, AudioThree]
    }
  },

  watch:{
    value(val) {
      if (val) {
        this.reStartAudio()
      }
    }
  },

  methods: {
    handleTimeUpdate() {
      if (!this.$refs.audio) {
        return
      }

      let totalTime = parseInt(this.$refs.audio.duration)
      let currentTime = parseInt(this.$refs.audio.currentTime)

      this.leastTime = durationFormat(totalTime - currentTime, { format: 'mm:ss' })
      if (this.$refs.audio.currentTime / this.$refs.audio.duration === 1 || this.$refs.audio.ended) {
        this.progressBarVal = 0
        this.interval && clearInterval(this.interval)
        this.audioImg = 3
        this.leastTime = durationFormat(totalTime, { format: 'mm:ss' })
      } else {
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

          if (index > 2) {
            index = 0
          }
        }, 1000)
      } else {
        this.$refs.audio.pause()
        clearInterval(this.interval)
        this.audioImg = 3
      }
    },

    getTotalDuration() {
      if (
        this.$refs.audio &&
        this.$refs.audio.duration &&
        !isNaN(this.$refs.audio.duration)
      ) {
        this.leastTime = durationFormat(parseInt(this.$refs.audio.duration), { format: 'mm:ss' })
      }
    },

    reStartAudio() {
      this.leastTime = null
      this.progressBarVal = 0
      this.audioImg = 3
      clearInterval(this.interval)
      this.interval = null

      if (this.$refs.audio) {
        if (this.$refs.audio.played) {
          this.$refs.audio.pause()
        }

        this.$refs.audio.load()
      }
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
  align-items: center;
  background:rgba(235,235,235,1);
  padding: 0 4px;
  border-radius: 4px;
}

.audio-container-right {
  width: calc(#{$absolutely-measure} - 70px);
  height: 10px;
  border: 1px solid #2B569A;
  margin: 0 auto;
  border-radius: 4px;
  display: flex;
  align-items:center;
  padding: 0 4px 0 4px;
}

.progress__bar {
  height: 2px;
  background: #264c90;
}

.audio-container-time {
  font-size: 12px;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color:rgba(51,51,51,1);
}
</style>

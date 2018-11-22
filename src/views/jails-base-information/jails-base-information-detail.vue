<template>
  <el-row
    id="jail-information-management"
    :gutter="0">
    <el-row :gutter="0">
      <el-col :span="12">
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
        <img
          v-if="jailInformation.imageUrl"
          :src="jailInformation.imageUrl + '?token=' + $urls.token"
          style="margin-bottom: 10px; vertical-align: middle;"
          alt="">
        <div
          v-if="jailInformation.audioPath"
          class="audio-container">
          <button
            style="outline: none;margin: 0;padding: 0;border: none;background: transparent;"
            @click.prevent="handleAudio">
            <img
              :src="audioImg"
              style="width: 2.1rem;vertical-align: middle;cursor: pointer"
              alt="">
          </button>
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
                :src="jailInformation.audioPath + '?token=' + $urls.token"
                type="audio/mp3">
              <source
                :src="jailInformation.audioPath + '?token=' + $urls.token"
                type="audio/ogg">
              <source
                :src="jailInformation.audioPath + '?token=' + $urls.token"
                type="audio/mpeg">
              您的浏览器不支持Audio标签
            </audio>
          </div>
          <div class="audio-container-time">
            <span>{{ showTime }}</span>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <el-col :span="24">
          <h3>{{ jailInformation.title }}</h3>
        </el-col>
        <el-col :span="24">
          <el-col :span="12">
            <p>监狱所在省</p>
          </el-col>
          <el-col :span="12">
            <p>{{ jailInformation.provincesName }}</p>
          </el-col>
        </el-col>
        <el-col
          :span="24"
          class="line"/>
        <el-col :span="24">
          <el-col :span="12">
            <p>监狱所在市</p>
          </el-col>
          <el-col :span="12">
            <p>{{ jailInformation.citysName }}</p>
          </el-col>
        </el-col>
        <el-col
          :span="24"
          class="line"/>
        <el-col :span="24">
          <el-col :span="12">
            <p>监狱所在行政区</p>
          </el-col>
          <el-col :span="12">
            <p>{{ jailInformation.district }}</p>
          </el-col>
        </el-col>
        <el-col
          :span="24"
          class="line"/>
        <el-col :span="24">
          <el-col :span="12">
            <p>监狱所在街道</p>
          </el-col>
          <el-col :span="12">
            <p>{{ jailInformation.street }}</p>
          </el-col>
        </el-col>
        <el-col
          :span="24"
          class="line"/>
        <el-col
          :span="24"
          class="description">
          <p>监狱简介</p>
        </el-col>
        <div style="height: 10px; width: 100%; clear: both;"/>
        <el-col :span="24">
          <p
            class="desc"
            v-html="jailInformation.description"/>
        </el-col>
        <el-col :span="24">
          <el-button
            type="primary"
            size="mini"
            @click="editJails(jailInformation.id)">编辑</el-button>
        </el-col>
      </el-col>
    </el-row>
  </el-row>
</template>

<script>
import AudioThree from '@/assets/images/audio-icon.png'
import AudioOne from '@/assets/images/audio-no.png'
import audioTwo from '@/assets/images/audio-one.png'
import helper from '@/filters/modules/time'
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      triggered: false,
      showTime: null,
      progressBarVal: 0,
      audioImgs: [AudioOne, audioTwo, AudioThree],
      audioImg: AudioThree,
      interval: null
      // isJailEdit: false // 是否是监狱基本信息编辑页面
    }
  },
  computed: {
    ...mapState(['jailInformation'])
  },
  mounted() {
    this.getJailInformation().then(() => {
      this.$refs.audio && this.getTotalDuration()
    })
  },
  methods: {
    ...mapActions(['getJailInformation']),
    // 编辑监狱基本信息
    editJails(id) {
      this.$router.push({
        path: `/jails/edit/${ id }`
      })
    },
    // 新增监狱基本信息
    addJails() {
      this.$router.push({
        path: '/jails/add'
      })
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
    handleTimeUpdate() {
      if (!this.$refs.audio) return
      let totalTime = parseInt(this.$refs.audio.duration),
        currentTime = parseInt(this.$refs.audio.currentTime)
      this.showTime = helper.timeNew(totalTime - currentTime)
      if (this.$refs.audio.currentTime / this.$refs.audio.duration === 1 || this.$refs.audio.ended) {
        this.progressBarVal = 0
        this.showTime = helper.timeNew(totalTime)
      }
      else {
        this.progressBarVal = (currentTime / totalTime * 100)
      }
    },
    getTotalDuration() {
      this.showTime = helper.timeNew(parseInt(this.$refs.audio.duration))
    }
  }
}
</script>

<style type="text/stylus" lang="stylus">
  #jail-information-management
    > .el-row
      > .el-col-12
        &:first-child
          padding: 3% 2% 20px 2%
          img
            max-width: 100%
            float: left
        &:nth-child(2)
          padding: 18px 2% 0 0
          .el-col-24
            &:first-child
              margin-bottom: 10px
              h3
                text-align: center
                font-weight: bold
            &:last-child
              .el-button
                float: right
                margin-right: 3%
                margin-bottom: 20px
      .el-col.line
        border-bottom: 1px solid #F3F3F3
        margin-bottom: 10px
      .el-col-24
        &.description
          img
            max-width: 100%
        .el-col-12
          &:nth-child(2)
            p
              color: #A6A6A6
              text-align: right
    .audio-container
      display: flex
      justify-items: flex-start
      align-items:center
      background:rgba(235,235,235,1)
      padding: 12px 8px
    .prison-detail
      font-size:1.1rem !important
      font-family:PingFang-SC-Medium !important
      font-weight:500 !important
      color:rgba(102,102,102,1) !important
      text-indent: 2.4rem
    .audio-container-right
      width: 82%
      height: .7rem
      border: .05rem solid #2B569A
      margin: 0 auto
      border-radius: .4rem
      display:flex
      align-items:center
    .progress__bar
      height: .16rem
      background: #264c90
      margin-left: .4rem
    .desc
      img
        display: block
        margin: auto
        max-width: 100%
</style>

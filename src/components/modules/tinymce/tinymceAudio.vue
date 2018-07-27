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
      default: `http://120.79.67.25:1339/audio-server/audios` // 测试和演示
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
      }
    }
  },
  methods: {
    handleSuccess(res, file, fileList) {
      switch (res.code) {
        case 200:
          this.$message.success('音频上传成功')
          this.$emit('success', `${ res.url }?token=${ this.headers.Authorization }`)
          break
        default:
          this.$message.error(`上传音频失败:${ res.message }`)
      }
    },
    beforUpload(file) {
      // let fileType = this.accept.split(',')
      // const isAccept = fileType.indexOf(file.type) > -1
      // if (!isAccept) {
      //   let accept = []
      //   fileType.forEach(type => { accept.push(type.substr(type.lastIndexOf('/') + 1)) })
      //   this.$message.error(`请上传${ accept.join('或') }格式的文件`)
      //   return false
      // }
      return true
    },
    handleExceed() {
      this.$message.error('音频数量超出限制')
    },
    handleError(e) {
      this.$message.error(`上传音频失败`)
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

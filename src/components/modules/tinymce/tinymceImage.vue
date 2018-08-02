<template>
  <el-upload
    ref="uploadImg"
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
    <i class="mce-ico mce-i-image"></i>
  </el-upload>

</template>

<script>
export default {
  props: {
    action: {
      type: String,
      // default: 'http://39.108.185.51:1339/avatars'
      // default: `https://www.yuwugongkai.com/image-server/avatars`
      default: `http://123.57.7.159:1339/image-server/avatars` // 测试和演示
    },
    name: {
      type: String,
      default: 'avatar'
    },
    accept: {
      type: String,
      default: 'image/jpeg,image/jpg'
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
          this.$message.success('图片上传成功')
          this.$emit('success', res.url)
          break
        default:
          this.$message.error(`上传图片失败:${ res.message }`)
      }
    },
    beforUpload(file) {
      let fileType = this.accept.split(',')
      const isAccept = fileType.indexOf(file.type) > -1
      const isSize = file.size / 1024 / 1024 < 1
      if (!isAccept) {
        let accept = []
        fileType.forEach(type => { accept.push(type.substr(type.lastIndexOf('/') + 1)) })
        this.$message.error(`请上传${ accept.join('或') }格式的文件`)
        return false
      }
      if (!isSize) {
        this.$message.error('文件大小不能超过1MB!')
        return false
      }
      return true
    },
    handleExceed() {
      this.$message.error('图片数量超出限制')
    },
    handleError(e) {
      console.log(e)
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

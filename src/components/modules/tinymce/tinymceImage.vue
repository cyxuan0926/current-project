<template>
  <el-upload
    ref="uploadImg"
    :action="$urls.imageUrl"
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
    <i class="mce-ico mce-i-image"/>
  </el-upload>

</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
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
        Authorization: this.$urls.token
      }
    }
  },
  methods: {
    ...mapActions(['setUrlStorage', 'setNewUrlStorage']),
    handleSuccess(res, file, fileList) {
      switch (res.code) {
        // 存储url 包括以前的 还有新的
        case 200:
          this.$message.success('图片上传成功')
          this.$emit('success', `${ res.url }?token=${ this.$urls.token }`)
          let urls = localStorage.getItem('urls') ? JSON.parse(localStorage.getItem('urls')) : []
          this.setUrlStorage({ urls: [...urls, res.url] })
          this.setNewUrlStorage({ urls: [res.url] })
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

<template>
  <div class="">
    <el-upload
      class="avatar-uploader"
      ref="uploadImg"
      :action="$urls.imageUrl"
      :headers="headers"
      :multiple="multiple"
      :name="name"
      :accept="accept"
      :list-type="listType"
      :file-list="fileList"
      :limit="limit"
      :on-preview="handlePictureCardPreview"
      :on-success="handleSuccess"
      :before-upload="beforUpload"
      :on-exceed="handleExceed"
      :on-error="handleError"
      :on-remove="handleRemove">
      <i class="el-icon-plus"/>
      <div
        slot="tip"
        class="el-upload__tip">
        只能上传<span class="red">jpg/jpeg</span>文件,且文件大小不超过<span class="red">1MB</span>
        <template v-if="ratio">,图片宽高比为<span class="red">{{ ratio }}</span></template>
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img
        width="100%"
        :src="imageUrl"
        alt="">
    </el-dialog>
  </div>

</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    headers: {
      type: Object,
      default: function() {
        return {
          Authorization: this.$urls.token
        }
      }
    },
    multiple: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: 'avatar'
    },
    accept: {
      type: String,
      default: 'image/jpeg,image/jpg'
    },
    listType: {
      type: String,
      default: 'picture-card'
    },
    limit: {
      type: Number,
      default: 1
    },
    ratio: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      imageUrl: '',
      dialogVisible: false,
      changed: false
    }
  },
  computed: {
    fileList() {
      if (this.limit === 1) {
        let res = (!this.value || !this.value.length) ? [] : [{ url: `${ this.value }?token=${ this.$urls.token }` }]
        return res
      }
      let r = this.value
      r.map(item => {
        item.url = `${ item.url }?token=${ this.$urls.token }`
      })
      return r
    }
  },
  watch: {
    fileList(val) {
      if (!this.changed && val.length) {
        val.forEach(img => {
          this.setImageLocalstorage('images', img.url.split('?token=')[0])
        })
        this.changed = true
      }
      if (this.limit <= val.length) {
        this.$refs.uploadImg.$el.getElementsByClassName('el-upload el-upload--picture-card')[0].style.display = 'none'
      }
      else if (this.limit > val.length) {
        this.$refs.uploadImg.$el.getElementsByClassName('el-upload el-upload--picture-card')[0].style.display = 'inline-block'
      }
    }
  },
  methods: {
    handleSuccess(res, file, fileList) {
      switch (res.code) {
        case 200:
          this.$message.success('图片上传成功')
          this.$emit('success', this.limit === 1 ? res.url : fileList)
          this.setImageLocalstorage('images', res.url)
          this.setImageLocalstorage('newImages', res.url)
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
      if (!this.ratio) return true
      const ratio = this.ratio.split(':')
      return new Promise((resolve, reject) => {
        var reader = new FileReader()
        reader.onload = (e) => {
          let data = e.target.result, image = new Image()
          image.onload = () => {
            if (image.width / image.height !== ratio[0] / ratio[1]) {
              this.$message.error(`请上传宽高比为${ this.ratio }的图片`)
              reject(false)
            }
            else {
              resolve(true)
            }
          }
          image.src = data
        }
        reader.readAsDataURL(file)
      })
    },
    handlePictureCardPreview(file) {
      this.imageUrl = file.url
      this.dialogVisible = true
    },
    handleExceed() {
      this.$message.error('图片数量超出限制')
      this.$refs.uploadImg.$el.getElementsByClassName('el-upload el-upload--picture-card')[0].style.display = 'none'
    },
    handleError(e) {
      console.log(e)
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

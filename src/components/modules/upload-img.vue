<template>
  <div style="overflow: hidden;">
    <div class="component-img__box">
      <div
        v-if="!value"
        class="no-video">
        <i class="iconfont icon-image" />
      </div>
      <img
        v-else
        :src="value + '?token=' + $urls.token"
        style="width: 108px; height: 108px;"
        @click="handlePictureCardPreview">
    </div>
    <div class="upload-buttons">
      <el-upload
        class="avatar-uploader"
        ref="uploadImage"
        :action="$urls.imageUrl"
        :headers="headers"
        :multiple="multiple"
        name="avatar"
        :accept="accept"
        :file-list="fileList"
        :limit="1"
        :show-file-list="false"
        :on-success="handleSuccess"
        :before-upload="beforUpload"
        :on-exceed="handleExceed"
        :disabled="loading || Boolean(value)"
        :on-error="handleError"
        :on-remove="handleRemove">
        <el-button
          slot="trigger"
          size="small"
          :disabled="loading || Boolean(value)"
          type="primary">上传图片
        </el-button>
        <!-- <i class="el-icon-plus"/>
        <div
          slot="tip"
          class="el-upload__tip">
          只能上传<span class="red">jpg/jpeg</span>文件,且文件大小不超过<span class="red">1MB</span>
          <template v-if="ratio">,图片宽高比为<span class="red">{{ ratio }}</span></template>
        </div> -->
      </el-upload>
      <el-button
        type="danger"
        size="small"
        :disabled="!loading && !Boolean(value)"
        style="margin-top: 10px;"
        @click="handleDelete">删除</el-button>
    </div>
    <span
      slot="tip"
      class="el-upload__tip"
      style="line-height: 40px; clear: both; display: block;">
      只能上传<span class="red">jpg/jpeg</span>文件,且文件大小不超过<span class="red">1MB</span>
      <template v-if="ratio">,图片宽高比为<span class="red">{{ ratio }}</span></template>
    </span>
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
    multiple: {
      type: Boolean,
      default: false
    },
    accept: {
      type: String,
      default: 'image/jpeg,image/jpg'
    },
    listType: {
      type: String,
      default: 'picture-card'
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
      changed: false,
      headers: {
        Authorization: this.$urls.token
      },
      loading: false,
      notification: null
    }
  },
  computed: {
    fileList() {
      let files = [], name = ''
      if (this.value) {
        name = this.value.replace(`${ this.$urls.imageUrl }/`, '').replace(/-[0-9]+\./, '.')
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
  methods: {
    handleSuccess(res, file, fileList) {
      switch (res.code) {
        case 200:
          this.$message.success('图片上传成功')
          this.$emit('success', res.url)
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
    handlePictureCardPreview() {
      this.imageUrl = `${ this.value }?token=${ this.$urls.token }`
      this.dialogVisible = true
    },
    handleExceed() {
      this.$message.error('图片数量超出限制')
      this.$refs.uploadImage.$el.getElementsByClassName('el-upload el-upload--picture-card')[0].style.display = 'none'
    },
    handleError(e) {
      console.log(e)
    },
    handleRemove(file, fileList) {
      this.$emit('success', fileList.length ? fileList : '')
    },
    handleDelete() {
      this.$refs.uploadImage.clearFiles()
      this.handleRemove('', [])
    },
    setImageLocalstorage(key, value) {
      let storage = localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : []
      if (storage.indexOf(value) < 0) storage.push(value)
      localStorage.setItem(key, JSON.stringify(storage))
    }
  }
}
</script>

<style lang="css" scoped>
  .el-upload__tip{
    margin-top: 0;
    line-height: 20px;
  }
  .red{
    color: #f00;
  }
  .component-img__box{
    float: left;
    display: inline-flex;
    flex-direction: column;
    margin-right: 10px;
    width: 108px;
  }
  .component-img__box .no-video{
    height: 108px;
    width: 100%;
    background: #E5E5E5;
    line-height: 108px;
    text-align: center;
    color: #8C8080;
    flex-shrink: 0;
  }
  .component-img__box .no-video .iconfont{
    font-size: 28px;
  }
  .component-img__box + .upload-buttons{
    height: 108px;
    float: left;
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
  }
</style>

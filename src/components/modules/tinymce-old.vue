<template>
  <div>
    <quill-editor
      ref="quillEditor"
      v-model="content"
      :options="options"
       @change="editorChange($event)" />
    <el-upload
      ref="uploadImg"
      class="hidden"
      :action="$urls.imageUrl"
      :headers="headers"
      name="avatar"
      :before-upload="beforUpload"
      :on-success="handleSuccess"
      :on-error="handleError"
      :accept="accept"
      multiple
      :on-exceed="handleExceed"
      :file-list="fileList"
      :on-remove="handleRemove">
    </el-upload>
  </div>
</template>
<script>
import { quillEditor } from 'vue-quill-editor'
// import * as ImageResize from 'quill-image-resize-module'
// console.log(ImageResize)
// quillEditor.register('modules/imageResize', ImageResize)
export default {
  components: {
    quillEditor
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    tools: {
      type: String,
      default: 'onlyImage'
    }
  },
  computed: {
    editor() {
      return this.$refs.quillEditor.quill
    }
  },
  watch: {
    value(val) {
      this.content = val
    }
  },
  data() {
    return {
      content: '',
      options: {
        placeholder: '请输入内容...',
        modules: {
          // ImageResize: {
          //   modules: ['Resize']
          // },
          toolbar: [['bold', 'italic', 'underline', 'strike'], [{ 'list': 'ordered'}, { 'list': 'bullet' }], [{ 'script': 'sub'}, { 'script': 'super' }], [{ 'indent': '-1'}, { 'indent': '+1' }], [{ 'color': [] }, { 'background': [] }], [{ 'align': [] }], ['link', 'image'], ['clean']]
        }
      },
      accept: 'image/jpeg,image/jpg',
      fileList: [],
      headers: {
        Authorization: this.$urls.token
      }
    }
  },
  mounted() {
    console.log(this.editor.getModule('toolbar'))
    this.editor.getModule('toolbar').addHandler('image', this.handleImageUpload)
  },
  methods: {
    editorChange({ editor, html, text }) {
      console.log('editorChange', html, 888, text, 777, html.replace(/\s*(&nbsp;)*/g, '').replace(/\n/g, '').replace(/<p><\/p>/g, ''))
      this.$emit('editorChange', html, text.substr(0, 500), html.replace(/\s*(&nbsp;)*/g, '').replace(/\n/g, '').replace(/<p><\/p>/g, ''))
    },
    handleImageUpload(e) {
      this.$refs.uploadImg.$refs['upload-inner'].$refs.input.click()
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
    handleError(e) {
      console.log(e)
    },
    handleExceed() {
      this.$message.error('图片数量超出限制')
    },
    handleRemove(file, fileList) {
      this.$emit('success', fileList.length ? fileList : '')
    },
    handleSuccess(res, file, fileList) {
      switch (res.code) {
        case 200:
          this.$message.success('图片上传成功')
          this.editor.insertEmbed(this.editor.getSelection().index, 'image', `${ res.url }?token=${ this.$urls.token }`)
          this.setImageLocalstorage('images', res.url)
          this.setImageLocalstorage('newImages', res.url)
          break
        default:
          this.$message.error(`上传图片失败:${ res.message }`)
      }
    },
    setImageLocalstorage(key, value) {
      let storage = localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : []
      if (storage.indexOf(value) < 0) storage.push(value)
      localStorage.setItem(key, JSON.stringify(storage))
    }
  }
}
</script>
<style lang="scss" scoped>
@import "quill/dist/quill.core.css", "quill/dist/quill.snow.css", "quill/dist/quill.bubble.css";
.hidden{
  height: 0;
  width: 0;
  overflow: hidden;
}
</style>

<template>
  <el-row id="quill-editor">
    <quill-editor
      :content="contents"
      ref="myQuillEditor"
      :options="editorOption"
      @change="editorChange($event)"/>
    <el-upload
      v-show="false"
      :action="_$agency + '/avatars'"
      name="avatar"
      :headers="authorization"
      :before-upload="beforUpload"
      :on-success="handleSuccess"
      :on-error="handleError"
      :file-list="fileListForEditor"
      accept="image/jpeg,image/jpg">
      <el-button
        class="custom-input"
        size="normal"
        type="primary"
        plain>添加富文本图片</el-button>
    </el-upload>
  </el-row>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
export default {
  components: { quillEditor },
  props: {
    contents: {
      type: String,
      // required: true,
      default: ''
    } // 初始化富文本的内容
  },
  data() {
    const _this = this
    return {
      authorization: { 'Authorization': '523b87c4419da5f9186dbe8aa90f37a3876b95e448fe2a' },
      fileListForEditor: [], // 富文本上传图片列表
      editorOption: {
        placeholder: '请输入内容',
        modules: {
          toolbar: {
            container: [
              ['bold', 'italic', 'underline', 'strike'], // toggled buttons
              ['blockquote', 'code-block'],
              [{ 'header': 1 }, { 'header': 2 }], // custom button values
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              [{ 'script': 'sub' }, { 'script': 'super' }], // superscript/subscript
              [{ 'indent': '-1' }, { 'indent': '+1' }], // outdent/indent
              [{ 'direction': 'rtl' }], // text direction
              [{ 'size': ['small', false, 'large', 'huge'] }], // custom dropdown
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'color': [] }, { 'background': [] }], // dropdown with defaults from theme
              [{ 'font': [] }],
              [{ 'align': [] }],
              ['image'], ['link'],
              ['clean'] // remove formatting button
            ],
            handlers: {
              'image': function(value) {
                if (value) this.quill.format('image', _this.$el.querySelector('.custom-input').click())
                else this.quill.format('image', false)
              }
            }
          }
        } // 富文本编辑器的配置
      }
    }
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill
    }
  },
  methods: {
    // 当富文本的内容发生改变的时候传给父组件
    editorChange({ editor, html, text }) {
      this.$emit('editorChange', html, text.substr(0, 100))
    },
    // 上传图片成功执行的方法
    handleSuccess(res) {
      switch (res.code) {
        case 200:
          this.$message.success('图片上传成功')
          this.editor.insertEmbed(this.editor.getSelection().index, 'image', `${ res.url }?token=523b87c4419da5f9186dbe8aa90f37a3876b95e448fe2a`)
          break
        default:
          this.$message.error(`上传图片失败:${ res.message }`)
      }
    },
    handleError(err, file) {
      console.log('富文本图片上传失败', err)
    },
    beforUpload(file) {
      let fileType = 'image/jpeg,image/jpg'.split(',')
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
    }
  }
}
</script>

<style type="text/stylus" lang="stylus">
  #quill-editor
    .ql-editor
      min-height: 145px
    .ql-snow .ql-color-picker .ql-picker-label svg, .ql-snow .ql-icon-picker .ql-picker-label svg, .ql-snow .ql-picker-label::before
      float: left;
</style>

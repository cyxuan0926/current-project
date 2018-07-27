<template>
    <div>
        <div :id="tinymceId"></div>
        <tinymce-img
          ref="upload1"
          style="visibility: hidden; height: 0; width: 0; overflow: hidden;"
          @success="handleSuccess" />
    </div>
</template>

<script>
import tinymceImg from './tinymceImage'

export default {
  components: { tinymceImg },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      hasChanged: false,
      hasInit: false,
      tinymceId: this.id || `vue-tinymce-${ +new Date() }`
    }
  },
  watch: {
    value(val) {
      if (!this.hasChange && this.hasInit) {
        this.$nextTick(() => window.tinymce.get(this.tinymceId).setContent(val))
      }
    }
  },
  mounted() {
    window.tinymce.init({
      selector: `#${ this.tinymceId }`,
      language: 'zh_CN',
      menubar: '',
      height: 300,
      resize: false,
      branding: false,
      content_style: 'blockquote{padding: 10px 20px; margin: 0 0 20px; font-size: initial; border-left: 5px solid #eee;} p{ margin: 0; line-height: 1.42857143; }.mce-panel{ box-sizing: border-box; }',
      plugins: 'anchor charmap codesample textcolor colorpicker contextmenu directionality emoticons media hr image insertdatetime link lists advlist table preview searchreplace table',
      toolbar: 'formatselect fontsizeselect | bold italic blockquote underline strikethrough forecolor backcolor | hr subscript superscript | numlist bullist | alignleft aligncenter alignright alignjustify alignnone | outdent indent table | charmap codesample emoticons insertdatetime | link imageUpload | removeformat searchreplace undo redo | preview',
      init_instance_callback: editor => { //  media
        this.hasInit = true
        if (this.value) {
          editor.setContent(this.value)
        }
        editor.on('NodeChange Change KeyUp', () => {
          this.hasChange = true
          this.$emit('editorChange', editor.getContent({ format: 'raw' }), editor.getContent({ format: 'text' }), editor.getContent({ format: 'html' }).replace(/\s*(&nbsp;)*/g, '').replace(/\n/g, '').replace(/<p><\/p>/g, ''))
        })
      },
      setup: editor => {
        editor.addButton('imageUpload', {
          icon: 'image',
          tooltip: '选择图片',
          onclick: (data) => {
            this.$refs.upload1.$refs.uploadImg.$refs['upload-inner'].$refs.input.click()
          }
        })
      }
    })
  },
  destroyed() {
    window.tinymce.get(this.tinymceId).destroy()
  },
  methods: {
    handleSuccess(e) {
      window.tinymce.get(this.tinymceId).insertContent(`<img class='wscnph' src='${ e }?token=${ this.$refs.upload1.headers.Authorization }' >`)
    }
  }
}
</script>

<style scoped>
</style>

<template>
    <div>
        <editor
          :id="tinymceId"
          :init="init" />
        <!-- <textarea :id="tinymceId"></textarea> -->
    </div>
</template>

<script>
// import tinymce from '@tinymce/tinymce-vue'
import Editor from '@tinymce/tinymce-vue'

export default {
  components: { Editor },
  data() {
    return {
      tinymceId: this.id || `vue-tinymce-${ +new Date() }`
    }
  },
  computed: {
    init() {
      return {
        plugins: 'advlist autolink link image lists charmap print preview',
        language: 'zh-CN'
      }
    }
  },
  watch: {
  },
  mounted() {
    console.log(this.init)
    // console.log(`#${ this.tinymceId }`, Object.assign({}, tinymce.props))
    // tinymce.props.init({
    //   selector: `#${ this.tinymceId }`,
    //   plugins: 'advlist autolink link image lists charmap print preview'
    // })
  },
  methods: {
  }
}
</script>

<style scoped>
</style>

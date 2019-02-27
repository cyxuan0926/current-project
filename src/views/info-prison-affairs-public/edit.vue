<template>
  <div>
    <div class="form-container">
      <m-form
        ref="form"
        :items="formItems"
        @submit="onSubmit"
        :values="values"/>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      formItems: {
        formConfigs: { labelWidth: '140px' },
        buttons: [{ update: { loading: false } }],
        typeId: { value: this.$route.meta.typeId },
        title: { type: 'input', label: '新闻标题', rules: ['required'] },
        contents: { type: 'jaileditor', label: '新闻内容', rules: ['required'], summary: 'summary' },
        audioPath: { type: 'uploadAudio', label: '新闻音频' },
        videoPath: { type: 'uploadVideo', label: '新闻视频' },
        imageUrl: { type: 'uploadImg', label: '新闻图片' },
        isFocus: { type: 'checkbox', value: false, noLabel: true, group: [{ value: true, label: '是否设为焦点新闻' }] }
      },
      values: {},
      types: [
        {
          name: 'prison-affairs-public',
          typeId: 1
        },
        {
          name: 'working-dynamics',
          typeId: 2
        },
        {
          name: 'complaints-suggestions',
          typeId: 3
        },
        {
          name: 'prison-affairs-public/4',
          typeId: 4
        },
        {
          name: 'prison-affairs-public/5',
          typeId: 5
        },
        {
          name: 'prison-affairs-public/6',
          typeId: 6
        }
      ]
    }
  },
  computed: {
    ...mapState(['news'])
  },
  destroyed() {
    this.removeUrlStorage()
  },
  mounted() {
    this.getNewsDetail(this.$route.params.id).then(res => {
      if (!res) return
      this.setUrlStorage({ urls: [this.news.imageUrl, this.news.audioPath, this.news.videoPath], contents: this.news.contents })
      this.values = this.news
    })
  },
  methods: {
    ...mapActions(['getNewsDetail', 'editNews', 'setUrlStorage', 'removeUrlStorage']),
    onSubmit(e) {
      if (this.$refs.form.$refs.audioPath[0].$refs.audio.loading || this.$refs.form.$refs.videoPath[0].$refs.video.loading) {
        this.$message.warning('正在上传文件')
        return false
      }
      if (!e.contents) {
        this.$message.warning('请填写新闻内容')
        return false
      }
      this.editNews(e).then(res => {
        if (res) {
          let type = this.types.find(t => t.typeId === this.$route.meta.typeId)
          if (!type) {
            this.$message.error('不识别的类型')
          }
          else {
            this.$router.push(`/prison-affairs-public/${ type.name }`)
          }
        }
      })
    }
  }
}
</script>

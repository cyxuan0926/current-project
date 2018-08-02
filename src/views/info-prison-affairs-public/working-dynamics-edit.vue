<template>
  <el-row class="row-container" :gutter="0">
    <el-col :span="13" :offset="5">
      <el-form ref="form" :model="news" label-position="top" :rules="rules">
        <el-form-item label="新闻标题" prop="title">
          <el-input v-model="news.title" placeholder="请填写新闻标题"></el-input>
        </el-form-item>
        <el-form-item class="is-required" label="新闻内容" prop="contents">
          <!-- <m-quill-editor :contents="news.contents" @editorChange="editorChange"></m-quill-editor> -->
          <m-tinymce :value="news.contents" @editorChange="editorChange"></m-tinymce>
        </el-form-item>
        <el-form-item label="新闻图片">
          <m-upload-img v-model="news.imageUrl" @success="onSuccess"></m-upload-img>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="news.isFocus">是否设为焦点新闻</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" size="small" style="float: right;">更新</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      rules: {
        title: [{ required: true, message: '请填写新闻标题' }]
      }
    }
  },
  computed: {
    ...mapState(['news'])
  },
  mounted() {
    this.getNewsDetail(this.$route.params.id)
  },
  methods: {
    ...mapActions(['getNewsDetail', 'editNews']),
    onSuccess(e) {
      this.news.imageUrl = e
    },
    // 当富文本内容发生改变时执行的方法
    editorChange(contents, text) {
      this.news.contents = contents
      this.news.summary = text
    },
    // 点击更新时执行的方法
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (!this.news.contents) {
            this.$message.warning('请填写新闻内容')
            return false
          }
          this.editNews(this.news).then(res => {
            if (res) this.$router.push('/prison-affairs-public/working-dynamics')
          })
        }
      })
    }
  }
}
</script>

<style type="text/stylus" lang="stylus" scoped>
</style>

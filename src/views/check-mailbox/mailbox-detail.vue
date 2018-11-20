<template>
  <el-row
    class="row-container"
    :gutter="0">
    <h3 class="mail-title">{{ mailbox.title }}</h3>
    <div class="mail-from">
      <h5>来自：
        <span>{{ mailbox.name }} &nbsp;&nbsp;&nbsp; &lt;{{ mailbox.prisonerName }} 的 {{ mailbox.relationship }}&gt;</span>
      </h5>
      <h5>日期： <span>{{ mailbox.createdAt | Date }}</span></h5>
    </div>
    <div class="mail-content">
      <h5>信件内容：</h5>
      <p class="contents">{{ mailbox.contents }}</p>
    </div>
    <div class="mail-reply">
      <div
        v-for="comments in mailbox.comments"
        :key="comments.id">
        <p class="reply-top">
          <span class="blue">监狱回复：</span>
          <span>{{ comments.createdAt | Date }}</span>
        </p>
        <p class="contents">{{ comments.contents }}</p>
      </div>
    </div>
    <el-form
      :model="comments"
      :rules="rule"
      ref="replyForm">
      <el-form-item prop="contents">
        <el-input
          type="textarea"
          :rows="3"
          placeholder="快速回复"
          v-model="comments.contents" />
      </el-form-item>
    </el-form>
    <el-button
      class="button-add"
      plain
      size="mini"
      @click="onReply">回复</el-button>
  </el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      comments: {
        contents: ''
      },
      rule: {
        contents: [{ required: true, message: '请输入回复的内容', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState(['mailbox'])
  },
  mounted() {
    this.getMailbox(this.$route.params.id)
  },
  methods: {
    ...mapActions(['getMailbox', 'mailboxReply']),
    onReply() {
      this.$refs['replyForm'].validate(valid => {
        if (valid) {
          let params = {
            id: this.$route.params.id,
            contents: this.comments.contents,
            familyId: this.mailbox.familyId
          }
          this.mailboxReply(params).then(res => {
            if (!res) return
            this.comments.contents = ''
            this.getMailbox(this.$route.params.id)
          })
        }
      })
    }
  }
}
</script>

<style type="text/stylus" lang="stylus" scoped>
[class^='mail-']
  border-bottom: 1px solid #f4f4f4;
  padding: 10px;
.mail-title
  font-size: 18px;
  margin: 0;
p
  margin: 0;
p.contents
  text-indent: 2em;
.blue
  color: #409EFF;
.reply-top
  line-height: 40px;
.mail-reply
  margin-bottom: 10px;
</style>

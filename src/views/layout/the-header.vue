<template>
  <div class="header-container">
    <div
      :class="[
        'header-left',
        'transition',
        { 'collapsed': isCollapsed }]">
      <span class="bold">国科服务</span>管理平台
    </div>
    <div class="header-right">
      <i
        class="iconfont icon-category bold"
        @click="handleCollapse" />
      <div>
        <el-dropdown
          trigger="click"
          @command="handleCommand">
          <div class="item">
            <img
              src="/static/images/user2-160x160.jpg"
              class="avatar circle">
            <span class="hidden-xs-only">{{ publicUserInfo.username }}</span>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="{ path: '/password/edit' }">修改用户密码</el-dropdown-item>
            <el-dropdown-item :command="'setSecurityQuestions'">设置安全问题</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <i
          class="iconfont icon-tuichu"
          @click="handleLogout" />
      </div>
    </div>
    <el-dialog
      :visible.sync="visible"    
      ref="allDialog"
      title="设置你的安全问题"
      class="authorize-dialog all-dialog__style"
      @close="handleCloseDialog"
      width="530px">
      <m-form
        class="security-question__form"
        :items="questionAnswersFormItems"
        @submit="handleSubmit"
        :values='values'
        ref="dialogForm"
        @cancel="visible = false"/>
    </el-dialog>
  </div>
</template>

<script>
import questionAnswersSetter from '@/mixins/question-answers-setter'
import { mapActions, mapState } from 'vuex'
import logout from '@/utils/logout'
export default {
  mixins: [questionAnswersSetter],
  data() {
    return {
      visible: false
    }
  },
  computed: {
    ...mapState({
      isCollapsed: state => state.layout.isCollapsed,
      publicUserInfo: state => state.account.publicUserInfo
    })
  },
  methods: {
    ...mapActions(['handleCollapse', 'closeWebsocket']),
    ...mapActions('account', ['setUserSecurityQuestionAnswers', 'getUserSecurityQuestionAnswers']),
    handleCommand(e) {
      if (e === 'setSecurityQuestions') {
        (async () => {
          const res = await this.getUserSecurityQuestionAnswers()
          await this.onRenderData(res)
          this.visible = true
        })()
      }
      else this.$router.push(e)
    },
    handleLogout() {
      this.$confirm('是否退出登录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          this.closeWebsocket()
          this.$router.replace('/login')
          logout()
      }).catch(() =>{})
    },
    onSecurityQuestionsChange(e, field) {
      this.$set(this.isChoose, field, e)
      const filterFields = this.fields.filter(val => val && val !== field)
      // 这里是处理没有触发change事件的select
      filterFields.map(fullField => {
        // 如果这个这个select已经选择过了那么这个筛选条件就要去除掉选择的那个值 这里在已经设置好问题时有bug
        const temp = Object.values(this.isChoose).filter(question => question && question !== this.isChoose[fullField])
        this.$set(this.questions, fullField, this.securityQuestions.filter(val => val && !temp.includes(val.id)))
        this.$set(this.questionAnswersFormItems[fullField], 'options', this.questions[fullField])
      })
    },
    async handleSubmit(val) {
      const mapArray = [ 'One', 'Two', 'Three' ]
      this.onProcesseData(val)
      const params = mapArray.map((val,index) => ({ securityQuestionId: this.questionAnswers[val][0], answer: this.questionAnswers[val][1], ordinal: index }))
      await this.setUserSecurityQuestionAnswers(params)
      this.handleCloseDialog()
    },
    handleCloseDialog() {
     this.$refs.dialogForm && this.$refs.dialogForm.onCancel()
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../assets/css/layout";
.all-dialog__style {
  line-height: 24px;
}
</style>

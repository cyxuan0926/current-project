<template>
  <div class="header-container">
    <div
      :class="[
        'header-left',
        'transition',
        { 'collapsed': isCollapsed }]">
      <span class="bold">狱务通</span>管理平台
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
        :items="dialogFormItems"
        @submit="handleSubmit"
        :values='values'
        ref="dialogForm"
        @cancel="visible = false"/>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import logout from '@/utils/logout'
// action: 'getSecurityQuestions', namespaced: 'account' customClass: 'el-form-item__margin-bottom-0','lengthRange-10'
export default {
  data() {
    let formButton = { buttons: [ { add: 'add', text: '确定' }, 'cancel' ] },
      inputItem = { type: 'input', label: '答案', placeholder: '请输入你的答案，控制在10个字符以内',
        rules: ['required'], clearable: true, maxlength: 10 },
      selectItem = { type: 'select', props: { label: 'name', value: 'id' },
        func: this.onSecurityQuestionsChange, rules: ['required'], value: '' }
    return {
      visible: false,
      filterData: [],
      dialogFormItems: Object.assign({}, {
        formConfigs: { labelWidth: '100px' },
        questionOne: Object.assign({}, selectItem, { label: '问题1' }),
        answerOne: inputItem,
        questionTwo: Object.assign({}, selectItem, { label: '问题2' }),
        answerTwo: inputItem,
        questionThree: Object.assign({}, selectItem, { label: '问题3' }),
        aneswrThree: inputItem
      }, formButton),
      values: {},
      isChoose: {},
      questions: {},
      questionAnswers: {}
    }
  },
  computed: {
    ...mapState({
      isCollapsed: state => state.layout.isCollapsed,
      publicUserInfo: state => state.account.publicUserInfo
    }),
    ...mapState('account', {
      securityQuestions: state => state.securityQuestions
    }),
  },
  methods: {
    ...mapActions(['handleCollapse', 'closeWebsocket']),
    ...mapActions('account', ['getSecurityQuestions', 'setUserSecurityQuestionAnswers', 'getUserSecurityQuestionAnswers']),
    handleCommand(e) {
      if (e === 'setSecurityQuestions') {
        (async () => {
          const fields = ['questionOne', 'questionTwo', 'questionThree']
          await this.getSecurityQuestions()
          const res = await this.getUserSecurityQuestionAnswers()
          if (res && res.length) {
            const questionAnswers = res.map(val => {
              if (val.ordinal === 0) return { 'One': [ val.securityQuestionId, val.answer ] }
              if (val.ordinal === 1) return { 'Two': [ val.securityQuestionId, val.answer ] }
              if (val.ordinal === 2) return { 'Three': [ val.securityQuestionId, val.answer ] }
            })
            const noOne = [questionAnswers[1]['Two'][0], questionAnswers[2]['Three'][0]]
            const noTwo = [questionAnswers[0]['One'][0], questionAnswers[2]['Three'][0]]
            const noThree = [questionAnswers[0]['One'][0], questionAnswers[1]['Two'][0]]
            this.$set(this.questions, 'questionOne', this.securityQuestions.filter(question => question && !noOne.includes(question.id)))
            this.$set(this.questions, 'questionTwo', this.securityQuestions.filter(question => question && !noTwo.includes(question.id)))
            this.$set(this.questions, 'questionThree', this.securityQuestions.filter(question => question && !noThree.includes(question.id)))
            fields.map(val => this.$set(this.dialogFormItems[val], 'options', this.questions[val]))
            this.values = { questionOne: questionAnswers[0]['One'][0], questionTwo: questionAnswers[1]['Two'][0], questionThree: questionAnswers[2]['Three'][0],
              answerOne: questionAnswers[0]['One'][1], answerTwo: questionAnswers[1]['Two'][1], aneswrThree: questionAnswers[2]['Three'][1] }
          }
          else fields.map(val => this.$set(this.dialogFormItems[val], 'options', this.securityQuestions))
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
      const fields = ['questionOne', 'questionTwo', 'questionThree']
      const filterFields = fields.filter(val => val && val !== field)
      // 这里是处理没有触发change事件的select
      filterFields.map(fullField => {
        // 如果这个这个select已经选择过了那么这个筛选条件就要去除掉选择的那个值
        const temp = this.isChoose[fullField] ? Object.values(this.isChoose).filter(question => question && question !== this.isChoose[fullField])
          : Object.values(this.isChoose)
        this.$set(this.questions, fullField, this.securityQuestions.filter(val => val && !temp.includes(val.id)))
        this.$set(this.dialogFormItems[fullField], 'options', this.questions[fullField])
      })
    },
    async handleSubmit(val) {
      const mapArray = [ 'One', 'Two', 'Three' ]
      const { questionOne, questionTwo, questionThree, answerOne, answerTwo, aneswrThree } = val
      const One = [ questionOne, answerOne ]
      const Two = [ questionTwo, answerTwo ]
      const Three = [ questionThree, aneswrThree ]
      this.$set(this.questionAnswers, 'One', One)
      this.$set(this.questionAnswers, 'Two', Two)
      this.$set(this.questionAnswers, 'Three', Three)
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
// .security-question__form {
//   /deep/ .el-form-item__margin-bottom-0 {
//     // margin-bottom: 0px;
//   }
// }
</style>

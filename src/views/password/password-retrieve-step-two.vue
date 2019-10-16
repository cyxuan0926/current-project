<template>
  <div>
    <m-form
        :values="values"
         @submit="handleGoNextStep"
        :items="questionAnswersFormItems"
        ref="dialogForm">
        <el-form-item v-if="isPass">
          <div class="el-form-item__error">找回密码问题答案错误，请重新输入，或联系厂家维护人员协助处理，谢谢！</div>
        </el-form-item>
    </m-form>    
  </div>
</template>
<script>
import questionAnswersSetter from '@/mixins/question-answers-setter'
import { mapActions, mapState, mapMutations } from 'vuex'
import passwordMixins from './mixins/password-mixins'
export default {
  mixins: [questionAnswersSetter, passwordMixins],
  data () {
    const  disabled = { disabled: true }
    return {
      questionAnswersFormItems: {
        formConfigs: { labelWidth: '30%' },
        questionOne: Object.assign({}, disabled),
        answerOne: {},
        questionTwo: Object.assign({}, disabled),
        answerTwo: {},
        questionThree:  Object.assign({}, disabled),
        buttons: [ 'next', { prev: '上一步', func: this.handleSetStepAndRouter } ]
      },
      isPass: false
    }
  },
  async mounted() {
    if (!this.isStep || !this.findPasswordUsername) this.handleSetStepAndRouter()
    else {
      const data = await this.getUserSecurityQuestions({ username: this.findPasswordUsername })
      const questions = data.map(item => ({ id: item.securityQuestionId, name: item.securityQuestionName }))
      this.fields.map((value, index) => this.$set(this.questionAnswersFormItems[value], 'options', [questions[index]]))
      this.values = { questionOne: questions[0].id,
          questionTwo: questions[1].id,
          questionThree: questions[2].id }
    }
  },
  methods: {
    ...mapActions('account', ['getUserSecurityQuestions', 'verificateSecurityQuestionAnswers']),
    async handleGoNextStep(val) {
      const username = this.findPasswordUsername
      const mapArray = [ 'One', 'Two', 'Three' ]
      this.onProcesseData(val)
      const params = mapArray.map(val => ({ securityQuestionId: this.questionAnswers[val][0], answer: this.questionAnswers[val][1] }))
      const res = await this.verificateSecurityQuestionAnswers({ username, questionAnswers: params })
      this.isPass = !res
      if (res) this.handleSetStepAndRouter({ step: 2, path: '/password_retrieve/step_three' })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped >
</style>

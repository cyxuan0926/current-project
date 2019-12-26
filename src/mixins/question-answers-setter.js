import { mapActions, mapState } from 'vuex'
export default {
  data() {
    let formButton = { buttons: [ { add: 'add', text: '确定' }, 'cancel' ] },
      inputItem = { type: 'input',
        label: '答案',
        placeholder: '请输入你的答案，控制在10个字数以内',
        rules: ['required', 'lengthRange-10'],
        clearable: true,
        ruleMessages: { lengthRange: '不要超过字数限定数' } },
      selectItem = { type: 'select',
        props: { label: 'name', value: 'id' },
        func: this.onSecurityQuestionsChange,
        rules: ['required'] }
    return {
      questionAnswersFormItems: Object.assign({}, {
        formConfigs: { labelWidth: '100px' },
        questionOne: Object.assign({}, selectItem, { label: '问题1', controlProps: [ 'answerOne' ] }),
        answerOne: inputItem,
        questionTwo: Object.assign({}, selectItem, { label: '问题2', controlProps: [ 'answerTwo' ] }),
        answerTwo: inputItem,
        questionThree: Object.assign({}, selectItem, { label: '问题3', controlProps: [ 'aneswrThree' ] }),
        aneswrThree: inputItem
      }, formButton),
      values: {},
      isChoose: {},
      questions: {},
      questionAnswers: {},
      fields: ['questionOne', 'questionTwo', 'questionThree']
    }
  },
  methods: {
    ...mapActions('account', ['getSecurityQuestions']),
    onProcesseData(data) {
      const { questionOne, questionTwo, questionThree, answerOne, answerTwo, aneswrThree } = data
      const One = [ questionOne, answerOne ]
      const Two = [ questionTwo, answerTwo ]
      const Three = [ questionThree, aneswrThree ]
      this.$set(this.questionAnswers, 'One', One)
      this.$set(this.questionAnswers, 'Two', Two)
      this.$set(this.questionAnswers, 'Three', Three)
    },
    async onRenderData(answers) {
      await this.getSecurityQuestions()
      if (answers && answers.length) {
        const questionAnswers = answers.map(val => [ val.securityQuestionId, val.answer ])
        const noOne = [questionAnswers[1][0], questionAnswers[2][0]]
        const noTwo = [questionAnswers[0][0], questionAnswers[2][0]]
        const noThree = [questionAnswers[0][0], questionAnswers[1][0]]
        this.$set(this.questions, 'questionOne', this.securityQuestions.filter(question => question && !noOne.includes(question.id)))
        this.$set(this.questions, 'questionTwo', this.securityQuestions.filter(question => question && !noTwo.includes(question.id)))
        this.$set(this.questions, 'questionThree', this.securityQuestions.filter(question => question && !noThree.includes(question.id)))
        this.$set(this.isChoose, 'questionOne', questionAnswers[0][0])
        this.$set(this.isChoose, 'questionTwo', questionAnswers[1][0])
        this.$set(this.isChoose, 'questionThree', questionAnswers[2][0])
        this.fields.map(val => this.$set(this.questionAnswersFormItems[val], 'options', this.questions[val]))
        this.values = { questionOne: questionAnswers[0][0],
          questionTwo: questionAnswers[1][0],
          questionThree: questionAnswers[2][0],
          answerOne: questionAnswers[0][1],
          answerTwo: questionAnswers[1][1],
          aneswrThree: questionAnswers[2][1] }
      }
      else this.fields.map(val => this.$set(this.questionAnswersFormItems[val], 'options', this.securityQuestions))
    }
  },
  computed: {
    ...mapState('account', {
      securityQuestions: state => state.securityQuestions
    })
  }
}

<template>
  <div>
    <m-form
        :items="passwordFormItems"
        ref="dialogForm"/>
  </div>
</template>
<script>
// func: this.onSecurityQuestionsChange,
export default {
  data () {
    let formButton = { buttons: [ { add: 'add', text: '确定' }, 'cancel' ] },
      inputItem = { type: 'input', label: '答案', placeholder: '请输入你的答案，控制在10个字符以内',
        rules: ['required'], clearable: true, maxlength: 10 },
      selectItem = { type: 'select', props: { label: 'name', value: 'id' },
        rules: ['required'], value: '' }
    return {
      passwordFormItems: Object.assign({}, {
        formConfigs: { labelWidth: '30%' },
        questionOne: Object.assign({}, selectItem, { label: '问题1' }),
        answerOne: inputItem,
        questionTwo: Object.assign({}, selectItem, { label: '问题2' }),
        answerTwo: inputItem,
        questionThree: Object.assign({}, selectItem, { label: '问题3' }),
        aneswrThree: inputItem
      }, formButton)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

import Vue from 'vue'

export default {
  update: (el, binding) => {
    const minlength = parseInt(binding.arg)
    const elInputWrapper = el.querySelector('.el-input')
    const elInput = elInputWrapper.querySelector('input')

    if (!elInput && !elInputWrapper) {
      return
    }

    Vue.nextTick(() => {
      elInputWrapper.style.width = elInput.value.length > minlength
        ? `${ elInput.value.length + 5 }em`
        : '13em'
    })
  }
}

import Vue from 'vue'
// import { on } from 'element-ui/src/utils/dom'
const isServer = Vue.prototype.$isServer
const on = (function() {
  if (!isServer && document.addEventListener) {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false)
      }
    }
  }
  else {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.attachEvent(`on${ event }`, handler)
      }
    }
  }
})()

const nodeList = []
const ctx = '@@clickoutsideContext'

let startClick, seed = 0

!Vue.prototype.$isServer && on(document, 'mousedown', e => (startClick = e))

!Vue.prototype.$isServer && on(document, 'mouseup', e => {
  nodeList.forEach(node => node[ctx].documentHandler(e, startClick))
})

function createDocumentHandler(el, binding, vnode) {
  return function(mouseup = {}, mousedown = {}) {
    if (!vnode ||
      !vnode.context ||
      !mouseup.target ||
      !mousedown.target ||
      el.contains(mouseup.target) ||
      el.contains(mousedown.target) ||
      (el[ctx].ignoreEle && el[ctx].ignoreEle.length &&
        (el[ctx].ignoreEle[0].contains(mouseup.target) ||
          el[ctx].ignoreEle[0].contains(mousedown.target) ||
          el[ctx].ignoreEle[0] === mouseup.target)) ||
      el === mouseup.target ||
      (vnode.context.popperElm &&
        (vnode.context.popperElm.contains(mouseup.target) ||
          vnode.context.popperElm.contains(mousedown.target)))) return

    if (binding.value.func &&
      el[ctx].methodName &&
      vnode.context[el[ctx].methodName]) {
      vnode.context[el[ctx].methodName](mouseup.target || mousedown.target)
    }
    else {
      el[ctx].bindingFn && el[ctx].bindingFn(mouseup.target || mousedown.target)
    }
  }
}

/**
 * v-clickoutside
 * @desc 点击元素外面才会触发的事件
 * @example
 * ```vue
 * <div v-element-clickoutside="handleClose">
 * ```
 */
export default {
  bind(el, binding, vnode, p) {
    nodeList.push(el)
    const id = seed++
    el[ctx] = {
      id,
      documentHandler: createDocumentHandler(el, binding, vnode),
      methodName: binding.value.func,
      bindingFn: binding.value.func
    }
  },

  update(el, binding, vnode) {
    el[ctx].documentHandler = createDocumentHandler(el, binding, vnode)
    el[ctx].methodName = binding.value.func
    el[ctx].bindingFn = binding.value.func
    binding.value.ignoreEle && (el[ctx].ignoreEle = document.querySelectorAll(binding.value.ignoreEle))
  },

  unbind(el) {
    let len = nodeList.length

    for (let i = 0; i < len; i++) {
      if (nodeList[i][ctx].id === el[ctx].id) {
        nodeList.splice(i, 1)
        break
      }
    }
    delete el[ctx]
  }
}

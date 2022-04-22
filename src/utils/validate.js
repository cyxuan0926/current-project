import dateFormate from '@/filters/modules/date'

import * as helper from './helper'

const isEmpty = (val) => {
  if ([undefined, null, ''].indexOf(val) > -1) {
    return true
  } else {
    return false
  }
}

export default {
  required: (rule, value, callback) => {
    const pattern = /^\s*(.*?)\s*$/

    if (isEmpty(value)) {
      callback(new Error(rule.message))
    } else if (typeof value === 'string' && isEmpty(value.replace(pattern, '$1'))) {
      callback(new Error(rule.message))
    } else if (Array.isArray(value) && !value.length) {
      callback(new Error(rule.message))
    } else {
      callback()
    }
  },

  // 和公共服务的正则统一
  phone: (_, value, callback) => {
    const pattern = /^[1][3456789][0-9]{9}$/

    if (value && (pattern.test(value))) {
      callback()
    } else {
      callback(new Error('手机号格式错误'))
    }
  },

  isFee: (_, value, callback) => {
    const feeReg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/

    if (!feeReg.test(value)) {
      callback(new Error('请输入大于0的数字,且最多保留两位小数'))
    } else {
      callback()
    }
  },

  isNumber: (_, value, callback) => {
    const reg = /^-?[1-9]\d*$/

    if (isEmpty(value)) {
      callback()
    } else if (!reg.test(value)) {
      callback(new Error('请输入整数'))
    } else {
      callback()
    }
  },

  noChinese: (_, value, callback) => {
    const pattern = /[\u4e00-\u9fa5]+/g

    if (isEmpty(value)) {
      callback()
      return
    }

    if (pattern.test(value)) {
      callback(new Error('请输入中文以外的字符'))
    } else {
      callback()
    }
  },

  numberRange: (rule, value, callback) => {
    const val = Number(value)

    if (isEmpty(value)) {
      callback()
      return
    }

    if (!isEmpty(rule.min) && !isEmpty(rule.max) && (val < rule.min || val > rule.max)) {
      callback(new Error(`请输入${ rule.min }-${ rule.max }之间的数字`))
    } else if (!isEmpty(rule.min) && isEmpty(rule.max) && val < rule.min) {
      callback(new Error(`请输入大于${ rule.min }的数字`))
    } else if (isEmpty(rule.min) && !isEmpty(rule.max) && val > rule.max) {
      callback(new Error(`请输入小于${ rule.max }的数字`))
    } else {
      callback()
    }
  },

  lengthRange: (rule, value, callback) => {
    if (!isEmpty(rule.min) && !isEmpty(rule.max) && (helper.trimString(value).length < rule.min || helper.trimString(value).length > rule.max)) {
      callback(new Error(rule['lengthRange'] || `请输入${ rule.min }到${ rule.max }个字符`))
    } else if (!isEmpty(rule.min) && isEmpty(rule.max) && helper.trimString(value).length < rule.min) {
      callback(new Error(rule['lengthRange'] || `请输入${ rule.min }以上个字符`))
    } else if (isEmpty(rule.min) && !isEmpty(rule.max) && helper.trimString(value).length > rule.max) {
      callback(new Error(rule['lengthRange'] || `请输入${ rule.max }以下个字符`))
    } else {
      callback()
    }
  },

  timeRange: (rule, value, callback) => { // 只比较时间先后, 设置时间列表时专用
    let minTime = ''
    const time = dateFormate.dateFormate(new Date(`1971-01-01 ${ value[0] }`), 'hh:mm')

    if (!value) {
      callback()
      return
    }

    if (rule.prev) {
      minTime = dateFormate.dateFormate(new Date(`1971-01-01 ${ rule.prev[1] }`), 'hh:mm')
    }

    if (time < minTime) {
      rule.flag[rule.prop] = false
      callback(new Error(`开始时间最早为${ rule.prev[1] }`))
    } else if (value[0] === value[1]) {
      rule.flag[rule.prop] = false
      callback(new Error('间隔时间过短'))
    } else if (value[1].indexOf('23:59') > -1) {
      rule.flag[rule.prop] = false
      callback()
    } else {
      rule.flag[rule.prop] = true
      callback()
    }
  },

  containerLetter: (_, value, callback) => {
    const pattern = /^(?=.*[A-Za-z])[a-zA-Z\d_.-]{0,100}$/

    if (isEmpty(value)) {
      callback(new Error('请填写用户名'))
    } else if (!pattern.test(value)) {
      callback(new Error('格式不对，用户名是含有长度为100以内、必须含有字母、不能含有汉字'))
    } else {
      callback()
    }
  },

  // (暂时)狱警账户管理-狱警号限制
  tempNumber: (_, value, callback) => {
    const pattern = /^[0-9]{1,10}$/

    if (isEmpty(value)) {
      callback()
      return
    } else if (!pattern.test(value)) {
      callback(new Error('格式不对，狱警号是10位以内的数字'))
    } else {
      callback()
    }
  },

  // 正整数
  isPositiveIntegers: (rule, value, callback) => {
    const reg = /^[1-9]\d*$/

    if (isEmpty(value)) {
      callback(new Error(rule.ownMessage))
    } else if (!reg.test(value)) {
      callback(new Error('请输入正整数'))
    } else {
      callback()
    }
  },

  // 正整数>0
  isPositiveNumber: (rule, value, callback) => {
    const reg = /^[1-9]\d*|0$/

    if (isEmpty(value)) {
      callback(new Error(rule.ownMessage))
    } else if (!reg.test(value)) {
      callback(new Error('请输入非负整数'))
    } else {
      callback()
    }
  },

  password(_, value, callback) {
    if (!/(?=.*[a-zA-Z])(?=.*\d)(?=.*[#_@!~%^&\\$\\+\\(\\)\\*])[a-zA-Z\d#_@!~%^&\\$\\+\\(\\)\\*]{8,16}/.test(value)) {
      callback(new Error('密码长度必须为8到16位，由数字、大小写字母、特殊字符组成'))
    } else {
      callback()
    }
  },

  isRepeatValidate: (rule, value, callback) => {
    if (!value) {
      callback()
    }

    if (rule.repeatArray && _.isArray(rule.repeatArray)) {
      const filterValue = rule.filterFun ? rule.filterFun(value) : value
      const exist = rule.repeatArray.find(item => _.isEqual(item[rule['valueKey']], filterValue))

      if (exist) {
        callback(new Error(rule.message))
      }

      callback()
    }

    callback()
  }
}

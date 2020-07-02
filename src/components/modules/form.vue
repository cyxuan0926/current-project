<template>
  <div class="yt-form">
    <el-form
      v-if="flag"
      ref="form"
      :label-position="items.formConfigs ? items.formConfigs.labelPosition : ''"
      :inline="items.formConfigs ? items.formConfigs.inline : false"
      :label-width="items.formConfigs ? items.formConfigs.labelWidth : ''"
      :model="fields"
      :rules="rules">
      <template v-for="(item, key) in items">
        <template v-if="dismiss.indexOf(key) < 0 && !item.slotName && key !== 'dissMissConfigs'">
          <form-item
            :ref="key"
            :key="key"
            :prop="key"
            :rule="item.rule"
            :item="item"
            :fields="fields"
            :select-change-event="selectChangeEvent"
            :radio-change-event="radioChangeEvent"
            :reset-field-value="resetFieldValue"
            @validateField="validateField" />
        </template>
        <template v-if="dismiss.indexOf(key) < 0 && item.slotName && key !== 'dissMissConfigs'">
          <el-form-item 
            :key="key"
            v-bind="item.attrs"
            v-on="item.events"
            :class="item.customClass">
              <slot :name="item.slotName" />
          </el-form-item>
        </template>
      </template>
      <slot />
    </el-form>
    <div
      v-if="items.buttons && Object.keys(items.buttons).length"
      class="button-box">
      <template v-for="(button, index) in items.buttons">
        <el-button
          v-if="button.attrs"
          :key="index"
          v-bind="button.attrs"
          v-on="button.events">{{ button.text }}</el-button>
        <el-button
          v-if="button === 'prev' || button.prev"
          :key="index"
          size="small"
          type="primary"
          @click="button.func && button.func() || onPrevClick">上一步</el-button>
        <el-button
          v-if="button === 'next' || button.next"
          :key="index"
          size="small"
          type="primary"
          @click="onSubmit">下一步</el-button>
        <el-button
          v-if="button === 'update' || button.update"
          :key="index"
          size="small"
          type="primary"
          :loading="button.update && button.update.loading"
          @click="onSubmit">更新</el-button>
        <el-button
          v-if="button === 'add' || button.add"
          :key="index"
          size="small"
          type="primary"
          :loading="button.add && button.add.loading"
          @click="onSubmit">{{ button.text || '新增'}}</el-button>
        <el-button
          v-if="button === 'cancel' || button.cancel"
          :key="index"
          size="small"
          @click="onCancel"
          :type="button.type || 'primary'">取消</el-button>  
        <el-button
          v-if="button === 'back'"
          :key="index"
          @click="onGoBack"
          size="small">返回</el-button>
      </template>
    </div>
  </div>
</template>

<script>
import formItem from './form-item'
import validator, { helper } from '@/utils'
import Monent from 'moment'
export default {
  components: { formItem },
  props: {
    items: {
      type: Object,
      default: () => ({})
    },
    values: {
      type: Object,
      default: () => ({})
    }
  },
  watch: {
    values: {
      handler: function(val) {
        this.fields = Object.assign({}, this.fields, val)
      },
      deep: true
    },
    items: {
      handler: function(val) {
        val && this.render()
      }
    }
  },
  data() {
    return {
      dismiss: ['buttons', 'formConfigs'],
      fields: {},
      rules: {},
      flag: false,
      destroyed: false
    }
  },
  created() {
    this.render()
  },
  beforeDestroy() {
    this.destroyed = true
  },
  methods: {
    onPrevClick(e) {
      this.$router.back()
    },
    onSubmit(e) {
      this.$refs.form.validate(valid => {
        if (valid) this.$emit('submit', helper.trimObject(this.fields))
      })
    },
    onCancel() {
      this.$refs.form.resetFields()
      this.$emit('cancel')
    },
    onGoBack() {
      this.$emit('back')
    },
    handleResetField() {
      this.$refs.form.resetFields()
    },
    render() {
      let fields = {}
      this.dismiss = ['buttons', 'formConfigs']
      if (this.items.dissMissConfigs && Array.isArray(this.items.dissMissConfigs) && this.items.dissMissConfigs.length) this.dismiss = [...this.dismiss, ...this.items.dissMissConfigs]
      Object.keys(this.items).forEach(key => {
        if (this.dismiss.indexOf(key) >= 0 || key === 'dissMissConfigs' || this.items[key].slotName) return
        fields[key] = this.items[key].value
        this.initRules(this.items[key])
        this.items[key].rule && (this.rules[key] = this.items[key].rule)
        if (this.items[key].type === 'select') this.initSelect(this.items[key], key)
        if (this.items[key].type === 'date' && this.items[key].pickerOptions) this.initDate(this.items[key], this.items[key].pickerOptions)
      })
      this.fields = helper.isEmptyObject(this.values) ? Object.assign({}, this.values) : fields
      this.flag = true
    },
    validateField(e) {
      if (this.destroyed) return
      this.$refs.form.validateField(e)
    },
    async initSelect(item, key) {
      if (item.action && !item.defer) {
        item.loading = true
        const actionArgs = item.actionArgs || {}
        const action = item.namespaced ? `${item.namespaced}/${item.action}` : item.action
        const res = await this.$store.dispatch(action, actionArgs)
        if (!res) return
        this.$set(item, 'options', res.options)
        this.$set(item, 'props', { label: res.label, value: res.value })
        this.$set(item, 'loading', false)
      }
    },
    initRules(item) {
      if (!item.rules || !item.rules.length) return
      item.rules.forEach((rule, index) => {
        if (index === 0) item.rule = []
        item.rule.push(this.ruleSwitch(rule, item.label, item.type, item.ruleMessages))
      })
      delete item.rules
    },
    // 暂时就只初始化禁用日期
    initDate(item, pickerOptions) {
      let disabledDate
      if(pickerOptions.disabledDate && Object.prototype.toString.call(pickerOptions.disabledDate) === "[object Object]") {
        disabledDate = (time) => {
          if(pickerOptions.disabledDate.name === 'start') {
            if(this.fields[pickerOptions.disabledDate.prop]) return Monent(this.fields[pickerOptions.disabledDate.prop]).valueOf() < time.getTime()
          }
          if(pickerOptions.disabledDate.name === 'end') {
            if(this.fields[pickerOptions.disabledDate.prop]) return Monent(this.fields[pickerOptions.disabledDate.prop]).valueOf() > time.getTime()
          }
        }
        item['pickerOptions'] = { disabledDate }
      }
    },
    ruleSwitch(rule, label, type, ruleMessages) {
      if (rule.indexOf('numberRange') > -1 || rule.indexOf('lengthRange') > -1) {
        var range = rule.replace(/^numberRange|lengthRange/, '').split('-'), validate = {}
        if ([undefined, null, ''].indexOf(range[0]) < 0) validate.min = parseInt(range[0])
        if ([undefined, null, ''].indexOf(range[1]) < 0) validate.max = parseInt(range[1])
        return Object.assign({}, { validator: validator[rule.match(/^numberRange|lengthRange/)[0]] }, validate, ruleMessages)
      }
      let plea = ['input', 'editor', 'jaileditor', 'textarea'].indexOf(type) > -1 ? '请输入' : '请选择'
      switch (rule) {
        case 'required':
          return { message: `${ plea }${ label }`, required: true, validator: validator.required }
        case 'isNumber':
          return { validator: validator.isNumber }
        case 'isFee':
          return { validator: validator.isFee }
        case 'noChinese':
          return { validator: validator.noChinese }
        case 'phone':
          return { validator: validator.phone }
        case 'tempNumber':
          return { validator: validator.tempNumber }
        default:
          return {}
      }
    },
    resetFieldValue(...arg) {
      const [status, prop, { controlTheOther }] = arg
      if (!controlTheOther) return
      const fields = this.$refs.form.fields
      for(let [key, value] of Object.entries(this.items)) {
        if(value.disableDependingProp === prop) fields.map(field => field.prop === key && field.resetField())
      }
    },
    selectChangeEvent(e, prop, item) {
      const { controlProps } = item
      if (Array.isArray(controlProps)) {
        this.$nextTick(function() {
          controlProps.map(prop => {
            if (this.fields[prop]) this.$set(this.fields, prop, '')
          })
        })
      }
      item.func && item.func(e, prop, item)
    },
    radioChangeEvent(e, prop, item) {
      const { relativeProps } = item
      const props = [ prop, ...relativeProps ]
      this.dismiss = ['buttons', 'formConfigs']
      if (props && Array.isArray(props) && props.length) {
        props.forEach(propItem => {
          const item = this.items[propItem]
          const { configs } = item
          if (item && configs && Array.isArray(configs) && configs.length) {
            this.$nextTick(function() {
              configs.forEach(item => {
                if (this.fields[propItem] === item.value) {
                  if (item.value === 1 && !this.fields['onceMoney'] && propItem === 'chargeType') this.$set(this.fields, 'onceMoney', 0)
                  for (let [key, value] of Object.entries(item.itemConfigs)) {
                    this.dismiss.push(key)
                    if (this.items[key].func) this.items[key].func(e, prop, item)
                    else this.$set(this.fields, key, value)
                  }
                }
              })
            })
          }
        })
      }
    }
  }
}
</script>

<style lang="css" scoped>
.button-box{
  padding-bottom: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>

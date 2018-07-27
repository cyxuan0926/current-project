<template>
  <div class="yt-form">
    <el-form
      v-if="flag"
      ref="form"
      :inline="items.formConfigs ? items.formConfigs.inline : false"
      :label-width="items.formConfigs ?  items.formConfigs.labelWidth : ''"
      :model="fields"
      :rules="rules">
      <template v-for="(item, key) in items">
        <form-item
          v-if="dismiss.indexOf(key) < 0"
          :key="key"
          :prop="key"
          :item="item"
          :fields="fields"
          @validateField="validateField" />
      </template>
    </el-form>
    <div v-if="items.buttons && Object.keys(items.buttons).length" class="button-box">
      <template v-for="(button, index) in items.buttons">
        <el-button
          v-if="button === 'prev' || button.prev"
          :key="index"
          size="small"
          type="primary"
          @click="onPrevClick">上一步</el-button>
        <el-button
          v-if="button === 'next' || button.next"
          :key="index"
          size="small"
          type="primary"
          @click="onSubmit">下一步</el-button>
        <el-button
          v-if="button === 'update'"
          :key="index"
          size="small"
          type="primary"
          @click="onSubmit">更新</el-button>
        <el-button
          v-if="button === 'add'"
          :key="index"
          size="small"
          type="primary"
          @click="onSubmit">新增</el-button>
        <el-button
          v-if="button === 'back'"
          :key="index"
          size="small">返回</el-button>
      </template>
    </div>
  </div>
</template>

<script>
import formItem from './form-item'
import validator, { helper } from '@/utils'
export default {
  components: { formItem },
  props: {
    items: {
      type: Object
    },
    values: Object
  },
  watch: {
    values: {
      handler: function(val) {
        this.fields = Object.assign({}, this.fields, val)
      },
      deep: true
    },
    items: {
      handler: val => {
        // console.log('222222222', val)
      },
      deep: true
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
  mounted() {
    // console.log(8888, this.values)
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
        if (valid) {
          this.$emit('submit', helper.trimObject(this.fields))
        }
      })
    },
    render() {
      let fields = {}
      Object.keys(this.items).forEach(key => {
        if (this.dismiss.indexOf(key) >= 0) return
        fields[key] = this.items[key].value
        this.initRules(this.items[key])
        this.items[key].rule && (this.rules[key] = this.items[key].rule)
        if (this.items[key].type === 'select') this.initSelect(this.items[key], key)
      })
      this.fields = helper.isEmptyObject(this.values) ? Object.assign({}, this.values) : fields
      // console.log(333, this.fields)
      this.flag = true
    },
    validateField(e) {
      if (this.destroyed) return
      this.$refs.form.validateField(e)
    },
    initSelect(item, key) {
      if (item.action && !item.defer) {
        item.loading = true
        this.$store.dispatch(item.action).then(res => {
          if (!res) return
          item.options = res.options
          item.props = { label: res.label, value: res.value }
          item.loading = false
        })
      }
    },
    initRules(item) {
      if (!item.rules || !item.rules.length) return
      item.rules.forEach((rule, index) => {
        if (index === 0) item.rule = []
        item.rule.push(this.ruleSwitch(rule, item.label, item.type))
      })
      delete item.rules
    },
    ruleSwitch(rule, label, type) {
      if (rule.indexOf('numberRange') > -1 || rule.indexOf('lengthRange') > -1) {
        var range = rule.replace(/^numberRange|lengthRange/, '').split('-'), validate = {}
        if (range[0] !== '') validate.min = parseInt(range[0])
        if (range[1] !== '') validate.max = parseInt(range[1])
        return Object.assign({}, { validator: validator[rule.match(/^numberRange|lengthRange/)[0]] }, validate)
      }
      let plea = ['input', 'editor', 'jaileditor'].indexOf(type) > -1 ? '请输入' : '请选择'
      switch (rule) {
        case 'required':
          return { message: `${ plea }${ label }`, required: true, validator: validator.required }
        case 'isNumber':
          return { validator: validator.isNumber }
        case 'isFee':
          return { validator: validator.isFee }
        case 'noChinese':
          return { validator: validator.noChinese }
        default:
          return {}
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

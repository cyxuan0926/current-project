<template>
  <el-form-item
    :rules="(rule && rule.length) ? rule : (((item.disableDependingProp ? (item.dependingRelation ? !!fields[item.disableDependingProp] : !fields[item.disableDependingProp] ) : false) ? [] : item.changeRules))"
    :class="[(item.disableDependingProp ? (item.dependingRelation ? !!fields[item.disableDependingProp] : !fields[item.disableDependingProp] ) : false) ? 'unused-form__item' : '', (item.customClass ? item.customClass : '')]"
    :label="item.noLabel ? '' : item.label"
    :prop="prop">
    <slot :name="prop">
      <el-input
        v-if="(item.type === 'input' || item.type === 'textarea') && !item.isTrim"
        :type="item.type"
        :maxlength="item.maxlength"
        :clearable="item.clearable"
        :autosize="item.autosize"
        :show-word-limit="item.type === 'textarea' && item.showWordLimit"
        v-model="fields[prop]"
        :disabled="item.disabled || (item.disableDependingProp ? (item.dependingRelation ? !!fields[item.disableDependingProp] : !fields[item.disableDependingProp] ) : false)"  
        :placeholder="item.noPlaceholder ? '' : (item.placeholder || '请输入' + item.label)">
        <template
          v-if="item.append"
          slot="append">{{ item.append }}</template>
      </el-input>
      <el-input
        v-if="(item.type === 'input' || item.type === 'textarea') && item.isTrim"
        :type="item.type"
        :maxlength="item.maxlength"
        :clearable="item.clearable"
        :autosize="item.autosize"
        :show-word-limit="item.type === 'textarea' && item.showWordLimit"
        v-model.trim="fields[prop]"
        :disabled="item.disabled || (item.disableDependingProp ? (item.dependingRelation ? !!fields[item.disableDependingProp] : !fields[item.disableDependingProp] ) : false)"  
        :placeholder="item.noPlaceholder ? '' : (item.placeholder || '请输入' + item.label)">
        <template
          v-if="item.append"
          slot="append">{{ item.append }}</template>
      </el-input>
      <el-select
        v-if="item.type === 'select'"
        :placeholder="'请选择' + item.label"
        v-model="fields[prop]"
        :loading="item.loading"
        :filterable="!!(item.filterable)"
        :disabled="item.disabled"
        @change="selectChangeEvent($event, prop, item)">
        <el-option
          v-for="option in item.options"
          :key="item.props ? option[item.props.value] : option.value"
          :label="item.props && tem.props.label ? option[item.props.label] : option.label"
          :value="item.props && item.props.value ? option[item.props.value] : option.value"
        />
      </el-select>
      <el-radio-group
        v-if="item.type === 'radio'"
        v-model="fields[prop]"
        :disabled="item.disabled"
        @change="item.func ? item.func($event, prop, item) : radioChangeEvent($event, prop, item)"
      >
        <el-radio 
          v-for="option in item.options"
          :key="item.props ? option[item.props.value] : option.value"
          :label="item.props.label ? option[item.props.label] : option.label">
          {{ item.props.value ? option[item.props.value] : option.value }}
        </el-radio>
      </el-radio-group>
      <el-date-picker
        v-if="item.type === 'date'"
        v-model="fields[prop]"
        type="date"
        :disabled="item.disabled"
        value-format="yyyy-MM-dd"
        :picker-options="item.pickerOptions"
        :placeholder="'请选择' + item.label"/>
      <el-switch
        v-if="item.type === 'switch'"
        v-model="fields[prop]"
        active-color="#13ce66"
        inactive-color="#dddddd"
        :active-value="1"
        :inactive-value="0"
        :disabled="item.disabled"
        @change="(item.func && item.func($event, prop, item)) || resetFieldValue($event, prop, item) "
        :width="60" />
      <el-checkbox-group
        v-if="item.type === 'checkbox' || item.type === 'checkboxgroup'"
        v-model="fields[prop]">
        <el-checkbox
          v-for="box in item.group"
          :key="box.value"
          :label="box.value">{{ box.label }}</el-checkbox>
      </el-checkbox-group>
      <span
        v-if="item.type === 'switch' && item.tips && fields[prop]"
        style="margin-left: 10px; color: #999; vertical-align: middle;">{{ item.tips }}</span>
      <m-upload-img
        v-if="item.type === 'uploadImg'"
        v-model="fields[prop]"
        @success="onSuccess" />
      <m-upload-audio
        v-if="item.type === 'uploadAudio'"
        ref="audio"
        v-model="fields[prop]"
        @success="onSuccess" />
      <m-upload-video
        v-if="item.type === 'uploadVideo'"
        ref="video"
        v-model="fields[prop]"
        @success="onSuccess" />
      <!-- <m-quill-editor
        v-if="item.type === 'editor'"
        :contents="fields[prop]"
        @editorChange="editorChange" /> -->
      <m-tinymce
        v-if="item.type === 'jaileditor'"
        :value="fields[prop]"
        tools="allTools"
        @editorChange="tinymceChange" />
    </slot>
  </el-form-item>
</template>

<script>
// import { mapActions } from 'vuex'
// import isEmpty from 'lodash/isEmpty'

export default {
  name: 'MFormItem',

  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    prop: {
      type: String,
      default: ''
    },
    fields: {
      type: Object,
      default: () => ({})
    },
    rule: {
      type: Array,
      default: () => []
    },
    'reset-field-value': {
      type: Function,
      default: () => () => {}
    },
    'select-change-event': {
      type: Function,
      default: () => () => {}
    },
    'radio-change-event': {
      type: Function,
      default: () => () => {}
    },

    'set-field-value': {
      type: Function,
      default: () => () => {}
    }
  },
  methods: {
    // editorChange(contents, text) {
    //   this.fields[this.prop] = contents
    //   this.$emit('validateField', this.prop)
    // },
    // 简单判断下是否是非空
    // isEmpty(input) {
    //   return isEmpty(input)
    // },

    tinymceChange(contents, text, content) {
      if (!content) {
        this.fields[this.prop] = ''
        if (this.item.summary) this.fields[this.item.summary] = ''
      }
      else {
        let pattern = /src="(\.\.\/)+(image-server\/avatars)/g, c = contents.replace(pattern, `src="${ this.$urls.imageUrl }`)
        this.fields[this.prop] = c
        if (this.item.summary) this.fields[this.item.summary] = text
      }
      this.$emit('validateField', this.prop)
    },
    onSuccess(e) {
      this.fields[this.prop] = e
      this.$emit('validateField', this.prop)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form-item.el-form__notFull {
  /deep/ .el-form-item__content {
    width: 35%;
  }
}
</style>

<template>
  <el-form-item
    v-if="!item.miss"
    :rules="(rule && rule.length) ? rule : (((item.disableDependingProp ? (item.dependingRelation ? !!fields[item.disableDependingProp] : !fields[item.disableDependingProp] ) : false) ? [] : item.changeRules))"
    :class="[(item.disableDependingProp ? (item.dependingRelation ? !!fields[item.disableDependingProp] : !fields[item.disableDependingProp] ) : false) ? 'unused-form__item' : '', (item.customClass ? item.customClass : '')]"
    :label="item.noLabel ? '' : item.label"
    :prop="prop"
  >
    <slot :name="prop">
      <template v-if="$_elInputTypes.includes(item.type) && !item.isTrim">
        <el-input
          v-model="fields[prop]"
          :ref="prop + item.type"
          :type="item.type"
          :rows="item.rows"
          :maxlength="item.maxlength"
          :clearable="item.clearable"
          :autosize="item.autosize"
          :show-word-limit="item.type === 'textarea' && item.showWordLimit"
          :disabled="item.disabled || (item.disableDependingProp ? (item.dependingRelation ? !!fields[item.disableDependingProp] : !fields[item.disableDependingProp] ) : false)"  
          :placeholder="item.noPlaceholder ? '' : (item.placeholder || '请输入' + item.label)"
          :onKeypress="item.keypress"
          v-bind="item.attrs || {}"
          v-on="item.events || {}"
        >
          <template v-if="item.append" #append>{{ item.append }}</template>
        </el-input>
      </template>

      <template v-if="$_elInputTypes.includes(item.type) && item.isTrim">
        <el-input
          v-model.trim="fields[prop]"
          :ref="prop + item.type"
          :type="item.type"
          :maxlength="item.maxlength"
          :clearable="item.clearable"
          :autosize="item.autosize"
          :show-word-limit="item.type === 'textarea' && item.showWordLimit"
          :disabled="item.disabled || (item.disableDependingProp ? (item.dependingRelation ? !!fields[item.disableDependingProp] : !fields[item.disableDependingProp] ) : false)"  
          :placeholder="item.noPlaceholder ? '' : (item.placeholder || '请输入' + item.label)"
          v-bind="item.attrs || {}"
          v-on="item.events || {}"
        >
          <template v-if="item.append" #append>{{ item.append }}</template>
        </el-input>
      </template>

      <template v-if="item.type === 'select'">
        <el-select
          v-model="fields[prop]"
          :ref="prop + item.type"
          :placeholder="item.placeholder || '请选择' + item.label"
          :loading="item.loading"
          :filterable="!!item.filterable"
          :disabled="item.disabled"
          :collapse-tags="!!item.collapseTags"
          :multiple="!!item.multiple"
          @change="selectChangeEvent($event, prop, item)"
        >
          <template v-for="option in item.options">
            <el-option
              :key="item.props ? option[item.props.value] : option.value"
              :label="item.props && item.props.label ? option[item.props.label] : option.label"
              :value="item.props && item.props.value ? option[item.props.value] : option.value"
            />
          </template>
        </el-select>
      </template>

      <template v-if="item.type === 'radio'">
        <el-radio-group
          v-model="fields[prop]"
          :ref="prop + item.type"
          :disabled="item.disabled"
          @change="item.func ? item.func($event, prop, item) : radioChangeEvent($event, prop, item)"
        >
          <template v-for="option in item.options">
            <el-radio 
              :key="item.props ? option[item.props.value] : option.value"
              :label="item.props.label ? option[item.props.label] : option.label"
            >{{ item.props.value ? option[item.props.value] : option.value }}</el-radio>
          </template>
        </el-radio-group>
      </template>

      <template v-if="item.type === 'date'">
        <el-date-picker
          v-model="fields[prop]"
          :ref="prop + item.type"
          type="date"
          :disabled="item.disabled"
          value-format="yyyy-MM-dd"
          :picker-options="item.pickerOptions"
          :placeholder="'请选择' + item.label"
        />
      </template>

      <template v-if="item.type === 'switch'">
        <el-switch
          v-model="fields[prop]"
          :ref="prop"
          active-color="#13ce66"
          inactive-color="#dddddd"
          :active-value="1"
          :inactive-value="0"
          :disabled="item.disabled"
          @change="(item.func && item.func($event, prop, item)) || resetFieldValue($event, prop, item) "
          :width="60"
        />
      </template>

      <template v-if="item.type === 'checkbox' || item.type === 'checkboxgroup'">
        <el-checkbox-group
          v-model="fields[prop]"
          :ref="prop + item.type"
          v-bind="item.attrs || {}"
          v-on="item.events || {}"
        >
          <template v-for="box in item.group">
            <el-checkbox
              :key="box.value"
              :label="box.value"
              v-bind="box.attrs || {}"
              v-on="box.events || {}"
            >{{ box.label }}</el-checkbox>
          </template>
        </el-checkbox-group>
      </template>

      <template v-if="item.type === 'switch' && item.tips && fields[prop]">
        <span style="margin-left: 10px; color: #999; vertical-align: middle;">{{ item.tips }}</span>
      </template>

      <template v-if="item.type === 'uploadImg'">
        <m-upload-img v-model="fields[prop]" @success="onSuccess" />
      </template>

      <template v-if="item.type === 'uploadAudio'">
        <m-upload-audio
          v-model="fields[prop]"
          ref="audio"
          @success="onSuccess"
        />
      </template>

      <template v-if="item.type === 'uploadVideo'">
        <m-upload-video
          v-model="fields[prop]"
          ref="video"
          @success="onSuccess"
        />
      </template>
      <!-- <m-quill-editor
        v-if="item.type === 'editor'"
        :contents="fields[prop]"
        @editorChange="editorChange" /> -->
      <template v-if="item.type === 'jaileditor'">
        <m-tinymce
          :value="fields[prop]"
          tools="allTools"
          @editorChange="tinymceChange"
        />
      </template>
    </slot>
  </el-form-item>
</template>

<script>
// import { mapActions } from 'vuex'

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
    //   return _.isEmpty(input)
    // },
    tinymceChange(contents, text, content) {
      if (!content) {
        this.fields[this.prop] = ''
        if (this.item.summary) {
          this.fields[this.item.summary] = ''
        }
      }
      else {
        let pattern = /src="(\.\.\/)+(image-server\/avatars)/g, c = contents.replace(pattern, `src="${ this.$urls.imageUrl }`)
        this.fields[this.prop] = c
        if (this.item.summary) {
          this.fields[this.item.summary] = text
        }
      }

      this.$emit('validateField', this.prop)
    },

    onSuccess(e) {
      this.fields[this.prop] = e
      this.$emit('validateField', this.prop)
    },

    handleFormItemMethods(prop, method) {
      const ref = prop + this.item.type

      switch(method) {
        case 'focus':
          this.$refs[ref].focus()
          break;
        case 'blur':
          this.$refs[ref].blur()
          break;
        default:
          break;
      }
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

<template>
  <el-form-item
    :label="item.label"
    :prop="prop">
    <el-input
      v-if="item.type === 'input' || item.type === 'textarea'"
      :type="item.type"
      :autosize="item.autosize"
      v-model="fields[prop]"
      :disabled="item.disabled"
      :placeholder="'请输入' + item.label">
      <template v-if="item.append" slot="append">{{ item.append }}</template>
    </el-input>
      <!-- <template v-if="item.type === 'select'">{{ item }}</template> -->
    <el-select
      v-if="item.type === 'select'"
      :placeholder="'请选择' + item.label"
      v-model="fields[prop]"
      :loading="item.loading"
      filterable
      :disabled="item.disabled"
      @change="item.func ? item.func($event, prop) : onSelectChange($event, prop)">
      <el-option
        v-for="(option) in item.options"
        :key="item.props ? option[item.props.value] : option.value"
        :label="item.props.label ? option[item.props.label] : option.label"
        :value="item.props.value ? option[item.props.value] : option.value"/>
    </el-select>
    <el-switch
      v-if="item.type === 'switch'"
      v-model="fields[prop]"
      active-color="#13ce66"
      inactive-color="#dddddd"
      :active-value="1"
      :inactive-value="0"
      :disabled="item.disabled"
      :width="60" />
    <m-upload-img
      v-if="item.type === 'uploadImg'"
      v-model="fields[prop]"
      @success="onSuccess" />
    <m-quill-editor
      v-if="item.type === 'editor'"
      :contents="fields[prop]"
      @editorChange="editorChange" />
    <m-tinymce
      v-if="item.type === 'jaileditor'"
      :value="fields[prop]"
      @editorChange="tinymceChange" />
  </el-form-item>
</template>

<script>
// import { mapActions } from 'vuex'
export default {
  props: {
    item: Object,
    prop: String,
    fields: Object
  },
  data() {
    return {
      // getting: true
      // options: {}
    }
  },
  // watch
  mounted() {
    // console.log(this.item, this.prop, this.fields)
  },
  methods: {
    // ...mapActions({ this.item.action }),
    onSelectChange(e, prop) {
      // this.fields[prop] = e
      // if (this.item.rely)
    },
    editorChange(contents, text) {
      this.fields[this.prop] = contents
      this.$emit('validateField', this.prop)
    },
    tinymceChange(contents, text, content) {
      if (!content) this.fields[this.prop] = ''
      else this.fields[this.prop] = contents
      this.$emit('validateField', this.prop)
    },
    onSuccess(e) {
      this.fields[this.prop] = e
      this.$emit('validateField', this.prop)
    }
  }
}
</script>

<style lang="css">
</style>

export default {
  inheritAttrs: false,

  data() {
    return {
      $_attrs: {},
      $_listeners: {}
    }
  },

  watch: {
    // Work around unwanted re-renders: https://github.com/vuejs/vue/issues/10115
    // Make sure to use `v-bind="$data.$_attrs"` instead of `v-bind="$attrs"`
    $attrs: {
      immediate: true,
      handler(val) {
        Object.keys(val).forEach(k => {
          this.$set(this.$data.$_attrs, k, val[k])
        })
      }
    },

    $listeners: {
      immediate: true,
      handler(val) {
        Object.keys(val).forEach(k => {
          this.$set(this.$data.$_listeners, k, val[k])
        })
      }
    }
  }
}

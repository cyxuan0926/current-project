<template>
  <div :id="id" :style="{ width, height }"></div>
</template>

<script>
import echarts from 'echarts'
import isPlainObject from 'lodash/isPlainObject'

export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },

    options: {
      type: Object,
      default: () => ({})
    },

    width: {
      type: String,
      default: 'auto'
    },

    height: {
      type: String,
      default: '300px'
    }
  },

  data() {
    return {
      id: 'chart-' + Date.now(),
      instance: null
    }
  },

  watch: {
    loading(val) {
      if (!val) {
        this.instance.hideLoading()
      }
    },

    options: {
      deep: true,
      handler(val) {
        if (isPlainObject(val)) {
          this.instance.setOption(val)
        }
      }
    }
  },

  mounted() {
    this.init()
  },

  beforeDestroy() {
    this.instance.dispose()
    this.instance = null
  },

  methods: {
    init() {
      this.instance = echarts.init(document.getElementById(this.id))
      this.instance.setOption(this.options)

      if (this.loading) {
        this.instance.showLoading()
      }
    }
  }
}
</script>
<template>
  <div v-show="visible" :id="id" :style="{ width, height }"></div>
</template>

<script>
import echarts from 'echarts'
import isPlainObject from 'lodash/isPlainObject'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },

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
      if (val) {
        this.instance.showLoading()
      } else {
        this.instance.hideLoading()
      }
    },

    visible(val) {
      if (val) {
        this.$nextTick(() => this.instance.resize())
      }
    },

    options: {
      deep: true,
      handler(val) {
        if (isPlainObject(val)) {
          this.instance.setOption(val, true)
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
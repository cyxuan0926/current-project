<template>
  <div
    class="m-charts"
    v-show="visible"
    :id="id"
    :style="{ width, height }"
  >
  </div>
</template>

<script>
import { mapState } from 'vuex'
import echarts from 'echarts'
import isPlainObject from 'lodash/isPlainObject'
import debounce from 'lodash/debounce'

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
      default: '100%'
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

  computed: {
    ...mapState({
      isCollapsed: state => state.layout.isCollapsed
    })
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

    isCollapsed(val) {
      // 左侧菜单动画完成之后再调用 resize 方法，获取新的宽、高
      setTimeout(() => {
        this.resizeHandler()
      }, 500)
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

      window.addEventListener('resize', debounce(this.resizeHandler, 300))
    },

    resizeHandler() {
      this.instance.resize()
    }
  }
}
</script>
<template>
  <div style="position: relative">
    <div
      class="m-charts"
      v-show="visible"
      :id="id"
      :style="{ width, height }"
    >
  </div>
    <div v-if="cnt" class="legend" >

    <ul>

      <li v-for="(item,index) in pienum" :key="index" > <span>&nbsp;&nbsp;{{item.value}}</span>(次)  </li>
      <li style="font-size:14px;color: #0f0f0f;"> 总次数合计 <span>&nbsp;&nbsp;{{  cnt }}</span>（次） </li>

    </ul>
    </div>
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
    cnt:{
      type:Number,
      default:0
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
      instance: null,
      resizeHandler: function(){}
    }
  },

  computed: {
    ...mapState({
      isCollapsed: state => state.layout.isCollapsed
    }),
    pienum(){
      let arr=this.options.series[0].data

      return arr
    },
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
    this.instance.on('legendselectchanged', ({selected,name}) => {
      selected[name] = true
      this.instance.setOption({ legend:  {selected}})
    })
    var option =  this.instance.getOption()
  },
  beforeDestroy() {
    this.instance.dispose()
    this.instance = null
    window.removeEventListener('resize', this.resizeHandler)
  },


  methods: {
    init() {
      this.instance = echarts.init(document.getElementById(this.id))
      this.instance.setOption(this.options)
      this.resizeHandler = debounce(this.resize, 300)

      if (this.loading) {
        this.instance.showLoading()
      }

      window.addEventListener('resize', this.resizeHandler)
    },
    resize() {
      this.instance && this.instance.resize()
    }
  }
}
</script>
<style scoped>
  .legend{
    position: absolute;
    width: 177px;
    height: 157px;
    right: 145px;
    top: 46px;
    text-align: right;
    font-size: 12px;
    z-index: 10;
    pointer-events:none;
  }
  li{
    height: 24px;
  }
  span{
    color: rgb(0, 82, 204);
  }
</style>

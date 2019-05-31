<template>
  <img
    :src="url+'?token=' + $urls.token"
    @click="showImg"
    :alt="title">
</template>

<script>
import Viewer from 'viewerjs'
export default {
  props: {
    url: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  methods: {
    showImg() {
      return new Viewer(this.$el.parentNode, {
        title: false,
        navbar: false,
        zIndex: 100000000,
        // 工具条配置
        toolbar: {
          zoomIn: 1,
          zoomOut: 1,
          oneToOne: 1,
          reset: 1,
          prev: 0,
          next: 0,
          play: 1,
          rotateLeft: 1,
          rotateRight: 1,
          flipHorizontal: 1,
          flipVertical: 1
        },
        hidden: function() {
          this.viewer.destroy()
        },
        url: `${ this.url }?token=${ this.$urls.token }`
      });
    }
  }
}
</script>

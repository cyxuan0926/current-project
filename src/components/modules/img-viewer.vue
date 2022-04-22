<template>
  <!-- <div> -->
  <!-- <p v-if="label">{{title}}</p> -->
  <el-image
    :src="url || joinUrl + `?token=${ this.$urls.token }`"
    :fit="fit"
    :alt="title"
    :lazy="isLazy"
    class="img-viewer__overflow-unset"
    @click.native="showImg"
  >
    <!-- <template v-if="!isRequired" #error>
      <img
        :src="elImageError"
        alt="占位图"
      >
    </template> -->
  </el-image>
  <!-- </div> -->
</template>
<script>
import Viewer from 'viewerjs'

// import elImageError from '@/assets/images/el-image__error.png'

export default {
  // data() {
  //   return {
  //     elImageError
  //   }
  // },

  props: {
    // 公共服务公有类型的图片或者不需要拼接token处理的图片
    url: {
      type: String,
      default: ''
    },

    // label:{
    //   type: Boolean,
    //   default: false
    // },
    title: {
      type: String,
      default: ''
    },

    // 狱务通的图片 需要拼接 node的token
    joinUrl: {
      type: String,
      default: ''
    },

    // 工具条
    toolbar: {
      type: Object,
      default: () => ({})
    },

    // 是否懒加载图片
    isLazy: {
      type: Boolean,
      default: true
    },

    fit: {
      type: String,
      default: 'fill'
    }
    // 图片类型是不是必传的
    // isRequired: {
    //   type: Boolean,
    //   default: false
    // }
  },

  methods: {
    showImg() {
      const commonToolbar = {
        zoomIn: 1,
        zoomOut: 1,
        oneToOne: 1,
        reset: 1,
        prev: 0,
        play: 1,
        next: 0,
        rotateLeft: 1,
        rotateRight: 1,
        flipHorizontal: 1,
        flipVertical: 1
      }
      const toolbar = Object.assign({}, commonToolbar, this.toolbar)

      return new Viewer(this.$el.parentNode, {
        title: false,
        navbar: false,
        zIndex: 100000000,
        // 工具条配置
        toolbar,
        hidden: function() {
          this.viewer.destroy()
        },
        url: this.url || `${ this.joinUrl }?token=${ this.$urls.token }`
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.el-image {
  /deep/ img {
    box-shadow: none !important;
  }
}
</style>

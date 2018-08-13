<template>
    <img :src="url" @click="showImg">
</template>

<script>
import Viewer from 'viewerjs'
export default {
  data() {
    return {
    }
  },
  props: {
    url: {
      type: String,
      default: ''
    }
  },
  methods: {
    showImg() {
      return new Viewer(this.$el.parentNode, {
        title: false,
        navbar: false,
        url: this.url
      })
    }
  }
}
</script>



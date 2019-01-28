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
        url: `${ this.url }?token=${ this.$urls.token }`
      })
    }
  }
}
</script>

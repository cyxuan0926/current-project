<template>
    <img :src="url+`?token=${token}`" @click="showImg" :alt="title">
</template>

<script>
import Viewer from 'viewerjs'
export default {
  data() {
    return {
      token: '523b87c4419da5f9186dbe8aa90f37a3876b95e448fe2a'
    }
  },
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
        url: `${ this.url }?token=${ this.token }`
      })
    }
  }
}
</script>



<template>
  <router-view/>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  mounted() {
    if (localStorage.getItem('user')) {
      if (JSON.parse(localStorage.getItem('user')).role === '1') {
        this.getWebsocketResult(JSON.parse(localStorage.getItem('user')).jailId)
      }
    }
  },
  methods: {
    ...mapActions(['getWebsocketResult'])
  }
}
</script>

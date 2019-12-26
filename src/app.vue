<template>
  <router-view/>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  mounted() {
    if (localStorage.getItem('user')) {
      const role = JSON.parse(localStorage.getItem('user')).role

      if ([1, -1].includes(parseInt(role))) {
        this.getWebsocketResult(JSON.parse(localStorage.getItem('user')).jailId)
      }
    }
  },
  methods: {
    ...mapActions(['getWebsocketResult'])
  }
}
</script>

<template>
  <gdAdmin v-if="isGdadmin" />
  <p v-else>欢迎来到狱务通管理平台</p>
</template>
<script>
  import gdAdmin from '@/views/gd-admin/index.vue'
  export default {
    components: {
      gdAdmin
    },
    computed: {
      isGdadmin() {
        return this.$store.state.account.accountInfo.role == '广东省管理员'
      }
    }
  }
</script>
<style lang="scss" scoped>
p{
  text-align: center;
  line-height: 50px;
  margin-top: 100px;
  font-size: 24px;
}
</style>

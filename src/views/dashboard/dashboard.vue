<template>
  <gdAdmin v-if="!!chartRole" :mapData="chartRole" />
  <p v-else>欢迎来到国科服务管理平台</p>
</template>
<script>
  import gdAdmin from '@/views/gd-admin/index.vue'
  import { mapGetters } from 'vuex'
  export default {
    components: {
      gdAdmin
    },
    computed: {
      ...mapGetters(['chartRole'])
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

<template>
  <div class="layout">
    <the-header v-if="!$route.meta.notLogin" />
    <!--页面侧边栏-->
    <the-aside v-if="!$route.meta.notLogin" />
    <div
      class="content-wrapper"
      :class="{'content-wrapper-login':$route.meta.notLogin}"
      :style="'min-height:' + wrapperHeight">
      <!--页面内容-->
      <section
        class="content"
        :class="{'content-not-login':!$route.meta.notLogin}"
        v-loading="loading"
        element-loading-background="rgba(255, 255, 255, 0.5)">
        <the-breadcrumb v-if="!$route.meta.notLogin" />
        <transition
          name="router-fade"
          mode="out-in">
          <router-view />
        </transition>
      </section>
    </div>
    <the-footer v-if="!$route.meta.notLogin" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import TheHeader from './the-header'
import TheAside from './the-aside'
import TheFooter from './the-footer'
import TheBreadcrumb from './the-breadcrumb'

export default {
  components: {
    'the-header': TheHeader,
    'the-aside': TheAside,
    'the-footer': TheFooter,
    'the-breadcrumb': TheBreadcrumb
  },
  computed: {
    // 获取vuex数据
    ...mapGetters({
      loading: 'loading' // 获取是否显示遮罩层
    })
  },
  data() {
    return {
      wrapperHeight: ''
    }
  },
  mounted() {
    this.wrapperHeight = `${ parseInt(window.innerHeight) - 100 }px`
  },
  methods: {
  }
}
</script>

<style type="text/stylus" lang="stylus" scoped>
white = #fff
.content-wrapper
  &.content-wrapper-login
    margin-left: 0;
  .content
    padding: 0;
    > div
      background: white
  .content-not-login
    padding: 15px;
    padding-top: 0
.layout
  background: #222D32;
</style>

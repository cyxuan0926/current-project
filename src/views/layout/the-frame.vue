<template>
  <el-container :class="['height100', { 'no-login': $route.meta.notLogin }]">
    <el-header
      v-if="!$route.meta.notLogin"
      height="50px"><the-header /></el-header>
    <el-container class="main-container">
      <el-aside
        v-if="!$route.meta.notLogin"
        :width="isCollapsed ? (hidden ? '0px' : '50px') : '230px'"
        :class="['transition', { 'collapsed': isCollapsed }]">
        <the-sidebar />
      </el-aside>
      <el-container>
        <the-breadcrumb v-if="!$route.meta.notLogin" />
        <el-main
          v-loading="loading"
          element-loading-background="rgba(255, 255, 255, 0.5)">
          <transition
            name="router-fade"
            mode="out-in">
            <router-view />
          </transition>
        </el-main>
        <el-footer
          height="40px"><the-footer /></el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { mapState, mapActions } from 'Vuex'
import TheHeader from './the-header'
import TheSidebar from './the-aside'
import TheBreadcrumb from './the-breadcrumb'
import TheFooter from './the-footer'

export default {
  components: { TheHeader, TheSidebar, TheBreadcrumb, TheFooter },
  data() {
    return {
      hidden: false
    }
  },
  computed: {
    ...mapState({
      isCollapsed: state => state.layout.isCollapsed,
      loading: state => state.layout.loading
    })
  },
  mounted() {
    this.handleResize()
    window.onresize = () => {
      this.handleResize()
    }
  },
  methods: {
    ...mapActions(['handleCollapse']),
    handleResize() {
      if (window.innerWidth <= 768) {
        if (!this.hidden) {
          this.handleCollapse(true)
          this.hidden = true
        }
      }
      else {
        this.hidden = false
      }
    }
  },
  // watch: {
  //   '$route' (to, from) {
  //     console.log(to, from)
  //     let routes = localStorage.getItem('routes') && JSON.parse(localStorage.getItem('routes'))
  //     if (to.meta.hidden || (routes && routes.indexOf(to.matched[to.matched.length - 1].path) < 0)) this.$router.replace({ path: '/dashboard'})
  //   }
  // }
}
</script>
<style lang="scss" scoped>
@import "../../assets/css/no-login";
</style>
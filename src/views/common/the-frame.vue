<template>
  <el-container class="height100">
    <el-header height="50px"><the-header /></el-header>
    <el-container>
      <el-aside
        :width="isCollapsed ? '50px': '230px'"
        :class="['transition', { 'collapsed': isCollapsed }]">
        <the-sidebar />
      </el-aside>
      <el-container>
        <the-breadcrumb />
        <el-main>
          <transition
            name="router-fade"
            mode="out-in">
            <router-view />
          </transition>
        </el-main>
        <el-footer height="50px"><the-footer /></el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { mapState } from 'Vuex'
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
      isCollapsed: state => state.layout.isCollapsed
    })
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
// @import "../../assets/css/layout";
</style>

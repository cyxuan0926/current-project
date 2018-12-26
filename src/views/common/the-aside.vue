<template>
  <div class="aside-container">
    <div class="aside-top">
      <img
        src="/static/images/user2-160x160.jpg"
        class="avatar circle">
      <div class="info">
        <span
          class="bold ellipsis"
          v-if="Number(user.role)">{{ user.jailName }}</span>
        <div class="ellipsis">
          <span class="bold1">{{ user.role | role }}</span>
          <el-popover
            placement="bottom"
            width="260"
            trigger="hover"
            :disabled="prisonerAreas.length <= 1"
            :content="prisonerAreas.join('、')">
            <span
              class="bold1 ml-10"
              slot="reference">{{ prisonerAreas[0] }}</span>
          </el-popover>
        </div>
      </div>
    </div>
    <el-menu
      :default-active="$route.meta.deep ? getActiveMenu() : $route.path"
      background-color="#222d32"
      text-color="#b8c7ce"
      active-text-color="#fff"
      :collapse="isCollapsed"
      class="first-level"
      unique-opened
      @select="handleSelect">
      <template v-for="(item) in menu">
        <el-menu-item
          v-if="!item.children"
          class="border-bottom"
          :key="item.path"
          :index="item.path">
          <i :class="item.icon" />
          <span slot="title">{{ item.title }}</span>
        </el-menu-item>
        <el-submenu
          v-if="item.children"
          :class="[
            'border-bottom',
            { 'is-active': item.children.indexOf(r => r.path === $route.path) > -1 }
          ]"
          :key="item.path"
          :index="item.path">
          <template slot="title">
            <i :class="item.icon" />
            <span>{{ item.title }}</span>
          </template>
          <template v-for="second in item.children">
            <el-menu-item
              v-if="!second.hidden"
              :key="second.path"
              :index="second.path">{{ second.title }}</el-menu-item>
          </template>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import menu from './menu.js'

export default {
  data() {
    return {
      menu: [],
      prisonerAreas: [],
      collapsed: false
    }
  },
  computed: {
    ...mapState({
      user: state => state.user,
      isCollapsed: state => state.layout.isCollapsed
    })
  },
  watch: {
    isCollapsed(val) {
      console.log(val)
      if (val) {
        setTimeout(() => {
          this.collapsed = val
        }, 300)
      }
      else {
        this.collapsed = val
      }
    }
  },
  mounted() {
    if (this.user.prisonConfigList && this.user.prisonConfigList.length) {
      this.prisonerAreas = this.user.prisonConfigList.reduce((pre, cur) => {
        return pre.concat([cur.prisonConfigName])
      }, [])
    }
    this.menu = menu[Number(this.user.role)]
  },
  methods: {
    getActiveMenu() {
      let active = this.$route.path.replace(/(\/[A-z-]+)(\/[A-z-]+)*/, '$1')
      return active
    },
    handleSelect(e, keyPath) {
      this.$router.push(e)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../assets/css/layout";
</style>

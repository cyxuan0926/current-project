<template>
  <div class="aside-container">
    <div class="aside-top">
      <img
        src="/static/images/user2-160x160.jpg"
        class="avatar circle">
      <div class="info">
        <!-- v-if="Number(user.role)"  {{ user.role | role }}-->
        <span
          class="bold ellipsis"
          >{{ publicUserInfo.tenantName }}</span>
        <div class="ellipsis">
          <span
            class="bold1"
            v-if="user.role !== '-1'">{{ publicUserInfo.userRoles[0].roleName }}</span>
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
      <template v-for="(item) in menus">
        <el-menu-item
          v-if="!item.children.length"
          class="border-bottom"
          :popper-append-to-body="false"
          :key="item.path"
          :index="item.path">
          <i :class="['iconfont', `${item.icon}`]" />
          <span slot="title">{{ item.name }}</span>
        </el-menu-item>
        <el-submenu
          v-if="item.children.length"
          :class="[
            'border-bottom',
            'second-level',
          ]"
          :key="item.path"
          :index="item.path">
          <template slot="title">
            <i :class="['iconfont', `${item.icon}`]" />
            <span>{{ item.name }}</span>
          </template>
          <template v-for="second in item.children">
            <el-menu-item
              v-if="!second.hidden && !second.children.length"
              :key="second.path"
              :index="second.path">{{ second.name }}</el-menu-item>
            <el-submenu
              v-else
              :class="[
                'border-bottom',
                'third-level',
              ]"
              :key="second.path"
              :index="second.path">
              <template slot="title">
                <span>{{ second.name }}</span>
              </template>
              <template v-for="third in second.children">
                <el-menu-item
                  v-if="!third.hidden"
                  :key="third.path"
                  :index="third.path">
                  <!-- <i :class="third.icon" /> -->
                  {{ third.name }}
                </el-menu-item>
              </template>
            </el-submenu>
          </template>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { mapState } from 'vuex'
// import menu from './menu.js'

export default {
  data() {
    return {
      // menu: [],
      prisonerAreas: []
    }
  },
  computed: {
    ...mapState({
      user: state => state.global.user,
      isCollapsed: state => state.layout.isCollapsed,
      menus: state => state.account.menus,
      publicUserInfo: state => state.account.publicUserInfo
    })
  },
  mounted() {
    if (this.user.prisonConfigList && this.user.prisonConfigList.length) {
      this.prisonerAreas = this.user.prisonConfigList.reduce((pre, cur) => {
        return pre.concat([cur.prisonConfigName])
      }, [])
    }
    // this.menu = menu[Number(this.user.role)]
  },
  methods: {
    getActiveMenu() {
      let active
      if (this.$route.meta && this.$route.meta.activeMenu) {
        active = this.$route.meta.activeMenu
      }
      else {
        active = `${ this.$route.matched[0].path || this.$route.matched[1].path }/list`
      }
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

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
    <!-- $route.meta.deep ? getActiveMenu() : $route.path -->
    <el-menu
      id="aside"
      :default-active=" active "
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
          <i :class="[`${ item.icon && item.icon.startsWith('ywgk') ? 'ywgk-' : '' }iconfont`, `${item.icon}`]" />
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
            <i :class="[`${ item.icon && item.icon.startsWith('ywgk') ? 'ywgk-' : '' }iconfont`, `${item.icon}`]" />
            <span>{{ item.name }}</span>
          </template>
          <!-- !second.hidden && -->
          <template v-for="second in item.children">
            <el-menu-item
              v-if=" !second.children.length "
              :key="second.path"
              :index="second.path">{{ second.name }}
              </el-menu-item>    
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
                <!-- v-if="!third.hidden" -->
                <el-menu-item
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
import { helper } from '@/utils'

export default {
  data() {
    return {
      prisonerAreas: []
    }
  },
  computed: {
    ...mapState({
      user: state => state.global.user,
      isCollapsed: state => state.layout.isCollapsed,
      menus: state => state.account.menus,
      publicUserInfo: state => state.account.publicUserInfo
    }),
    active() {
      let val
      // 自我定义了激活菜单的情况
      if (this.$route.meta && this.$route.meta.activeMenu) val = this.$route.meta.activeMenu
      // 这是特殊情况 一个页面多个不同路由的tab页面
      else if (this.$route.matched[this.$route.matched.length - 1].path.includes('trade')) val = '/trade/account'
      // 通过重定向导航到子路由的情况
      else if (this.$route.redirectedFrom) val = this.$route.redirectedFrom
      // 重定向页面刷新情况
      else if (this.$route.matched[this.$route.matched.length - 2].redirect && this.$route.matched[this.$route.matched.length - 2].redirect.path) val = this.$route.matched[this.$route.matched.length - 2].path
      // 一些新增/编辑页面 active是list路径的 暂定为deep为true的情况
      else if (this.$route.meta && this.$route.meta.deep) val = `${this.$route.matched[0].path}/list`
      // 一些可能会出现的编辑页面
      else if (helper.isEmptyObject(this.$route.params)) {
        let temp = new Set(this.$route.matched[this.$route.matched.length - 1].path.split('/'))
        for (let key of Object.keys(this.$route.params)) temp.delete(`:${key}`)
        val = [...temp].join('/')
      }
      // 这就是普通情况
      else val = this.$route.matched[this.$route.matched.length - 1].path
      return val
    }
  },
  mounted() {
    if (this.user.prisonConfigList && this.user.prisonConfigList.length) {
      this.prisonerAreas = this.user.prisonConfigList.reduce((pre, cur) => {
        return pre.concat([cur.fullname])
      }, [])
    }
  },
  methods: {
    // getActiveMenu() {
    //   let active
    //   if (this.$route.meta && this.$route.meta.activeMenu) {
    //     active = this.$route.meta.activeMenu
    //   }
    //   else {
    //     active = `${ this.$route.matched[0].path || this.$route.matched[1].path }/list`
    //   }
    //   return active
    // },
    handleSelect(e, keyPath) {
      this.$router.push(e)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../assets/css/layout";
</style>

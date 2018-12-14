<template>
  <div>
    <div class="aside-top">
      <img
        src="/static/images/user2-160x160.jpg"
        class="avatar circle">
      <div class="info">
        <span
          class="bold"
          v-if="Number(user.role)">{{ user.jailName }}</span>
        <div>
          <span class="bold">{{ user.role | role }}</span>
          <el-popover
            v-if="user.prisonConfigList && user.prisonConfigList.length"
            placement="bottom"
            width="260"
            trigger="hover"
            :content="prisonerAreas.join('、')">
            <span
              class="bold"
              slot="reference">{{ prisonerAreas[0] }}</span>
          </el-popover>
        </div>
      </div>
    </div>
  </div>
  <!-- <aside
    id="main-sidebar"
    class="main-sidebar">
    <section
      class="sidebar"
      style="height: auto;">
      <div class="user-panel">
        <div class="pull-left image">
          <img
            src="../../../static/dist/img/user2-160x160.jpg"
            class="img-circle"
            alt="User Image">
        </div>
        <div class="pull-left info">
          <p v-if="Number(user.role)">{{ user.jailName }}</p>
          <p :class="{'super-role': !Number(user.role)}">
            <span>{{ user.role | role }}</span>
            <el-tooltip
              v-if="prisonerAreas.length"
              :disabled="prisonerAreas.length === 1"
              popper-class="prisonser_areas__popper"
              :content="prisonerAreas.join('、')"
              placement="bottom">
              <span style="margin-left: 5px">{{ prisonerAreas[0] }}</span>
            </el-tooltip>
          </p>
        </div>
      </div>
      <ul class="sidebar-menu">
        <li class="header">导航</li>
        <li
          v-for="(first, index) in menus[user.role]"
          :key="index">
          <template v-if="!first.children">
            <router-link :to="first.path">
              <i :class="first.icon"/>
              <span>{{ first.title }}</span>
            </router-link>
          </template>
          <template v-else>
            <a
              href="javascript:;"
              @click="onTreeMenuClick(first)">
              <i :class="first.icon"/>
              <span>{{ first.title }}</span>
              <i
                class="el-submenu__icon-arrow"
                :class="first.active ? 'el-icon-arrow-down' : 'el-icon-arrow-right'"/>
            </a>
            <ul class="treeview-menu">
              <li
                v-for="(second, order) in first.children"
                :key="order">
                <router-link :to="second.path"><i :class="second.icon"/>&nbsp;&nbsp;{{ second.title }}</router-link>
              </li>
            </ul>
          </template>
        </li>
      </ul>
    </section>
  </aside> -->
</template>

<script>
import { mapState } from 'vuex'
import menu from './menu.js'

export default {
  data() {
    return {
      menus: menu,
      prisonerAreas: []
    }
  },
  computed: {
    ...mapState(['user'])
  },
  mounted() {
    console.dir({ ...this.user })
    if (this.user.prisonConfigList && this.user.prisonConfigList.length) {
      this.prisonerAreas = []
    }
  },
  methods: {
    onTreeMenuClick(e) {
      this.menus[this.user.role].forEach(item => {
        if (e.path !== item.path) item.active = false
      })
      e.active = !e.active
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../assets/css/layout";
</style>

<template>
  <aside
    id="main-sidebar"
    class="main-sidebar">
    <!-- sidebar: style can be found in sidebar.less -->
    <section
      class="sidebar"
      style="height: auto;">
      <!-- Sidebar user panel -->
      <div class="user-panel">
        <div class="pull-left image">
          <img
            src="../../../static/dist/img/user2-160x160.jpg"
            class="img-circle"
            alt="User Image">
        </div>
        <div class="pull-left info">
          <p>{{ user.username }}</p>
          <p>
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
        <!--<a href="#" @click="$event.preventDefault()"><i class="fa fa-circle text-success"></i> 在线</a>-->
        </div>
      </div>
      <!-- /.search form -->
      <!-- sidebar menu: : style can be found in sidebar.less -->
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
          <template v-else><!-- first.active = !first.active -->
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
      <!--商品侧边栏-->
    </section>
    <!-- /.sidebar -->
  </aside>
</template>

<script>
import { mapState } from 'vuex'
import menu from './menu.js'

export default {
  data() {
    return {
      menus: menu
    }
  },
  computed: {
    ...mapState(['user']),
    prisonerAreas: vm => {
      let values = []
      if (vm.user && vm.user.prisonConfigList && vm.user.prisonConfigList.length) {
        for (let val of vm.user.prisonConfigList.values()) {
          values.push(val.prisonConfigName)
        }
      }
      return values
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

<style type="text/stylus" lang="stylus">
  #main-sidebar
    &.main-sidebar
      a
        font-size: 14px;
        line-height: 22px;
        display: flex;
        align-items: center;
        padding-left: 10px;
    .treeview-menu>li>a
      padding-left: 12px;
</style>

<template>
  <header
    id="main-header"
    class="main-header">
    <!-- Logo -->
    <a
      href="#"
      class="logo"
      @click="$event.preventDefault()">
      <!-- mini logo for sidebar mini 50x50 pixels -->
      <span class="logo-mini"><b>狱务</b></span>
      <!-- logo for regular state and mobile devices -->
      <span class="logo-lg"><b>狱务通</b>管理平台</span>
    </a>
    <!-- Header Navbar: style can be found in header.less -->
    <nav class="navbar navbar-static-top">
      <!-- Sidebar toggle button-->
      <a
        href="#"
        data-toggle="offcanvas"
        role="button"
        @click="$event.preventDefault()">
        <i class="iconfont icon-category" />
        <span class="sr-only">Toggle navigation</span>
      </a>
      <div class="navbar-custom-menu">
        <ul class="nav navbar-nav">
          <!-- User Account: style can be found in dropdown.less -->
          <li class="dropdown user user-menu">
            <a
              href="#"
              class="dropdown-toggle"
              data-toggle="dropdown">
              <img
                src="../../../static/dist/img/user2-160x160.jpg"
                class="user-image">
              <span class="hidden-xs">{{ user.username || user.jailName }}</span>
            </a>
            <ul class="dropdown-menu">
              <!-- Menu Footer-->
              <li/>
              <li class="user-footer">
                <div class="text-center">
                  <router-link
                    to="/password/edit"
                    class="pull-left">
                    <i class="iconfont icon-edit" />
                    修改用户密码
                  </router-link>
                </div>
              </li>
            </ul>
          </li>
          <!-- Control Sidebar Toggle Button -->
          <li>
            <a
              href="#"
              data-toggle="control-sidebar"
              @click="confirmExit($event)">
              <i class="iconfont icon-icon-logout" />
            </a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data() {
    return {}
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    ...mapActions(['logout', 'resetState']),
    confirmExit(e) {
      e.preventDefault()
      this.$confirm('是否退出登录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.logout().then(res => {
          if (!res) return
          console.log('logout')
          localStorage.removeItem('user')
          localStorage.removeItem('routes')
          this.$router.replace('/new-login')
          this.resetState('logout')
        })
      }).catch(() => {})
    }
  }
}
</script>

<style type="text/stylus" lang="stylus">
  #main-header
    .user-header
      height: 110px
    .navbar
      > a
        float: left
        height: 51px
        width: 46px
        text-align: center
        &:hover
          background: #367FA9
        i
          color: #ffffff
          font-size: 16px
          font-weight: bold
          line-height: 51px
      .nav
        .dropdown
          .dropdown-menu
            width: 0
          .user-footer
            padding: 5px 0 5px 0
            > div
              background: #F2F2F2
              height: 30px
              line-height: 30px
              a
                width: 100%
</style>

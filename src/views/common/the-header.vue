<template>
  <div class="header-container">
    <div
      :class="[
        'header-left',
        'transition',
        { 'collapsed': isCollapsed }]">
      <span class="bold">狱务通</span>管理平台
    </div>
    <div class="header-right">
      <i
        class="iconfont icon-category bold"
        @click="handleCollapse" />
      <div>
        <el-dropdown
          trigger="click"
          @command="onClick">
          <div class="item">
            <img
              src="/static/images/user2-160x160.jpg"
              class="avatar circle">
            <span class="hidden-xs-only">{{ user.username }}</span>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="{ path: '/password/edit' }">修改用户密码</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <i
          class="iconfont icon-tuichu"
          @click="handleLogout" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      isCollapsed: state => state.layout.isCollapsed,
      user: state => state.global.user
    })
  },
  methods: {
    ...mapActions(['handleCollapse', 'logout', 'resetState']),
    onClick(e) {
      this.$router.push(e)
    },
    handleLogout() {
      this.$confirm('是否退出登录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.logout().then(res => {
          if (!res) return
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
<style lang="scss" scoped>
@import "../../assets/css/layout";
</style>

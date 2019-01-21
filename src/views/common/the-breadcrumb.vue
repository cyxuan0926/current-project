<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>
    <el-breadcrumb-item
      v-for="(item, index) in breadcrumb"
      :key="index">{{ item.name }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  data() {
    return {
      breadcrumb: []
    }
  },
  watch: {
    $route(to) {
      this.render(to)
    }
  },
  mounted() {
    this.render(this.$route)
  },
  methods: {
    render(route) {
      let breadcrumb = [], getBreadcrumb = (route, arr) => {
        if (!route || !route.name) return
        arr.push({ name: route.name, path: route.path })
        getBreadcrumb(route.parent, arr)
      }
      getBreadcrumb(route.matched[route.matched.length - 1], breadcrumb)
      this.breadcrumb = breadcrumb.reverse()
    }
  }
}
</script>

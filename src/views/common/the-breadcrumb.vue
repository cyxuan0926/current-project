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
      if (!route || !route.path) return
      let breadcrumb = [], getBreadcrumb = (rt, arr) => {
        if (!rt || !rt.name) return
        arr.push({ name: rt.name, path: rt.path })
        getBreadcrumb(rt.parent, arr)
      }
      getBreadcrumb(route.matched[route.matched.length - 1], breadcrumb)
      this.breadcrumb = breadcrumb.reverse()
    }
  }
}
</script>

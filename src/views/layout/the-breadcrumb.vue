<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/dashboard' }">主页</el-breadcrumb-item>

    <template v-for="(item, index) in breadcrumb">
      <el-breadcrumb-item :key="index">{{ item.name }}</el-breadcrumb-item>
    </template>
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
      if (!route || !route.path) {
        return
      }

      let breadcrumb = [], getBreadcrumb = (rt, arr) => {
        if (!rt) {
          return
        }
        if (rt.meta.breadcrumbName) {
          arr.push({ name: rt.meta.breadcrumbName, path: rt.path })
        }

        getBreadcrumb(rt.parent, arr)
      }

      getBreadcrumb(route.matched[route.matched.length - 1], breadcrumb)

      this.breadcrumb = breadcrumb.reverse()
    }
  }
}
</script>

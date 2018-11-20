<template>
  <ol class="breadcrumb">
    <li
      v-for="bc in breadcrumbs"
      :key="bc">
      <a
        href="#"
        @click="$event.preventDefault()">
        {{ bc }}
      </a>
    </li>
  </ol>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState(['breadcrumbs'])
  },
  watch: {
    $route(to) { // 监听路由变化
      this.update(to.matched)
      let breadcrumbs = ['主页']
      to.matched.map(item => {
        if (item.name.match(/[1-9]/g)) return
        breadcrumbs.push(item.name)
      })
      this.updateBreadcrumbs(breadcrumbs)
    }
  },
  mounted() {
    this.update(this.$route.matched)
    let breadcrumbs = ['主页']
    this.$route.matched.map(item => {
      if (item.name.match(/[1-9]/g)) return
      breadcrumbs.push(item.name)
    })
    this.updateBreadcrumbs(breadcrumbs)
  },
  methods: {
    ...mapActions(['updateBreadcrumbs']),
    update(e) {
      // let breadcrumbs = ['主页']
      // e.map(item => {
      //   if (item.name.match(/[1-9]/g)) return
      //   breadcrumbs.push({ name: item.name, path: item.path })
      // })
      // this.updateBreadcrumbs(breadcrumbs)
      // console.log(breadcrumbs)
    }
  }
}
</script>

<style lang="css">
.breadcrumb {
  background: transparent;
  margin-bottom: 0;
  padding: 15px;
}
.breadcrumb> li + li::before{
  content: "\E604";
  font-family: element-icons!important;
}
.breadcrumb > li > a{
  color: #444;
  font-size: 12px;
}
</style>

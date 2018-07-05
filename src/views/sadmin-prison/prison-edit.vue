<template>
  <div>
    <div v-if="show" class="form-container">
      <el-tabs v-model="activeName" type="border-card" class="no-bottom-padding" @tab-click="handleClick">
        <template v-for="item in tabMapOptions">
          <el-tab-pane :label="item.label" :key='item.key' :name="item.key">
            <keep-alive>
              <component v-if='activeName == item.key' :is="activeName"></component>
            </keep-alive>
          </el-tab-pane>
        </template>
      </el-tabs>
    </div>
  </div>

</template>

<script>
import prisonBase from './components/prison-base'
import prisonConfig from './components/prison-config'
import prisonRemote from './components/prison-remote'
export default {
  components: { prisonBase, prisonConfig, prisonRemote },
  data() {
    return {
      activeName: '',
      tabMapOptions: [],
      show: false
    }
  },
  watch: {
    '$route': 'render'
  },
  mounted() {
    this.render()
  },
  methods: {
    handleClick() {
      this.$router.push({ query: { tag: this.activeName } })
    },
    render() {
      this.handleShow()
      if (!this.$route.query.tag) {
        this.$router.push({ query: { tag: this.tabMapOptions[0].key } })
      }
      if (this.$route.query.tag !== this.activeName) {
        if (this.tabMapOptions.find(item => item.key === this.$route.query.tag)) this.activeName = this.$route.query.tag
        else this.activeName = this.tabMapOptions[0].key
        this.handleClick()
      }
    },
    handleShow() {
      this.show = false
      let tabs = [
        { label: '基本信息', key: 'prisonBase' },
        { label: '配置信息', key: 'prisonConfig' }
      ]
      if (this.$route.path === '/remote/config') tabs = [{ label: '远程会见', key: 'prisonRemote' }]
      else if (this.$route.meta.role === '0' && this.$route.path.search(/\/prison\/remote\/\d+/) > -1) {
        tabs = [{ label: '远程会见', key: 'prisonRemote' }]
      }
      this.tabMapOptions = tabs
      this.show = true
    }
  }
}
</script>

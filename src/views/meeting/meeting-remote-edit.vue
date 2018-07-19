<template>
  <div>
    <div class="form-container">
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
import usual from './components/remote-usual'
import weekend from './components/remote-weekend'
import special from './components/remote-special'
export default {
  components: { usual, weekend, special },
  data() {
    return {
      activeName: 'usual',
      tabMapOptions: [
        { label: '常规配置', key: 'usual' },
        { label: '周末配置', key: 'weekend' },
        { label: '特殊日期配置', key: 'special' }
      ]
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
      this.$router.replace({ query: { tag: this.activeName } })
    },
    render() {
      if (!this.$route.query.tag) {
        this.$router.replace({ query: { tag: this.activeName } })
      }
      else if (this.$route.query.tag !== this.activeName) {
        if (this.tabMapOptions.find(item => item.key === this.$route.query.tag)) {
          this.activeName = this.$route.query.tag
        }
        else {
          this.activeName = this.tabMapOptions[0].key
          this.handleClick()
        }
      }
    }
  }
}
</script>

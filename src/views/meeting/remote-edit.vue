<template>
  <div class="w80">
    <el-tabs
      v-model="activeName"
      type="border-card"
      class="min-height-400"
      @tab-click="handleClick">
      <div v-if="activeName === 'usual'" class="remote-visit-form">
        <remote-visit-day
          v-model="advanceDayLimit_"
          @submit="handleUpdateAdvanceDayLimit"
        />
      </div>
      <template v-for="item in tabMapOptions">
        <el-tab-pane
          :label="item.label"
          :key='item.key'
          :name="item.key">

          <keep-alive>
            <component
              v-if='activeName == item.key'
              :is="activeName"/>
          </keep-alive>
        </el-tab-pane>
      </template>
    </el-tabs>
  </div>

</template>

<script>
import remoteVisitDay from './components/remote-visit-day'
import usual from './components/remote-usual'
import special from './components/remote-special'
import times from './components/remote-times'
import { mapActions, mapState } from 'vuex';
export default {
  components: { remoteVisitDay, usual, special, times },
  data() {
    return {
      activeName: 'usual',
      tabMapOptions: [
        { label: '常规配置', key: 'usual' },
        { label: '特殊日期配置', key: 'special' },
        { label: '每人日申请次数限制配置', key: 'times' }
      ],
      advanceDayLimit_: 1 // 远程探视申请需提前天数
    }
  },
  computed: {
    ...mapState(['advanceDayLimit']),
    jailId() {
      return this.$route.meta.role === '3' ? JSON.parse(localStorage.getItem('user')).jailId : this.$route.params.id
    }
  },
  watch: {
    '$route': 'render',
    advanceDayLimit: {
      immediate: true,
      handler(val) {
        this.advanceDayLimit_ = val
      }
    }
  },
  created() {
    this.getRemoteAdvanceDayLimit({ jailId: this.jailId })
  },
  mounted() {
    this.render()
  },
  methods: {
    ...mapActions(['getRemoteAdvanceDayLimit', 'updateRemoteAdvanceDayLimit']),
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
    },
    handleUpdateAdvanceDayLimit(day) {
      this.updateRemoteAdvanceDayLimit({
        jailId: this.jailId,
        advanceDayLimit: day
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.w80{
  padding: 20px 10%;
}

.remote-visit-form {
  border-bottom: 1px solid #dcdfe6;
  margin-bottom: 15px;

  /deep/ .el-form-item {
    margin-bottom: 10px;
  }
}
</style>

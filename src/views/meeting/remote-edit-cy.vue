<template>
  <div class="w80">
    <el-tabs
      v-model="activeName"
      type="border-card"
      class="min-height-400"
      @tab-click="handleClick">
      <!-- 常规配置才有可视电话申请提前天数这个配置 -->
      <div
        v-if="activeName === 'usual'"
        class="remote-visit-form">
        <remote-visit-day
          v-model="advanceDayLimit_"
          :on-submit="handleUpdateAdvanceDayLimit"
        />
      </div>
      <template v-for="item in tabMapOptions">
        <el-tab-pane
          :label="item.label"
          :key='item.key'
          :name="item.key">

          <keep-alive>
            <component
              v-if='activeName === item.key'
              :is="activeName"/>
          </keep-alive>
        </el-tab-pane>
      </template>
    </el-tabs>
  </div>

</template>

<script>
import remoteVisitDay from './components/remote-visit-day-cy'
import usual from './components/remote-usual-cy'
import special from './components/remote-special-cy'
import times from './components/remote-times'
import { mapActions, mapState, mapMutations } from 'vuex';
export default {
  components: {
    // 可视可视电话提前天数
    remoteVisitDay,
    // 常规配置
    usual,
    // 特殊配置
    special,
    // 每人日申请次数限制配置
    times
  },
  data() {
    return {
      // 标签页 也对应组件名称
      activeName: 'usual',
      // 标签页选项
      tabMapOptions: [
        {
          label: '常规配置',
          key: 'usual'
        },
        {
          label: '特殊日期配置',
          key: 'special'
        },
        {
          label: '每人日申请次数限制配置',
          key: 'times'
        }
      ],
      advanceDayLimit_: [2, 15] // 实际操作的远程探视申请需提前天数(cy)
    }
  },
  computed: {
    // 最开始的远程探视申请需提前天数
    ...mapState(['advanceDayLimit']),
    // 监狱id
    jailId() {
      return this.$route.meta.role === '3' ? JSON.parse(localStorage.getItem('user')).jailId : this.$route.params.id
    }
  },
  watch: {
    // 路由变化
    '$route': 'render',
    // 路由的参数变化
    '$route.query': {
      handler(query) {
        // 为常规配置的时候
        if (query.tag === 'usual') {
          // 获取可视电话申请需提前天数
          this.getRemoteAdvanceDayLimits({ jailId: this.jailId })
        }
      }
    },
    // 初始化实际操作的远程探视申请需提前天数(cy)
    advanceDayLimit: {
      immediate: true,
      handler(val) {
        this.advanceDayLimit_ = val.slice(0)
      }
    }
  },
  // 获取申请提前天数
  created() {
    this.getRemoteAdvanceDayLimits({ jailId: this.jailId })
  },
  // 渲染组件
  mounted() {
    this.render()
  },
  methods: {
    ...mapActions([
      'getRemoteAdvanceDayLimits',
      'updateRemoteAdvanceDayLimit'
    ]),

    ...mapMutations((['setAdvanceDayLimits'])),

    // 进入不同的标签页
    handleClick() {
      this.$router.replace({ query: { tag: this.activeName } })
    },
    // 渲染函数
    render() {
      // 第一次渲染
      if (!this.$route.query.tag) {
        // 跳转到对应的
        this.$router.replace({ query: { tag: this.activeName } })
      }
      else if (this.$route.query.tag !== this.activeName) {
        if (this.tabMapOptions.find(item => item.key === this.$route.query.tag)) {
          // 把标签页对应到对应组件
          this.activeName = this.$route.query.tag
        }
        else {
          // 否则就是强制到常规配置标签页
          this.activeName = this.tabMapOptions[0].key
          // 更新路由配置
          this.handleClick()
        }
      }
    },
    // 可视电话申请需求提前天数 更新操作实际调用的方法
    async handleUpdateAdvanceDayLimit() {
      const [advanceDayLimit, dayInLimit] = this.advanceDayLimit_

      const isSucess = await this.updateRemoteAdvanceDayLimit({
        jailId: this.jailId,
        advanceDayLimit,
        dayInLimit
      })

      if (isSucess) this.setAdvanceDayLimits(this.advanceDayLimit_)
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

.el-tabs--border-card {
  /deep/ .el-tabs__content {
    padding-top: 0;
  }
}
</style>

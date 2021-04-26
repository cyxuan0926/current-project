<template>
  <div class="w80">
    <el-tabs
      v-model="activeName"
      type="border-card"
      class="min-height-400"
      @tab-click="handleClick"
    >
      <template v-if="haveRemoteVisitDay">
        <div class="remote-visit-form">
          <remote-visit-day
            v-model="advanceDayLimit_"
            :on-submit="handleUpdateAdvanceDayLimit"
            :tipText="tipText"
            :formLabelText="formLabelText"
          />
        </div>
      </template>

      <template v-for="item in tabMapOptions">
        <el-tab-pane
          :label="item.label"
          :key='item.key'
          :name="item.key"
        >
          <keep-alive>
            <component v-if='activeName === item.key' :is="activeName">
              <template #windowSize="{ scope }">
                <div class="el-form-item meeting_windowSize">
                  <label class="el-form-item__label">现场探视窗口个数</label>

                  <div class="form-meeting_windowSize">
                    <el-input
                      class="part-right"
                      v-model="scope['windowSize']"
                      size="small"
                      placeholder="请填写现场探视窗口个数"
                    >
                      <template slot="append">/个</template>
                    </el-input>

                    <span v-if="Boolean(errorMsg(scope['windowSize']))" class="tips">{{ errorMsg(scope['windowSize']) }}</span>
                  </div>
                </div>
              </template>

              <template #visitNotice="{ scope }">
                <m-form
                  class="el-form_visit-message"
                  ref="visitMessageForm"
                  :items="visitMessageFormItems"
                  :values="scope"
                  @response="onResponse"
                >
                  <p class="red" style="margin: 5px 0px 10px 105px;">*请填写现场探视注意事项，当家属预约现场探视时会提醒；预约成功后系统会将该信息发送至家属app端。</p>
                </m-form>
              </template>
            </component>
          </keep-alive>
        </el-tab-pane>
      </template>
    </el-tabs>
  </div>
</template>

<script>
import remoteVisitDay from '../components/remote-visit-day-cy'

import usual from './components/visit-usual'

import special from './components/visit-special'

import { mapActions, mapState, mapMutations } from 'vuex'

import validator from '@/utils'
export default {
  components: {
    // 可视电话提前天数
    remoteVisitDay,

    // 常规配置
    usual,

    // 特殊配置
    special
  },

  data() {
    const remoteVisitDayNames = ['usual']

    const tabMapOptions = [
      {
        label: '现场探视常规配置',
        key: 'usual'
      },

      {
        label: '现场探视特殊日期配置',
        key: 'special'
      }
    ]
    return {
      tabMapOptions,

      // 标签页 也对应组件名称
      activeName: 'usual',

      // 标签页选项
      advanceDayLimit_: [2, 15],

      remoteVisitDayNames,

      tipText: '*家属预约现场探视日期设置，以自然日为单位',

      formLabelText: '现场探视预约日期管理',

      visitMessageFormItems: {
        formConfigs: {
          labelWidth: '107px',
          hideRequiredAsterisk: true
        },

        notice: {
          type: 'textarea',
          label: '现场探视须知',
          maxlength: 2000,
          showWordLimit: true,
          rows: 4,
          rules: ['required']
        }
      },

      formModel: {}
    }
  },

  computed: {
    // 最开始的远程探视申请需提前天数
    ...mapState({
      advanceDayLimit: state => state.advanceDayLimit,
    }),

    // 监狱id
    jailId() {
      return this.$route.meta.role === '3' ? JSON.parse(localStorage.getItem('user')).jailId : this.$route.params.id
    },

    // 是否拥有配置日期组件
    haveRemoteVisitDay() {
      return this.remoteVisitDayNames.includes(this.activeName)
    }
  },

  watch: {
    // 路由变化
    '$route': 'render',

    // 路由的参数变化
    '$route.query': {
      handler(query) {
        // 为常规配置的时候
        if (this.haveRemoteVisitDay) {
          // 获取可视电话申请需提前天数
          this.getRemoteAdvanceDayLimits({ params: { jailId: this.jailId }, url: '/visit/config/getNormalConfig' })
        }
      }
    },

    // 初始化实际操作的远程探视申请需提前天数
    advanceDayLimit: {
      immediate: true,
      handler(val) {
        this.advanceDayLimit_ = val.slice(0)
      }
    }
  },

  // 获取申请提前天数
  async created() {
    await this.getRemoteAdvanceDayLimits({ params: { jailId: this.jailId }, url: '/visit/config/getNormalConfig' })
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
      } else if (this.$route.query.tag !== this.activeName) {
        if (this.tabMapOptions.find(item => item.key === this.$route.query.tag)) {
          // 把标签页对应到对应组件
          this.activeName = this.$route.query.tag
        } else {
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
        params: {
          jailId: this.jailId,
          startDay: advanceDayLimit,
          endDay: dayInLimit
        },

        url: '/visit/config/setNormalConfigDay'
      })

      if (isSucess) this.setAdvanceDayLimits(this.advanceDayLimit_)
    },

    onResponse(params) {
      this.$nextTick(() => {
        this.formModel = Object.assign({}, params)
      })
    },

    // 手动强制更新 提示的内容
    onInitMessageValue(value) {
      const setValue = value

      this.$set(this.visitMessageFormItems['notice'], 'setValueConfigs', [{ setValue }])

      this.$refs['visitMessageForm'][0].setFieldValue('', 'notice', this.visitMessageFormItems['notice'])
    },

    // 调用
    async onParentSubimt(windowSizes) {
      try {
        const isChecked = await this.$refs['visitMessageForm'][0].onCheck()

        let windowSizeChecked = false

        if (Array.isArray(windowSizes)) windowSizeChecked = windowSizes.every(windowSize => !this.errorMsg(windowSize))

        if (Object.prototype.toString.call(windowSizes) === '[object String]') windowSizeChecked = !this.errorMsg(windowSizes)

        return windowSizeChecked && isChecked && this.formModel
      } catch (err) {
        Promise.reject(err)
      }
    },

    errorMsg(windowSize) {
      if (windowSize === null || windowSize === undefined) return ''

      let msg = '', handleValid = v => {
        if (typeof v === 'object') {
          if (!msg) msg = v.message
        }
      }

      validator.required({ message: '请填写现场探视窗口个数' }, windowSize, handleValid)

      validator.isNumber({}, windowSize, handleValid)

      validator.numberRange({ min: 1, max: 60 }, windowSize, handleValid)

      return msg
    }
  }
}
</script>
<style lang="scss" scoped>
.w80 {
  padding: 20px 10%;

  .meeting_windowSize {
    display: flex;
    align-items: center;
    margin: 10px 0px;

    label {
      float: none;
    }

    .form-meeting_windowSize {
      width: calc(100% - 150px);
      position: relative;

      .tips {
        color: #F56C6C;
        position: absolute;
        left: 0;
        top: 32px;
      }

      .part-right {
        width: 40%;
      }
    }
  }
}

.remote-visit-form {
  border-bottom: 1px solid #dcdfe6;

  /deep/ .el-form-item {
    margin-bottom: 10px;
  }
}

.el-tabs--border-card {
  /deep/ .el-tabs__content {
    padding-top: 0;
  }
}

.el-form_visit-message {
  margin-top: 10px;
  /deep/ .el-form-item {
    .el-textarea {
      width: 75%;
    }
  }
}
</style>

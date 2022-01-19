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
              <template #windowSize="{ scope = { window_size: 1, queue: []  }, attrsConfigs = { disabled: false } }">
                <div class="el-form-item meeting_windowSize">
                  <label class="el-form-item__label">现场探视窗口个数</label>

                  <div class="form-meeting_windowSize">
                    <el-input
                      :disabled="attrsConfigs['disabled']"
                      class="part-right"
                      v-model="scope['window_size']"
                      size="small"
                      placeholder="请填写现场探视窗口个数"
                    >
                      <template slot="append">/个</template>
                    </el-input>

                    <span v-if="Boolean(errorMsg(scope['window_size']))" class="tips">{{ errorMsg(scope['window_size']) }}</span>
                  </div>
                </div>
              </template>

              <template #visitNotice>
                <m-form
                  class="el-form_visit-message"
                  ref="visitMessageForm"
                  :items="visitMessageFormItems"
                  :values="visitNotice"
                  @response="onVisitMessageResponse"
                  @submit="onUpdateNotice"
                  @back="onGoBack"
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

  provide() {
    return {
      onParentSubimt: this.onParentSubimt,

      errorMsg: this.errorMsg
    }
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

      formModel: {},

      visitNormalDaysConfigs: {}
    }
  },

  computed: {
    // 最开始的远程探视申请需提前天数
    ...mapState({
      advanceDayLimit: state => state.advanceDayLimit,
      visitNotice: state => state.visitNotice
    }),

    // 监狱id
    jailId() {
      return this.$route.meta.role === '3' ? JSON.parse(localStorage.getItem('user')).jailId : this.$route.params.id
    },

    // 是否拥有配置日期组件
    haveRemoteVisitDay() {
      return this.remoteVisitDayNames.includes(this.activeName)
    },

    visitMessageFormItems() {
      const items = {
        formConfigs: {
          labelWidth: '105px',
          hideRequiredAsterisk: true
        },

        notice: {
          type: 'textarea',
          label: '现场探视须知',
          maxlength: 2000,
          showWordLimit: true,
          rows: 4,
          rules: !this.haveRemoteVisitDay ? [] : ['required'],
          disabled: !this.haveRemoteVisitDay
        },

        buttons: ['back', 'update']
      }

      let cloneDeepItem = _.cloneDeep(items)

      if (!this.haveRemoteVisitDay) delete cloneDeepItem['buttons']

      return cloneDeepItem
    }
  },

  watch: {
    // 路由变化
    '$route': 'render',

    // 路由的参数变化
    '$route.query': {
      async handler(query) {
        // 为常规配置的时候
        await this.onPromises()
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
    this.render()

    await this.onPromises()
  },

  methods: {
    ...mapActions([
      'getRemoteAdvanceDayLimits',
      'updateRemoteAdvanceDayLimit',
      'getVisitNotice',
      'updateVisitNotice'
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

      const { id } = this.visitNormalDaysConfigs

      const isSucess = await this.updateRemoteAdvanceDayLimit({
        params: {
          id,
          startDay: advanceDayLimit,
          endDay: dayInLimit
        },

        url: '/visit/config/setNormalConfigDay',

        methods: 'postObj'
      })

      if (isSucess) this.setAdvanceDayLimits(this.advanceDayLimit_)
    },

    onVisitMessageResponse(params) {
      this.$nextTick(() => {
        this.formModel = Object.assign({}, params)

        this.$forceUpdate()
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
        // const isChecked = await this.$refs['visitMessageForm'][0].onCheck()

        let windowSizeChecked = false

        if (Array.isArray(windowSizes)) windowSizeChecked = windowSizes.every(windowSize => !this.errorMsg(windowSize))

        if (Object.prototype.toString.call(windowSizes) === '[object String]') windowSizeChecked = !this.errorMsg(windowSizes)

        //  && isChecked
        return windowSizeChecked
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
    },

    async onUpdateNotice(params) {
      const hasNoChanged = this.visitNotice['notice'].replace(/\s*/g, '') === params['notice'].replace(/\s*/g, '')

      if (hasNoChanged) {
        this.$message({
          showClose: true,
          message: '现场探视须知没有变化，无需编辑！',
          duration: 3000,
          type: 'error'
        })
      } else {
        const notice = params['notice'].replace(/\s*/g, '')

        const inputs = {
          jailId: this.jailId,
          notice
        }

        await this.updateVisitNotice(inputs)

        setTimeout(async () => {
          await this.getVisitNotice(this.jailId)
        }, 2000)
      }
    },

    onGoBack() {
      this.$router.back()
    },

    async onPromises() {
      let maps = [{
        method: this.getVisitNotice,

        params: this.jailId
      }]

      if (this.haveRemoteVisitDay) maps = [
        ...maps,
        {
          method: this.getRemoteAdvanceDayLimits,

          inputs: {
            params: { jailId: this.jailId },
            url: '/visit/config/getNormalConfigDay'
          }
        }
      ]

      const promises = maps.map(item => {
        return item['params'] ? item['method'](item['params']) : item['method']({...item['inputs']})
      })

      const response = await Promise.all(promises)

      this.visitNormalDaysConfigs = response[1] || {}
    }

    // visitMessageFormItems(inputs = {}) {
    //   const items = {
    //     formConfigs: {
    //       labelWidth: '107px',
    //       hideRequiredAsterisk: true
    //     },

    //     notice: {
    //       type: 'textarea',
    //       label: '现场探视须知',
    //       maxlength: 2000,
    //       showWordLimit: true,
    //       rows: 4,
    //       rules: ['required'],
    //       // disabled: !this.haveRemoteVisitDay
    //     }
    //   }

    //   const { noticeRules = ['required'] } = inputs

    //   this.$set(items['notice'], 'rules', noticeRules)

    //   return items
    // }
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
    margin-bottom: 15px;

    label {
      float: none;
    }

    .form-meeting_windowSize {
      width: calc(#{$absolutely-measure} - 153px);
      position: relative;

      .tips {
        color: $red;
        position: absolute;
        left: 0;
        top: 32px;
      }

      .part-right {
        width: 35%;
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

  /deep/ .button-box {
    padding-bottom: 0px;
  }
}
</style>

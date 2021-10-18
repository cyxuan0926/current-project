<template>
  <div class="header-container">
    <div
      :class="[
        'header-left',
        'transition',
        { 'collapsed': isCollapsed }]">
      <span class="bold">国科服务</span>管理平台
    </div>
    <div :class="[ 'header-right', { 'header-right-no__regisition': multistageExamineCountConfigs.total } ]">
      <i
        class="iconfont icon-category bold"
        @click="handleCollapse"
      />

      <div class="mine__box">
        <el-dropdown
          trigger="click"
          @command="handleCommand">
          <div class="item">
            <img
              src="/static/images/user2-160x160.jpg"
              class="avatar circle">
            <span class="hidden-xs-only">{{ publicUserInfo.nickname || publicUserInfo.username }}</span>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="{ path: '/password/edit' }">修改用户密码</el-dropdown-item>
            <!-- 用安全问题找回密码的逻辑的入口 -->
            <!-- <el-dropdown-item :command="'setSecurityQuestions'">设置安全问题</el-dropdown-item> -->
          </el-dropdown-menu>
        </el-dropdown>

        <!-- 消息铃铛 -->
        <el-dropdown
          v-if="isAdvancedAuditor"
          class="bell__dropdown"
          trigger="click"
          @command="handleCommand"
        >
          <el-badge
            :class="[
              'item',
              'bell__badge',
              { 'no__regisition': !multistageExamineCountConfigs.total }
            ]"
            :value="multistageExamineCountConfigs.total"
            :max="99"
          >
            <i class="el-icon-bell icon-bell" />
          </el-badge>

          <el-dropdown-menu
            slot="dropdown"
            class="bell-dropdown-menu"
          >
            <template v-for="item in multistageExamineDropdownItems">
              <el-dropdown-item
                v-if="multistageExamineCountConfigs[item['paramsKey']]"
                :command="item.path"
                :key="item.menuName"
              >
                <span>{{ item.menuName }}</span>

                <span class="bell__count">{{ +multistageExamineCountConfigs[item['paramsKey']] > 99 ? '99+' : multistageExamineCountConfigs[item['paramsKey']] }}</span>
              </el-dropdown-item>
            </template>
          </el-dropdown-menu>
        </el-dropdown>

        <i class="iconfont icon-tuichu" @click="handleLogout" />
      </div>
    </div>
    <el-dialog
      :visible.sync="visible"    
      ref="allDialog"
      title="设置你的安全问题"
      class="authorize-dialog all-dialog__style"
      @close="handleCloseDialog"
      width="530px">
      <m-form
        class="security-question__form"
        :items="questionAnswersFormItems"
        @submit="handleSubmit"
        :values='values'
        ref="dialogForm"
        @cancel="visible = false"
      />
    </el-dialog>
  </div>
</template>

<script>
import questionAnswersSetter from '@/mixins/question-answers-setter'

import {
  mapActions,
  mapState,
  mapGetters
} from 'vuex'

import logout from '@/utils/logout'

import { multistageExamineDropdownItems } from '@/common/constants/const'

export default {
  mixins: [questionAnswersSetter],
  data() {
    return {
      visible: false,

      multistageExamineDropdownItems
    }
  },
  computed: {
    ...mapState({
      isCollapsed: state => state.layout.isCollapsed,

      publicUserInfo: state => state.account.publicUserInfo,

      multistageExamineCountConfigs: state => state.layout.multistageExamineCountConfigs,

      isRefreshMultistageExamineMessageBell: state => state.global.isRefreshMultistageExamineMessageBell
    }),

    ...mapGetters(['isAdvancedAuditor'])
  },

  watch: {
    isRefreshMultistageExamineMessageBell(val) {
      if (val) {
        (async () => {
          await this.getMultistageExamineCountConfigs()
        })()
      }
    }
  },

  methods: {
    ...mapActions([
      'handleCollapse',
      'closeWebsocket',
      'getMultistageExamineCountConfigs'
    ]),

    ...mapActions('account', ['setUserSecurityQuestionAnswers', 'getUserSecurityQuestionAnswers']),

    handleCommand(e) {
      if (e === 'setSecurityQuestions') {
        (async () => {
          const res = await this.getUserSecurityQuestionAnswers()
          await this.onRenderData(res)
          this.visible = true
        })()
      }
      else this.$router.push(e)
    },
    handleLogout() {
      this.$confirm('是否退出登录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.closeWebsocket()
        logout()
        this.$router.replace('/login')
      }).catch(() =>{})
    },
    onSecurityQuestionsChange(e, field) {
      this.$set(this.isChoose, field, e)
      const filterFields = this.fields.filter(val => val && val !== field)
      // 这里是处理没有触发change事件的select
      filterFields.map(fullField => {
        // 如果这个这个select已经选择过了那么这个筛选条件就要去除掉选择的那个值 这里在已经设置好问题时有bug
        const temp = Object.values(this.isChoose).filter(question => question && question !== this.isChoose[fullField])
        this.$set(this.questions, fullField, this.securityQuestions.filter(val => val && !temp.includes(val.id)))
        this.$set(this.questionAnswersFormItems[fullField], 'options', this.questions[fullField])
      })
    },
    async handleSubmit(val) {
      const mapArray = [ 'One', 'Two', 'Three' ]
      this.onProcesseData(val)
      const params = mapArray.map((val,index) => ({ securityQuestionId: this.questionAnswers[val][0], answer: this.questionAnswers[val][1], ordinal: index }))
      await this.setUserSecurityQuestionAnswers(params)
      this.handleCloseDialog()
    },
    handleCloseDialog() {
     this.$refs.dialogForm && this.$refs.dialogForm.onCancel()
    }
  },

  async created() {
    if (this.isAdvancedAuditor) await this.getMultistageExamineCountConfigs()
  }
}
</script>
<style lang="scss" scoped>
@import "../../assets/css/layout";
.all-dialog__style {
  line-height: 24px;
}

.header-right-no__regisition {
  line-height: 45px;
}

.mine__box {
  display: flex;

  justify-content: space-between;
  .bell__badge {
    .icon-bell {
      font-size: 18px;
    }

    /deep/ .is-fixed {
      transform: translateX(4%) translateX(38%);
    }

    /deep/ .el-badge__content {
      background-color: red;
    }

    &.no__regisition {
      /deep/ .el-badge__content {
        display: none;
      }
    }
  }
}
</style>

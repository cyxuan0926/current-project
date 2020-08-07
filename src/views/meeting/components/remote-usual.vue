<template>
  <div class="m-container">
    <!-- 当前配置 configBefore -->
    <remote-config :configs="configsBefore" :disabled="permissonDisabled || configsBeforeDisabled" />
    <!-- 即将生效的配置 configAfter -->
    <h3 class="remote-config-title" v-if="configs">{{ updatedAt }}调整后的时间段配置，{{ enabledAt }}生效</h3>
    <remote-config v-if="configs" :configs="configs" :disabled="permissonDisabled" />
    <div class="config-box" v-if="isShowEnabledAt">
      <div style="overflow: hidden; margin-bottom: 10px;">
        <label class="c-label">生效日期</label>
        <el-date-picker
          style="width: 180px"
          v-model="enabledAt"
          type="date"
          placeholder="请选择生效日期"
          :disabled="permissonDisabled"
          :picker-options="pickerOptions">
        </el-date-picker>
      </div>
    </div>
    <div class="button-box">
      <el-button
        v-if="superAdmin"
        size="small"
        @click="onGoBack">返回</el-button>
      <!-- 权限是编辑并且是国科服务管理人员并且至少有一个通话时间配置 -->
      <el-button
        v-if="isShowEnabledAt"
        size="small"
        type="primary"
        @click="onUpdate">更新</el-button>
    </div>
    <el-dialog
      :visible.sync="visible"
      width="400px">
      <span
        slot="title"
        style="display: block; text-align: center; font-weight: bold;">提示</span>
      <div style="text-align: center;">修改常规配置后，将重新分配相关待会见时间段，调整后会以短信形式通知相关家属。</div>
      <div style="text-align: center;">注意：若预约日期无法在当日分配时间段，系统将自动取消该条待会见申请，并以短信形式通知相关家属，请确认是否继续操作！</div>
      <div
        slot="footer"
        class="button-box"
        style="padding-bottom: 0;">
        <el-button
          type="default"
          size="mini"
          @click="visible = false">取消</el-button>
        <el-button
          type="primary"
          size="mini"
          :loading="loading"
          @click="onSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import Moment from 'moment'
import isEqual from 'lodash/isEqual'
import cloneDeep from 'lodash/cloneDeep'
import roles from '@/common/constants/roles'
import remoteConfig from './remote-config'
export default {
  components: {
    remoteConfig
  },
  data() {
    return {
      updatedAt: '',
      enabledAt: '',
      isEnabledAt: false,
      enabledAtPick: [],
      // 监狱id: 信息管理员角色 是从用户里面取监狱id 其余是从路由里面取
      jailId: this.$route.meta.role === '3' ? JSON.parse(localStorage.getItem('user')).jailId : this.$route.params.id,
      // 配置参数
      configs: [],
      configsBefore: [],
      permissonDisabled: true,
      configsBeforeDisabled: true,
      flag: true,
      // 确定更新按钮加载
      loading: false,
      disabled: true,
      permission: 'add',
      // 提示对话框显示属性
      visible: false,
      // 原始的配置信息
      orignConfigs: [],
      pickerOptions: {
        disabledDate: (time) => {
          let t = time.getTime()
          return t < this.enabledAtPick[0].valueOf() || t > this.enabledAtPick[1].valueOf();
        },
      }
    }
  },
  computed: {
    // 常规配置
    ...mapState(['normalConfig', 'dayLimit']),
    // 国科服务管理员
    superAdmin() {
      return this.$store.getters.role === roles.SUPER_ADMIN
    },
    isShowEnabledAt() {
      return !this.permissonDisabled && this.permission === 'edit' && (this.configsBeforeDisabled ? this.configs : this.configsBefore).some(c => !!c.queue.length)
    }
  },
  watch: {
    // 'configs.0': {
    //   handler: function(val) {
    //     this.$emit('canAdd', val.queue.length > 0)
    //   },
    //   deep: true
    // }
    dayLimit(val) {
      this.setEnabledAt(this.enabledAt)
    }
  },
  // 激活状态
  activated() {
    // 国科服务管理员
    if (this.$route.meta.role === '0') {
      this.permissonDisabled = false
      this.configsBeforeDisabled = false
    }
    // 国科服务管理员权限/信息管理人员权限
    if (this.$route.meta.permission === 'visit.prison.visit-config.search' || this.$route.meta.permission === 'visit.remote-visit-configure.search') {
      this.permission = 'edit'
    }
    // 获取远程通话常规配置
    if (this.permission === 'edit') {
      this.getRemoteNormalConfig({ jailId: this.jailId }).then(res => {
        if (!res) return
        this.configs = this.normalConfig.configAfter
        this.configsBefore = this.normalConfig.configBefore
        this.orignConfigs = cloneDeep(this.configs && this.configs.length ? this.configs : this.configsBefore)
        this.setEnabledAt(this.normalConfig.enabledAt)
        this.updatedAt = this.normalConfig.updatedAt
        if (this.configs && this.configs.length && this.configs[0].config.length) {
          this.configsBeforeDisabled = true
        }
      })
    }
  },
  methods: {
    ...mapActions([
      // 获取通话常规配置
      'getRemoteNormalConfig',
      // 更新通话常规配置
      'updateRemoteNormalConfig'
    ]),

    // 更新按钮的方法
    onUpdate() {
      // 最新的通话配置
      const configs = this.filterParams(this.configs && this.configs.length ? this.configs : this.configsBefore)
      // 初始的通话配置
      const orignConfigs = this.filterParams(this.orignConfigs)
      // 是否发生变化
      const hasNoChanged = isEqual(configs, orignConfigs)
      if (hasNoChanged) {
        this.$message({
          showClose: true,
          message: '配置没有变化，无需编辑！',
          duration: 3000,
          type: 'error'
        })
      }
      // 展示提示对话框
      else this.visible = true
    },

    // 更新常规配置
    onSubmit(e) {
      const params = this.filterParams(this.configs && this.configs.length ? this.configs : this.configsBefore)
      if (e) {
        this.loading = true
        this.updateRemoteNormalConfig({
          id: this.normalConfig.id,
          jailId: this.normalConfig.jailId,
          enabledAt: this.enabledAt,
          configAfter: params
        }).then(res => {
          this.loading = false
          if (!res) return
          this.visible = false
        })
      }
      // 触发父组件的submit事件
      else this.$emit('submit', params)
    },
    // 返回操作
    onGoBack() {
      this.$router.back()
    },

    // 以下 v2.6.4 需求  u-修改 a-新增
    // 入参结构 (update)
    filterParams(params) {
      let result = []
      params.forEach(config => {
        if (!config.days.length || !config.timequeue.length || !config.queue.length) return
        let c = [], t = []
        config.queue.forEach(q => c.push(q.join('-')))
        config.timequeue.forEach(q => t.push(q.join('-')))
        result.push({
          days: config.days,
          interval: config.interval,
          duration: config.duration,
          timeperiod: t,
          config: c
        })
      })
      return result
    },

    // 设置修改有效期
    setEnabledAt(enabledAt) {
      let cur = Moment()
      let enat
      if ( !enabledAt || (enat = Moment(enabledAt)) && cur.diff(enat) > 0 ) {
        this.enabledAtPick.push(cur.add(1, 'd'), cur.add(this.dayLimit.dayInLimit, 'd'))
      }
      else {
        this.enabledAtPick.push(cur, enat)
      }
      this.enabledAt = this.enabledAtPick[1].format('YYYY-MM-DD')
    }
  }
}
</script>
<style lang="scss" scoped>
.m-container{
  .remote-config-title {
    padding: 10px 0;
    border-bottom: 1px solid #dcdfe6;
    border-top: 1px solid #dcdfe6;
    font-weight: 500;
    color: #333;
    font-size: 14px;
  }
  .config-box{
    overflow: hidden;
  }
  // .config-box+.config-box{
  //   border-top: 1px solid #dcdfe6;
  //   padding-top: 10px;
  // }
  label.c-label{
    width: 70px;
    text-align: right;
    font-weight: normal;
    float: left;
    color: #606266;
    line-height: 28px;
    margin-right: 10px;
  }
  .button-box{
    padding-bottom: 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    clear: both;
  }
}
</style>

<template>
  <div>
    <el-form
      ref="form"
      label-width="140px"
      :model="meeting"
      :rules="rules">
      <remote-visit-day
        v-model="meeting.advanceDayLimit"
        :hasUpdateBtn="false"
      />
      <el-form-item
        prop="dailyApplyLimit"
        label="每人日申请次数限制">
        <el-input
          v-model="meeting.dailyApplyLimit"
          placeholder="请输入每人日申请次数限制">
          <template slot="append">次/人</template>
        </el-input>
      </el-form-item>
    </el-form>
    <div class="config-title">常规配置<span class="tips">(*必填)</span></div>
    <div style="padding: 10px 20px 0;">
      <remote-usual
        ref="usual"
        @canAdd="handleAdd"
        @submit="handleUsual" />
    </div>
    <div class="config-title">特殊日期配置<span class="tips">(*最多设置10个特殊日期)</span></div>
    <div style="padding: 10px 20px;">
      <remote-special
        ref="special"
        @submit="handleSpecial" />
    </div>
    <div class="button-box">
      <el-button
        size="small"
        type="primary"
        @click="onPrevClick">上一步</el-button>
      <el-button
        :disabled="!canAdd"
        size="small"
        type="primary"
        @click="handleSubmit">新增</el-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
// import Moment from 'moment'
import validator from '@/utils/validate'
import remoteVisitDay from '@/views/meeting/components/remote-visit-day'
import remoteUsual from '@/views/meeting/components/remote-usual'
import remoteSpecial from '@/views/meeting/components/remote-special'

export default {
  components: { remoteVisitDay, remoteUsual, remoteSpecial },
  data() {
    return {
      canAdd: false,
      rules: {
        dailyApplyLimit: [{ validator: validator.isNumber }, { validator: validator.numberRange, min: 0 }]
      },
      meeting: {
        dailyApplyLimit: '',
        advanceDayLimit: 1 // 远程探视申请需提前天数
      }
    }
  },
  computed: {
    ...mapState(['prison'])
  },
  created() {
    if (!sessionStorage.getItem('base')) {
      this.$router.push({ query: Object.assign({}, { tag: 'prisonBase' }) })
    }
    else if (parseInt(sessionStorage.getItem('step')) !== 2 || !sessionStorage.getItem('config')) {
      this.$router.push({ query: Object.assign({}, { tag: 'prisonConfig' }) })
    }
  },
  methods: {
    ...mapActions(['addPrison']),
    handleSubmit(e) {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$refs.usual.onSubmit(false)
          this.$refs.special.handleEmit()
          let prison = Object.assign({}, JSON.parse(sessionStorage.getItem('base')), JSON.parse(sessionStorage.getItem('config')), this.meeting)
          this.addPrison(prison).then(res => {
            if (!res) return
            this.$router.push('/prison/list')
          })
        }
      })
    },
    handleUsual(e) {
      this.meeting.meetingQueue = e
    },
    handleSpecial(e) {
      this.meeting.specialQueue = e
    },
    handleAdd(e) {
      this.canAdd = e
    },
    onPrevClick(e) {
      this.$router.back()
    }
  }
}
</script>

<style lang="scss" scoped>
.config-title{
  background: #E5E5E5;
  line-height: 30px;
  font-weight: bold;
  padding-left: 20px;
}
.tips{
  color: #f56c6c;
  font-weight: normal;
  font-size: 12px;
  margin-left: 10px;
}
.button-box{
  padding-bottom: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  clear: both;
}
</style>

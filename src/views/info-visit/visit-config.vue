<template>
  <div class="yt-form" style="padding-top: 20px;">
    <el-form
      v-if="show"
      ref="form"
      label-width="140px"
      :model="prisonVisitConfigDetail"
      inline
      style="width: 75%; margin: auto; overflow: hidden;"
      :rules="rules">
      <el-form-item
          label="实地探监窗口个数"
          prop="windowSize">
          <el-input
            v-model="prisonVisitConfigDetail.windowSize"
            :disabled="prisonVisitConfigDetail.canNotChange"
            placeholder="请填写实地探监窗口个数(1-20)">
            <template slot="append">/个</template>
          </el-input>
        </el-form-item>
      <div>
        <div class="el-form-item is-required" style="float: left;">
           <label class="el-form-item__label" style="width: 130px; padding-right: 2px;">配置</label>
        </div>
        <div style="float: left; width: calc(100% - 140px);">
          <template v-for="(item, index) in prisonVisitConfigDetail.usual">
            <el-form-item
              :key="index"
              :prop="'usual.' + index"
              :rules="[{ required: true, message: '请选择实地会见批次' }]"
              style="width: calc(25% - 10px); min-width: 140px; max-width: 350px;">
              <m-time-range-picker
                :val="prisonVisitConfigDetail.usual[index]"
                :prev="prisonVisitConfigDetail.usual[index - 1]"
                :next="prisonVisitConfigDetail.usual[index + 1]"
                :disabled="prisonVisitConfigDetail.canNotChange"
                type="usual"
                @handleBlur="handleBlur" />
            </el-form-item>
          </template>
          <el-button
            v-if="!prisonVisitConfigDetail.canNotChange"
            :disabled="!flag.canAddUsual"
            type="primary"
            style="margin-right: 10px; margin-bottom: 22px;"
            @click="onAddRange('usual')">新增实地会见批次</el-button>
          <el-button
            v-if="!prisonVisitConfigDetail.canNotChange && prisonVisitConfigDetail.usual.length > 1"
            style="margin-left: 0; margin-bottom: 22px;"
            @click="onRestRange('usual')">重置实地会见配置</el-button>
        </div>
      </div>
      <el-button
        v-if="!prisonVisitConfigDetail.canNotChange"
        size="small"
        type="primary"
        class="button-add"
        style="margin-right: 10px;"
        @click="onSubmit">确定</el-button>
    </el-form>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Moment from 'moment'
import validator from '@/utils'

export default {
  data() {
    let jailId = ''
    if (this.$route.meta.role === '0') jailId = this.$route.params.id
    else if (this.$route.meta.role === '3') jailId = JSON.parse(localStorage.getItem('user')).jailId
    return {
      rules: {
        windowSize: [{ required: true, message: '请填写实地探监窗口个数' }, { validator: validator.isNumber }, { validator: validator.numberRange, min: 1, max: 20 }]
      },
      flag: {
        canAddUsual: true
      },
      usualToAdd: [],
      routeRole: this.$route.meta.role,
      show: false,
      jailId,
      validator
    }
  },
  computed: {
    ...mapState(['prisonVisitConfigDetail'])
  },
  mounted() {
    this.render()
  },
  methods: {
    ...mapActions(['getPrisonVisitConfigDetail', 'updatePrisonVisitConfig']),
    onSubmit(e) {
      this.$refs.form.validate(valid => {
        if (valid) {
          let params = Object.assign({}, this.prisonVisitConfigDetail, { jailId: this.jailId })
          this.handleQueue(params)
          delete params.usual
          delete params.canNotChange
          this.updatePrisonVisitConfig(params).then(res => {
            if (!res) return
            this.render()
          })
        }
      })
    },
    render() {
      this.getPrisonVisitConfigDetail({ jailId: this.jailId }).then(res => {
        this.show = true
        if (!res) return
        if (!this.prisonVisitConfigDetail.canNotChange) this.getNextTime('usual', this.prisonVisitConfigDetail.usual[this.prisonVisitConfigDetail.usual.length - 1])
      })
    },
    handleBlur(e, type) {
      if (type !== 'special') {
        this.prisonVisitConfigDetail[type][this.prisonVisitConfigDetail[type].length - 1] = e
        if (type === 'usual') this.$refs.form.validateField('usual.0')
        this.getNextTime(type, e)
      }
    },
    handleQueue(params) {
      params.batchQueue = []
      params.usual.forEach(queue => {
        params.batchQueue.push(`${ queue[0] }-${ queue[1] }`)
      })
    },
    onAddRange(type) {
      this.prisonVisitConfigDetail[type].push(this[`${ type }ToAdd`])
      this.getNextTime(type, this.prisonVisitConfigDetail[type][this.prisonVisitConfigDetail[type].length - 1])
    },
    onRestRange(type) {
      this.prisonVisitConfigDetail[type] = [null]
      this.flag[`canAdd${ type.replace(/(\w)/, (v) => v.toUpperCase()) }`] = false
    },
    getNextTime(type, last = null) {
      if (!this.handleCanAdd(type, last) || !last) return
      let start = Moment(new Date(2000, 0, 1, last[0].split(':')[0], last[0].split(':')[1])),
        end = Moment(new Date(2000, 0, 1, last[1].split(':')[0], last[1].split(':')[1])),
        duration = end.diff(start, 'minutes'),
        toEnd = end.add(duration, 'minutes')
      if (toEnd.date() !== 1) {
        this[`${ type }ToAdd`] = [last[1], '23:59']
      }
      else {
        this[`${ type }ToAdd`] = [last[1], `${ toEnd.format('HH:mm') }`]
      }
    },
    handleCanAdd(type, last) {
      let flag = true
      if (last === null) {
        flag = false
      }
      else if (last[1] === '23:59') {
        flag = false
      }
      this.flag[`canAdd${ type.replace(/(\w)/, (v) => v.toUpperCase()) }`] = flag
      return flag
    }
  }
}
</script>

<style lang="css">
</style>

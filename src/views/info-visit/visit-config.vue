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
        <div class="time-queue" style="float: left; width: calc(100% - 140px);">
          <template v-for="(item, index) in prisonVisitConfigDetail.usual">
            <el-form-item
              :key="index"
              :prop="'usual.' + index"
              :rules="[{ required: true, message: '请选择实地会见批次' }, { validator: validator.timeRange, prev: prisonVisitConfigDetail.usual[index - 1], prop: 'canAddUsual', flag: flag }]">
              <el-time-picker
                is-range
                arrow-control
                v-model="prisonVisitConfigDetail.usual[index]"
                value-format="H:mm"
                format="H:mm"
                :disabled="Boolean(prisonVisitConfigDetail.usual[index + 1]) || prisonVisitConfigDetail.canNotChange"
                :editable="false"
                :clearable="false"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :picker-options="index === 0 ? {} : { start: prisonVisitConfigDetail.usual[index - 1][1], end: '23:59:59', minTime: prisonVisitConfigDetail.usual[index - 1][1], selectableRange: prisonVisitConfigDetail.usual[index - 1][1] + ' - 23:59:59' }"
                @change="getNextTime('usual')">
              </el-time-picker>
            </el-form-item>
          </template>
          <el-button
            v-if="!prisonVisitConfigDetail.canNotChange && prisonVisitConfigDetail.usual[prisonVisitConfigDetail.usual.length - 1] !== null"
            :disabled="!flag['canAddUsual']"
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
  watch: {
    'prisonVisitConfigDetail.usual': function(val) {
      if (val[val.length - 1] === null) return
      if (val[val.length - 1][1] === '23:59') {
        this.flag.canAddUsual = false
      }
      else {
        this.flag.canAddUsual = true
      }
    }
  },
  computed: {
    ...mapState(['prisonVisitConfigDetail'])
  },
  created() {
    this.render()
  },
  methods: {
    ...mapActions(['getPrisonVisitConfigDetail', 'updatePrisonVisitConfig']),
    onSubmit(e) {
      this.$refs.form.validate(valid => {
        if (valid) {
          // if (this.routeRole === '0') {
          let params = Object.assign({}, this.prisonVisitConfigDetail, { jailId: this.jailId })
          this.handleQueue(params)
          delete params.usual
          delete params.canNotChange
          this.updatePrisonVisitConfig(params).then(res => {
            if (!res) return
            this.render()
          })
          // }
        }
      })
    },
    render() {
      this.getPrisonVisitConfigDetail({ jailId: this.jailId }).then(res => {
        this.show = true
        if (!res) return
      })
    },
    handleQueue(params) {
      params.batchQueue = []
      params.usual.forEach(queue => {
        params.batchQueue.push(`${ queue[0] }-${ queue[1] }`)
      })
    },
    onAddRange(e) {
      let last = this.prisonVisitConfigDetail[e][this.prisonVisitConfigDetail[e].length - 1]
      if (last === null) return false
      this.getNextTime(e)
      this.prisonVisitConfigDetail[e].push(this[`${ e }ToAdd`])
    },
    onRestRange(e) {
      this.prisonVisitConfigDetail[e] = [null]
    },
    getNextTime(e) {
      let last = this.prisonVisitConfigDetail[e][this.prisonVisitConfigDetail[e].length - 1],
        start = last[0].split(':'),
        end = last[1].split(':'),
        duration = (parseInt(end[0]) - parseInt(start[0])) * 60 + parseInt(end[1]) - parseInt(start[1]),
        toEnd = new Date(1970, 0, 1, end[0], parseInt(end[1]) + duration)
      if (toEnd.getDate() !== 1) {
        this[`${ e }ToAdd`] = [last[1], '23:59']
      }
      else {
        var minute = `00${ toEnd.getMinutes() }`.slice(-2)
        this[`${ e }ToAdd`] = [last[1], `${ toEnd.getHours() }:${ minute }`]
      }
    }
  }
}
</script>

<style lang="css">
</style>

<template>
  <div class="yt-form">
    <el-form
      ref="form"
      label-width="140px"
      :model="meeting"
      inline
      :rules="rules">
      <div v-for="(type, idx) in types" :key="idx" style="clear: both;">
        <div class="el-form-item" :class="{ 'is-required': type.name==='usual' }" style="float: left;">
           <label class="el-form-item__label" style="width: 140px;padding-right: 2px;">{{ type.label }}</label>
        </div>
        <div class="time-queue" style="float: left; width: calc(100% - 150px);">
          <template v-for="(item, index) in meeting[type.name]">
            <el-form-item
              :key="index"
              :prop="type.name + '.' + index"
              :rules="[{ required: type.name === 'usual', message: '请选择会见时间段' }, { validator: validator.timeRange, prev: meeting[type.name][index - 1], prop: 'canAdd' + type.upperName, flag: flag }]">
              <el-time-picker
                is-range
                arrow-control
                v-model="meeting[type.name][index]"
                value-format="H:mm"
                format="H:mm"
                :disabled="Boolean(meeting[type.name][index + 1])"
                :editable="false"
                :clearable="false"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :picker-options="index === 0 ? {} : { start: meeting[type.name][index - 1][1], end: '23:59:59', minTime: meeting[type.name][index - 1][1], selectableRange: meeting[type.name][index - 1][1] + ' - 23:59:59' }"
                @change="getNextTime(type.name)">
              </el-time-picker>
            </el-form-item>
          </template>
          <el-button
            v-if="meeting[type.name][meeting[type.name].length - 1] !== null"
            :disabled="!flag['canAdd' + type.upperName]"
            type="primary"
            style="margin-right: 10px; margin-bottom: 22px;"
            @click="onAddRange(type.name)">新增会见时间段</el-button>
          <el-button
            v-if="meeting[type.name].length > 1"
            style="margin-left: 0; margin-bottom: 22px;"
            @click="onRestRange(type.name)">重置{{ type.label }}</el-button>
        </div>
      </div>
      <div style="clear: both;">
        <div class="el-form-item" style="float: left;">
           <label class="el-form-item__label" style="width: 140px;padding-right: 2px;">特殊日期配置</label>
        </div>
        <div class="time-queue" style="float: left; width: calc(100% - 150px);">
          <div v-for="(special, list) in meeting.special" :key="list">
            <el-form-item class="special-config">
              <el-date-picker
                v-model="special.date"
                :clearable="false"
                :editable="false"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                :picker-options="pickerOptions" />
            </el-form-item>
            <el-button
              v-if="special.date"
              type="text"
              @click="getSpecialQueue(list)">配置</el-button>
            <el-button
              v-if="special.queue[0] !== null"
              type="text"
              style="color: #F56C6C;"
              @click="deleteSpecialQueue(list)">删除</el-button>
            <el-button
              v-if="list === (meeting.special.length - 1) && special.queue[0] !== null"
              type="text"
              @click="addSpecialQueue">新增特殊日期</el-button>
          </div>
        </div>
      </div>
    </el-form>
    <div class="button-box">
      <el-button
        v-if="permission !== 'edit'"
        size="small"
        type="primary"
        @click="onPrevClick">上一步</el-button>
      <el-button
        v-if="permission !== 'edit'"
        size="small"
        type="primary"
        @click="onSubmit">新增</el-button>
      <el-button
        v-if="permission === 'edit'"
        size="small"
        type="primary"
        @click="onSubmit">更新</el-button>
    </div>
    <el-dialog
      :visible.sync="flag.dialog"
      class="authorize-dialog"
      :title="meeting.special[specialIndex].date + '会见配置'">
      <el-form
        ref="special"
        :model="meeting.special[specialIndex]"
        inline
        :rules="rules">
        <div class="time-queue">
          <el-form-item
            v-for="(q, order) in meeting.special[specialIndex].queue"
            :key="order"
            :prop="'queue.' + order"
            style="width: calc(30% - 10px); margin-right: 10px;"
            :rules="[{ required: true, message: '请选择会见时间段' }, { validator: validator.timeRange, prev: meeting.special[specialIndex][order - 1], prop: 'canAddSpecial', flag: flag }]">
            <el-time-picker
              is-range
              arrow-control
              v-model="meeting.special[specialIndex].queue[order]"
              value-format="H:mm"
              format="H:mm"
              :disabled="Boolean(meeting.special[specialIndex].queue[order + 1])"
              :editable="false"
              :clearable="false"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :picker-options="order === 0 ? {} : { start: meeting.special[specialIndex].queue[order - 1][1], end: '23:59:59', minTime: meeting.special[specialIndex].queue[order - 1][1], selectableRange: meeting.special[specialIndex].queue[order - 1][1] + ' - 23:59:59' }"
              @change="getNextTime('special')">
            </el-time-picker>
          </el-form-item>
          <el-button
            :disabled="!flag.canAddSpecial"
            type="primary"
            style="margin-right: 10px; margin-bottom: 22px;"
            @click="onAddRange('special')">新增会见时间段</el-button>
          <el-button
            style="margin-left: 0; margin-bottom: 22px;"
            @click="onRestRange('special')">重置</el-button>
        </div>
      </el-form>
      <template slot="footer">
        <el-button
          class="button-add"
          type="primary"
          size="mini"
          @click="onCloseDialog">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import validator from '@/utils'

const fillPre = (val) => {
  return `00${ val }`.slice(-2)
}

export default {
  data() {
    let permission = 'add'
    if (this.$route.meta.permission === 'edit') {
      permission = 'edit'
    }
    return {
      types: [
        { name: 'usual', label: '常规配置', upperName: 'Usual' },
        { name: 'weekend', label: '周末配置', upperName: 'Weekend' }
      ],
      meetingAdd: {
        usual: [['9:00', '9:30'], ['9:30', '10:00'], ['10:00', '10:30'], ['10:30', '11:00'], ['11:00', '11:30'], ['11:30', '12:00'], ['14:00', '14:30'], ['14:30', '15:00'], ['15:00', '15:30'], ['15:30', '16:00'], ['16:00', '16:30'], ['16:30', '17:00']],
        weekend: [['9:00', '9:30'], ['9:30', '10:00'], ['10:00', '10:30'], ['10:30', '11:00'], ['11:00', '11:30'], ['11:30', '12:00'], ['14:00', '14:30'], ['14:30', '15:00'], ['15:00', '15:30'], ['15:30', '16:00'], ['16:00', '16:30'], ['16:30', '17:00']],
        special: [
          { date: '', queue: [null] }
        ]
      },
      meeting: { usual: [null], weekend: [null], special: [{ date: '', queue: [null] }] },
      rules: {},
      flag: {
        canAddUsual: true,
        canAddWeekend: true,
        canAddSpecial: false,
        dialog: false
      },
      specialIndex: 0,
      usualToAdd: [],
      weekendToAdd: [],
      specialToAdd: [],
      pickerOptions: {
        disabledDate: (time) => {
          let yyyy = time.getFullYear(), MM = fillPre(time.getMonth() + 1), dd = fillPre(time.getDate())
          return (time.getTime() < Date.now()) || (this.meeting.special.find(item => item.date === `${ yyyy }-${ MM }-${ dd }`))
        }
      },
      validator,
      permission
    }
  },
  watch: {
    'meeting.usual': function(val) {
      if (val[val.length - 1] === null) return
      if (val[val.length - 1][1] === '23:59') {
        this.flag.canAddUsual = false
      }
      else {
        this.flag.canAddUsual = true
      }
    },
    'meeting.weekend': function(val) {
      if (val[val.length - 1] === null) return
      if (val[val.length - 1][1] === '23:59') {
        this.flag.canAddWeekend = false
      }
      else {
        this.flag.canAddWeekend = true
      }
    },
    'meeting.special': {
      handler: function(val) {
        this.canChangeSpecial()
      },
      deep: true
    },
    specialIndex(val) {
      this.canChangeSpecial()
    }
  },
  computed: {
    ...mapState(['prison'])
  },
  activated() {
    if (this.permission === 'edit') {
      this.getPrisonDetail({ id: this.$route.params.id }).then(res => {
        if (!res) return
        this.meeting = Object.assign({}, this.prison)
      })
    }
  },
  created() {
    if (this.permission === 'edit') return
    this.meeting = this.meetingAdd
    if (!sessionStorage.getItem('base')) {
      this.$router.push({ query: Object.assign({}, { tag: 'prisonBase' }) })
    }
    else if (parseInt(sessionStorage.getItem('step')) !== 2 || !sessionStorage.getItem('config')) {
      this.$router.push({ query: Object.assign({}, { tag: 'prisonConfig' }) })
    }
    this.types.forEach(type => {
      this.getNextTime(type.name)
    })
  },
  methods: {
    ...mapActions(['getPrisonDetail', 'addPrison', 'updatePrison']),
    onSubmit(e) {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.meeting.special[this.meeting.special.length - 1].date &&
            this.meeting.special[this.meeting.special.length - 1].queue[0] === null) {
            this.$confirm(`特殊日期配置中日期为${ this.meeting.special[this.meeting.special.length - 1].date }尚未设置会见时间段，是否继续？`, '提示', { type: 'warning' }).then(() => { this.handleSubmit() }).catch(() => {})
          }
          else {
            this.handleSubmit()
          }
        }
      })
    },
    handleSubmit() {
      if (this.permission !== 'edit') {
        let prison = Object.assign({}, JSON.parse(sessionStorage.getItem('base')), JSON.parse(sessionStorage.getItem('config')), this.meeting)
        this.handleQueue(prison)
        delete prison.usual
        delete prison.weekend
        delete prison.special
        this.addPrison(prison).then(res => {
          if (!res) return
          this.$router.push('/prison/list')
        })
      }
      else if (this.permission === 'edit') {
        let params = Object.assign({}, this.meeting)
        delete params.meetingQueue
        delete params.weekendQueue
        delete params.specialQueue
        this.handleQueue(params)
        if (params.meetingQueue.toString() !== this.prison.meetingQueue.toString()) {
          params.changed = 1
        }
        else {
          params.changed = 0
        }
        if ((!params.weekendQueue && !this.prison.weekendQueue) || (params.weekendQueue && this.prison.weekendQueue && (params.weekendQueue.toString() === this.prison.weekendQueue.toString()))) {
          params.weekendChanged = 0
        }
        else {
          params.weekendChanged = 1
        }
        this.updatePrison(params).then(res => {
          if (!res) return
          // if (this.$route.meta.role !== '3') this.$router.push('/prison/list')
          // else this.$router.push('/jails/detail')
        })
      }
    },
    handleQueue(prison) {
      prison.meetingQueue = []
      prison.usual.forEach(queue => {
        prison.meetingQueue.push(`${ queue[0] }-${ queue[1] }`)
      })
      if (prison.weekend[0] !== null) {
        prison.weekendQueue = []
        prison.weekend.forEach(queue => {
          prison.weekendQueue.push(`${ queue[0] }-${ queue[1] }`)
        })
      }
      if (prison.special[0].date && prison.special[0].queue[0] !== null) {
        let cfg = []
        prison.specialQueue = []
        prison.special.forEach(queue => {
          if (queue.queue[0] === null) return
          cfg = []
          queue.queue.forEach(c => {
            cfg.push(`${ c[0] }-${ c[1] }`)
          })
          prison.specialQueue.push({ day: queue.date, config: cfg })
        })
      }
    },
    onAddRange(e) {
      let last = e === 'special' ? this.meeting[e][this.specialIndex].queue[this.meeting[e][this.specialIndex].queue.length - 1] : this.meeting[e][this.meeting[e].length - 1]
      if (last === null) return false
      this.getNextTime(e)
      if (e !== 'special') this.meeting[e].push(this[`${ e }ToAdd`])
      else this.meeting[e][this.specialIndex].queue.push(this[`${ e }ToAdd`])
    },
    onRestRange(e) {
      if (e !== 'special') this.meeting[e] = [null]
      else this.meeting.special[this.specialIndex].queue = [null]
    },
    getNextTime(e) {
      let last = e === 'special' ? this.meeting[e][this.specialIndex].queue[this.meeting[e][this.specialIndex].queue.length - 1] : this.meeting[e][this.meeting[e].length - 1],
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
    },
    getSpecialQueue(index) {
      this.specialIndex = index
      this.flag.dialog = true
    },
    deleteSpecialQueue(index) {
      if (this.meeting.special.length === 1) this.meeting.special = [{ date: '', queue: [null] }]
      else {
        this.meeting.special.splice(index, 1)
      }
    },
    addSpecialQueue() {
      this.meeting.special.push({ date: '', queue: [null] })
    },
    onPrevClick(e) {
      this.$router.back()
    },
    onCloseDialog() {
      this.$refs.special.validate(valid => {
        if (valid) {
          this.flag.dialog = false
          this.specialIndex = 0
        }
      })
    },
    canChangeSpecial() {
      if (this.meeting.special[this.specialIndex].queue[this.meeting.special[this.specialIndex].queue.length - 1] === null) {
        this.flag.canAddSpecial = false
        return
      }
      if (this.meeting.special[this.specialIndex].queue[this.meeting.special[this.specialIndex].queue.length - 1][1] === '23:59') {
        this.flag.canAddSpecial = false
      }
      else {
        this.flag.canAddSpecial = true
      }
    }
  }
}
</script>

<style lang="css">
</style>

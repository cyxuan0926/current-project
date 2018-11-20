<template>
  <div class="yt-form">
    <el-form
      ref="form"
      label-width="140px"
      :model="meeting"
      inline
      :rules="rules">
      <div
        v-for="(type, idx) in types"
        :key="idx"
        style="clear: both;">
        <div
          class="el-form-item"
          :class="{ 'is-required': type.name==='usual' }"
          style="float: left;">
          <label
            class="el-form-item__label"
            style="width: 140px;padding-right: 2px;">{{ type.label }}</label>
        </div>
        <div style="float: left; width: calc(100% - 150px);">
          <template v-for="(item, index) in meeting[type.name]">
            <el-form-item
              :key="index"
              :prop="type.name + '.' + index"
              :rules="[{ required: type.name === 'usual', message: '请选择会见时间段' }]"
              style="width: calc(25% - 10px); min-width: 140px; max-width: 350px;">
              <m-time-range-picker
                :val="meeting[type.name][index]"
                :prev="meeting[type.name][index - 1]"
                :next="meeting[type.name][index + 1]"
                :type="type.name"
                @handleBlur="handleBlur" />
            </el-form-item>
          </template>
          <el-button
            :disabled="!flag['canAdd' + type.upperName]"
            type="primary"
            style="margin-right: 10px; margin-bottom: 22px;"
            @click="onAddRange(type.name)">新增会见时间段</el-button>
          <el-button
            v-if="meeting[type.name][0]"
            style="margin-left: 0; margin-bottom: 22px;"
            @click="onRestRange(type.name)">重置{{ type.label }}</el-button>
        </div>
      </div>
      <div style="clear: both;">
        <div
          class="el-form-item"
          style="float: left;">
          <label
            class="el-form-item__label"
            style="width: 140px;padding-right: 2px;">特殊日期配置</label>
        </div>
        <div
          class="time-queue"
          style="float: left; width: calc(100% - 150px);">
          <div
            v-for="(special, list) in meeting.special"
            :key="list">
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
              type="primary"
              @click="getSpecialQueue(list)">配置会见时间段</el-button>
            <el-button
              v-if="special.queue[0] !== null"
              type="text"
              style="color: #F56C6C;"
              @click="deleteSpecialQueue(list)">删除当前日期配置</el-button>
            <!-- v-if="list === (meeting.special.length - 1) && special.queue[0] !== null"-->
            <el-button
              type="text"
              @click="onAddRange('specialDate')">新增特殊日期</el-button>
          </div>
        </div>
      </div>
    </el-form>
    <div
      v-show="flag.dialog"
      style="float: left; width: calc(100% - 150px);">
      <el-form
        ref="special"
        :model="meeting.special[specialIndex]"
        inline
        :rules="rules">
        <div>
          <el-form-item
            style="width: calc(25% - 10px); min-width: 140px; max-width: 350px;"
            v-for="(q, order) in meeting.special[specialIndex].queue"
            :key="order"
            :prop="'queue.' + order">
            <m-time-range-picker
              :val="q"
              :prev="meeting.special[specialIndex].queue[order - 1]"
              :next="meeting.special[specialIndex].queue[order + 1]"
              type="special"
              @handleBlur="handleBlur" />
          </el-form-item>
          <el-button
            :disabled="!flag.canAddSpecial"
            type="primary"
            style="margin-right: 10px; margin-bottom: 22px;"
            @click="onAddRange('special')">新增会见时间段</el-button>
          <el-button
            v-if="meeting.special[specialIndex].queue[0]"
            style="margin-left: 0; margin-bottom: 22px;"
            @click="onRestRange('special')">重置特殊日期配置</el-button>
        </div>
      </el-form>
    </div>
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
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Moment from 'moment'

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
        usual: [['09:00', '09:30'], ['09:30', '10:00'], ['10:00', '10:30'], ['10:30', '11:00'], ['11:00', '11:30'], ['11:30', '12:00'], ['14:00', '14:30'], ['14:30', '15:00'], ['15:00', '15:30'], ['15:30', '16:00'], ['16:00', '16:30'], ['16:30', '17:00']],
        weekend: [null],
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
      pickerOptions: {
        disabledDate: (time) => {
          let t = Moment(new Date(time)).format('YYYY-MM-DD')
          return (time.getTime() < Date.now()) || (this.meeting.special.find(item => item.date === t))
        }
      },
      specialIndex: 0,
      permission
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
        this.types.forEach(type => {
          this.getNextTime(type.name, this.meeting[type.name][this.meeting[type.name].length - 1])
        })
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
      this.getNextTime(type.name, this.meeting[type.name][this.meeting[type.name].length - 1])
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
    handleBlur(e, type) {
      if (type !== 'special') {
        this.meeting[type][this.meeting[type].length - 1] = e
        if (type === 'usual') this.$refs.form.validateField('usual.0')
        this.getNextTime(type, e)
      }
      else {
        let queue = this.meeting.special[this.specialIndex].queue
        this.meeting.special[this.specialIndex].queue[queue.length - 1] = e
        this.$refs.special.validateField('queue.0')
        this.getNextTime(type, e)
      }
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
        if ((!params.specialQueue && !this.prison.specialQueue) || (params.specialQueue && this.prison.specialQueue && (params.specialQueue.toString() === this.prison.specialQueue.toString()))) {
          params.specialChanged = 0
        }
        else {
          params.specialChanged = 1
        }
        this.updatePrison(params).then(res => {
          if (!res) return
          if (this.$route.meta.role !== '3') this.$router.push('/prison/list')
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
    onAddRange(type) {
      if (type === 'specialDate') {
        this.meeting.special.push({ date: '', queue: [null] })
      }
      else if (type === 'special') {
        this.meeting.special[this.specialIndex].queue.push(this[`${ type }ToAdd`])
        let queue = this.meeting.special[this.specialIndex].queue
        this.getNextTime(type, queue[queue.length - 1])
      }
      else {
        this.meeting[type].push(this[`${ type }ToAdd`])
        this.getNextTime(type, this.meeting[type][this.meeting[type].length - 1])
      }
    },
    onRestRange(type) {
      if (type === 'special') {
        this.meeting.special[this.specialIndex].queue = [null]
      }
      else {
        this.meeting[type] = [null]
      }
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
    },
    getSpecialQueue(index) {
      this.specialIndex = index
      this.getNextTime('special', this.meeting.special[this.specialIndex].queue[this.meeting.special[this.specialIndex].queue.length - 1])
      this.flag.dialog = true
    },
    deleteSpecialQueue(index) {
      if (this.meeting.special.length === 1) this.meeting.special = [{ date: '', queue: [null] }]
      else {
        this.meeting.special.splice(index, 1)
      }
    },
    onPrevClick(e) {
      this.$router.back()
    }
  }
}
</script>

<style lang="css">
</style>

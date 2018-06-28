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
        <div class="time-queue1" style="float: left; width: calc(100% - 150px);">
          <template v-for="(item, index) in meeting[type.name]">
            <el-form-item
              :key="index"
              :prop="type.name + '.' + index"
              :rules="[{ required: type.name === 'usual', message: '请选择会见时间段' }, { validator: validator.timeRange, prev: meeting[type.name][index - 1], prop: 'canAdd' + type.upperName, flag: flag }]"
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
    </el-form>
    <div class="button-box">
      <el-button
        v-if="permission !== 'edit'"
        size="small"
        type="primary"
        @click="onSubmit">新增</el-button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import validator from '@/utils'

export default {
  data() {
    let permission = 'add'
    if (this.$route.meta.permission === 'edit') {
      permission = 'edit'
    }
    return {
      types: [
        // { name: 'usual', label: '常规配置', upperName: 'Usual' },
        { name: 'weekend', label: '周末配置', upperName: 'Weekend' }
      ],
      meetingAdd: {
        weekend: [['9:00', '9:30'], ['9:30', '10:00'], ['10:00', '10:30'], ['10:30', '11:00']]
      },
      meeting: { weekend: [null] },
      rules: {},
      flag: {
        canAddWeekend: true
      },
      weekendToAdd: [],
      validator,
      permission
    }
  },
  watch: {
    'meeting.weekend': function(val) {
      if (val[val.length - 1] === null) return
      if (val[val.length - 1][1] === '23:59') {
        this.flag.canAddWeekend = false
      }
      else {
        this.flag.canAddWeekend = true
      }
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
        console.log(this.meeting.weekend)
      })
    },
    handleBlur(e, type) {
      console.log(e, type)
      this.meeting[type]
    },
    handleSubmit() {
      if (this.permission !== 'edit') {
        let prison = Object.assign({}, JSON.parse(sessionStorage.getItem('base')), JSON.parse(sessionStorage.getItem('config')), this.meeting)
        this.handleQueue(prison)
        delete prison.weekend
        this.addPrison(prison).then(res => {
          if (!res) return
          this.$router.push('/prison/list')
        })
      }
      else if (this.permission === 'edit') {
        let params = Object.assign({}, this.meeting)
        delete params.weekendQueue
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
      if (prison.weekend[0] !== null) {
        prison.weekendQueue = []
        prison.weekend.forEach(queue => {
          prison.weekendQueue.push(`${ queue[0] }-${ queue[1] }`)
        })
      }
    },
    onAddRange(e) {
      let last = e === this.meeting[e][this.meeting[e].length - 1]
      if (last === null) return false
      this.getNextTime(e)
      this.meeting[e].push(this[`${ e }ToAdd`])
    },
    onRestRange(e) {
      this.meeting[e] = [null]
    },
    getNextTime(e) {
      let last = this.meeting[e][this.meeting[e].length - 1],
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
    onPrevClick(e) {
      this.$router.back()
    }
  }
}
</script>

<style lang="css">
</style>

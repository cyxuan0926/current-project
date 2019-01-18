<template>
  <el-row
    class="row-container"
    :gutter="0">
    <el-col :span="24">
      <div style="margin-bottom: 10px;">
        <label class="el-form-item__label">调整日期</label>
        <el-date-picker
          v-model="adjustDate"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :clearable="false"
          placeholder="选择日期"
          :picker-options="pickerOptions"/>
        <el-button
          type="primary"
          style="margin-left: 10px;"
          :loading="gettingConfigs"
          @click="getConfigs('sure')">确定</el-button>
        <label style="margin-left: 5px;font-size: 12px;color: red">注：仅支持2天后的会见申请调整</label>
        <div
          v-if="show"
          class="adjustTable"
          style="float: right;">
          <el-tag class="occupied">已分配且未调整</el-tag>
          <el-tag class="occupied is-choosed">待调整</el-tag>
          <el-tag class="occupied is-changed">已调整</el-tag>
        </div>
      </div>
      <div
        class="adjustTable"
        v-if="show">
        <div class="adjust-row bold">
          <div
            class="adjust-col"
            :style="colWidth">终端号</div>
          <div
            v-for="meetingQueue in meetingAdjustment.meetingQueue"
            :key="meetingQueue"
            class="adjust-col"
            :style="colWidth">{{ meetingQueue }}</div>
        </div>
        <div
          v-for="(terminal, row) in meetingAdjustment.terminals"
          :key="row"
          class="adjust-row">
          <div
            class="adjust-col bold"
            :style="colWidth">
            {{ terminal.terminalNumber }}
          </div>
          <div
            v-for="(meetingQueue, col) in meetingAdjustment.meetingQueue"
            :key="col"
            class="adjust-col pointer"
            :class="[
              {
                'occupied': meetings[terminal.terminalNumber][meetingQueue].id,
                'is-choosed': clicked.length === 1 && clicked[0].terminalNumber === terminal.terminalNumber && clicked[0].duration === meetingQueue,
                'is-choosed-occupied': clicked.length === 2 && clicked[1].terminalNumber === terminal.terminalNumber && clicked[1].duration === meetingQueue,
                'is-changed': meetings[terminal.terminalNumber][meetingQueue].changed
            }]"
            :style="colWidth"
            @click="onCellClick(row, col, meetings[terminal.terminalNumber][meetingQueue], $event)">
            {{ meetings[terminal.terminalNumber][meetingQueue].name }}
          </div>
        </div>
        <!-- <div class="adjust-row">
          <div class="adjust-col" :style="colWidth">
            待调整：
          </div>
          <div class="adjust-col" :style="lastRowWidth">
            <template v-if="clicked.length > 0">{{ clicked[0].name }}(终端号：{{ clicked[0].terminalNumber }}，会见时间：{{ clicked[0].duration }})</template>
            <template v-if="clicked.length > 1">⇄{{ clicked[1].name }}(终端号：{{ clicked[1].terminalNumber }}，会见时间：{{ clicked[1].duration }})</template>
          </div>
        </div> -->
      </div>
      <el-button
        v-if="show"
        class="button-add"
        type="info"
        size="small"
        @click="resetMeetings">重置</el-button>
      <el-button
        v-if="show"
        class="button-add"
        type="primary"
        size="small"
        :loading="buttonLoading"
        @click="onSubmit">确认调整</el-button>
    </el-col>
  </el-row>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import helper from '@/filters/modules/date'
export default {
  data() {
    return {
      show: false,
      colWidth: 0,
      lastRowWidth: 0,
      adjustDate: helper.dateFormate(new Date(Date.now() + 172800000)),
      realDate: helper.dateFormate(new Date(Date.now() + 172800000)),
      // adjustDate: helper.dateFormate(new Date(2018, 6, 3, 12, 12, 12)),
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() + 86400000
        }
      },
      meetings: {},
      origin: {},
      clicked: [],
      buttonLoading: false,
      gettingConfigs: true
    }
  },
  computed: {
    ...mapState(['meetingAdjustment', 'meetingAdjustRefresh'])
  },
  watch: {
    meetingAdjustRefresh(val) {
      console.log(this.adjustDate, this.realDate)
      if (val && val === this.realDate) {
        console.log('需要刷新')
        this.adjustDate = this.realDate
        this.getConfigs()
      }
    }
  },
  methods: {
    ...mapActions(['getMeetingConfigs', 'adjustMeeting', 'meetingAdjustDealing']),
    getConfigs(e) {
      this.show = false
      let adjustDate = this.realDate
      if (e === 'sure') adjustDate = this.adjustDate
      this.gettingConfigs = true
      this.getMeetingConfigs(adjustDate).then(res => {
        console.log(this.meetingAdjustRefresh, 'getConfigs')
        this.gettingConfigs = false
        if (!res) return
        this.realDate = adjustDate
        if (!this.meetingAdjustment.meetingQueue || !this.meetingAdjustment.meetingQueue.length) {
          this.$message.closeAll()
          this.$message.warning('该日无可调整时间段')
          return
        }
        if (!this.meetingAdjustment.terminals || !this.meetingAdjustment.terminals.length) {
          this.$message.closeAll()
          this.$message.warning('该日无可用终端')
          return
        }
        this.meetingAdjustment.terminals.forEach((terminal, index) => {
          this.meetings[terminal.terminalNumber] = { terminalId: terminal.id }
          this.origin[terminal.terminalNumber] = {}
          this.meetingAdjustment.meetingQueue.map(meetingQueue => {
            this.meetings[terminal.terminalNumber][meetingQueue] = { terminalNumber: terminal.terminalNumber, duration: meetingQueue }
            this.origin[terminal.terminalNumber][meetingQueue] = { terminalNumber: terminal.terminalNumber, duration: meetingQueue }
          })
        })
        this.meetingAdjustment.meetings.map(meeting => {
          let time = meeting.meetingTime.replace(`${ this.realDate } `, '')
          meeting = Object.assign({}, meeting)
          this.meetings[meeting.terminalNumber][time] = Object.assign({}, meeting, { duration: time })
          this.origin[meeting.terminalNumber][time] = Object.assign({}, meeting, { duration: time })
        })
        this.clicked = []
        this.colWidth = `width: ${ 100 / (this.meetingAdjustment.meetingQueue.length + 1) }%`
        this.lastRowWidth = `width: ${ 100 - 100 / (this.meetingAdjustment.meetingQueue.length + 1) }%`
        this.show = true
        this.meetingAdjustDealing(false)
      })
    },
    saveOrigin() {
      Object.keys(this.origin).forEach(terminal => {
        Object.keys(this.origin[terminal]).forEach(duration => {
          if (this.meetings[terminal][duration].changed) {
            delete this.meetings[terminal][duration].changed
            this.origin[terminal][duration] = Object.assign({}, this.meetings[terminal][duration])
          }
        })
      })
    },
    onCellClick(row, col, meeting) {
      // meeting.changed = true
      this.clicked.push(meeting)
      if (this.clicked.length === 2 && (this.clicked[0].id || this.clicked[1].id)) {
        if (this.clicked[0].id === this.clicked[1].id) {
          this.clicked = []
        }
        else {
          let toChange = Object.assign({}, this.meetings[this.clicked[0].terminalNumber][this.clicked[0].duration])
          this.meetings[this.clicked[0].terminalNumber][this.clicked[0].duration] = Object.assign({}, this.clicked[1], { terminalNumber: this.clicked[0].terminalNumber, duration: this.clicked[0].duration })
          this.meetings[this.clicked[1].terminalNumber][this.clicked[1].duration] = Object.assign({}, toChange, { terminalNumber: this.clicked[1].terminalNumber, duration: this.clicked[1].duration })
          setTimeout(() => {
            this.clicked.forEach((meeting, index) => {
              if (this.origin[this.clicked[index].terminalNumber][this.clicked[index].duration].id !== this.meetings[this.clicked[index].terminalNumber][this.clicked[index].duration].id) {
                this.meetings[this.clicked[index].terminalNumber][this.clicked[index].duration].changed = true
                if (this.origin[this.clicked[index].terminalNumber][this.clicked[index].duration].id && this.meetings[this.clicked[index].terminalNumber][this.clicked[index].duration].id) {
                  this.meetings[this.clicked[index].terminalNumber][this.clicked[index].duration].adjustStatus = 1
                }
                else {
                  this.meetings[this.clicked[index].terminalNumber][this.clicked[index].duration].adjustStatus = 0
                }
              }
              else {
                this.meetings[this.clicked[index].terminalNumber][this.clicked[index].duration].changed = false
              }
            })
            this.clicked = []
          }, 150)
        }
      }
      else if (this.clicked.length === 2 && !this.clicked[0].id && !this.clicked[1].id) {
        this.clicked.shift()
      }
      this.show = false
      this.show = true
    },
    resetMeetings() {
      this.adjustDate = this.realDate
      this.getConfigs()
    },
    onSubmit() {
      this.buttonLoading = true
      let params = [], meeting = {}
      Object.keys(this.meetings).forEach(terminal => {
        Object.keys(this.meetings[terminal]).forEach(queue => {
          if (this.meetings[terminal][queue].id && this.meetings[terminal][queue].changed) {
            meeting = {
              name: this.meetings[terminal][queue].name,
              id: this.meetings[terminal][queue].id,
              meetingTime: `${ this.realDate } ${ queue }`,
              terminalId: this.meetings[terminal].terminalId,
              terminalNumber: terminal,
              jailId: `${ this.meetingAdjustment.config.jail_id }`,
              adjustStatus: this.meetings[terminal][queue].adjustStatus
            }
            params.push(meeting)
          }
        })
      })
      if (!params.length) {
        this.buttonLoading = false
        return
      }
      this.adjustMeeting(params).then(res => {
        this.buttonLoading = false
        if (!res) return
        // this.resetMeetings()
        this.clicked = []
        this.saveOrigin()
      })
    }
  },
  mounted() {
    this.getConfigs()
  },
  destroyed() {
    // console.log(999)
  }
}
</script>

<style lang="css" scoped>
.adjustTable{
  margin-bottom: 10px;
  overflow-x: auto;
}
.bold{
  font-weight: bold;
}
.pointer{
  cursor: pointer;
}
.pointer:hover{
  background: #f5f7fa;
}
.adjustTable .adjust-row{
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}
.adjustTable .adjust-row:last-child .adjust-col{
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 10px;
}
.adjustTable .adjust-row .adjust-col:last-child{
  border-right: 1px solid #ebeef5;
}
.adjustTable .adjust-col{
  min-width: 100px;
  min-height: 40px;
  border-top: 1px solid #ebeef5;
  border-left: 1px solid #ebeef5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #909399;
  flex-shrink: 0;
  box-sizing: border-box;
}
.adjustTable .occupied{
  background: #3c8dbc;
  transition: background 0.3s ease-in-out;
  color: #fff;
}
.occupied.is-changed{
  background: #606266;
}
.adjustTable .is-choosed, .occupied.is-choosed, .occupied.is-choosed-occupied{
  background: #C0C4CC;
}
</style>

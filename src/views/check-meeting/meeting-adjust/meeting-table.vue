<template>
  <section>
    <div class="meeting-list" v-show="hasTerminal && hasQueue">
      <div class="meeting-list-deviceNo">
        <h3 class="meeting-list-cell meeting-list-th">终端号</h3>
        <div class="meeting-list-cell meeting-list-th" v-for="t in terminals" :key="t.id">{{ t.terminalNumber }}</div>
      </div>
      <div class="meeting-list-deviceName">
        <h3 class="meeting-list-cell meeting-list-th">终端别名</h3>
        <div class="meeting-list-cell meeting-list-cell__tername" v-for="t in terminals" :key="t.id">
          <template v-if="!t.isEdit">
            <span class="meeting-list-cell__tername__flex">{{ t.terminalName }}</span>
            <el-button class="meeting-list-cell__tername__edit" type="text" icon="el-icon-edit-outline" @click="handleEditTername(t)"></el-button>
          </template>
          <template v-else>
            <el-input
              maxlength="10"
              class="meeting-list-cell__tername__flex meeting-list-cell__tername__inp"
              placeholder="请输入终端别名"
              v-model="t.terminalName"
              clearable>
            </el-input>
            <el-button class="meeting-list-cell__tername__btn" type="text" @click="handleSaveTername(t)">保存</el-button>
          </template>
        </div>
      </div>
      <div class="meeting-list-jailArea">
        <h3 class="meeting-list-cell meeting-list-th">监区</h3>
        <div class="meeting-list-cell ellipsis" v-for="t in terminals" :key="t.id">{{ t.prisonConfigName }}</div>
      </div>
      <div class="meeting-list-block">
        <div class="meeting-list-block-scroller" style="width: 9000px">
          <section class="meeting-list-block__wrap" v-for="(meetings, i) in meetingsData" 
            :key="meetings.id || uuId()">
            <div class="meeting-list-block__head">
              <div class="meeting-list-cell meeting-list-th">{{ meetingQueue[i] }}</div>
            </div>
            <m-draggable class="meeting-list-block__body meetings-col" :options="dragOptions">
              <div class="meeting-list-cell meeting-list-cell__drag" 
                v-for="m in meetings"
                :key="m.id || uuId()"
                :class="[ m.id ? 'draggable' : 'undraggable' ]"
                :data-meeting-time="m.meetingTime"
                :data-terminal-id="m.terminalId"
                :data-terminal-number="m.terminalNumber"
                :__MEETING__.prop="m">
                  <template v-if="!!m.id">
                    <div class="meeting-list-cell__names ellipsis">{{ m | getMeetingsName }}</div>
                    <el-button class="meeting-list-cell__acrossdate" type="text" icon="el-icon-date" @click="handleShowacross(m)"></el-button>
                  </template>
              </div>
            </m-draggable>
          </section>
          <section class="meeting-list-block__wrap" v-for="(specials, i) in specialData" 
            :key="specials.id || uuId()">
            <div class="meeting-list-block__head">
              <div class="meeting-list-cell meeting-list-th">{{ meetingQueue[i] }}</div>
            </div>
            <div class="meeting-list-cell meeting-list-cell__drag" 
                v-for="m in specials"
                :key="m.id || uuId()"
                :class="[ m.id ? 'draggable' : 'undraggable' ]"
                :data-meeting-time="m.meetingTime"
                :data-terminal-id="m.terminalId"
                :data-terminal-number="m.terminalNumber"
                :__MEETING__.prop="m">
                  <template v-if="!!m.id">
                    <div class="meeting-list-cell__names ellipsis">{{ m | getMeetingsName }}</div>
                    <el-button class="meeting-list-cell__acrossdate" type="text" icon="el-icon-date" @click="handleShowacross(m, true)"></el-button>
                  </template>
              </div>
          </section>
        </div>  
      </div>
    </div>

    <el-dialog
      class="cross-meeting-dialog"
      title="可视电话申请调整"
      :visible.sync="meetingVisible"
      width="802px">
      <div class="across-filter">
        <label class="filter__label" :class="{'special': isSpecial}">调整日期</label>
        <el-date-picker
          style="width: 200px; margin-right: 10px;"
          v-model="acrossAdjustDate"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :clearable="false"
          :picker-options="pickerOptions"
          @change="handleGetConfigs"
        />
        <!-- <el-button type="primary" size="mini" @click="handleGetConfigs">查询</el-button> -->
      </div>
      <template v-if="isSpecial">
        <section>
          <div class="across-filter" v-if="isSeparateByArea">
            <label class="filter__label special">选择区域</label>
            <el-select style="width: 200px" v-model="areaType" placeholder="请选择区域">
              <el-option
                v-for="item in $store.state.areaOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="across-filter">
            <label class="filter__label special">通话时长</label>
            <el-input style="width: 200px" v-model="crossDuration" disabled></el-input>
          </div>
          <div class="across-filter">
            <label class="filter__label special">可视电话通话时间</label>
            <el-time-picker
              style="width: 150px;"
              v-model="timeRangeStart"
              format="HH:mm"
              :picker-options="selectRange"
              :clearable="false"
              @change="handleTimepickerChange">
            </el-time-picker>
            <label style="margin: 0 10px;">至</label>
            <el-time-picker
              style="width: 150px;"
              v-model="timeRangeEnd"
              format="HH:mm"
              disabled>
            </el-time-picker>
          </div>
        </section>
        <p class="timerange-tips" v-show="isShowTips">{{showTips}}</p>
      </template>
      <template v-else>
        <section>
          <el-tabs
            v-if="isSeparateByArea"
            v-model="areaType"
            type="card">
            <el-tab-pane v-for="t in $store.state.areaOptions"
              :key="t.value"
              :label="t.label"
              :name="t.value" />
          </el-tabs>
        </section>
        <el-table
          v-if="crossMeetingQueue && crossMeetingQueue.length"
          class="across-table"
          :data="crossMeetingData"
          @cell-click="handleCellClick"
          border>
          <el-table-column
            v-if="crossMeetingQueue && crossMeetingQueue.length > 4"
            fixed
            prop="terminalNumber"
            label="终端号"
            width="80">
          </el-table-column>
          <el-table-column
            v-else
            prop="terminalNumber"
            label="终端号"
            width="80">
          </el-table-column>
          <el-table-column
            v-if="crossMeetingQueue && crossMeetingQueue.length > 4"
            fixed
            show-overflow-tooltip
            prop="terminalName"
            label="终端别名"
            width="100">
          </el-table-column>
          <el-table-column
            v-else
            show-overflow-tooltip
            prop="terminalName"
            label="终端别名"
            width="100">
          </el-table-column>
          <el-table-column
            v-if="crossMeetingQueue && crossMeetingQueue.length > 4"
            fixed
            show-overflow-tooltip
            prop="prisonConfigName"
            label="监区"
            width="100">
          </el-table-column>
          <el-table-column
            v-else
            show-overflow-tooltip
            prop="prisonConfigName"
            label="监区"
            width="100">
          </el-table-column>
          <el-table-column
            v-for="t in crossMeetingQueue"
            align="center"
            width="120"
            :key="t"
            :prop="t"
            :label="t">
            <template slot-scope="scope">
              <span v-if="scope.row[t]">已申请</span>
              <el-button class="acrosssel-btn" type="text" v-else @click="handleSelectAcross(scope.row.terminalNumber, t)">{{ crossMeetingCurrent | getMeetingsName }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelAcross">取 消</el-button>
        <el-button type="primary" @click="handleSaveAcross" :disabled="!isSpecial && !crossDateSelect">确 定</el-button>
      </span>
    </el-dialog>

    <!-- <div>
    <div
      class="meeting-table meeting-table__header"
      v-show="hasTerminal && hasQueue"
    >
      <div class="table-col table-cell">终端号</div>
      <div
        class="table-col table-cell"
        v-for="timeCell in meetingQueue"
        :key="timeCell"
      >
        {{ timeCell }}
      </div>
    </div>

    <div
      class="meeting-table meeting-table__body"
      v-show="hasTerminal && hasQueue"
    >
      <div class="table-col">
        <div
          class="table-cell"
          v-for="terminal in terminals"
          :key="terminal.id"
        >
          {{ terminal.terminalNumber }}
        </div>
      </div>

      <m-draggable
        class="table-col meetings-col"
        v-for="item in meetingsData"
        :key="item.id || uuId()"
        :options="dragOptions"
      >
        <div
          v-for="meeting in item"
          :key="meeting.id || uuId()"
          :class="['table-cell', meeting.id ? 'draggable' : 'undraggable']"
          :data-meeting-time="meeting.meetingTime"
          :data-terminal-id="meeting.terminalId"
          :data-terminal-number="meeting.terminalNumber"
          :__MEETING__.prop="meeting"
        >
          {{ meeting.name }}
        </div>
      </m-draggable>
    </div>
  </div> -->
  </section>

</template>

<script>
import { uuId } from "@/utils/helper";
import http from '@/service'
import Moment from 'moment'
import { mapActions, mapState } from "vuex";
export default {
  props: {
    adjustDate: String,
    dayinLimit: String,
    isSeparateByArea: Boolean,
    areaType: String,
    onDragFinish: {
      type: Function,
      default: function() {}
    }
  },

  data() {
    return {
      showTips: '',
      isShowTips: false,
      timeRangeStart: new Date(),
      timeRangeEnd: new Date(),
      crossDuration: 5,
      isSpecial: true,
      timeRange: [],
      selectRange: {},
      meetingsData: [],
      specialData: [],
      terminals: [],
      crossMeetingData: [],
      crossMeetings: [],
      crossTerminals: [],
      crossMeetingQueue: [],
      crossMeetingCurrent: {},
      crossDateSelect: '',
      meetingVisible: false,
      acrossAdjustDate: '',
      pickerOptions: {}
    };
  },

  watch: {
    'meetingAdjustment.terminals'() {
      this.terminals = this.meetingAdjustment.terminals.map(t => Object.assign(t, {
        isEdit: false
      }))
      this.meetingsData = this.getMeetingsData()
      this.specialData = this.getMeetingsData('specialQueue')
      document.querySelector('.meeting-list-block-scroller').style.width = 188 * (this.meetingsData.length + this.specialData.length) + 'px'
    },

    areaType() {
      this.handleGetConfigs()
    }
  },

  computed: {
    ...mapState(["meetingAdjustment"]),

    hasQueue() {
      return this.meetingQueue.length || this.specialQueue.length
    },

    hasTerminal() {
      return this.terminals.length
    },

    hasMeetings() {
      return this.meetings.length
    },

    dragOptions() {
      return {
        group: "shared",
        disabled: !this.hasMeetings,
        onEnd: this.onEnd
      };
    },

    // 通话时间段
    meetingQueue() {
      return this.meetingAdjustment.meetingQueue || [];
    },

    // 特殊通话时间
    specialQueue() {
      return this.meetingAdjustment.specialQueue || [];
    },

    // 终端
    // terminals: {
    //   get() {
    //     return this.meetingAdjustment.terminals.map(t => Object.assign(t, {
    //       isEdit: false
    //     })) || [];
    //   }
    // },

    // 通话纪录
    meetings() {
      return this.meetingAdjustment.meetings || [];
    },

    // 通话日期
    meetingDate() {
      if (this.hasMeetings) {
        // return this.meetings[0].applicationDate;
        return this.meetings[0].meetingTime.split(' ')[0];
      }

      return "";
    }
  },

  filters: {
    getMeetingsName(m) {
      let names = ''
      if (m.prisonerName) {
        names += `${m.prisonerName} `
      }
      if (m.name) {
        names += `${m.name}`
      }
      return names
    }
  },

  methods: {
    // 通话数据
    getMeetingsData(key = 'meetingQueue') {
      if (!this.hasQueue || !this.hasTerminal) {
        return [];
      }

      return this[key].map(timeCell => {
        return this.terminals.map(terminal => {
          let meeting = this.meetings.find(meeting => {
            return (
              meeting.meetingTime.includes(timeCell) &&
              meeting.terminalNumber === terminal.terminalNumber
            );
          });

          meeting = meeting || {
            terminalNumber: terminal.terminalNumber,
            meetingTime: this.meetingDate + " " + timeCell
          };

          return { ...meeting, terminalId: terminal.id };
        });
      });
    },

    removeSelClass() {
      let els = document.querySelectorAll('.acrosssel-btn')
      els.forEach(el => el.classList.remove('selected'))
    },

    handleCellClick(row, column, cell, event) {
      this.removeSelClass()
      let elBtn = cell.querySelector('.acrosssel-btn')
      if( elBtn ) {
        elBtn.classList.add('selected')
      }
    },

    checkInmeetings() {
      return this.meetingQueue.some(m => {
        let {sm, em} = this.getStartandEndTime(m)
        return this.timeRangeStart.diff(sm) > 0 && this.timeRangeStart.diff(em) < 0 || this.timeRangeEnd.diff(sm) > 0 && this.timeRangeEnd.diff(em) < 0
      })
    },

    getStartandEndTime(time) {
      let _timeRange = time.split('-')
      let sm = _timeRange[0].split(':')
      sm = Moment({ hour: sm[0], minute: sm[1] })
      let em = _timeRange[1].split(':')
      em = Moment({ hour: em[0], minute: em[1] })
      return {
        sm,
        em
      }
    },

    setTimeRange(dateObj) {
      let _start = Moment(dateObj)
      let _end = Moment(dateObj).add(this.crossDuration, 'm')
      let _last = Moment({ hour: '23', minute: '59' })
      this.timeRangeStart = _start
      this.timeRangeEnd = _last.diff(_end) > 0 ? _end : _last
    },

    handleShowacross(m, flag) {
      let _this = this
      let _adjustDate = Moment(this.adjustDate)
      this.isSpecial = !!flag
      if (this.isSpecial) {
        let {sm, em} = this.getStartandEndTime(m.meetingTime.split(' ')[1])
        this.crossDuration = em.diff(sm, 'm')
        let _now = new Date()
        this.selectRange = {
          selectableRange: `${Moment(_now).format('HH:mm')}:00 - 23:58:00`,
          format: 'HH:mm'
        }
        this.setTimeRange(_now)
        this.showTips = ''
        this.isShowTips = false
      }
      this.acrossAdjustDate =  (!_adjustDate.diff(Moment(this.dayinLimit)) ? _adjustDate.subtract(1, 'd') : _adjustDate.add(1, 'd')).format('YYYY-MM-DD')
      this.pickerOptions = {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 3600 * 1000 || (_this.isSeparateByArea && Moment(time).format('YYYY-MM-DD') === _this.adjustDate) || time.getTime() > Moment(_this.dayinLimit).valueOf();
        }
      }
      this.crossMeetingCurrent = m
      this.handleGetConfigs()
      .then(() => {
        this.meetingVisible = true
      })
    },

    handleTimepickerChange(val) {
      this.isShowTips = false
      this.setTimeRange(val)
    },

    handleSelectAcross(terNum, time) {
      this.crossDateSelect = {
        name: this.crossMeetingCurrent.name,
        id: this.crossMeetingCurrent.id,
        meetingTime: `${this.acrossAdjustDate} ${time}`,
        terminalId: this.terminals.find(t => t.terminalNumber == terNum).id,
        terminalNumber: terNum,
        adjustStatus: 0
      }
    },
    async handleSaveAcross() {
      if (this.isSpecial) {
        if (this.checkInmeetings()) {
          this.showTips = '（通话时间与常规配置中的通话时间冲突，请重新选择！）'
          this.isShowTips = true
          return
        }
        if ((this.showTips = this.checkCanMeetings())) {
          this.isShowTips = true
          return
        }
        this.crossDateSelect = {
          name: this.crossMeetingCurrent.name,
          id: this.crossMeetingCurrent.id,
          meetingTime: `${this.acrossAdjustDate} ${Moment(this.timeRangeStart).format('HH:mm')}-${Moment(this.timeRangeEnd).format('HH:mm')}`,
          terminalId: this.terminalId,
          terminalNumber: this.terminalNumber,
          adjustStatus: 0
        }
      }

      if (this.isSeparateByArea) {
        this.crossDateSelect.area = this.areaType
      }

      await http.adjustMeeting([this.crossDateSelect])
      this.removeSelClass()
      this.crossDateSelect = ''
      this.meetingVisible = false
      this.$emit('on-across-submit')
    },
    handleCancelAcross() {
      this.removeSelClass()
      this.crossDateSelect = ''
      this.meetingVisible = false
    },

    checkCanMeetings() {
      if (!this.crossMeetingQueue || !this.crossMeetingQueue.length) {
        return "该日不可申请可视电话"
      } else if (!this.crossTerminals || !this.crossTerminals.length) {
        return "该日无可用终端"
      }
    },

    async handleGetConfigs() {
      let { data } = await http.getMeetingConfigs({
        inputDate: this.acrossAdjustDate,
        area: this.isSeparateByArea ? this.areaType : ''
      })
      this.isShowTips = false
      let applyList = {}
      this.crossMeetings = data.meetings
      this.crossTerminals = data.terminals
      this.crossMeetingQueue = data.meetingQueue

      this.$message.closeAll()
      let message = this.checkCanMeetings()
      if (message) {
        this.$message.warning(message)
      }

      this.crossMeetingData = []
      if (this.crossMeetings) {
        this.crossMeetings.forEach(m => {
          applyList[m.terminalNumber + m.meetingTime.split(' ')[1]] = true
        })
      }

      if (this.crossTerminals && this.crossMeetingQueue) {
        this.crossTerminals.forEach(c => {
          let m = {
            terminalNumber: c.terminalNumber,
            terminalName: c.terminalName,
          }
          this.crossMeetingQueue.forEach(q => {
            m[q] = !!applyList[c.terminalNumber + q]
          })
          this.crossMeetingData.push(m)
        })
      }

    },

    setTerStatus(ter, flag) {
      this.terminals = this.terminals.map(t => {
        if( t.id === ter.id ) {
          ter.isEdit = flag
          return ter
        }
        return t
      })
    },

    handleEditTername(ter) {
      this.setTerStatus(ter, true)
    },

    async handleSaveTername(ter) {
      let res = await http.updateTerminalName(ter)
      if ( res ) {
        this.setTerStatus(ter, false)
      }
    },

    uuId,

    onEnd(evt) {
      // 移动的元素
      const elDragged = evt.item;
      // 被置换的元素
      const elSwapped = evt.swapItem;

      // 移动元素的参数
      const originParams = this.getMeetingParams(elDragged);
      // 目标元素的参数
      const targetParams = this.getMeetingParams(elSwapped);

      // 把目标位置的参数赋值移动的元素上
      this.setMeetingParams(elDragged, targetParams);
      // 把移动位置的参数赋值给目标的元素上
      this.setMeetingParams(elSwapped, originParams);

      // 拖拽完成
      this.onDragFinish(this.meetingsAjusted());
    },

    // 通话调整完成
    meetingsAjusted() {
      const result = [];
      // 通话的列元素
      const meetingCols = document.querySelectorAll(".meetings-col");

      // 遍历每一列
      for (let i = 0; i < meetingCols.length; i++) {
        // 通话的单元格
        const meetingCells = meetingCols[i].childNodes;

        // 遍历单元格
        for (let j = 0; j < meetingCells.length; j++) {
          // 单元格
          const meetingCell = meetingCells[j];

          if (
            this.isMeeting(meetingCell) &&
            this.hasMeetingChanged(meetingCell)
          ) {
            const newMeetingParams = this.getMeetingParams(meetingCell);

            result.push({
              name: meetingCell.__MEETING__.name,
              id: meetingCell.__MEETING__.id,
              meetingTime: newMeetingParams["data-meeting-time"],
              terminalId: parseInt(newMeetingParams["data-terminal-id"]),
              terminalNumber: parseInt(
                newMeetingParams["data-terminal-number"]
              ),
              adjustStatus: this.isSwap(meetingCell) ? 1 : 0
            });
          }
        }
      }

      return result;
    },

    // 通话调整
    hasMeetingChanged(el) {
      const meetingParams = this.getMeetingParams(el);
      const { terminalNumber, meetingTime } = el.__MEETING__;
      // 通话时间段/终端号不同 就说明这个元素调整了会见
      return (
        terminalNumber !== meetingParams["data-terminal-number"] ||
        meetingTime !== meetingParams["data-meeting-time"]
      );
    },

    // 是否置换: 1: 没有变化 0: 变化
    isSwap(el) {
      const meetingParams = this.getMeetingParams(el);

      return this.meetings.find(meeting => {
        return (
          meeting.terminalNumber === meetingParams["data-terminal-number"] &&
          meeting.meetingTime === meetingParams["data-meeting-time"]
        );
      });
    },

    // 有通话的单元格
    isMeeting(el) {
      return el.__MEETING__.id;
    },

    // 获取通话参数
    getMeetingParams(el) {
      if (!el) {
        return {};
      }

      // 返回的参数对象 通话时间/终端id/终端号
      return {
        "data-meeting-time": el.getAttribute("data-meeting-time"),
        "data-terminal-id": el.getAttribute("data-terminal-id"),
        "data-terminal-number": el.getAttribute("data-terminal-number")
      };
    },

    // 设置通话参数
    setMeetingParams(el, params) {
      if (!el) {
        return;
      }

      Object.keys(params).forEach(k => {
        el.setAttribute(k, params[k]);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.meeting-list {
  width: 100%;
  overflow: hidden;
  display: flex;

  .meeting-list-deviceNo {
    .meeting-list-cell {
      width: 90px;
    }
  }

  .meeting-list-jailArea {
    .meeting-list-cell {
      width: 150px;
    }
  }

  .meeting-list-block {
    flex: 1;
    overflow: hidden;
    overflow-x: auto;
    position: relative;
  }

  .meeting-list-block__wrap {
    float: left;
  }

  .meeting-list-block__body {
    .meeting-list-cell {
      margin-top: 0;

      &.draggable {
        color: #fff;
        background-color: #3c8dbc;
      }

      &.swap-target {
        color: #fff;
        background-color: #f56c6c;
      }
    }
  }

  .meeting-list-cell {
    width: 180px;
    background-color: #f4f4f5;
    height: 42px;
    margin: 8px 4px;
    border-radius: 3px;
    line-height: 42px;
    text-align: center;
    background-color: #fff;
    box-shadow: 0px 0px 2px rgba(0,0,0,0.382);
  }

  .meeting-list-th {
    background-color: #f4f4f5;
    font-size: 14px;
  }

  .meeting-list-cell__tername {
    display: flex;

    &__flex {
      flex: 1;
      text-align: center;
    }

    &__edit {
      margin-right: 10px;
    }

    /deep/ &__inp input {
      border: none;
    }

    &__btn {
      margin-right: 6px;
    }
  }

  .meeting-list-cell__drag {
    display: flex;

    .meeting-list-cell__names {
      flex: 1;
      cursor: move;
    }
    .meeting-list-cell__acrossdate {
      color: #fff;
      cursor: pointer;
      margin-right: 10px;
    }
  }
}

.cross-meeting-dialog {
  /deep/ .el-dialog__body::after {
    display: table;
    content: ' ';
    clear: both;
  }
}

.across-filter {
  display: flex;
  align-items: center;
  margin-bottom: 16px;

  .filter__label {
    font-size: 12px;
    margin-right: 10px;
    color: #666;
  
    &.special {
      min-width: 110px;
      text-align: right;
    }
  }
}

.timerange-tips {
  padding-left: 120px;
  color: red;
  font-size: 12px;
}

.across-table {
  width: auto;
  float: left;
  /deep/ td {
    border-bottom: 1px solid #e6e6e6 !important;
    position: relative;
  }

  .acrosssel-btn {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    color: #fff;

    &.selected {
      color: #fff;
      background-color: #3c8dbc;
    }
  }
}

.meeting-table {
  display: flex;
  color: #606266;

  &__body {
    border-top: none;
  }

  .table-col {
    flex: 1;

    &:first-child .table-cell {
      background-color: #f4f4f5;
    }
  }

  .table-cell {
    height: 42px;
    margin: 8px 4px;
    border-radius: 3px;
    line-height: 42px;
    text-align: center;
    background-color: #fff;
    box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.382);
    overflow: hidden;

    &.draggable {
      color: #fff;
      background-color: #3c8dbc;
      cursor: move;
    }

    &.swap-target {
      color: #fff;
      background-color: #f56c6c;
    }
  }

  &__header {
    .table-cell {
      margin: 0 4px;
      background-color: #f4f4f5;
    }
  }
}
</style>

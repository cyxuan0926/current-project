<template>
  <section>
    <div class="meeting-list" v-show="hasTerminal && hasMeetingQueue">
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
        </div>
      </div>
    </div>

    <el-dialog
      class="cross-meeting-dialog"
      title="亲情电话申请调整"
      :visible.sync="meetingVisible"
      width="702px">
      <section>
        <div class="across-filter">
          <label class="filter__label">调整日期</label>
          <el-date-picker
            style="width: 150px; margin-right: 10px;"
            v-model="acrossAdjustDate"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :clearable="false"
            :picker-options="pickerOptions"
          />
          <el-button type="primary" size="mini" @click="handleGetConfigs">查询</el-button>
        </div>
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelAcross">取 消</el-button>
        <el-button type="primary" @click="handleSaveAcross" :disabled="!crossDateSelect">确 定</el-button>
      </span>
    </el-dialog>

    <!-- <div>
    <div
      class="meeting-table meeting-table__header"
      v-show="hasTerminal && hasMeetingQueue"
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
      v-show="hasTerminal && hasMeetingQueue"
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
    onDragFinish: {
      type: Function,
      default: function() {}
    }
  },

  data() {
    return {
      meetingsData: [],
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
      document.querySelector('.meeting-list-block-scroller').style.width = 188 * this.meetingsData.length + 'px'
    }
  },

  computed: {
    ...mapState(["meetingAdjustment"]),

    hasMeetingQueue() {
      return this.meetingQueue.length > 0;
    },

    hasTerminal() {
      return this.terminals.length > 0;
    },

    hasMeetings() {
      return this.meetings.length > 0;
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
    getMeetingsData() {
      if (!this.hasMeetingQueue || !this.hasTerminal) {
        return [];
      }

      return this.meetingQueue.map(timeCell => {
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
      cell.querySelector('.acrosssel-btn').classList.add('selected')
    },

    handleShowacross(m) {
      let _this = this
      let _adjustDate = Moment(this.adjustDate)
      this.acrossAdjustDate =  (!_adjustDate.diff(Moment(this.dayinLimit)) ? _adjustDate.subtract(1, 'd') : _adjustDate.add(1, 'd')).format('YYYY-MM-DD')
      this.pickerOptions = {
        disabledDate(time) {
          return time.getTime() < Date.now() || Moment(time).format('YYYY-MM-DD') === _this.adjustDate || time.getTime() > Moment(_this.dayinLimit).valueOf();
        }
      }
      this.crossMeetingCurrent = m
      this.handleGetConfigs()
      .then(() => {
        this.meetingVisible = true
      })
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

    async handleGetConfigs() {
      let { data } = await http.getMeetingConfigs(this.acrossAdjustDate)
      let applyList = {}
      this.crossMeetings = data.meetings
      this.crossTerminals = data.terminals
      this.crossMeetingQueue = data.meetingQueue

      let message = ""
      if (!this.crossMeetingQueue || !this.crossMeetingQueue.length) {
        message = "该日不可申请亲情电话"
      } else if (!this.crossMeetings || !this.crossMeetings.length) {
        message = "该日无申请"
      } else if (!this.crossTerminals || !this.crossTerminals.length) {
        message = "该日无可用终端"
      }

      if (message) {
        this.$message.closeAll()
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

.across-filter {
  display: flex;
  align-items: center;
  margin-bottom: 16px;

  .filter__label {
    font-size: 12px;
    margin-right: 10px;
    color: #666;
  }
}

.cross-meeting-dialog {
  /deep/ .el-dialog__body::after {
    display: table;
    content: ' ';
    clear: both;
  }
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

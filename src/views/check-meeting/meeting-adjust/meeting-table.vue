<template>
  <section>
    <div class="meeting-list">
      <div class="meeting-list-deviceNo">
        <h3 class="meeting-list-cell meeting-list-th">终端号</h3>
        <div class="meeting-list-cell meeting-list-th">23625</div>
        <div class="meeting-list-cell meeting-list-th">23626</div>
        <div class="meeting-list-cell meeting-list-th">23627</div>
      </div>
      <div class="meeting-list-deviceName">
        <h3 class="meeting-list-cell meeting-list-th">终端别名</h3>
        <div class="meeting-list-cell">哈哈</div>
        <div class="meeting-list-cell">啦啦啦</div>
        <div class="meeting-list-cell">啦啦啦</div>
      </div>
      <div class="meeting-list-jailArea">
        <h3 class="meeting-list-cell meeting-list-th">监区</h3>
        <div class="meeting-list-cell">监区1213</div>
        <div class="meeting-list-cell">监区565665</div>
        <div class="meeting-list-cell">监区7879</div>
      </div>
      <div class="meeting-list-block">
        <div class="meeting-list-block-scroller" style="width: 1000px">
          <div class="meeting-list-block__head">
            <div class="meeting-list-cell meeting-list-th">09:00-09:25</div>
            <div class="meeting-list-cell meeting-list-th">09:00-09:25</div>
            <div class="meeting-list-cell meeting-list-th">09:00-09:25</div>
            <div class="meeting-list-cell meeting-list-th">09:00-09:25</div>
          </div>
          <div class="meeting-list-block__body">
            <div class="meeting-list-cell"></div>
            <div class="meeting-list-cell"></div>
            <div class="meeting-list-cell draggable">吕能仕（囚）吕能仕（亲）</div>
            <div class="meeting-list-cell"></div>
            <div class="meeting-list-cell"></div>
            <div class="meeting-list-cell"></div>
            <div class="meeting-list-cell"></div>
          </div>
        </div>
      </div>
    </div>



    <div>
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
  </div>
  </section>

</template>

<script>
import { uuId } from "@/utils/helper";

export default {
  props: {
    meetingAdjustment: {
      type: Object,
      default: () => {
        return { meetingQueue: [], terminals: [], meetings: [] };
      }
    },

    onDragFinish: {
      type: Function,
      default: function() {}
    }
  },

  data() {
    return {};
  },

  computed: {
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
    terminals() {
      return this.meetingAdjustment.terminals || [];
    },

    // 通话纪录
    meetings() {
      return this.meetingAdjustment.meetings || [];
    },

    // 通话日期
    meetingDate() {
      if (this.hasMeetings) {
        return this.meetings[0].applicationDate;
      }

      return "";
    },

    // 通话数据
    meetingsData() {
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
    }
  },

  methods: {
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
      width: 120px;
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
    position: relative;
  }

  .meeting-list-block__head,
  .meeting-list-block__body {
    width: 100%;

    .meeting-list-cell {
      float: left;
    }
  }

  .meeting-list-block__body {
    .meeting-list-cell {
      margin-top: 0;

      &.draggable {
        color: #fff;
        background-color: #3c8dbc;
        cursor: move;
      }
    }
  }

  .meeting-list-cell {
    width: 220px;
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

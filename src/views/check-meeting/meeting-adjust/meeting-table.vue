<template>
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

    meetingQueue() {
      return this.meetingAdjustment.meetingQueue || [];
    },

    terminals() {
      return this.meetingAdjustment.terminals || [];
    },

    meetings() {
      return this.meetingAdjustment.meetings || [];
    },

    meetingDate() {
      if (this.hasMeetings) {
        return this.meetings[0].applicationDate;
      }

      return "";
    },

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
      const elDragged = evt.item;
      const elSwapped = evt.swapItem;

      const originParams = this.getMeetingParams(elDragged);
      const targetParams = this.getMeetingParams(elSwapped);

      this.setMeetingParams(elDragged, targetParams);
      this.setMeetingParams(elSwapped, originParams);

      this.onDragFinish(this.meetingsAjusted());
    },

    meetingsAjusted() {
      const result = [];
      const meetingCols = document.querySelectorAll(".meetings-col");

      for (let i = 0; i < meetingCols.length; i++) {
        const meetingCells = meetingCols[i].childNodes;

        for (let j = 0; j < meetingCells.length; j++) {
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

    hasMeetingChanged(el) {
      const meetingParams = this.getMeetingParams(el);
      const { terminalNumber, meetingTime } = el.__MEETING__;

      return (
        terminalNumber !== meetingParams["data-terminal-number"] ||
        meetingTime !== meetingParams["data-meeting-time"]
      );
    },

    isSwap(el) {
      const meetingParams = this.getMeetingParams(el);

      return this.meetings.find(meeting => {
        return (
          meeting.terminalNumber === meetingParams["data-terminal-number"] &&
          meeting.meetingTime === meetingParams["data-meeting-time"]
        );
      });
    },

    isMeeting(el) {
      return el.__MEETING__.id;
    },

    getMeetingParams(el) {
      if (!el) {
        return {};
      }

      return {
        "data-meeting-time": el.getAttribute("data-meeting-time"),
        "data-terminal-id": el.getAttribute("data-terminal-id"),
        "data-terminal-number": el.getAttribute("data-terminal-number")
      };
    },

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

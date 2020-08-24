<template>
  <el-row class="row-container" v-loading="loading" :gutter="0">
    <div class="filter">
      <label class="filter__label">调整日期</label>
      <el-date-picker
        v-model="adjustDate"
        type="date"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        :clearable="false"
        :picker-options="pickerOptions"
      />
      <el-button type="primary" @click="getConfigs">确定</el-button>
      <!-- <label class="filter__tip">注：仅支持2天后的申请调整</label> -->
    </div>

    <meeting-table
      ref="meetingTable"
      :adjustDate="adjustDate"
      :dayinLimit="dayinLimit"
      :on-drag-finish="onDragFinish"
      @on-get-configs="getConfigs"
    />

    <div class="operates" v-show="hasMeetings">
      <el-button type="warning" size="medium" @click="reset">重置</el-button>
      <el-button type="primary" size="medium" @click="onSubmit">
        确认调整
      </el-button>
    </div>
  </el-row>
</template>

<script>
import MeetingTable from "./meeting-table";

import { mapActions, mapState } from "vuex";
import helper from "@/filters/modules/date";
import Moment from 'moment'
export default {
  name: "MeetingAjust",

  components: { MeetingTable },

  data() {
    return {
      loading: false,
      // 默认展现两天后的会见申请数据
      adjustDate: '',
      dayinLimit: '',
      pickerOptions: {}
    };
  },

  computed: {
    ...mapState(["meetingAdjustment", "meetingAdjustRefresh"]),

    hasMeetings() {
      return (
        this.meetingAdjustment.meetings &&
        this.meetingAdjustment.meetings.length > 0
      );
    },

    hasMeetingQueue() {
      return (
        this.meetingAdjustment.meetingQueue &&
        this.meetingAdjustment.meetingQueue.length > 0
      );
    },

    hasTerminal() {
      return (
        this.meetingAdjustment.terminals &&
        this.meetingAdjustment.terminals.length > 0
      );
    }
  },

  watch: {
    meetingAdjustRefresh(val) {
      if (val === this.adjustDate) {
        this.getConfigs();
      }
    }
  },

  // 导航触发之前
  async beforeRouteLeave(to, from, next) {
    const meetings = this.meetingsAjusted();

    if (meetings.length > 0) {
      try {
        await this.$confirm("可视亲情电话申请调整未确认，请确认调整！", "提示", {
          distinguishCancelAndClose: true,
          closeOnClickModal: false,
          closeOnPressEscape: false,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });

        // 通话调整
        await this.adjustMeeting(meetings);
      } catch (err) {
        if (err === "close") {
          return next(false);
        }
      }
    }

    next();
  },

  async created() {
    this.adjustDate = this.defaultDate()
    await this.getConfigs();
    let limitDay = this.meetingAdjustment.config && JSON.parse(this.meetingAdjustment.config.settings)
    limitDay = limitDay.day_in_limit && parseInt(limitDay.day_in_limit) || 15
    this.dayinLimit = Moment().add(limitDay, 'd').format('YYYY-MM-DD')
    this.pickerOptions = {
      disabledDate(time) {
        return time.getTime() < Date.now() - 24 * 3600 * 1000 ||  time.getTime() > Date.now() + limitDay * 24 * 3600 * 1000;
      }
    }
  },

  beforeDestroy() {
    this.removePageunloadListener();
  },

  methods: {
    ...mapActions([
      "getMeetingConfigs",
      "adjustMeeting",
      "meetingAdjustDealing"
    ]),

    // 拖拽完成
    onDragFinish(meetings) {
      if (meetings.length > 0) {
        this.addPageunloadListener();
      } else {
        this.removePageunloadListener();
      }
    },

    // 确认调整
    async onSubmit() {
      const meetings = this.meetingsAjusted();

      if (meetings.length > 0) {
        try {
          await this.$confirm("确认进行调整吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          });

          this.loading = true;
          await this.adjustMeeting(meetings);
          this.removePageunloadListener();

          setTimeout(() => {
            this.loading = false;
          }, 300);
        } catch (err) {}
      } else {
        this.$message.warning("请修改后再进行提交");
      }
    },

    // 重置
    async reset() {
      this.loading = true;
      await this.getConfigs();
      this.$message.closeAll();

      setTimeout(() => {
        this.loading = false;
      }, 300);
    },

    // 获取配置
    async getConfigs() {
      // 获取监狱配置
      await this.getMeetingConfigs(this.adjustDate);
      this.meetingAdjustDealing(false);

      let message = "";

      if ( !this.hasMeetingQueue ) {
        message = "该日不可申请亲情电话";
      } else if (!this.hasMeetings) {
        message = "该日无申请";
      } else if (!this.hasTerminal) {
        message = "该日无可用终端";
      }
      if (message) {
        this.$message.closeAll();
        this.$message.warning(message);
      }
    },

    // 在浏览器窗口关闭或者刷新时 添加beforeunload事件
    addPageunloadListener() {
      window.addEventListener("beforeunload", this.pageunloadHandler);
    },

    // 移除beforeunload事件
    removePageunloadListener() {
      window.removeEventListener("beforeunload", this.pageunloadHandler);
    },

    // beforeunload事件 处理函数
    pageunloadHandler(e) {
      if (e) {
        // 阻止默认行为
        e.returnValue = "";
      }

      return "";
    },

    // 通话调整完成
    meetingsAjusted() {
      const result = this.$refs.meetingTable.meetingsAjusted();

      // 在数据字段中加入监狱id
      result.forEach(meeting => {
        meeting.jailId = parseInt(this.$store.state.global.user.jailId);
      });

      return result;
    },

    // 默认日期
    defaultDate() {
      // return helper.dateFormate(Date.now() + 2 * 24 * 3600 * 1000)
      return helper.dateFormate(Date.now())
    }
  }
};
</script>

<style lang="scss" scoped>
.row-container {
  padding-bottom: 40px;
}

.filter {
  margin-bottom: 20px;
  color: #606266;

  .el-date-editor {
    width: 160px;
    margin: 0 10px;
  }

  .filter__tip {
    margin-left: 10px;
    color: red;
  }
}

.operates {
  margin-top: 20px;
  text-align: right;

  button {
    font-size: 12px;
  }
}
</style>

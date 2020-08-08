<template>
  <el-form>
    <el-form-item label="亲情电话预约日期管理">
      <div class="remote-visit-box">
        <el-select
          v-model="advanceDayLimit_[0]"
          :disabled="disabled"
          size="small"
        >
          <el-option
            v-for="item in beginDays"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
        &nbsp;&nbsp;天后 &nbsp;&nbsp;&nbsp;至 &nbsp;&nbsp;&nbsp;
        <el-select 
          v-model="advanceDayLimit_[1]"
          :disabled="disabled"
          size="small"
        >
          <el-option
            v-for="item in endDays"
            :key="item"
            :label="item + beginDayLimit_"
            :value="item + beginDayLimit_">
          </el-option>
        </el-select>
        &nbsp;&nbsp;天内(包含)
        <p v-if="!disabled" class="tip">
          *家属预约亲情电话日期设置，以自然日为单位
        </p>
        <div
          v-if="!disabled && hasUpdateBtn && hasChange"
          class="operate"
        >
          <el-button
            type="primary"
            size="small"
            @click="onSubmit"
          >
            更新
          </el-button>
        </div>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapState } from 'vuex';
import isEqual from 'lodash/isEqual'
export default {
  props: {
    // v-model的值
    value: Array,
    // 是否有更新按钮-暂时不知道啥用
    hasUpdateBtn: {
      type: Boolean,
      default: true
    },
    onSubmit: {
      type: Function,
      default: () => () => {}
    }
  },
  data() {
    return {
      // 实际提前的天数
      advanceDayLimit_: [2, 15],
    }
  },
  computed: {
    ...mapState(['advanceDayLimit', 'global']),
    endDayLimit_() {
      return this.advanceDayLimit_[1]
    },
    beginDayLimit_() {
      return this.advanceDayLimit_[0]
    },
    beginDays() {
      return this.endDayLimit_ ? this.endDayLimit_ - 1 : 60
    },
    endDays() {
      return this.beginDayLimit_ ? 60 - this.beginDayLimit_ : 60
    },
    // 是否修改了亲情电话申请提前天数
    hasChange() {
      // 不等于默认的配置天数
      return !isEqual(this.advanceDayLimit_, this.advanceDayLimit)
    },
    // 当角色不是 国科服务管理人员的时候 为禁止状态
    disabled() {
      return parseInt(this.global.user.role) !== 0
    }
  },
  watch: {
    // 当数据变化后 驱动 input 事件 响应 v-model的值双向绑定
    advanceDayLimit_(val) {
      this.$emit('input', val)
    },
    // v-model 语法糖的本质
    value: {
      immediate: true,
      handler(val) {
        this.advanceDayLimit_ = val
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.remote-visit-box {
  display: flex;

  .el-select {
    width: 72px;
  }

  .tip {
    margin-left: 12px;
    color: #f56c6c;
  }
  
  .operate {
    flex: 1;
    text-align: right;
  }
}

.el-form-item {
  margin-bottom: 18px;
}
</style>


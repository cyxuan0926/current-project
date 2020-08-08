<template>
  <el-form>
    <el-form-item label="亲情电话预约日期管理">
      <div class="remote-visit-box">
        <el-select v-model="advanceDayLimit_" :disabled="disabled" size="small" placeholder="">
          <el-option
            v-for="item in 7"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
        &nbsp;&nbsp;天
        <p v-if="!disabled" class="tip">
          *家属预约亲情电话日期设置，以自然日为单位
        </p>
        <div v-if="!disabled && hasUpdateBtn && hasChange" class="operate">
          <el-button
            type="primary"
            size="small"
            @click="handleSubmit"
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
export default {
  props: {
    // v-model的值
    value: Number,
    // 是否有更新按钮-暂时不知道啥用
    hasUpdateBtn: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 实际提前的天数
      advanceDayLimit_: null
    }
  },
  computed: {
    ...mapState(['advanceDayLimit', 'global']),
    // 是否修改了亲情电话申请提前天数
    hasChange() {
      // 不等于默认的配置天数
      return this.advanceDayLimit !== this.advanceDayLimit_
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
  },
  methods: {
    // 更新操作 调用父组件的 submit事件
    handleSubmit() {
      this.$emit("submit", this.advanceDayLimit_)
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


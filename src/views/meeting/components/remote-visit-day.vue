<template>
  <el-form>
    <el-form-item label="亲情电话申请需提前">
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
          *每位家属需提前预约可视亲情电话天数（以自然日为单位）
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
    value: Number,
    hasUpdateBtn: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      advanceDayLimit_: null
    }
  },
  computed: {
    ...mapState(['advanceDayLimit', 'global']),
    hasChange() {
      return this.advanceDayLimit !== this.advanceDayLimit_
    },
    disabled() {
      return parseInt(this.global.user.role) !== 0
    }
  },
  watch: {
    advanceDayLimit_(val) {
      this.$emit('input', val)
    },
    value: {
      immediate: true,
      handler(val) {
        this.advanceDayLimit_ = val
      }
    }
  },
  methods: {
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


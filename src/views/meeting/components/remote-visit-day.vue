<template>
  <el-form>
    <el-form-item label="可视电话预约日期管理">
      <div class="remote-visit-box">
        <el-select v-model="value.advanceDayLimit" :disabled="disabled" size="small">
          <el-option
            v-for="item in advanceDayLimit_opt"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
        &nbsp;&nbsp;天后
        <span style="margin: 0 10px;">至</span>
        <el-select v-model="value.dayInLimit" :disabled="disabled" size="small">
          <el-option
            v-for="item in dayInLimit_opt"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
        &nbsp;&nbsp;天内（包含）
        <p v-if="!disabled" class="tip">
          *家属预约可视电话日期设置，以自然日为单位
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
    value: Object,
    // 是否有更新按钮-暂时不知道啥用
    hasUpdateBtn: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 实际提前的天数
      advanceDayLimit_: null,
      dayInLimit_: null,
      advanceDayLimit_opt: [],
      dayInLimit_opt: []
    }
  },
  computed: {
    ...mapState(['global']),
    // 是否修改了可视电话申请提前天数
    hasChange() {
      // 不等于默认的配置天数
      return this.advanceDayLimit_ && this.value.advanceDayLimit !== this.advanceDayLimit_ || this.dayInLimit_ && this.value.dayInLimit !== this.dayInLimit_
    },
    // 当角色不是 国科服务管理人员的时候 为禁止状态
    disabled() {
      return parseInt(this.global.user.role) !== 0
    }
  },
  watch: {
    // 当数据变化后 驱动 input 事件 响应 v-model的值双向绑定
    // advanceDayLimit_(val) {
    //   this.dayInLimit_opt = []
    //   for(let i = val; i <= 15; i++) {
    //     this.dayInLimit_opt.push(i)
    //   }
    //   if( val > this.dayInLimit_ ) {
    //     this.dayInLimit_ = val
    //   }
    //   this.$emit('input', {
    //     advanceDayLimit: val,
    //     dayInLimit: this.dayInLimit
    //   })
    // },
    'value.advanceDayLimit': {
      deep: true,
      handler(val) {
        this.dayInLimit_opt = []
        for(let i = val; i <= 15; i++) {
          this.dayInLimit_opt.push(i)
        }
        if( val > this.value.dayInLimit ) {
          this.value.dayInLimit = val
        }
      }
    }

    // dayInLimit_(val) {
    //   this.$emit('input', {
    //     advanceDayLimit: this.advanceDayLimit,
    //     dayInLimit: val
    //   })
    // },

    // v-model 语法糖的本质
    // value: {
    //   immediate: true,
    //   handler(val) {
    //     this.advanceDayLimit_ = val.advanceDayLimit
    //     this.dayInLimit_ = val.dayInLimit
    //   }
    // }
  },
  methods: {
    // 更新操作 调用父组件的 submit事件
    handleSubmit() {
      this.$emit("submit")
    }
  },
  mounted() {
    this.advanceDayLimit_opt = []
    for(let i = 2; i <= 15; i++) {
      this.advanceDayLimit_opt.push(i)
    }
    this.advanceDayLimit_ = this.value.advanceDayLimit
    this.dayInLimit_ = this.value.dayInLimit
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
    color: $red;
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


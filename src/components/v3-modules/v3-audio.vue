<template>
  <div class="audio">
    <div class="audio-box">
      <template v-if="!value">
        <div class="no-video">
          <i class="iconfont icon-yinpinaudio47" />
        </div>
      </template>

      <template v-else>
        <m-audio :value="value" />
      </template>
    </div>

    <div class="audio-upload__buttons">
      <el-upload ref="$uploadRef" v-bind="$elUploadAttrs">
        <slot name="default">
          <!-- 默认就是 触发文件选择框的内容 的插槽 -->
          <!-- loading: 这个是按钮禁用状态 el-upload 才是真正的禁用 -->
          <el-button
            class="el-button_trigger"
            slot="trigger"
            v-bind="$triggerButtonAttrs"
          >上传音频</el-button>
        </slot>
      </el-upload>

      <!-- 其余自定义的插槽 -->
      <slot name="otherSlots" />
    </div>
  </div>
</template>

<script>
import { ref, onUnmounted } from '@vue/composition-api'

import composableUpload from '@/common/composables/upload'
export default {
  name: 'V3Audio',

  props: {
    value: {
      type: String,
      default: ''
    },

    elUploadAttrs: {
      type: Object,
      default: () => ({})
    },

    sizeLimit: {
      type: Number,
      default: 0
    },

    triggerButtonAttrs: {
      type: Object,
      default: () => ({})
    },

    'on-control-parent-loading': {
      type: Function,
      default: () => () => {}
    }
  },

  setup(props, { emit }) {
    // data
    const uploadType = ref('音频')
    const $accpet = ref('audio/*')

    const {
      $elUploadAttrs,
      $uploadRef,
      unmountedMethod,
      $triggerButtonAttrs
    } = composableUpload(props, { emit }, { uploadType, $accpet })

    // Lifecycle
    onUnmounted(() => {
      unmountedMethod()
    })

    return {
      $uploadRef,
      $elUploadAttrs,
      $triggerButtonAttrs
    }
  }
}
</script>

<style lang="scss" scoped>
.audio {
  display: flex;
  align-items: center;
  &-box {
    width: 192px;
    /deep/ .no-video {
      height: 36px;
      width: $absolutely-measure;
      background: #E5E5E5;
      line-height: 36px;
      text-align: center;
      color: #8C8080;
      flex-shrink: 0;
      border-radius: 4px;
      .iconfont {
        font-size: 20px;
      }
    }

    .progress__bar {
      height: .16rem;
      background: #264c90;
    }
  }

  &-upload__buttons {
    margin-left: 10px;
    /deep/ .el-button_trigger {
      padding: 10px 12px !important;
    }
  }
}
</style>

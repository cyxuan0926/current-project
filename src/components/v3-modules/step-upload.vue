<template>
  <div class="step-upload">
    <m-excel-upload ref="$stepUpload" :configs="excelUploadConfigs" />

    <el-dialog
      class="authorize-dialog upload-dialog"
      ref="$stepUploadDialog"
      :title="dialogTitle"
      :visible.sync="uploadDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      @open="onOpenUploadDialog"
    >
      <el-row class="el-row__process">
        <el-col :span="20" :offset="2">
          <el-steps
            class="el-steps__upload-process"
            :active="status"
            finish-status="success"
          >
            <template v-for="(tag, index) in $uploadStepsTabOptions">
              <el-step :key="index" :title="tag.label" />
            </template>
          </el-steps>
        </el-col>

        <el-col class="process-col_tips">
          <span>准备导入数据总计：{{ $stepUploadValidateUploadResult.total }}条</span>

          <span>已用时：{{ spendTime }}秒</span>

          <span>进度：{{ percent }}%</span>
        </el-col>

        <el-col class="process-col_waiting">请稍后...</el-col>
      </el-row>

      <el-dialog
        class="authorize-dialog"
        append-to-body
        custom-class="upload-dialog__inner"
        ref="$stepUploadInnerDialog"
        title="导入结果提示"
        :visible.sync="uploadInnerDialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="onUploadInnerDialogClose"
      >
        <div style="line-height: 30px; margin-top: 10px">
          <i class="el-icon-success green" style="font-size: 20px; margin-right: 10px"></i>成功：{{ $stepUploadValidateUploadResult.successTotal }}条<br />

          <template v-if="!!$stepUploadValidateUploadResult.failTotal">
            <i class="el-icon-error red" style="font-size: 20px; margin-right: 10px"></i>失败：{{ $stepUploadValidateUploadResult.failTotal }}条

            <p style="padding-left: 30px">原因：上传的Excel文件内容格式有误，请检查文件内容，仔细对照下载的模版数据。</p>

            <p style="padding-left: 30px">导入失败数据：
              <!-- 为了扩展处理下载的处理 -->
              <slot name="elDialogExcelDownloadSlot" v-bind="$stepUploadValidateUploadResult">
                <m-excel-download
                  :path="$dialogExcelDownloadRequest['path']"
                  :params="{ fileName: $stepUploadValidateUploadResult.filepath }"
                  :buttonsProps="$excelExportButtonProps"
                  :text="$dialogExcelDownloadRequest['text']"
                  :apiConfigs="$dialogExcelDownloadRequest['apiConfigs']"
                />
              </slot>
            </p>
          </template>
        </div>

        <template #footer>
          <div class="inner-dialog__footer">
            <el-button type="primary" @click="uploadInnerDialogVisible = false">确 定</el-button>
          </div>
        </template>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import {
  ref,
  reactive,
  computed,
  toRefs
} from "@vue/composition-api"
import router from "@/router"
import Vue from "vue"
import composableStepUpload from '@/common/composables/step-upload'
import store from "@/store"
import { uploadStepsTabOptions } from '@/common/constants/const'

export default {
  name: 'StepUpload',

  props: {
    // 标签页的选项
    tabItems: {
      type: Array,
      default: () => [],
    },

    'on-init-data': {
      type: Function,
      default: () => {}
    },

    // dialogExcelDownloadRequest: path/apiConfigs/text
    dialogExcelDownloadRequest: {
      type: Object,
      default: () => ({}),
    },

    excelExportButtonProps: {
      type: Object,
      default: () => {
        return {
          attrs: {},
          listeners: {}
        }
      }
    },

    $uploadStepsTabOptions: {
      type: Array,
      default: () => {
        return uploadStepsTabOptions
      }
    },

    // url, module, params, methods
    excelUploadRequest: {
      type: Object,
      default: () => ({})
    }
  },

  setup(props) {
    // props
    const {
      tabItems,
      onInitData,
      $uploadStepsTabOptions,
      excelUploadRequest
    } = toRefs(props)

    // data
    const $stepUpload = ref(null)
    const $stepUploadDialog = ref(null)
    const uploadDialogVisible = ref(false)
    const $stepUploadInnerDialog = ref(null)
    const uploadInnerDialogVisible = ref(false)

    const {
      status,
      spendTime,
      percent,
      $dialogExcelDownloadRequest,
      $excelExportButtonProps
    } = composableStepUpload(props)

    // computed
    // 导入弹框的文案
    const dialogTitle = computed(() => {
      const tabItem = tabItems.value.filter(tabItem => tabItem.name === $tabs.value)
      const text = (tabItem[0] && tabItem[0]["label"]) || router.currentRoute.meta.breadcrumbName

      return `${ text }导入`
    })

    const $stepUploadValidateUploadResult = computed(() => store.state.v3Component.stepValidateUploadResult)
    const $stepUploadResult = computed(() => store.state.v3Component.stepUploadResult)

    // methods
    const onResetAndcloseUploadDialog = async isSuccess => {
      uploadDialogVisible.value = false

      if (isSuccess) {
        await onInitData.value()
      }
    }

    const onOpenUploadDialog = () => {
      Vue.nextTick(() => {
        $stepUpload.value.onManualUpload()
      })
    }

    // 关闭上传内层弹框的回调函数
    const onUploadInnerDialogClose = () => {
      setTimeout(() => {
        const _temp = !!$stepUploadValidateUploadResult.value.successTotal

        onResetAndcloseUploadDialog(_temp)
      }, 1000)
    }

    const onChange = file => {
      if (uploadDialogVisible.value) {
        return
      }

      if (file) {
        uploadDialogVisible.value = true
      }
    }

    // el-upload 上传文件前的钩子函数
    const beforeUpload = file => {
      spendTime.value = 0
      percent.value = 0
      status.value = 0

      store.commit("v3Component/setValidateExcelResult", {
        successTotal: 0,
        failTotal: 0,
        filepath: "",
        total: 0,
      })

      let count = 0, index = 0

      // 上次文件的定时器
      const uploadInterver = setInterval(async () => {
        status.value += 1
        percent.value += 15
        spendTime.value += 0.5

        if (status.value === 4) {
          clearInterval(uploadInterver)

          // 上次文件到服务器
          const isSuccess = await store.dispatch('v3Component/commonUploadFile', file)

          if (!isSuccess) {
            onResetAndcloseUploadDialog()

            return
          }

          // 验证excel的定时器
          const validateInterver = setInterval(async () => {
            count++

            if (count === 1) {
              spendTime.value += 1

              // 验证excel
              const {
                url,
                methods,
                params,
                module
              } = excelUploadRequest.value

              const { path } = $stepUploadResult.value

              const isSuccess = await store.dispatch('v3Component/commonValidateUpload', {
                url,
                params: {
                  filepath: path,
                  ...params
                },
                methods,
                module
              })

              clearInterval(validateInterver)

              if (!isSuccess) {
                onResetAndcloseUploadDialog()

                return
              }

              // 模拟完成最后两步
              const processInterver = setInterval(() => {
                index++

                if (index === 1) {
                  percent.value += 20
                  spendTime.value += 1
                  status.value = status.value + 1

                  clearInterval(processInterver)

                  spendTime.value += 1
                  status.value += 1
                  percent.value = 100

                  setTimeout(() => {
                    uploadInnerDialogVisible.value = true
                  }, 1500)
                } else {
                  spendTime.value += 1
                }
              }, 1000)
            } else {
              spendTime.value += 1
            }
          }, 1000)
        } else {
          spendTime.value += 1
        }
      }, 500)

      return false
    }

    const excelUploadConfigs = reactive({
      attrs: {
        autoUpload: false,
        limit: 1,
        beforeUpload: beforeUpload,
        onChange: onChange,
      }
    })

    return {
      $stepUpload,
      $stepUploadDialog,
      uploadDialogVisible,
      excelUploadConfigs,
      dialogTitle,
      onOpenUploadDialog,
      status,
      spendTime,
      percent,
      onUploadInnerDialogClose,
      stepUploadInnerDialog,
      uploadInnerDialogVisible,
      $stepUploadValidateUploadResult,
      $dialogExcelDownloadRequest,
      $excelExportButtonProps
    }
  }
}
</script>

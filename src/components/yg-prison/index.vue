<template>
  <!-- 整体容器 -->
  <el-row class="row-container" :gutter="0">
    <!-- 查询组件 -->
    <m-search ref="$ygSearch" :items="{
        familyName: {
          type: 'input',
          label: '家属姓名'
        }}">
      <!-- 上传、导入、导出 -->
      <template #append>
        <m-excel-upload ref="$mExcelUpload" :configs="excelUploadConfigs" />
      </template>
      <template #searchSlot></template>
    </m-search>

    <!-- 主体组件 -->
    <el-col :span="24">
      <!-- 标签页组件 -->
      <template v-if="!!tabItems.length">
        <el-tabs type="card">
          <template v-for="tab in tabItems">
            <el-tab-pane
              :key="tab.name"
              :label="tab.label"
              :name="tab.name"
            />
          </template>
        </el-tabs>
      </template>

      <!-- 表格组件 -->
      <m-table-new stripe ref="$ygTable"></m-table-new>
    </el-col>

    <!-- 分页组件 -->
    <m-pagination ref="$ygPagination" @onPageChange="getData" />

    <!-- 导入数据的交互 -->
    <el-dialog
      class="authorize-dialog upload-dialog"
      ref="$uploadDialog"
      title="亲情电话家属信息导入"
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
            <template v-for="(tag, index) in $_uploadStepsTabOptions">
              <el-step :key="index" :title="tag.label" />
            </template>
          </el-steps>
        </el-col>

        <el-col class="process-col_tips">
          <!-- validateFamiliesResult.total -->
          <span>准备导入数据总计：{{}}条</span>

          <span>已用时：{{ spendTime }}秒</span>

          <span>进度：{{ percent }}%</span>
        </el-col>

        <el-col class="process-col_waiting">请稍后...</el-col>
      </el-row>

      <el-dialog
        class="authorize-dialog"
        append-to-body
        custom-class="upload-dialog__inner"
        ref="$uploadInnerDialog"
        title="导入结果提示"
        :visible.sync="uploadInnerDialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="onUploadInnerDialogClose"
      >
        <div style="line-height: 30px; margin-top: 10px;">
          <!-- add_total -->
          <i class="el-icon-success green" style="font-size: 20px;margin-right: 10px;"></i>成功：{{}}条<br>
          <!-- v-if="!!validateFamiliesResult.error_total" -->
          <template>
            <!-- error_total -->
            <i class="el-icon-error red" style="font-size: 20px; margin-right: 10px;"></i>失败：{{}}条

            <p style="padding-left: 30px;">原因：上传的Excel文件内容格式有误，请检查文件内容，仔细对照下载的模版数据。</p>

            <p style="padding-left: 30px;">导入失败数据：
              <m-excel-download
                path="/download/localfile"
                :params="{}"
                :buttonsProps="excelExportButtonProps"
                text="导入失败的数据.xls"
              />
            </p>
          </template>
        </div>

        <div slot="footer">
          <el-button type="primary" @click="uploadInnerDialogVisible = false">确 定</el-button>
        </div>        
      </el-dialog>
    </el-dialog>
  </el-row>
</template>

<script>
import { ref, reactive, onMounted } from '@vue/composition-api'

import prisonFilterCreator from '@/mixins/prison-filter-creator'

import router from '@/router'

import store from '@/store'

import Vue from 'vue'
export default {
  name: 'YgPrisonContent',

  mixins: [prisonFilterCreator],

  props: {
    // 标签页的选项
    tabItems: {
      type: Array,
      default: () => []
    }
  },

  setup(props, context) {
    // console.log(context, router, store)
    // 导入数据的外层弹框的显示控制
    const uploadDialogVisible = ref(false)

    // 上传进度条的当前步骤值
    const status = ref(0)

    // 上传进度的已用时
    const spendTime = ref(0)

    // 上传进度的进度比
    const percent = ref(0)

    // 导入数据的内层弹框的显示控制
    const uploadInnerDialogVisible = ref(false)

    // 失败数据excel导出按钮属性
    const excelExportButtonProps = reactive({
      attrs: {
        type: 'text'
      }
    })

    // 上传外层弹框的元素
    const $mExcelUpload = ref(null)

    // 查询组件的元素
    const $ygSearch = ref(null)

    // 表单的元素
    const $ygTable = ref(null)

    // 分页的元素
    const $ygPagination = ref(null)

    // 重制上传的参数关闭对话框
    const onResetAndcloseUploadDialog = () => {
      spendTime.value = 0

      percent.value = 0

      status.value = 0

      uploadDialogVisible.value = false
    }

    // el-upload 上传文件前的钩子函数
    const beforeUpload = file => {
      store.dispatch('resetState', {
        ygPrisonValidateUploadResult: {
          add_total: 0,
          error_total: 0,
          filePath: '',
          total: 0
        }
      })

      let count = 0, index = 0

      // 上次文件的定时器
      const uploadInterver = setInterval(async () => {
        status.value += 1

        percent.value += 15

        spendTime.value += .5

        if (status.value === 4) {
          clearInterval(uploadInterver)

          // 上次文件到服务器
          const isSuccess = await store.dispatch('ygPrisons/ygUploadFile', file)

          if (!isSuccess) {
            onResetAndcloseUploadDialog()

            return
          }

          // 验证excel的定时器
          const validateInterver = setInterval(async () => {
            count ++

            if (count === 1) {
              spendTime.value += 1

              // 验证excel
              const isSuccess = await store.dispatch('ygPrisons/validateUploadYgCommon', store.state.ygPrisons.ygUploadResult.path)

              clearInterval(validateInterver)

              if (!isSuccess) {
                onResetAndcloseUploadDialog()

                return
              }

              // 模拟完成最后两步
              const processInterver = setInterval(() => {
                index ++

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
                } else spendTime.value += 1
              }, 1000)
            } else spendTime.value += 1
          }, 1000)
        } else spendTime.value += 1
      }, 500)

      return false
    }

    const onChange = file => {
      if (uploadDialogVisible.value) return

      if (file) uploadDialogVisible.value = true
    }

    // excel导入的配置
    const excelUploadConfigs = reactive({
      attrs: {
        autoUpload: false,
        limit: 1,
        beforeUpload: beforeUpload,
        onChange: onChange
      }
    })

    // 打开上传外层弹框的回调的函数
    const onOpenUploadDialog = () => {
      Vue.nextTick(() => {
        $mExcelUpload.value.onManualUpload()
      })
    }

    // 关闭上传内层弹框的回调函数
    const onUploadInnerDialogClose = () => {
      setTimeout(() => {
        onResetAndcloseUploadDialog()
      }, 1000)
    }

    // 获取列表数据
    const getData = async () => {}

    return {
      uploadDialogVisible,
      status,
      spendTime,
      percent,
      uploadInnerDialogVisible,
      excelExportButtonProps,
      onOpenUploadDialog,
      onUploadInnerDialogClose,
      $mExcelUpload,
      excelUploadConfigs,
      $ygSearch,
      $ygTable,
      $ygPagination,
      getData
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
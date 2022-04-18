<template>
  <!-- 整体容器 -->
  <el-row class="row-container" :gutter="0">
    <!-- 查询组件 -->
    <m-search
      ref="$ygSearch"
      :items="searchItems"
      @searchSelectChange="searchSelectChange"
      @search="onSearch"
    >
      <!-- 查询组件 前插槽 -->
      <template #pre>
        <slot name="ygSearchPreSlots" />
      </template>

      <!-- 查询组件的 后插槽 -->
      <!-- 上传、导入、导出 -->
      <template #append>
        <!-- 后置插槽的 前置部分 -->
        <slot name="ygSearchAppendPreSlots" />

        <!-- 模版 -->
        <template v-if="$componentsVisible['excelDownloadVisible']">
          <m-excel-download
            :path="$httpRequests['excelDownloadRequest']['path']"
            :params="$httpRequests['excelDownloadRequest']['params']"
            :text="$httpRequests['excelDownloadRequest']['text']"
            :apiConfigs="$httpRequests['excelDownloadRequest']['apiConfigs']"
          />
        </template>

        <!-- 导入组件 -->
        <template v-if="$componentsVisible['excelUploadVisible']">
          <m-excel-upload ref="$mExcelUpload" :configs="excelUploadConfigs" />
        </template>

        <!-- 前端导出 -->
        <template v-if="$componentsVisible['excelExportVisible']">
          <el-button
            type="primary"
            :loading="ygPrisonDownloading"
            @click="onYGPrisonDownloadExcel"
          >导出 Excel</el-button>
        </template>

        <!-- 后置插槽的 后置部分 -->
        <slot name="ygSearchAppendAppendSlots" />
      </template>
    </m-search>

    <!-- 主体组件 -->
    <el-col :span="24">
      <!-- 标签页组件 -->
      <template v-if="!!tabItems.length">
        <el-tabs v-model="$tabs" type="card">
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
      <m-table-new
        stripe
        ref="$ygTable"
        :data="$pagedYgPrisonsDataCommon.list"
        :cols="$tableCols"
        v-bind="elTableConfigs['_$attrs']"
        v-on="elTableConfigs['_$listeners']"
      >
        <template v-for="col in $tableCols" #[col.slotName]="scope">
          <!-- 默认是为了 不可控的插槽的显示本身值 -->
          <slot :name="col.slotName" v-bind="scope">{{ scope.row[col["prop"]] }}</slot>
        </template>
      </m-table-new>
    </el-col>

    <!-- 分页组件 -->
    <m-pagination
      ref="$ygPagination"
      :total="$pagedYgPrisonsDataCommon.totalCount"
      @onPageChange="getData"
    />

    <!-- 导入数据的交互 -->
    <el-dialog
      class="authorize-dialog upload-dialog"
      ref="$uploadDialog"
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
            <template v-for="(tag, index) in $_uploadStepsTabOptions">
              <el-step :key="index" :title="tag.label" />
            </template>
          </el-steps>
        </el-col>

        <el-col class="process-col_tips">
          <span>准备导入数据总计：{{ $ygPrisonValidateUploadResult.total }}条</span>

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
        <div style="line-height: 30px; margin-top: 10px">
          <i class="el-icon-success green" style="font-size: 20px; margin-right: 10px"></i>成功：{{ $ygPrisonValidateUploadResult.successTotal }}条<br />

          <template v-if="!!$ygPrisonValidateUploadResult.failTotal">
            <i class="el-icon-error red" style="font-size: 20px; margin-right: 10px"></i>失败：{{ $ygPrisonValidateUploadResult.failTotal }}条

            <p style="padding-left: 30px">原因：上传的Excel文件内容格式有误，请检查文件内容，仔细对照下载的模版数据。</p>

            <p style="padding-left: 30px">导入失败数据：
              <!-- 为了扩展处理下载的处理 -->
              <slot name="elDialogExcelDownloadSlot" v-bind="$ygPrisonValidateUploadResult">
                <m-excel-download
                  :path="$httpRequests['dialogExcelDownloadRequest']['path']"
                  :params="{ fileName: $ygPrisonValidateUploadResult.filepath }"
                  :buttonsProps="excelExportButtonProps"
                  :text="$httpRequests['dialogExcelDownloadRequest']['text']"
                  :apiConfigs="$httpRequests['dialogExcelDownloadRequest']['apiConfigs']"
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
  </el-row>
</template>

<script>
import {
  ref,
  reactive,
  computed,
  toRefs,
  watch,
  toRef,
} from "@vue/composition-api";

import prisonFilterCreator from "@/mixins/prison-filter-creator";

import router from "@/router";

import store from "@/store";

import Vue from "vue";

import { arrayRemove, DateFormat } from "@/utils/helper";

import { tokenExcel } from "@/utils/token-excel";

// 为了重载一些内部方法
import ygPrisonPerch from "@/mixins/yg-prison-perch";
export default {
  name: "YgPrisonContent",

  mixins: [prisonFilterCreator, ygPrisonPerch],

  props: {
    // 标签页的初始值 传递过来需要 加上 .sync修饰符
    tabs: {
      type: String,
      default: "",
    },

    // 标签页的选项
    tabItems: {
      type: Array,
      default: () => [],
    },

    // 列表选项
    tableCols: {
      type: Array,
      default: () => [],
    },

    // 查询选项
    // 需要在父组件引入 mixins prisonFilterCreator
    // 而且父组件的 参数的名
    // 或者传props 进来
    ygSearchItems: {
      type: Object,
      default: () => ({}),
    },

    // http请求的
    // 导入/导出/列表/模版/导出错误excel
    // excelDownloadRequest: 模版
    // excelUploadRequest: 导入验证
    // pagedRequest: 列表
    // excelExportRequest: 导出
    //   [name]: {
    //     url: '',
    //     params: {}
    //   }
    // dialogExcelDownloadRequest：dialog 导出的模版地址
    httpRequests: {
      type: Object,
      default: () => ({
        excelDownloadRequest: {
          params: {
            fileName: "",
          }
        },
      }),
    },

    // 自定义显示组件的
    // 导入组件：excelUploadVisible
    // 模版组件：excelDownloadVisible
    // 导出组件：excelExportVisible
    componentsVisible: {
      type: Object,
      default: () => ({}),
    },

    // m-table
    elTableConfigs: {
      type: Object,
      default: () => {
        return {
          _$attrs: {}, // el-table的属性
          _$listeners: {}, // el-table的事件
        };
      },
    },
  },

  setup(props, { emit }) {
    const {
      httpRequests,
      componentsVisible,
      tableCols,
      tabItems,
      tabs,
      ygSearchItems,
    } = toRefs(props);

    // data
    // 导入数据的外层弹框的显示控制
    const uploadDialogVisible = ref(false);

    // 上传进度条的当前步骤值
    const status = ref(0);

    // 上传进度的已用时
    const spendTime = ref(0);

    // 上传进度的进度比
    const percent = ref(0);

    // 导入数据的内层弹框的显示控制
    const uploadInnerDialogVisible = ref(false);

    // 失败数据excel导出按钮属性
    const excelExportButtonProps = reactive({
      attrs: {
        type: "text",
      },
    });

    // 上传外层弹框的元素
    const $mExcelUpload = ref(null);

    // 查询组件的元素
    const $ygSearch = ref(null);

    // 表单的元素
    const $ygTable = ref(null);

    // 分页的元素
    const $ygPagination = ref(null);

    // filter
    const filter = ref({});

    // pagination
    const pagination = ref({});

    // 导出的loading
    const ygPrisonDownloading = ref(false);

    // el-tabs 的value
    const $tabs = ref("");

    // 搜索组件
    const searchItems = ref(Object.assign({}, ygSearchItems.value));

    // computed
    // store 列表数据选项 在内部引用 是个包装对象 .value
    const $pagedYgPrisonsDataCommon = computed(() => store.state.ygPrisons.pagedYgPrisonsDataCommon);

    // store excel 验证结果 在内部引用 是个包装对象 .value
    const $ygPrisonValidateUploadResult = computed(() => store.state.ygPrisons.ygPrisonValidateUploadResult);

    // store ywt_admin账号
    const $isSuperAdmin = computed(() => store.getters.isSuperAdmin);

    // 非ywt_admin下面就不显示省份/监狱名称
    const $tableCols = computed(() => {
      let _temp = _.cloneDeep(tableCols.value);

      if (!$isSuperAdmin.value) {
        arrayRemove(_temp, "省份", "label");
        arrayRemove(_temp, "监狱名称", "label");
      }

      return _temp;
    });

    const $componentsVisible = computed(() => {
      return Object.entries(componentsVisible.value).reduce((accumulator, [key, value]) => {
          accumulator[key] = value;

          return accumulator;
        }, {
          // 默认 ywt_admin下面没有导入和模版
          excelUploadVisible: !$isSuperAdmin.value,
          excelDownloadVisible: !$isSuperAdmin.value,
          excelExportVisible: true, // 默认都有导出功能
        }
      );
    });

    // 导入弹框的文案
    const dialogTitle = computed(() => {
      const tabItem = tabItems.value.filter(tabItem => tabItem.name === $tabs.value)
      const text = (tabItem[0] && tabItem[0]["label"]) || router.currentRoute.meta.breadcrumbName

      return `${text}导入`;
    });

    // 接口
    const $httpRequests = computed(() => {
      return Object.entries(httpRequests.value).reduce((accumulator, [key, value]) => {
        const defaultValue = {
          excelDownloadRequest: {
            path: '/download/common/download',

            params: {
              fileName: ''
            },

            text: '模版',

            apiConfigs: {
              apiHostKey: 'ygApiHost',
              apiPathKey: 'temp'
            }
          },

          dialogExcelDownloadRequest: {
            path: '/download/common/download',

            apiConfigs: {
              apiHostKey: 'ygApiHost',
              apiPathKey: 'temp'
            },

            text: '导入失败的数据.xls'
          }
        }

        let temp = value

        if (defaultValue[key]) {
          temp = Object.assign({}, defaultValue[key], value)
        }

        accumulator = {
          ...accumulator,
          [key]: temp
        }

        return accumulator
      }, {})
    })

    // watch
    watch(tabs, async val => {
      if (val) {
        $tabs.value = val;
      }
    }, {
      immediate: true,
    });

    watch($tabs, val => {
      if (val) {
        emit("update:tabs", val);
      }
    });

    watch(searchItems, val => {
      if (val) {
        emit("update:ygSearchItems", val);
      }
    });

    // methods
    // 重制上传的参数关闭对话框
    const onResetAndcloseUploadDialog = async isSuccess => {
      spendTime.value = 0;
      percent.value = 0;
      status.value = 0;
      uploadDialogVisible.value = false;

      if (isSuccess) {
        await getData();
      }
    };

    // el-upload 上传文件前的钩子函数
    const beforeUpload = file => {
      store.commit("ygPrisons/setValidateExcelResult", {
        successTotal: 0,
        failTotal: 0,
        filepath: "",
        total: 0,
      });

      let count = 0, index = 0;

      // 上次文件的定时器
      const uploadInterver = setInterval(async () => {
        status.value += 1;
        percent.value += 15;
        spendTime.value += 0.5;

        if (status.value === 4) {
          clearInterval(uploadInterver);

          // 上次文件到服务器
          const { excelUploadRequest = {} } = httpRequests.value;
          let isSuccess = null;
          if (excelUploadRequest.params.isYgPrison) {
            isSuccess = await store.dispatch("ygPrisons/familyphonerechargeimport", file);
          } else {
            isSuccess = await store.dispatch("ygPrisons/ygUploadFile", file);
          }
          if (!isSuccess) {
            onResetAndcloseUploadDialog();

            return;
          }

          // 验证excel的定时器
          const validateInterver = setInterval(async () => {
            count++;

            if (count === 1) {
              spendTime.value += 1;

              // 验证excel
              const { excelUploadRequest = {} } = httpRequests.value;

              const isSuccess = await store.dispatch(
                "ygPrisons/validateUploadYgCommon",
                {
                  url: excelUploadRequest["url"],
                  params: {
                    filepath: store.state.ygPrisons.ygUploadResult.path,
                    ...excelUploadRequest["params"],
                  },
                  methods: excelUploadRequest["methods"],
                }
              );

              clearInterval(validateInterver);

              if (!isSuccess) {
                onResetAndcloseUploadDialog();

                return;
              }

              // 模拟完成最后两步
              const processInterver = setInterval(() => {
                index++;

                if (index === 1) {
                  percent.value += 20;
                  spendTime.value += 1;
                  status.value = status.value + 1;

                  clearInterval(processInterver);

                  spendTime.value += 1;
                  status.value += 1;
                  percent.value = 100;

                  setTimeout(() => {
                    uploadInnerDialogVisible.value = true;
                  }, 1500);
                } else {
                  spendTime.value += 1;
                }
              }, 1000);
            } else {
              spendTime.value += 1;
            }
          }, 1000);
        } else {
          spendTime.value += 1;
        }
      }, 500);

      return false;
    };

    const onChange = file => {
      if (uploadDialogVisible.value) {
        return;
      }

      if (file) {
        uploadDialogVisible.value = true;
      }
    };

    // excel导入的配置
    const excelUploadConfigs = reactive({
      attrs: {
        autoUpload: false,
        limit: 1,
        beforeUpload: beforeUpload,
        onChange: onChange,
      }
    });

    // 打开上传外层弹框的回调的函数
    const onOpenUploadDialog = () => {
      Vue.nextTick(() => {
        $mExcelUpload.value.onManualUpload();
      });
    };

    // 关闭上传内层弹框的回调函数
    const onUploadInnerDialogClose = () => {
      setTimeout(() => {
        const _temp = !!$ygPrisonValidateUploadResult.value.successTotal;

        onResetAndcloseUploadDialog(_temp);
      }, 1000);
    };

    // 查询
    const onSearch = () => {
      $ygPagination.value.handleCurrentChange(1);
    };

    // 获取列表数据
    const getData = () => {
      Vue.nextTick(async () => {
        const { pagedRequest } = httpRequests.value;

        const { url, params = {} } = pagedRequest;

        const allParams = {
          ...filter.value,
          ...pagination.value,
          ...params,
        };

        await store.dispatch("ygPrisons/getPagedYgPrisonsDataCommon", {
          url,
          params: allParams,
        });
      });
    };

    // 导出excel
    const onYGPrisonDownloadExcel = () => {
      Vue.nextTick(async () => {
        ygPrisonDownloading.value = true;
        const { excelExportRequest = {} } = httpRequests.value

        const times = DateFormat(Date.now(), "YYYYMMDDHHmmss")

        const tabItem = tabItems.value.filter(tabItem => tabItem.name === $tabs.value)

        const TABName = tabItem[0] && tabItem[0]["label"] ? `${ router.currentRoute.meta.breadcrumbName }-${ tabItem[0]["label"] }` : router.currentRoute.meta.breadcrumbName // 如果没有标签也 那么就是菜单名

        const actionName = "ygPrisons/exportYgPrisonExcel"

        const params = {
          url: excelExportRequest["url"],
          params: {
            ...filter.value,
            ...excelExportRequest["params"],
          },

          methods: excelExportRequest["methods"],
        };

        await tokenExcel({
          menuName: `${ TABName }-${ times }`,
          actionName,
          params,
        });

        setTimeout(() => {
          ygPrisonDownloading.value = false;
        }, 300);
      });
    };

    const initData = async () => {
      store.commit("ygPrisons/setPagedYgPrisonsDataCommon", {
        list: [],
        totalCount: 0,
      });

      $ygSearch.value.onGetFilter();

      await getData();
    };

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
      getData,
      $pagedYgPrisonsDataCommon,
      $ygPrisonValidateUploadResult,
      $componentsVisible,
      onSearch,
      pagination,
      filter,
      $tableCols,
      ygPrisonDownloading,
      onYGPrisonDownloadExcel,
      dialogTitle,
      $tabs,
      initData,
      searchItems,
      $httpRequests
    };
  },
};
</script>

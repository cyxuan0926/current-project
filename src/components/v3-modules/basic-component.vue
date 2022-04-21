<template>
  <!-- 整体容器 -->
  <el-row class="row-container" :gutter="0">
    <!-- 查询组件 -->
    <m-search
      ref="$basicSearch"
      :items="searchItems"
      @searchSelectChange="searchSelectChange"
      @search="onSearch"
    >
      <!-- 查询组件 前插槽 -->
      <template #pre>
        <slot name="searchPreDefault" />
      </template>

      <!-- 查询组件的 后插槽 -->
      <!-- 上传、导入、导出 -->
      <template #append>
        <!-- 后置插槽的 前置部分 -->
        <slot name="searchAppendPreDefault" />

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
          <m-step-upload
            ref="$mStepUpload"
            :tabItems="tabItems"
            :on-init-data="getData"
            :dialogExcelDownloadRequest="$httpRequests['dialogExcelDownloadRequest']"
            :excelExportButtonProps="excelExportButtonProps"
            :excelUploadRequest="$httpRequests['excelUploadRequest']"
            :uploadFileRequest="$httpRequests['uploadFileRequest'] || {}"
          >
            <template #stepUploadDefault>
              <slot name="stepDefault" />
            </template>

            <template #elDialogExcelDownloadSlot>
              <slot name="stepDownloadDefault" />
            </template>
          </m-step-upload>
        </template>

        <!-- 前端导出 -->
        <template v-if="$componentsVisible['excelExportVisible']">
          <el-button
            type="primary"
            :loading="exportDownloading"
            @click="onDownloadExcel"
          >导出 Excel</el-button>
        </template>

        <!-- 后置插槽的 后置部分 -->
        <slot name="searchAppendDefault" />
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
        ref="$table"
        :data="$pagedBasis.list"
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
      ref="$pagination"
      :total="$pagedBasis.totalCount"
      @onPageChange="getData"
    />
  </el-row>
</template>

<script>
import { ref, computed, toRefs, watch } from "@vue/composition-api"
import prisonFilterCreator from "@/mixins/prison-filter-creator"
import router from "@/router"
import store from "@/store"
import Vue from "vue"
import { arrayRemove, DateFormat } from "@/utils/helper"
import { tokenExcel } from "@/utils/token-excel"
// 为了重载一些内部方法
import basicPerch from "@/mixins/yg-prison-perch"
import composableStepUpload from '@/common/composables/step-upload'

export default {
  name: "BasicComponent",

  mixins: [prisonFilterCreator, basicPerch],

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
    propSearchItems: {
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
        }
      },
    },

    // step-upload 
    excelExportButtonProps: {
      type: Object,
      default: () => {
        return {
          attrs: {},
          listeners: {}
        }
      }
    }
  },

  setup(props, { emit }) {
    const {
      componentsVisible,
      tableCols,
      tabItems,
      tabs,
      propSearchItems,
    } = toRefs(props)

    const { $httpRequests } = composableStepUpload(props)

    // data
    // 查询组件的元素
    const $basicSearch = ref(null)
    // 表单的元素
    const $table = ref(null)
    // 分页的元素
    const $pagination = ref(null)
    // filter
    const filter = ref({})
    // pagination
    const pagination = ref({})
    // 导出的loading
    const exportDownloading = ref(false)
    // el-tabs 的value
    const $tabs = ref('')
    // 搜索组件
    const searchItems = ref(Object.assign({}, propSearchItems.value))
    // 进度条上传 ref
    const $mStepUpload = ref(null)

    // computed
    // store 列表数据选项 在内部引用 是个包装对象 .value
    const $pagedBasis = computed(() => store.state.v3Component.pagedBasis)
    // store ywt_admin账号
    const $isSuperAdmin = computed(() => store.getters.isSuperAdmin)
    // 非ywt_admin下面就不显示省份/监狱名称
    const $tableCols = computed(() => {
      let _temp = _.cloneDeep(tableCols.value)

      if (!$isSuperAdmin.value) {
        arrayRemove(_temp, '省份', 'label')
        arrayRemove(_temp, '监狱名称', 'label')
      }

      return _temp
    })
    // 导出/下载/上传组件的显示控制
    const $componentsVisible = computed(() => {
      return Object.entries(componentsVisible.value).reduce((accumulator, [key, value]) => {
          accumulator[key] = value

          return accumulator
        }, {
          // 默认 ywt_admin下面没有导入和模版
          excelUploadVisible: !$isSuperAdmin.value,
          excelDownloadVisible: !$isSuperAdmin.value,
          excelExportVisible: true, // 默认都有导出功能
        }
      )
    })

    // watch
    watch(tabs, async val => {
      if (val) {
        $tabs.value = val
      }
    }, {
      immediate: true,
    })

    watch($tabs, val => {
      if (val) {
        emit("update:tabs", val)
      }
    })

    watch(searchItems, val => {
      if (val) {
        emit("update:propSearchItems", val)
      }
    })

    // methods
    // 查询
    const onSearch = () => {
      $pagination.value.handleCurrentChange(1)
    }

    // 获取列表数据
    const getData = () => {
      Vue.nextTick(async () => {
        const { pagedRequest = {} } = $httpRequests.value
        // responseParams: 返回响应的参数类型 用来统一处理
        // url: 路径
        // module: 请求路径模块
        // methods：请求方式
        // params: 需要传递的参数
        const { params = {}, ...others } = pagedRequest
        const allParams = {
          ...filter.value,
          ...pagination.value,
          ...params,
        }

        await store.dispatch("v3Component/getPagedBasis", {
          ...others,
          params: allParams,
        })
      })
    }

    // 导出excel
    const onDownloadExcel = () => {
      Vue.nextTick(async () => {
        exportDownloading.value = true

        const { excelExportRequest = {} } = $httpRequests.value
        const { params = {} } = excelExportRequest
        const times = DateFormat(Date.now(), "YYYYMMDDHHmmss")
        const tabItem = tabItems.value.filter(tabItem => tabItem.name === $tabs.value)
        const TABName = tabItem[0] && tabItem[0]["label"] ? `${ router.currentRoute.meta.breadcrumbName }-${ tabItem[0]["label"] }` : router.currentRoute.meta.breadcrumbName // 如果没有标签也 那么就是菜单名
        const actionName = "v3Component/exportBasicExcel"
        const allParams = {
          params: {
            ...filter.value,
            ...params
          }
        }

        await tokenExcel({
          menuName: `${ TABName }-${ times }`,
          actionName,
          params: {
            ...allParams,
            ...others
          }
        })

        setTimeout(() => {
          exportDownloading.value = false
        }, 300)
      })
    }

    const initData = async () => {
      store.commit("v3Component/setPagedBasis", {
        list: [],
        totalCount: 0,
      })

      $basicSearch.value.onGetFilter()

      await getData()
    }

    // m-search组件的方法
    const onCompontentSearch = search => {
      $basicSearch.value.onSearch(search)
    }

    // m-table-new组件的方法
    const onElTableClearSort = () => {
      $table.value.elTableClearSort()
    }

    // m-step-upload组件的方法
    const onStepPreExcelClick = (args = {}) => {
      $mStepUpload.value.opPreExcelClick(...agrs)
    }

    return {
      onOpenUploadDialog,
      onUploadInnerDialogClose,
      $basicSearch,
      $table,
      $pagination,
      getData,
      $pagedBasis,
      $componentsVisible,
      onSearch,
      pagination,
      filter,
      $tableCols,
      exportDownloading,
      onDownloadExcel,
      $tabs,
      initData,
      searchItems,
      $httpRequests,
      onCompontentSearch,
      onElTableClearSort,
      onStepPreExcelClick
    }
  }
}
</script>

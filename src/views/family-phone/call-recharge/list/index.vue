<template>
  <el-row class="el-row__call-recharge-list" :gutter="0">
    <m-yg-prison-content
      ref="$callRechargeParent"
      :tabItems="$tabItems"
      :ygSearchItems.sync="searchItems"
      :tabs.sync="$tabs"
      :httpRequests="$httpRequests"
      :tableCols="$tableCols"
      :componentsVisible="omponentpublic"
      v-bind="routeProps"
      :isSearchLimit="isSearchLimit"
    >
     
    </m-yg-prison-content>
  
  </el-row>
</template>

<script>
import store from "@/store";

import { ref, reactive, computed, watch } from "@vue/composition-api";

import { tabItems, _searchItems, httpRequests, _tableCols } from "../constants";

import useRouteProps from "@/common/composables/useRouteProps";
export default {
  name: "CallRechargeList",

  setup() {
    const $callRechargeParent = ref(null);

    const searchItems = ref(_.cloneDeep(_searchItems));


    const $tabs = ref("0");

    const $tabItems = reactive(tabItems);

    const isSearchLimit = ref(true);
    // store ywt_admin账号
    const $isSuperAdmin = computed(() => store.getters.isSuperAdmin);
 
    const omponentpublic = ref({
      // 设置 ywt_admin下面有导入和模版
      excelUploadVisible: $isSuperAdmin.value,
      excelDownloadVisible: $isSuperAdmin.value,
    });
    const $httpRequests = computed(() => {
      return Object.entries(httpRequests).reduce(
        (accumulator, [key, value]) => {
          let temp = value;

          if (
            [
              "excelDownloadRequest",
              "pagedRequest",
              "excelExportRequest",
              "excelUploadRequest",
            ].includes(key)
          )
            temp = value[$tabs.value];

          accumulator[key] = {
            ...accumulator[key],
            ...temp,
          };

          return accumulator;
        },
        {}
      );
    });

    const $tableCols = computed(() => _tableCols[$tabs["value"]]);

    const { routeProps } = useRouteProps();

   

    watch($tabs, (val) => {
      if (val == "0") {
        searchItems.value.types.miss = false;
        omponentpublic.value.excelUploadVisible = $isSuperAdmin.value?true:false;
        omponentpublic.value.excelDownloadVisible = $isSuperAdmin.value?true:false;
      } else if (val == "1") {
        omponentpublic.value.excelUploadVisible = false;
        omponentpublic.value.excelDownloadVisible = false;
        searchItems.value.types.miss = true;
      }
      $callRechargeParent.value && $callRechargeParent.value.initData();
    });

    return {
      $callRechargeParent,
      searchItems,
      $tabs,
      $tabItems,
      $httpRequests,
      $tableCols,
      routeProps,
      $isSuperAdmin,
      omponentpublic,
      isSearchLimit
    };
  },
};
</script>

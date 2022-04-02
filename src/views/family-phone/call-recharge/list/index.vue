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
      <!-- <template #ygSearchAppendPreSlots
        ><el-button type="primary" v-if="$isSuperAdmin" @click="onNewFamily"
          >新增</el-button
        ></template
      > -->
    </m-yg-prison-content>
    <!-- 新增按钮 -->
    <!-- <el-dialog
      class="authorize-dialog"
      ref="familyInformationDialog"
      :visible.sync="familyphonerechargeamount"
      :close-on-click-modal="false"
      title="亲情电话充值金额"
      width="40%"
      @close="onCloseFamilyInformationDialog"
    >
      <m-form
        ref="familyInformationDialogForm"
        :items="familyInformationDialogFormItems"
        :values="familyInformationDialogFormValues"
        @cancel="familyphonerechargeamount = false"
        @submit="onFamilyInformationDialogFormSubmit"
      />
    </el-dialog> -->
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

    // const familyInformationDialogFormItems = ref({
    //   buttons: ["add", "cancel"],
    //   formConfigs: {
    //     labelWidth: "120px",
    //   },
    //   jailName: {
    //     type: "input",
    //     label: "监狱名称",
    //     rules: ["required"],
    //     value: "",
    //     clearable: true,
    //   },
    //   prisonerName: {
    //     type: "input",
    //     label: "罪犯姓名",
    //     rules: ["required"],
    //     value: "",
    //     clearable: true,
    //   },
    //   prisonerNumber: {
    //     type: "input",
    //     label: "罪犯编号",
    //     rules: ["required"],
    //     value: "",
    //     clearable: true,
    //   },
    //   vocationalResult: {
    //     type: "input",
    //     label: "亲情电话充值金额",
    //     rules: ["required", "phone"],
    //     // rules: ["required"],
    //     value: "",
    //     clearable: true,
    //   },
    //   remark: {
    //     type: "input",
    //     label: "备注",
    //     // rules: ["required"],
    //     value: "",
    //     clearable: true,
    //   },
    // });

    const $tabs = ref("0");

    const $tabItems = reactive(tabItems);

<<<<<<< HEAD
    const familyInformationDialogFormValues = ref({});

    const familyphonerechargeamount = ref(false);
=======
    // const familyInformationDialogFormValues = ref({});

    // const familyphonerechargeamount = ref(false);
>>>>>>> 57973a33586dab7f3c86b1bcdcf372f537f44d1c

    // const familyInformationVisible = ref(false);

    const isSearchLimit = ref(true);
    // store ywt_admin账号
    const $isSuperAdmin = computed(() => store.getters.isSuperAdmin);
    // const omponentpublic = computed(() => {

    //   return {
    //     // 设置 ywt_admin下面有导入和模版
    //     excelUploadVisible:  $isSuperAdmin.value , //                               ,
    //     excelDownloadVisible: $isSuperAdmin.value,
    //   };
    // });
    const omponentpublic = ref({
      // 设置 ywt_admin下面有导入和模版
      excelUploadVisible: $isSuperAdmin.value, //                               ,
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

    // async function onNewFamily() {
    //   familyphonerechargeamount.value = true;
    // }
    // 新增接口
    // async function onFamilyInformationDialogFormSubmit(data) {
    //   if (data) {
    //     let res = await http.familyforAdd(data);
    //     if (res === undefined) return;
    //     setTimeout(() => {
    //       this.onCloseFamilyInformationDialog();
    //       $callRechargeParent.value && $callRechargeParent.value.initData();
    //     }, 1000);
    //   } else {
    //     this.$message({
    //       showClose: true,
    //       message: "未编辑信息，无须提交审批！",
    //       duration: 2000,
    //       type: "error",
    //     });
    //   }
    // }
    // 关闭对话框
    // async function onCloseFamilyInformationDialog() {
    //   this.$refs.familyInformationDialogForm &&
    //     this.$refs.familyInformationDialogForm.onCancel();
    // }

    watch($tabs, (val) => {
      if (val == "0") {
        searchItems.value.types.miss = false;
        omponentpublic.value.excelUploadVisible = true;
        omponentpublic.value.excelDownloadVisible = true;
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
      isSearchLimit,
      // familyphonerechargeamount,
      // onNewFamily,
      // familyInformationVisible,
      // familyInformationDialogFormItems,
      // familyInformationDialogFormValues,
      // onFamilyInformationDialogFormSubmit,
      // onCloseFamilyInformationDialog,
    };
  },
};
</script>

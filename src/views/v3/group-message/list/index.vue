<template>
  <el-row class="el-row__prison-adminstration-list" :gutter="0">
    <m-yg-prison-content
      ref="$ygPrisonAdminstrationParent"
      :tabItems="$tabItems"
      :ygSearchItems.sync="searchItems"
      :tabs.sync="$tabs"
      :httpRequests="$httpRequests"
      :tableCols="$tableCols"
      :elTableConfigs="elTableConfigs"
      :componentsVisible="componentsVisiblefalse"
      v-bind="routeProps"
    >
      <template #ygSearchAppendPreSlots
        ><el-button type="primary" v-if="$isSuperAdmin" @click="onNewFamily"
          >群发短信</el-button
        ></template
      >
      <!-- <template #infoRecipeYearNum="{ row }">{{ row.yearNum }}</template> -->
    </m-yg-prison-content>
    <el-dialog
      class="authorize-dialog"
      ref="familyInformationDialog"
      :visible.sync="messageConfig"
      :close-on-click-modal="false"
      title="群发短信"
      width="40%"
      @close="onCloseMessageConfigDialog"
    >
      <m-form
        ref="familyInformationDialogForm"
        :items="messageConfigItem"
        :values="messageConfigItemValues"
        @cancel="messageConfig = false"
        @submit="onMessageConfigDialogFormSubmit"
      />
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
import store from "@/store";
import { tabItems, _searchItems, httpRequests, _tableCols } from "../constants";
import { mapState } from 'vuex'

import useRouteProps from "@/common/composables/useRouteProps";
export default {
  name: "PrisonAdminstrationList",

  watch: {
    '$store.state.provincesAll'(v) {
    //  console.log('messageConfigItem==', this.messageConfigItem)
      this.messageConfigItem.jailName.options=v
    }
  },

  setup() {
    const $ygPrisonAdminstrationParent = ref(null);

    const searchItems = ref(_.cloneDeep(_searchItems));
    const $tabs = ref("1");
    // console.log('store.state.provincesAll==', store.state.provincesAll)
    // watch(store.state.provincesAll, v => {
    //   console.log('provincesAll==', v)
    // })

    const messageConfigItem = ref({
      buttons: ["add", "cancel"],
      formConfigs: {
        labelWidth: "120px",
      },
      jailName: {
        type: 'select',
        label: "发送范围",
        filterable: true,
        props: { value: 'id', label: 'name'},
        rules: ["required"],
        multiple:true,
        options: [],
        value: ''
      },
      prisonerName: {
        type: "input",
        label: "发送内容",
        rules: ["required"],
        value: "",
        clearable: true,
      },
    });
    const messageConfigItemValues = ref({});
    const messageConfig = ref(false);
    const $tabItems = reactive(tabItems);
    const $isSuperAdmin = computed(() =>  store.getters.isSuperAdmin);
    const $httpRequests = computed(() => {
      return Object.entries(httpRequests).reduce(
        (accumulator, [key, value]) => {
          let temp = value;
          if (["pagedRequest"].includes(key)) temp = value[$tabs.value];
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
    const componentsVisiblefalse = computed(() => {
      return {
        // 设置 ywt_admin下面有导入和模版
        excelExportVisible: false,
      };
    });
    const onTableSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
      if ($tabs.value !== "0")
        return {
          rowspan: 1,
          colspan: 1,
        };
      else {
        if (["monthNum"].includes(column.property)) {
          return {
            rowspan: 1,
            colspan: 1,
          };
        }
        return {
          rowspan: 1,
          colspan: 1,
        };
      }
    };

    const elTableConfigs = reactive({
      _$attrs: {
        spanMethod: onTableSpanMethod,
      },
    });

    const { routeProps } = useRouteProps();
    async function onNewFamily() {
      messageConfig.value = true;
    }
    // 新增群发
    async function onMessageConfigDialogFormSubmit(data) {
      if (data) {
        //
        let res = await http.familyforAdd(data);
        if (res === undefined) return;
        setTimeout(() => {
          this.onCloseFamilyInformationDialog();
          $callRechargeParent.value && $callRechargeParent.value.initData();
        }, 1000);
      } else {
        this.$message({
          showClose: true,
          message: "未编辑信息，无须提交审批！",
          duration: 2000,
          type: "error",
        });
      }
    }
    // 关闭对话框
    async function onCloseMessageConfigDialog() {
      this.$refs.familyInformationDialogForm &&
        this.$refs.familyInformationDialogForm.onCancel();
    }
    watch(
      $tabs,
      (val) => {
        if (val === "1") {
          searchItems.value.prisonArea.miss = false;
          searchItems.value.jailId.miss = false;
          searchItems.value.provincesId.miss = false;
        } else {
          searchItems.value.prisonArea.miss = true;
          searchItems.value.jailId.miss = true;
          searchItems.value.provincesId.miss = true;
        }

        $ygPrisonAdminstrationParent.value &&
          $ygPrisonAdminstrationParent.value.initData();
      }
    );

    return {
      $ygPrisonAdminstrationParent,
      searchItems,
      $tabs,
      $tabItems,
      $httpRequests,
      $tableCols,
      // $ctiyOpt,
      elTableConfigs,
      routeProps,
      $isSuperAdmin,
      onNewFamily,
      componentsVisiblefalse,
      messageConfig,
      messageConfigItem,
      messageConfigItemValues,
      onMessageConfigDialogFormSubmit,
      onCloseMessageConfigDialog,
    };
  },
};
</script>

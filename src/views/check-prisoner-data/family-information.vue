<template>
  <el-row class="row-container" :gutter="0">
    <m-search
      ref="search"
      :items="searchItems"
      @searchSelectChange="searchSelectChange"
      @search="onSearch"
    >
      <template slot="append">
        <el-button type="primary" v-if="!isSuperAdmin" @click="onNewFamily">新增</el-button>
        <m-excel-download :path="prisonerHref" v-if="!isSuperAdmin"  text="模板" />
        <m-excel-upload ref="mExcelUpload" :configs="excelUploadConfigs" v-if="!isSuperAdmin" />
        <el-button
          type="primary"
          :loading="downloading"
          @click="onDownloadExcel"
          >导出 Excel</el-button
        >
      </template>
    </m-search>
    <el-col :span="24">
      <m-table-new
        stripe
        :data="tabledate.familyInfoImportList"
        :cols="tableCols"
      >
      </m-table-new>
    </el-col>

    <m-pagination
      ref="pagination"
      @onPageChange="getDatas"
      :total="tabledate.total"
    />
    <el-dialog
      class="authorize-dialog"
      ref="familyInformationDialog"
      :visible.sync="familyInformationVisible"
      :close-on-click-modal="false"
      title="新增亲情电话信息"
      width="40%"
      @close="onCloseFamilyInformationDialog"
    >
      <m-form
        ref="familyInformationDialogForm"
        :items="familyInformationDialogFormItems"
        :values="familyInformationDialogFormValues"
        @cancel="familyInformationVisible = false"
        @submit="onFamilyInformationDialogFormSubmit"
      />
    </el-dialog>
    <el-dialog
      class="authorize-dialog upload-dialog"
      ref="uploadDialog"
      title="亲情电话申请信息导入"
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
          <span>准备导入数据总计：{{ validateInformationResult.total }}条</span>

          <span>已用时：{{ spendTime }}秒</span>

          <span>进度：{{ percent }}%</span>
        </el-col>

        <el-col class="process-col_waiting">请稍后...</el-col>
      </el-row>

      <el-dialog
        class="authorize-dialog"
        append-to-body
        custom-class="upload-dialog__inner"
        ref="uploadInnerDialog"
        title="导入结果提示"
        :visible.sync="uploadInnerDialogVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="onUploadInnerDialogClose"
      >
        <div style="line-height: 30px; margin-top: 10px">
          <i
            class="el-icon-success green"
            style="font-size: 20px; margin-right: 10px"
          ></i
          >成功：{{ validateInformationResult.successTotal }}条<br />
          <template v-if="!!validateInformationResult.failTotal">
            <i
              class="el-icon-error red"
              style="font-size: 20px; margin-right: 10px"
            ></i
            >失败：{{ validateInformationResult.failTotal }}条

            <p style="padding-left: 30px">
              原因：上传的Excel文件内容格式有误，请检查文件内容，仔细对照下载的模版数据。
            </p>

            <p style="padding-left: 30px">
              失败数据：
              <m-excel-download
                path="/download/localfile"
                :params="{ filepath: validateInformationResult.filePath }"
                :buttonsProps="excelExportButtonProps"
                text="导入失败的数据.xls"
              />
            </p>
          </template>
        </div>

        <div slot="footer">
          <el-button type="primary" @click="uploadInnerDialogVisible = false"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </el-dialog>
  </el-row>
</template>

<script>
import prisonFilterCreator from "@/mixins/prison-filter-creator";
import { mapActions, mapState, mapGetters } from "vuex";
import { DateFormat } from "@/utils/helper";
import { tokenExcel } from "@/utils/token-excel";
import {
  $likeName,
  $likePrisonerNumber,
  $likePhone,
} from "@/common/constants/const";
import registrationDialogCreator from "@/mixins/registration-dialog-creator";
import http from "@/service";
export default {
  name: "FamilyPhone_Families",

  mixins: [prisonFilterCreator, registrationDialogCreator],

  data() {
    const clearable = true;
    return {
      prisonerHref: `/download/downloadfile?filepath=family_information_import_template.xls`,
      downloading: false,
      familyInformationVisible: false,
      uploadInnerDialogVisible: false,
      uploadDialogVisible: false,
      tabledate: {},
      toShow: {},
      status: 0,
      spendTime: 0,
      percent: 0,
      searchItems: {
        familyName: {
          type: "input",
          label: "家属姓名",
        },
        familyPhone: {
          type: "input",
          label: "家属电话",
        },
        prisonerName: {
          type: "input",
          label: "罪犯姓名",
        },

        prisonerNumber: {
          type: "input",
          label: "罪犯编号",
        },
        applicationDate: {
          type: "dateRange",
          unlinkPanels: true,
          start: "startDate",
          canNotClear: true,
          end: "endDate",
          startPlaceholder: "开始时间",
          endPlaceholder: "结束时间",
          value: [this.$_dateOneWeekAgo, this.$_dateNow],
        },
      },
      excelUploadConfigs: {
        attrs: {
          autoUpload: false,
          limit: 1,
          beforeUpload: this.beforeUpload,
          onChange: this.onChange,
        },
      },
      familyInformationDialogFormValues: {},
      familyInformationDialogFormItems: {
        buttons: ["add", "cancel"],
        formConfigs: {
          labelWidth: "120px",
        },
        prisonerNumber: {
          type: "input",
          label: "罪犯编号",
          rules: ["required"],
          value: "",
          clearable,
        },
        prisonerName: {
          type: "input",
          label: "罪犯姓名",
          rules: ["required"],
          value: "",
          clearable,
        },
        familyName: {
          type: "input",
          label: "家属姓名",
          rules: ["required"],
          value: "",
          clearable,
        },
          familyPhone: {
          type: "input",
          label: "家属电话",
          rules: [
                'required',
                'phone'
              ],
          // rules: ["required"],
          value: "",
          clearable,
        },
      },
      show: {
        isAdd: false,
        message: false,
        disagree: false,
        authorize: false,
        agree: false,
        process: false,
        editRebut: true,
        dialog: false,
      },
      excelExportButtonProps: {
        attrs: {
          type: "text",
        },
      },
    };
  },
  computed: {
    ...mapGetters(['isSuperAdmin']),
    ...mapState({
      uploadResult: (state) => state.global.uploadResult,
      validateInformationResult: (state) =>
        state.familyPhone.validateInformationResult,
    }),
    tableCols() {
      const cols = [
          {
            label: "监区",
            prop: "prisonArea",
          },
          {
            label: "罪犯编号",
            prop: "prisonerNumber",
            ...$likePrisonerNumber,
          },
          {
            label: "罪犯姓名",
            prop: "prisonerName",
            ...$likeName,
          },
          {
            label: "家属姓名",
            prop: "familyName",
            ...$likeName,
            className: "",
            desensitizationColsConfigs: {
              keyWord: "familyId",
              prop: "familyName",
              desensitizationColSlotName: "familyName",
            },
          },
          {
            label: "家属电话",
            prop: "familyPhone",
            ...$likePhone,
          },
          {
            label: "导入时间",
            prop: "createTime",
          },
        ],
        onlySuperAdminCols = [
        {
          label: '省份',
          prop: 'provinceName'
        },
        {
          label: '监狱名称',
          prop: 'jailName',
          showOverflowTooltip: true
        }
      ],
        indexCols = [
         {
            label: "序号",
            type: "index",
            index: this.handleGetIndex,
          }
        ]
      if (this.isSuperAdmin) return [...indexCols, ...onlySuperAdminCols, ...cols];
      return  [...indexCols, ...cols]
    },
  },
  methods: {
    ...mapActions(["uploadFile", "resetState"]),
    ...mapActions("familyPhone", ["validateImportFamilyInformation"]),
    async onFamilyInformationDialogFormSubmit(data) {
      if (data) {
        let res  = await http.familyforAdd(data)
        // if (!res) return;
        // console.log(res)
        setTimeout(() => {
          this.onCloseFamilyInformationDialog();
          this.getDatas();
        }, 1000);
      } else {
        this.$message({
          showClose: true,
          message: "未编辑信息，无须提交审批！",
          duration: 2000,
          type: "error",
        });
      }
    },
    onNewFamily() {
      this.familyInformationVisible = true;
    },
    // 导出excel
    async onDownloadExcel() {
      this.downloading = true;
      const times = DateFormat(Date.now(), "YYYYMMDDHHmmss"),
        actionName = "familyPhone/exportFamilyPhone",
        params = {
          url: "/download/exportFamilyImportInfo",
          methods: "get",
          params: { ...this.filter },
          isPrisonInternetGetUrlWay: "getHyUrl",
        };
      await tokenExcel({
        params,
        actionName,
        menuName: `家属信息-${times}`,
      });

      setTimeout(() => {
        this.downloading = false;
      }, 300);
    },
    onCloseShow() {
      this.show.dialog = false;
      this.toShow = {};
    },
    async getDatas() {
      this.filter.tab = this.tabs;
      let res = await http.familyInformationList({
        ...this.filter,
        ...this.pagination,
      });
      this.tabledate = res;
    },
    onSearch() {
      this.$refs.pagination.handleCurrentChange(1);
    },
    onOpenUploadDialog() {
      this.$nextTick(() => {
        this.$refs.mExcelUpload.onManualUpload();
      });
    },
    beforeUpload(file) {
      this.resetState({
        validateInformationResult: {
          successTotal: 0,
          failTotal: 0,
          filePath: "",
          total: 0,
        },
      });

      let count = 0,
        index = 0;

      // 上次文件的定时器
      const uploadInterver = setInterval(async () => {
        this.status += 1;

        this.percent += 15;

        this.spendTime += 0.5;

        if (this.status === 4) {
          clearInterval(uploadInterver);

          // 上次文件到服务器
          const isSuccess = await this.uploadFile(file);

          if (!isSuccess) {
            this.onResetAndcloseUploadDialog();

            return;
          }

          // 验证excel的定时器
          const validateInterver = setInterval(async () => {
            count++;

            if (count === 1) {
              this.spendTime += 1;

              // 验证excel
              const isSuccess = await this.validateImportFamilyInformation(
                this.uploadResult.path
              );

              clearInterval(validateInterver);

              if (!isSuccess) {
                this.onResetAndcloseUploadDialog();

                return;
              }

              // 模拟完成最后两步
              const processInterver = setInterval(() => {
                index++;

                if (index === 1) {
                  this.percent += 20;

                  this.spendTime += 1;

                  this.status = this.status + 1;

                  clearInterval(processInterver);

                  this.spendTime += 1;

                  this.status += 1;

                  this.percent = 100;
                  setTimeout(() => {
                    this.uploadInnerDialogVisible = true;
                  }, 1500);
                } else this.spendTime += 1;
              }, 1000);
            } else this.spendTime += 1;
          }, 1000);
        } else this.spendTime += 1;
      }, 500);

      return false;
    },

    onChange(file) {
      if (this.uploadDialogVisible) return;

      if (file) {
        this.uploadDialogVisible = true;
      }
    },

    // 关闭对话框
    onCloseFamilyInformationDialog() {
      this.$refs.familyInformationDialogForm &&
        this.$refs.familyInformationDialogForm.onCancel();
    },

    // 重制上传的参数关闭对话框
    onResetAndcloseUploadDialog() {
      this.spendTime = 0;

      this.percent = 0;

      this.status = 0;

      this.uploadDialogVisible = false;
    },
    // 内层提示对话框关闭的回调方法
    onUploadInnerDialogClose() {
      setTimeout(() => {
        this.onResetAndcloseUploadDialog();
      }, 1000);
    },
  },
};
</script>

<style lang="scss" scoped>
.el-steps {
  /deep/ .el-step__title {
    font-size: 12px;
    line-height: 32px;
  }
}

.process-col_tips {
  width: 68%;
  margin-left: 32%;
  span {
    color: #303133;
    font-weight: bold;
    & + span {
      padding-left: 3%;
    }
  }
}

.process-col_waiting {
  width: 60%;
  margin-left: 40%;
  color: #303133;
  font-weight: bold;
}

.upload-dialog {
  /deep/ .el-dialog__body {
    padding-bottom: 30px !important;
  }

  /deep/ .button-box {
    padding-bottom: 0px;
  }
}

.m-excel-export {
  float: none;
}

.authorize-dialog {
  /deep/ .el-dialog__footer {
    padding: 0px 20px 20px 0px;
  }
}
.family-detail {
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #e4e7ed;
}
.detail-message {
  width: 380px;
}
.detail-message-family {
  display: flex;
  line-height: 40px;
  font-size: 12px;
  border-bottom: 1px solid #e4e7ed;
  .family-name {
    width: 120px;
    background: #f5f7fa;
    text-align: right;
    padding-right: 10px;
    border-right: 1px solid #e4e7ed;
  }
  .family-nameDetail {
    flex: 1;
    padding-left: 10px;
    border-right: 1px solid #e4e7ed;
  }
}
.detail-content {
  flex: 1;
  line-height: 30px;
  font-size: 12px;
  .family-name {
    width: 120px;
    background: #f5f7fa;
    padding-right: 10px;
    text-align: right;
    border-right: 1px solid #e4e7ed;
  }
}
</style>

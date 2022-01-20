<template>
  <el-row class="row-container" :gutter="0">
    <el-tabs type="border-card" v-model="tabs" @tab-click="handleClick">
      <el-tab-pane label="配置信息" name="information">
        <el-form
          ref="form"
          label-width="150px"
          :rules="rules"
          :model="formData"
        >
          <el-form-item
            label="可视电话申请自动审核"
            :rules="{ required: true }"
          >
            <el-switch v-model="autoAuthorizeMeeting" active-color="#13ce66" />
          </el-form-item>
          <el-form-item label="家属认证自动审核" :rules="{ required: true }">
            <el-switch v-model="regAutoAudit" active-color="#13ce66" />
          </el-form-item>

          <el-form-item
            label="异常可视电话时长配置"
            :rules="{ required: true }"
          >
            <el-switch
              v-model="abnormalCallDurationSwitch"
              active-color="#13ce66"
            />

            <label v-if="abnormalCallDurationSwitch" class="sub-title">
              <el-input-number
                v-model="abnormalCallDuration"
                type="number"
                style="width: 150px; margin-left: 20px"
                :step="1"
                step-strictly
                controls-position="right"
                clearable
                :min="10"
                :max="600"
                @blur="changeTimes()"
                placeholder="输入秒数"
              ></el-input-number>
              <span style="margin-left: 10px">秒</span>
              <font style="margin-left: 20px" color="#C0C4CC"
                >说明: 每次通话时长不超过该时长时，该次通话不计入通话次数
              </font>
            </label>
          </el-form-item>

          <el-form-item label="人脸识别阈值设置">
            <el-col :span="24">
              <el-form-item
                label="IOS配置"
                prop="afrIOSSetValue"
                label-width="65px"
                class="el-form-item_afrSetValue"
              >
                <el-select
                  v-model="formData.afrIOSSetValue"
                  placeholder="请选择IOS阈值配置"
                >
                  <el-option
                    v-for="configs in faceRecognitionValues"
                    :key="configs"
                    :label="configs"
                    :value="configs"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item
                label="安卓配置"
                prop="afrAndroidSetValue"
                label-width="65px"
                class="el-form-item_afrSetValue"
              >
                <el-select
                  v-model="formData.afrAndroidSetValue"
                  placeholder="请选择安卓阈值配置"
                >
                  <el-option
                    v-for="configs in faceRecognitionValues"
                    :key="configs"
                    :label="configs"
                    :value="configs"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-form-item>

          <el-form-item
            label="人脸检索间隔时间"
            prop="afrInterval"
            class="el-form-item_afrInterval"
          >
            <el-input
              placeholder="请输入人脸检索间隔时间"
              v-model="formData.afrInterval"
            >
              <template #append>秒</template>
            </el-input>
          </el-form-item>

          <el-form-item
            label="可视电话通话人数上限"
            prop="visiblePhonePeopleNumber"
            class="el-form-item_people-number"
          >
            <el-input
              v-model="formData.visiblePhonePeopleNumber"
              placeholder="请输入可视电话通话人数上限"
            >
              <template #append>人</template>
            </el-input>
          </el-form-item>

          <el-form-item />
          <el-form-item />
          <el-form-item />
          <el-form-item />
          <el-form-item />
          <el-form-item />
          <el-form-item />
          <el-form-item />
          <el-form-item />
          <el-form-item />
          <el-form-item />
          <el-form-item>
            <el-button
              type="primary"
              style="float: right; margin-right: 60px"
              @click="submitTit()"
              >提交</el-button
            >
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="会见次数配置" name="configuration">
        <div style="margin:2px 0">
          <div class="el-form-item__content">可视电话会见配置</div>
          <el-table
            class="el-table__has__border-bottom"
            :data="tableData"
            border
            style="width: 800px"
          >
            <el-table-column prop="levelName" label="管教级别">
            </el-table-column>
            <el-table-column prop="accessTime" label="通话次数(次/月)">
              <template slot-scope="scope">
                <span v-if="scope.row.isEditPropertyShow">
                  <el-input
                    type="number"
                    onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                    :min="0"
                    @blur="changeTimes(scope.row)"
                    v-model="scope.row.accessTime"
                    size="mini"
                  >
                    <template slot="append">/次</template>
                  </el-input>
                </span>
                <span v-else>{{ scope.row.accessTime }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  v-if="!scope.row.isEditPropertyShow"
                  type="primary"
                  size="mini"
                  
                  @click="editProperty(scope.row, scope.$index)"
                  >编辑</el-button
                >
                <div v-else>
                  <el-button
                    type="primary"
                    plain
                    size="mini"
                    style="margin-right:16px;"
                    @click="saveProperty(scope.row, scope.$index, 1)"
                    >保存</el-button
                  >
                  <el-button
                    size="mini"
                    style="margin-right:16px;"
                    @click="saveProperty(scope.row, scope.$index, 2)"
                    >取消</el-button
                  >
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
       
        <el-form-item />
        <div style="margin:50px 0">
          <div class="el-form-item__content">亲情电话会见配置</div>
          <el-table
            class="el-table__has__border-bottom"
            :data="configurationsFamilyPhoneList"
            border
            style="width: 800px"
          >
            <el-table-column prop="type" label="管教级别" width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.type == 1"> 宽管级别 </span>
                <span v-if="scope.row.type == 2"> 普管级别 </span>
                <span v-if="scope.row.type == 3"> 考察级别 </span>
                <span v-if="scope.row.type == 4"> 严管级别 </span>
                <span v-if="scope.row.type == 5"> 其它级别 </span>
              </template>
            </el-table-column>
            <el-table-column prop="duration" label="通话时长(分钟)" width="200">
              <template slot-scope="scope">
                <span v-if="scope.row.isEditPropertyShow">
                  <el-input
                    type="number"
                    onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                    :min="0"
                    @blur="changeTimes(scope.row)"
                    v-model="scope.row.duration"
                    size="mini"
                  >
                    <template slot="append">/分钟</template>
                  </el-input>
                </span>
                <span v-else>{{ scope.row.duration }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="number" label="通话次数(次/月)">
              <template slot-scope="scope">
                <span v-if="scope.row.isEditPropertyShow">
                  <el-input
                    type="number"
                    onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                    :min="0"
                    @blur="changeTimes(scope.row)"
                    v-model="scope.row.number"
                    size="mini"
                  >
                    <template slot="append">/次</template>
                  </el-input>
                </span>
                <span v-else>{{ scope.row.number }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  v-if="!scope.row.isEditPropertyShow"
                  type="primary"
                  size="mini"
                  @click="compile(scope.row, scope.$index)"
                  >编辑</el-button
                >
                <div v-else >
                  <el-button
                    type="primary"
                    plain
                    size="mini"
                    style="margin-right:16px;"
                    @click="keep(scope.row, scope.$index, 1)"
                    >保存</el-button
                  >
                  <el-button
                    size="mini"
                    style="margin-right:16px;"
                    @click="keep(scope.row, scope.$index, 2)"
                    >取消</el-button
                  >
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="500px">
      <span
        >监狱配置已开启二级审核，当开启自动审核后，二级审核将失效，确认开启自动审核吗？</span
      >

      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDeploy">取 消</el-button>

        <el-button type="primary" @click="submitDeploy">确 定</el-button>
      </span>
    </el-dialog>
  </el-row>
</template>

<script>
import http from "@/service";
import Moment from "moment";
import { faceRecognitionValues } from "@/common/constants/const";

import validator from "@/utils";

export default {
  data() {
    const oneTimeDay = Moment().add(1, "day").format("YYYY-MM-DD");
    return {
      tabs: "information",
      dialogVisible: false,
      params: false,
      abnormalCallDuration: 300,
      autoAuthorizeMeeting: true,
      regAutoAudit: false,
      abnormalCallDurationSwitch: true,
      multistageExamine: false,
      maxDuration: 0,
      oneTimeDay,
      tableData: [],
      configurationsFamilyPhoneList: [],
      formData: {
        afrInterval: "1500",

        afrIOSSetValue: "0.2",

        afrAndroidSetValue: "0.4",

        visiblePhonePeopleNumber: "6",
      },

      faceRecognitionValues,

      rules: {
        afrInterval: [
          {
            required: true,
            message: "请输入人脸检索间隔时间",
            trigger: "blur",
          },
          { validator: validator.isPositiveIntegers, trigger: "blur" },
          {
            validator: validator.numberRange,
            trigger: "blur",
            min: 10,
            max: 3600,
          },
        ],

        visiblePhonePeopleNumber: [
          {
            validator: validator.isPositiveIntegers,
            ownMessage: "请输入可视电话通话人数上限",
          },
        ],
      },
    };
  },

  mounted() {
    this.getDeploy();
    this.getdata();
    this.getcall();
  },

  computed: {},
  methods: {
    handleClick(row, type) {},
    changeTimes(row, type) {
      if (type == 2) {
        if (parseFloat(this.ruleForm[row]) < 0) {
          this.$set(this.ruleForm, row, 0);
        }
        if (parseFloat(this.ruleForm[row]) > parseFloat(this.maxDuration)) {
          this.$set(this.ruleForm, row, this.maxDuration);
          this.$message.error("填写通话时长分钟数不能大于管教级别分钟数！！");
        }
      } else {
        if (row.duration < 0) {
          row.duration = 0;
        }
      }
    },
    // 修改可视电话属性
    editProperty(row, index, type) {
      // isEditPropertyShow为ture展示输入框
      this.$set(this.tableData[index], "isEditPropertyShow", true);
    },
    // 修改亲情电话会见属性
    compile(row, index, type) {
      // isEditPropertyShow为ture展示输入框
      this.$set(
        this.configurationsFamilyPhoneList[index],
        "isEditPropertyShow",
        true
      );
    },
    // 保存可视电话修改参数配置
    async saveProperty(row, index, type) {
      if (this.tableData[index].accessTime) {
        this.$set(this.tableData[index], "isEditPropertyShow", false);
        if (type == 2) {
          this.getdata();
        } else {
          let data = {
            jailId: JSON.parse(localStorage.getItem("user")).jailId,
            level: row.level,
            accessTime: row.accessTime,
          };
          let res = await http.setConfigurationsFamilyMeeting(data);
          if (!res) return;
          this.getdata();
        }
      } else {
        this.$message.error("请填写通话次数！！");
      }
    },
    // 保存亲情电话修改参数配置
    async keep(row, index, type) {
      if (
        this.configurationsFamilyPhoneList[index].duration &&
        this.configurationsFamilyPhoneList[index].number
      ) {
        this.$set(
          this.configurationsFamilyPhoneList[index],
          "isEditPropertyShow",
          false
        );
        if (type == 2) {
          this.getcall();
        } else {
          let res = await http.editConfigurations({
            ...this.configurationsFamilyPhoneList[index],
          });
          if (!res) return;
          this.getcall();
        }
      } else {
        this.$message.error("请填写通话时长与通话次数！！");
      }
    },
    async getcall() {
      let res = await http.getConfiguractionAndtemplate({
        jailId: JSON.parse(localStorage.getItem("user")).jailId,
      });
      if (!res) return;
      res.data.configurationsFamilyPhoneList.forEach((item) => {
        item.isEditPropertyShow = false;
      });
      this.configurationsFamilyPhoneList =
        res.data.configurationsFamilyPhoneList;
    },
    async getdata() {
      let res = await http.getConfigurationsFamilyMeeting({
        jailId: JSON.parse(localStorage.getItem("user")).jailId,
      });
      if (!res) return;
      res.data.forEach((item) => {
        item.isEditPropertyShow = false;
      });
      this.tableData = res.data;
    },
    async mounted() {
      this.getdata();
    },
    getDeploy() {
      http.getMeetDeploy().then((res) => {
        this.dialogVisible = false;
        this.autoAuthorizeMeeting = res.data.autoAuthorizeMeeting
          ? true
          : false;
        this.regAutoAudit = res.data.regAutoAudit ? true : false;
        this.multistageExamine = res.data.multistageExamine ? true : false;
        this.abnormalCallDurationSwitch = res.data.abnormalCallDurationSwitch
          ? true
          : false;
        this.abnormalCallDuration = res.data.abnormalCallDuration;
        this.formData = Object.assign({}, this.formData, res.data);
      });
    },
    changeTimes() {
      if (this.abnormalCallDuration > 600) {
        this.abnormalCallDuration = 600;
      }
      if (this.abnormalCallDuration < 10) {
        this.abnormalCallDuration = 10;
      }
    },
    submitTit() {
      //判断
      if (this.autoAuthorizeMeeting == true && this.multistageExamine == true) {
        this.dialogVisible = true;
      } else {
        this.submitDeploy();
      }
    },
    closeDeploy() {
      this.dialogVisible = false;
    },
    submitDeploy() {
      const params = Object.assign({}, this.formData, {
        autoAuthorizeMeeting: this.autoAuthorizeMeeting ? 1 : 0,
        abnormalCallDuration: this.abnormalCallDuration,
        regAutoAudit: this.regAutoAudit ? 1 : 0,
        abnormalCallDurationSwitch: this.abnormalCallDurationSwitch ? 1 : 0,
      });
      this.$refs.form.validate((valid) => {
        if (valid) {
          http.getMeetDeployUpdate(params).then((res) => {
            this.getDeploy();
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form {
  /deep/ .el-form-item_afrInterval {
    .el-form-item__content {
      .el-input {
        width: 20%;
      }
    }
  }

  /deep/ .el-form-item_afrSetValue {
    .el-form-item__content {
      .el-select {
        width: 15.5%;
      }
    }
  }

  /deep/ .el-form-item_people-number {
    .el-input {
      width: 20%;
    }
  }
}
</style>

<template>
  <el-row class="row-container" :gutter="0">
    <el-tabs type="border-card">
      <el-form ref="form" label-width="150px" :rules="rules" :model="formData">
        <el-form-item label="可视电话申请自动审核" :rules="{ required: true }">
          <el-switch v-model="autoAuthorizeMeeting" active-color="#13ce66" />
        </el-form-item>
        <el-form-item label="家属认证自动审核" :rules="{ required: true }">
          <el-switch v-model="regAutoAudit" active-color="#13ce66" />
        </el-form-item>

        <el-form-item label="异常可视电话时长配置" :rules="{ required: true }">
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
        <el-form-item
          label="家属关系"
          prop="family"
          class="el-form-item_people-number"
        >
          <div style="display: flex">
            <div
              style="
                border: 1px solid #dcdfe6;
                min-height: 42px;
                min-width: 300px;
                width: 500px;
                margin-right: 20px;
              "
            >
              <span
                style="
                  border: 1px solid #dcdfe6;
                  padding: 5px 10px;
                  margin-left: 20px;
                "
                v-for="(item, index) in familylist"
                :key="index"
                >{{ item }}</span
              >
            </div>
            <el-button :disabled="isSuperAdmin" type="primary" @click="onNewFamily">编辑</el-button>
          </div>
        </el-form-item>
        <el-dialog
          :visible.sync="familyrelations"
          title="新增家属关系"
          width="530px"
        >
          <div style="height: 400px; overflow-y: auto;">
            <span
              style="width: 220px; display: inline-block; padding-left: 30px"
              v-for="(item, index) in content"
              :key="index"
            >
              <el-input
                v-model="content[index]"
                style="margin-bottom: 10px;"
                maxlength="200"
                placeholder="请输入家属关系"
                clearable
              >
                <el-button
                  slot="append"
                  icon="el-icon-close"
                  @click="removeReject(index)"
                />
              </el-input>
            </span>
          </div>
          <span>
            <el-button
              v-if="content.length >= 1"
              class="button-add"
              type="primary"
              size="mini"
              @click="onSubmitReject"
              >保存</el-button
            >

            <el-button
              v-if="content.length < 30"
              type="primary"
              class="button-add"
              size="mini"
              @click="addReject"
              >新增</el-button
            >
          </span>
        </el-dialog>
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

import { faceRecognitionValues } from "@/common/constants/const";

import validator from "@/utils";
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      dialogVisible: false,
      params: false,
      abnormalCallDuration: 300,
      autoAuthorizeMeeting: true,
      regAutoAudit: false,
      abnormalCallDurationSwitch: true,
      multistageExamine: false,
      familyrelations: false,
      familylist:[],
      family: "",
      content: [],
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
   computed: {
      ...mapGetters([
        'isSuperAdmin'
      ])
   },
  mounted() {
    this.getDeploy();
  },

  methods: {
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
        this.content =  res.data.relationshipTemplate.split(",")
        this.familylist=Object.assign({}, this.familylist, res.data.relationshipTemplate.split(",")); 
      });
    },

    addReject() {
      this.content.push("");
    },

    removeReject(index) {
      this.content.splice(index, 1);
    },
    async onSubmitReject() {
     let relationship = [...new Set(this.content.filter((res) => res && res.trim()))];
     
      if (relationship.length < 1) {
        this.$message({
          message: "新增编辑内容不能为空",
          type: "error",
        });

        return false;
      } else {
        let params = {
           jailId:JSON.parse(localStorage.getItem("user")).jailId,
           relationshipTemplate: relationship.toString()
        };

        let res = await http.updateRelationshipTemplate(params);

        if (res) {
           this.getDeploy();
        }
        this.familyrelations = false;
      }
    },

    onNewFamily() {
      this.familyrelations = true;
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

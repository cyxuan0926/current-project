<template>
  <el-row class="row-container" :gutter="0">
    <el-tabs v-model="tabs" type="border-card">
      <el-tab-pane label="配置信息" name="information">
        <el-form
          ref="form"
          label-width="150px"
          :rules="rules"
          :model="formData"
        >
          <el-form-item label="可视电话申请自动审核" :rules="{ required: true }">
            <el-switch v-model="autoAuthorizeMeeting" active-color="#13ce66" />
          </el-form-item>

          <el-form-item label="家属认证自动审核" :rules="{ required: true }">
            <el-switch v-model="regAutoAudit" active-color="#13ce66" />
          </el-form-item>

          <el-form-item label="异常可视电话时长配置" :rules="{ required: true }">
            <el-switch v-model="abnormalCallDurationSwitch" active-color="#13ce66" />

            <template v-if="abnormalCallDurationSwitch">
              <label class="sub-title">
                <el-input-number
                  v-model="abnormalCallDuration"
                  type="number"
                  style="width: 150px; margin-left: 20px;"
                  :step="1"
                  step-strictly
                  controls-position="right"
                  clearable
                  :min="10"
                  :max="600"
                  @blur="changeDate"
                  placeholder="输入秒数"
                />

                <span style="margin-left: 10px;">秒</span>

                <font style="margin-left: 20px;" color="#C0C4CC">
                  说明: 每次通话时长不超过该时长时，该次通话不计入通话次数
                </font>
              </label>
            </template>
          </el-form-item>

          <el-form-item label="人脸识别阈值设置">
            <el-col :span="24">
              <el-form-item
                label="IOS配置"
                prop="afrIOSSetValue"
                label-width="65px"
                class="el-form-item_afrSetValue"
              >
                <el-select v-model="formData.afrIOSSetValue" placeholder="请选择IOS阈值配置">
                  <template v-for="configs in faceRecognitionValues">
                    <el-option
                      :key="configs"
                      :label="configs"
                      :value="configs"
                    />
                  </template>
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
                <el-select v-model="formData.afrAndroidSetValue" placeholder="请选择安卓阈值配置">
                  <template v-for="configs in faceRecognitionValues">
                    <el-option
                      :key="configs"
                      :label="configs"
                      :value="configs"
                    />
                  </template>
                </el-select>
              </el-form-item>
            </el-col>
          </el-form-item>

          <el-form-item
            label="人脸检索间隔时间"
            prop="afrInterval"
            class="el-form-item_afrInterval"
          >
            <el-input v-model="formData.afrInterval" placeholder="请输入人脸检索间隔时间">
              <template #append>秒</template>
            </el-input>
          </el-form-item>

          <el-form-item
            label="可视电话通话人数上限"
            prop="visiblePhonePeopleNumber"
            class="el-form-item_people-number"
          >
            <el-input v-model="formData.visiblePhonePeopleNumber" placeholder="请输入可视电话通话人数上限">
              <template #append>人</template>
            </el-input>
          </el-form-item>

          <el-form-item
            label="家属关系"
            prop="family"
            class="el-form-item_people-number"
          >
            <div style="display: flex;">
              <div
                style="
                  border: 1px solid #dcdfe6;
                  min-height: 42px;
                  min-width: 300px;
                  width: 500px;
                  margin-right: 20px;
                "
              >
                <template v-for="(item, index) in familylist">
                  <span
                    style="
                      line-height: 15px;
                      border: 1px solid #dcdfe6;
                      padding: 5px 8px;
                      margin: 5px;
                      display: inline-block;
                      margin-top:10px;
                    "
                    :key="index"
                  >{{ item }}</span>
                </template>    
              </div>

              <el-button :disabled="isSuperAdmin" type="primary" @click="onNewFamily">编辑</el-button>
            </div>
          </el-form-item>

          <el-form-item
            label="家属短信发送内容"
            prop="familySendMsgType"
            class="el-form-item_people-number"
          >
            <el-checkbox-group v-model="formData.familySendMsgType">
              <template v-for="item in $store.state.familySendMsgTypeOptions">
                <el-checkbox
                  :key="item.value"
                  :label="item.value"
                  v-bind="item.attrs || {}"
                >{{ item.label }}</el-checkbox>
              </template>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item
            label="服刑人员发送内容"
            prop="prisonerSendMsgType"
            class="el-form-item_people-number"
          >
            <el-checkbox-group v-model="formData.prisonerSendMsgType">
              <template v-for="item in $store.state.prisonerSendMsgTypeOptions">
                <el-checkbox
                  :key="item.value"
                  :label="item.value"
                  v-bind="item.attrs || {}"
                >{{ item.label }}</el-checkbox>
              </template>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item
            label="可视电话通话前提示"
            prop="visiblePhonePrompt"
            class="el-form-item_people-number"
          >
            <el-switch
              v-model="formData.visiblePhonePrompt"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
            />

            <el-row class="el-row_preConfig">
              <template v-if="showPreConfig.isShowViewPhoneText">
                <el-input
                  v-model="formData.visiblePhoneTextPrompt"
                  class="el-row_preConfig-contents"
                  type="textarea"
                  placeholder="请输入通话注意事项"
                  :autosize="{ minRows: 5 }"
                  maxlength="500"
                  show-word-limit
                  :disabled="!formData.visiblePhonePrompt"
                />
              </template>

              <template v-else>
                <m-v-new-audio
                  v-model="formData.visiblePhoneVoicePrompt"
                  ref="viewAudio"
                  :sizeLimit="5"
                  :elUploadAttrs="viewPhoneAttrs"
                  :triggerButtonAttrs="viewPhoneAttrs"
                  :on-control-parent-loading="onControlViewPhoneParentLoading"
                />
              </template>

              <el-row class="el-row_preConfig-buttons">
                <template v-if="!showPreConfig.isShowViewPhoneText">
                  <el-button
                    type="primary"
                    :disabled="!formData.visiblePhonePrompt"
                    @click="onChangeNoticeType('ViewPhone')"
                  >文字提示</el-button>
                </template>

                <template v-else>
                  <el-button
                    type="primary"
                    :disabled="!formData.visiblePhonePrompt"
                    @click="onChangeNoticeType('ViewPhone')"
                  >语音提示</el-button>
                </template>
              </el-row>
            </el-row>
          </el-form-item>

          <el-form-item
            label="亲情电话通话前提示"
            prop="familyPhonePrompt"
            class="el-form-item_people-number"
          >
            <el-switch
              v-model="formData.familyPhonePrompt"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
            />

            <el-row class="el-row_preConfig">
              <template v-if="showPreConfig.isShowFamilyPhoneText">
                <el-input
                  v-model="formData.familyPhoneTextPrompt"
                  class="el-row_preConfig-contents"
                  type="textarea"
                  placeholder="请输入通话注意事项"
                  :autosize="{ minRows: 5 }"
                  maxlength="500"
                  show-word-limit
                  :disabled="!formData.familyPhonePrompt"
                />
              </template>

              <template v-else>
                <m-v-new-audio
                  v-model="formData.familyPhoneVoicePrompt"
                  ref="familyAudio"
                  :sizeLimit="5"
                  :elUploadAttrs="familyPhoneAttrs"
                  :triggerButtonAttrs="familyPhoneAttrs"
                  :on-control-parent-loading="onControlFamilyPhoneParentLoading"
                />
              </template>

              <el-row class="el-row_preConfig-buttons">
                <template v-if="!showPreConfig.isShowFamilyPhoneText">
                  <el-button
                    type="primary"
                    :disabled="!formData.familyPhonePrompt"
                    @click="onChangeNoticeType('FamilyPhone')"
                  >文字提示</el-button>
                </template>

                <template v-else>
                  <el-button
                    type="primary"
                    :disabled="!formData.familyPhonePrompt"
                    @click="onChangeNoticeType('FamilyPhone')"
                  >语音提示</el-button>
                </template>
              </el-row>
            </el-row>
          </el-form-item>

          <el-form-item />
          <el-form-item />
          <el-form-item />

          <el-form-item>
            <el-button
              type="primary"
              style="float: right; margin-right: 60px;"
              @click="submitTit"
            >提交</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="会见次数配置" name="configuration">
        <div style="margin: 2px 0;">
          <div class="el-form-item__content">可视电话会见配置</div>

          <el-table
            class="el-table__has__border-bottom"
            :data="tableData"
            border
            style="width: 800px;"
          >
            <el-table-column prop="levelName" label="管教级别" />

            <el-table-column prop="accessTime" label="通话次数(次/月)">
              <template #default="{ row }">
                <template v-if="row.isEditPropertyShow">
                  <span>
                    <el-input
                      v-model="row.accessTime"
                      type="number"
                      :onKeypress="$_limitInputPositiveInteger"
                      :min="0"
                      @blur="changeTimes(row)"
                      size="mini"
                    >
                      <template slot="append">/次</template>
                    </el-input>
                  </span>
                </template>

                <template v-else>
                  <span>{{ row.accessTime }}</span>
                </template>
              </template>
            </el-table-column>

            <el-table-column label="操作">
              <template #default="{ row, $index }">
                <template v-if="!row.isEditPropertyShow">
                  <el-button
                    type="primary"
                    size="mini"
                    @click="editProperty(row, $index)"
                  >编辑</el-button>
                </template>

                <template v-else>
                  <div>
                    <el-button
                      type="primary"
                      plain
                      size="mini"
                      style="margin-right: 16px;"
                      @click="saveProperty(row, $index, 1)"
                    >保存</el-button>

                    <el-button
                      size="mini"
                      style="margin-right: 16px;"
                      @click="saveProperty(row, $index, 2)"
                    >取消</el-button>
                  </div>
                </template>               
              </template>
            </el-table-column>
          </el-table>
        </div>
       
        <div style="margin: 50px 0;">
          <div class="el-form-item__content">亲情电话会见配置</div>

          <el-table
            class="el-table__has__border-bottom"
            :data="configurationsFamilyPhoneList"
            border
            style="width: 800px;"
          >
            <el-table-column
              prop="type"
              label="管教级别"
              width="100"
            >
              <template #default="{ row }">
                <template v-if="row.type == 1">
                  <span>宽管级别</span>
                </template>

                <template v-if="row.type == 2">
                  <span>普管级别</span>
                </template>

                <template v-if="row.type == 3">
                  <span>考察级别</span>
                </template>

                <template v-if="row.type == 4">
                  <span>严管级别</span>
                </template>

                <template v-if="row.type == 5">
                  <span>其它级别</span>
                </template>
              </template>
            </el-table-column>

            <el-table-column
              prop="duration"
              label="通话时长(分钟)"
              width="200"
            >
              <template #default="{ row }">
                <template v-if="row.isEditPropertyShow">
                  <span>
                    <el-input
                      v-model="row.duration"
                      type="number"
                      :onKeypress="$_limitInputPositiveInteger"
                      :min="0"
                      @blur="changeTimes(row)"                    
                      size="mini"
                    >
                      <template slot="append">/分钟</template>
                    </el-input>
                  </span>
                </template>

                <template v-else>
                  <span>{{ row.duration }}</span>
                </template>              
              </template>
            </el-table-column>

            <el-table-column prop="number" label="通话次数(次/月)">
              <template #default="{ row }">
                <template v-if="row.isEditPropertyShow">
                  <span>
                    <el-input
                      v-model="row.number"
                      type="number"
                      :onKeypress="$_limitInputPositiveInteger"
                      :min="0"
                      @blur="changeTimes(row)"                  
                      size="mini"
                    >
                      <template slot="append">/次</template>
                    </el-input>
                  </span>
                </template>

                <template v-else>
                  <span>{{ row.number }}</span>
                </template>               
              </template>
            </el-table-column>

            <el-table-column label="操作">
              <template #default="{ row, $index }">
                <template v-if="!row.isEditPropertyShow">
                  <el-button
                    type="primary"
                    size="mini"
                    @click="compile(row, $index)"
                  >编辑</el-button>
                </template>
 
                <template v-else>
                  <div>
                    <el-button
                      type="primary"
                      plain
                      size="mini"
                      style="margin-right: 16px;"
                      @click="keep(row, $index, 1)"
                    >保存</el-button>

                    <el-button
                      size="mini"
                      style="margin-right: 16px;"
                      @click="keep(row, $index, 2)"
                    >取消</el-button>
                  </div>
                </template>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>

      <el-tab-pane label="亲情短信配置" name="message">
        <el-row style="padding: 5px 0px;">每月发短信上限条数</el-row>

        <m-form
          ref="messageForm"
          :items="formItems"
          :values="messageFormData"
          @cancel="onMessageFormCancel"
          @submit="onMessageFormSubmit"
        />

        <el-row style="padding-top: 10px; text-align: right;">
          <el-col :span="18">
            <template v-if="messageInputDisabled">
              <el-button type="primary" @click="messageInputDisabled = false">编 辑</el-button>
            </template>

            <template v-else>
              <el-button type="primary" @click="onMessageFormSave">保 存</el-button>
              <el-button @click="onAbord">取 消</el-button>
            </template>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="500px"
    >
      <span>监狱配置已开启二级审核，当开启自动审核后，二级审核将失效，确认开启自动审核吗</span>

      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDeploy">取 消</el-button>

        <el-button type="primary" @click="submitDeploy">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible.sync="familyrelations"
      title="新增家属关系"
      width="530px"
    >
      <div style="height: 400px; overflow-y: auto;">
        <template v-for="(item, index) in content">
          <span style="width: 220px; display: inline-block; padding-left: 30px;" :key="index">
            <el-input
              v-model="content[index]"
              style="margin-bottom: 10px;"
              maxlength="200"
              placeholder="请输入家属关系"
              clearable
            >
              <template #append>
                <el-button icon="el-icon-close" @click="removeReject(index)" />
              </template>
            </el-input>
          </span>
        </template>
      </div>

      <span>
        <template v-if="content.length >= 1">
          <el-button
            class="button-add"
            type="primary"
            size="mini"
            @click="onSubmitReject"
          >保存</el-button>
        </template>

        <template v-if="content.length < 30">
          <el-button
            type="primary"
            class="button-add"
            size="mini"
            @click="addReject"
          >新增</el-button>
        </template>
      </span>
    </el-dialog>
  </el-row>
</template>

<script>
import http from "@/service";
import Moment from "moment";
import { faceRecognitionValues } from "@/common/constants/const";

import validator from "@/utils";
import { mapGetters, mapActions } from 'vuex'
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
      familyrelations: false,
      familylist:[],
      family: "",
      content: [],

      maxDuration: 0,
      oneTimeDay,
      tableData: [],
      configurationsFamilyPhoneList: [],
      formData: {
        afrInterval: "1500",

        afrIOSSetValue: "0.2",

        afrAndroidSetValue: "0.4",

        visiblePhonePeopleNumber: "6",
        familySendMsgType: [1],
        prisonerSendMsgType: [1, 2],
        visiblePhonePrompt: 0,
        visiblePhoneTextPrompt: '',
        familyPhonePrompt: 0,
        familyPhoneTextPrompt: '',
        visiblePhoneVoicePrompt: '',
        familyPhoneVoicePrompt: ''
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

      messageInputDisabled: true,

      messageFormData: {
        broadNum: 100,
        commonNum: 100,
        inspectNum: 100,
        strictNum: 100,
        otherNum: 100
      },

      // 可视电话/亲情电话通话前配置显示类型
      showPreConfig: {
        isShowViewPhoneText: false,
        isShowFamilyPhoneText: false
      },

      viewPhoneParentLoading: false,
      familyPhoneParentLoading: false,

      jailId: JSON.parse(localStorage.getItem("user")).jailId
    };
  },

  computed: {
    ...mapGetters(['isSuperAdmin']),

    formItems() {
      const messageFormInputs = {
        type: 'number',
        append: "/条",
        rules: ["required", "isPositiveNumber"],
        disabled: this.messageInputDisabled,
        attrs: {
          min: 0,
          onKeypress: this.$_limitInputPositiveInteger,
        },
        customClass: ['el-form_item-message']
      }

      return Object.assign({}, {
        formConfigs: { labelWidth: "220px" },

        broadNum: {
          label: "宽管级别",
          ...messageFormInputs
        },

        commonNum: {
          label: "普管级别",
          ...messageFormInputs
        },

        inspectNum: {
          label: "考察级别",
          ...messageFormInputs
        },

        strictNum: {
          label: "严管级别",
          ...messageFormInputs
        },

        otherNum: {
          label: "其他级别",
          ...messageFormInputs
        }
      })
    },

    viewPhoneAttrs() {
      return {
        disabled: !this.formData.visiblePhonePrompt || this.viewPhoneParentLoading
      }
    },

    familyPhoneAttrs() {
      return {
        disabled: !this.formData.familyPhonePrompt || this.viewPhoneParentLoading
      }
    }
  },

  async mounted() {
    await Promise.all([
      this.getDeploy(),
      this.getdata(),
      this.getcall(),
      this.getFamilyMessageLevelNum()
    ]);
  },

  methods: {
    ...mapActions(['updateFamilyMessageLevelNum']),

    changeTimes(row, type) {
      if (type == 2) {
        if (parseFloat(this.ruleForm[row]) < 0) this.$set(this.ruleForm, row, 0);

        if (parseFloat(this.ruleForm[row]) > parseFloat(this.maxDuration)) {
          this.$set(this.ruleForm, row, this.maxDuration);
          this.$message.error("填写通话时长分钟数不能大于管教级别分钟数！！");
        }
      } else {
        if (row.duration < 0) row.duration = 0;
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
      if (type == 2) await this.getdata();

      else {
        if (this.tableData[index].accessTime) {
        this.$set(this.tableData[index], "isEditPropertyShow", false);

        let data = {
          jailId: this.jailId,
          level: row.level,
          accessTime: row.accessTime,
        };

        let res = await http.setConfigurationsFamilyMeeting(data);

        if (!res) return;

        await this.getdata();
        } else this.$message.error("请填写通话次数！！");
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

        if (type == 2) await this.getcall();

        else {
          let res = await http.editConfigurations({
            ...this.configurationsFamilyPhoneList[index],
          });

          if (!res) return;
          await this.getcall();
        }
      } else this.$message.error("请填写通话时长与通话次数！！");
    },

    async getcall() {
      let res = await http.getConfiguractionAndtemplate({
        jailId: this.jailId,
      });

      if (!res) return;
      res.data.configurationsFamilyPhoneList.forEach(item => {
        item.isEditPropertyShow = false;
      });

      this.configurationsFamilyPhoneList = res.data.configurationsFamilyPhoneList;
    },

    async getdata() {
      let res = await http.getConfigurationsFamilyMeeting({
        jailId: this.jailId,
      });

      if (!res) return;
      res.data.forEach(item => {
        item.isEditPropertyShow = false;
      });

      this.tableData = res.data;
    },

    getDeploy() {
      http.getMeetDeploy().then(res => {
        const { visiblePhonePrompt, familyPhonePrompt, callPrompt } = res.data
        this.dialogVisible = false;
        this.autoAuthorizeMeeting = res.data.autoAuthorizeMeeting ? true : false;
        this.regAutoAudit = res.data.regAutoAudit ? true : false;
        this.multistageExamine = res.data.multistageExamine ? true : false;
        this.abnormalCallDurationSwitch = res.data.abnormalCallDurationSwitch ? true : false;
        this.abnormalCallDuration = res.data.abnormalCallDuration;
        this.formData = Object.assign({}, this.formData, res.data);

        if ((visiblePhonePrompt || familyPhonePrompt) && callPrompt && Object.prototype.toString.call(callPrompt) === '[object Object]') {
          const {
            familyPhoneTextPrompt,
            familyPhoneVoicePrompt,
            visiblePhoneTextPrompt,
            visiblePhoneVoicePrompt
          } = callPrompt

          this.formData = Object.assign({}, this.formData, {
            familyPhoneTextPrompt,
            familyPhoneVoicePrompt,
            visiblePhoneTextPrompt,
            visiblePhoneVoicePrompt
          })

          this.$set(this.showPreConfig, 'isShowViewPhoneText', !!visiblePhoneTextPrompt)
          this.$set(this.showPreConfig, 'isShowFamilyPhoneText', !!familyPhoneTextPrompt)
        } else {
          this.$set(this.showPreConfig, 'isShowViewPhoneText', false)
          this.$set(this.showPreConfig, 'isShowFamilyPhoneText', false)
        }

        this.content =  res.data.relationshipTemplate.split(",");
        this.familylist = [...res.data.relationshipTemplate.split(",")];
      });
    },

    addReject() {
      this.content.push('');
    },

    removeReject(index) {
      this.content.splice(index, 1);
    },

    async onSubmitReject() {
     let relationship = [...new Set(this.content.filter(res => res && res.trim()))];
     
      if (relationship.length < 1) {
        this.$message({
          message: "新增编辑内容不能为空",
          type: "error",
        });

        return false;
      } else {
        let params = {
          jailId: this.jailId,
          relationshipTemplate: relationship.toString()
        };

        let res = await http.updateRelationshipTemplate(params);

        if (res) await this.getDeploy();

        this.familyrelations = false;
      }
    },

    onNewFamily() {
      this.content = [...this.familylist];
      this.familyrelations = true;
    },

    changeDate() {
      if (this.abnormalCallDuration > 600) this.abnormalCallDuration = 600;
      if (this.abnormalCallDuration < 10) this.abnormalCallDuration = 10;
    },

    submitTit() {
      //判断
      if (
        (!this.formData.visiblePhonePrompt && !this.formData.familyPhonePrompt) ||
        (this.formData.visiblePhonePrompt && (this.formData.visiblePhoneTextPrompt || this.formData.visiblePhoneVoicePrompt)) ||
        (this.formData.familyPhonePrompt && (this.formData.familyPhoneTextPrompt || this.formData.familyPhoneVoicePrompt))
      ) {
        if (this.autoAuthorizeMeeting && this.multistageExamine) this.dialogVisible = true;
        else this.submitDeploy();
      } else {
        this.$confirm('请上传通话前的提示语音或文字！', '提示', {
          type: 'warning',
          confirmButtonText: '确定',
          closeOnClickModal: false,
          showCancelButton: false
        })
      }      
    },

    closeDeploy() {
      this.dialogVisible = false;
    },

    submitDeploy() {
      const {
        familySendMsgType,
        prisonerSendMsgType,
        visiblePhonePrompt,
        visiblePhoneTextPrompt,
        familyPhonePrompt,
        familyPhoneTextPrompt
      } = this.formData, { isShowViewPhoneText, isShowFamilyPhoneText } = this.showPreConfig

      let params = Object.assign({}, this.formData, {
        autoAuthorizeMeeting: this.autoAuthorizeMeeting ? 1 : 0,
        abnormalCallDuration: this.abnormalCallDuration,
        regAutoAudit: this.regAutoAudit ? 1 : 0,
        abnormalCallDurationSwitch: this.abnormalCallDurationSwitch ? 1 : 0,
        familySendMsgType: JSON.stringify(familySendMsgType),
        prisonerSendMsgType: JSON.stringify(prisonerSendMsgType)
      });

      if (visiblePhonePrompt) {
        if (isShowViewPhoneText) {
          params['visiblePhoneTextPrompt'] = visiblePhoneTextPrompt.replace(/\s/g, '')
          delete params['visiblePhoneVoicePrompt']
        }
        else delete params['visiblePhoneTextPrompt']
      } else {
        delete params['visiblePhoneVoicePrompt']
        delete params['visiblePhoneTextPrompt']
      }

      if (familyPhonePrompt) {
        if (isShowFamilyPhoneText) {
          params['familyPhoneTextPrompt'] = familyPhoneTextPrompt.replace(/\s/g, '')
          delete params['familyPhoneVoicePrompt']
        }
        else delete params['familyPhoneTextPrompt']
      }
      else {
        delete params['familyPhoneVoicePrompt']
        delete params['familyPhoneTextPrompt']
      }
      delete params['callPrompt']

      this.$refs.form.validate(valid => {
        if (valid) {
          http.getMeetDeployUpdate(params).then(res => {
            this.getDeploy();
          });
        }
      });
    },

    onMessageFormCancel() {
      this.messageInputDisabled = true
    },

    onAbord() {
      this.$refs.messageForm.onCancel()
    },

    onMessageFormSave() {
      this.$refs.messageForm.onSubmit()
    },

    async onMessageFormSubmit(params) {
      Object.entries(params).forEach(([key, value]) => {
        params[key] = +value
      })

      const result = await this.updateFamilyMessageLevelNum(params)

      if (result) {
        await this.getFamilyMessageLevelNum()
        this.onMessageFormCancel()
      }
    },

    // 切换提示类型
    onChangeNoticeType(type) {
      const current = this.showPreConfig[`isShow${type}Text`]
      this.$set(this.showPreConfig, `isShow${type}Text`, !current)
    },

    onControlViewPhoneParentLoading(val) {
      this.viewPhoneParentLoading = val
    },

    onControlFamilyPhoneParentLoading(val) {
      this.familyPhoneParentLoading = val
    },

    async getFamilyMessageLevelNum() {
      const res = await http.getConfigMessageList({ jailId: this.jailId }),
        {
          broadNum,
          commonNum,
          inspectNum,
          otherNum,
          strictNum,
          id
        } = res[0]

      this.messageFormData = Object.assign({}, this.messageFormData, {
        broadNum,
        commonNum,
        inspectNum,
        otherNum,
        strictNum,
        id
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.row-container {
  height: 100%;
}

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

  .el-row_preConfig {
    display: flex;
    align-items: flex-start;
    &-contents {
      width: 45%;
    }

    &-buttons {
      margin-left: 10px;
    }
  }
}

.yt-form {
  /deep/ .el-form_item-message {
    .el-form-item__content {
      width: 24%;
    }
  }
}
</style>

<template>
  <div>
    <m-form
      :items="formItems"
      @submit="onSubmit"
      @back="onBack"
      :values="values"
      ref="prison-config_form"
    >
      <template #abnormalCalldurationSwitch>
        <el-col :span="3">
          <el-form-item prop="abnormalCalldurationSwitch">
            <el-switch
              :width="60"
              v-model="slotFormData.abnormalCalldurationSwitch"
              :disabled="isDisabled"
              active-color="#13ce66"
              :active-value="1"
              :inactive-value="0"
            />
          </el-form-item>
        </el-col>

        <template v-if="!!slotFormData.abnormalCalldurationSwitch">
          <el-col :span="21">
            <el-form-item prop="abnormalCallduration" :rules="slotFormRules.abnormalCallduration">
              <el-input-number
                type="number"
                style="width: 150px; margin-left: 20px"
                :step="1"
                step-strictly
                :disabled="isDisabled"
                v-model.trim.number="slotFormData.abnormalCallduration"
                controls-position="right"
                clearable
                placeholder="输入秒数"
                :min="10"
                :max="600"
              >
                <template slot="append">秒</template>
              </el-input-number>

              <span style="margin-left: 10px;"> 秒</span>

              <font color="#C0C4CC" style="margin-left: 20px;">
                说明: 每次通话时长不超过该时长时，该次通话不计入通话次数
              </font>
            </el-form-item>
          </el-col>
        </template>
        <!-- <el-form-item prop="diplomatistFixedMoney" :rules="rules.diplomatistFixedMoney">
            <el-input
              v-model.trim="formData.diplomatistFixedMoney"
              placeholder="请输入基础时长后每分钟费用"
              :disabled="$route.meta.role === '3'"
            >
              <template slot="append">/元</template>
            </el-input>
          </el-form-item> -->
      </template>

      <template #thresholdConfigs>
        <el-col :span="24">
          <el-form-item
            label="IOS配置"
            prop="afrIOSSetValue"
            label-width="65px"
          >
            <el-select
              v-model="slotFormData.afrIOSSetValue"
              placeholder="请选择IOS阈值配置"
              :disabled="isDisabled"
            >
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
          >
            <el-select
              v-model="slotFormData.afrAndroidSetValue"
              placeholder="请选择安卓阈值配置"
              :disabled="isDisabled"
            >
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
      </template>

      <template #relationshipTemplate>
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
            <template v-for="(item, index) in relationship">
              <span
                style="
                  border: 1px solid #dcdfe6;
                  padding: 5px 10px;
                  margin-left: 20px;
                "          
                :key="index"
              >{{ item }}</span>
            </template>
          </div>
        </div>
      </template>

      <template #visiblePhoneSlot>
        <el-switch
          v-model="slotFormData.visiblePhonePrompt"
          :active-value="1"
          :inactive-value="0"
          active-color="#13ce66"
          :disabled="isDisabled"
        />

        <el-row class="el-row_preConfig">
          <template v-if="showPreConfig.isShowViewPhoneText">
            <el-input
              v-model="slotFormData.visiblePhoneTextPrompt"
              class="el-row_preConfig-contents"
              type="textarea"
              placeholder="请输入通话注意事项"
              :autosize="{ minRows: 5 }"
              maxlength="500"
              show-word-limit
              :disabled="!slotFormData.visiblePhonePrompt || isDisabled"
            />
          </template>

          <template v-else>
            <m-v-new-audio
              v-model="slotFormData.visiblePhoneVoicePrompt"
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
                :disabled="!slotFormData.visiblePhonePrompt || isDisabled"
                @click="onChangeNoticeType('ViewPhone')"
              >文字提示</el-button>
            </template>

            <template v-else>
              <el-button
                type="primary"
                :disabled="!slotFormData.visiblePhonePrompt || isDisabled"
                @click="onChangeNoticeType('ViewPhone')"
              >语音提示</el-button>
            </template>
          </el-row>
        </el-row>
      </template>

      <template #familyPhonePreSlot>
        <el-switch
          v-model="slotFormData.familyPhonePrompt"
          :active-value="1"
          :inactive-value="0"
          active-color="#13ce66"
          :disabled="isDisabled"
        />

        <el-row class="el-row_preConfig">
          <template v-if="showPreConfig.isShowFamilyPhoneText">
            <el-input
              v-model="slotFormData.familyPhoneTextPrompt"
              class="el-row_preConfig-contents"
              type="textarea"
              placeholder="请输入通话注意事项"
              :autosize="{ minRows: 5 }"
              maxlength="500"
              show-word-limit
              :disabled="!slotFormData.familyPhonePrompt || isDisabled"
            />
          </template>

          <template v-else>
            <m-v-new-audio
              v-model="slotFormData.familyPhoneVoicePrompt"
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
                :disabled="!slotFormData.familyPhonePrompt || isDisabled"
                @click="onChangeNoticeType('FamilyPhone')"
              >文字提示</el-button>
            </template>

            <template v-else>
              <el-button
                type="primary"
                :disabled="!slotFormData.familyPhonePrompt || isDisabled"
                @click="onChangeNoticeType('FamilyPhone')"
              >语音提示</el-button>
            </template>
          </el-row>
        </el-row>
      </template>
    </m-form>
    <!-- <template #basicConfigs>
        <el-col :span="11">
          <el-form-item prop="startMinutes" :rules="rules.startMinutes">
            <el-input
              v-model.trim.number="formData.startMinutes"
              placeholder="请输入基础时间"
              :disabled="$route.meta.role === '3'"
            >
              <template slot="append">分钟</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item prop="startMoney" :rules="rules.startMoney">
            <el-input
              v-model.trim="formData.startMoney"
              placeholder="请输入基础费用"
              :disabled="$route.meta.role === '3'"
            >
              <template slot="append">/元</template>
            </el-input>
          </el-form-item>
        </el-col>
      </template>
      <template #fixedMoney>
        <el-col :span="11">
          <el-form-item prop="fixedMoney" :rules="rules.fixedMoney">
            <el-input
              v-model.trim="formData.fixedMoney"
              placeholder="请输入基础时长后每分钟费用"
              :disabled="$route.meta.role === '3'"
            >
              <template slot="append">/元</template>
            </el-input>
          </el-form-item>
        </el-col>
      </template>
      <template #totalCost>
        <el-col :span="11">
          <el-form-item prop="typeTotalCost">
            <el-input
              v-model="typeTotalCost"
              placeholder="请输入申请会见总费用"
              disabled
            >
              <template slot="append">/元</template>
            </el-input>
          </el-form-item>
        </el-col>
      </template>
      <template #diplomaticConsulOfficialBasicConfigs>
        <el-col :span="11">
          <el-form-item prop="diplomatistStartMinutes" :rules="rules.diplomatistStartMinutes">
            <el-input
              v-model.trim.number="formData.diplomatistStartMinutes"
              placeholder="请输入基础时间"
              :disabled="$route.meta.role === '3'"
            >
              <template slot="append">分钟</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item prop="diplomatistStartMoney" :rules="rules.diplomatistStartMoney">
            <el-input
              v-model.trim="formData.diplomatistStartMoney"
              placeholder="请输入基础费用"
              :disabled="$route.meta.role === '3'"
            >
              <template slot="append">/元</template>
            </el-input>
          </el-form-item>
        </el-col>
      </template>
      <template #diplomaticConsulOfficialFixedMoney>
        <el-col :span="11">
          <el-form-item prop="diplomatistFixedMoney" :rules="rules.diplomatistFixedMoney">
            <el-input
              v-model.trim="formData.diplomatistFixedMoney"
              placeholder="请输入基础时长后每分钟费用"
              :disabled="$route.meta.role === '3'"
            >
              <template slot="append">/元</template>
            </el-input>
          </el-form-item>
        </el-col>
      </template> -->
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import validator, { helper } from "@/utils";
import roles from "@/common/constants/roles";
import { Message } from "element-ui";

import { faceRecognitionValues } from "@/common/constants/const";
// import Moment from 'moment'
// import BigNumber from 'bignumber.js'
// import { Message } from 'element-ui'
export default {
  data() {
    let formButton = { buttons: [] },
      permission;
    if (
      this.$route.meta.permission === "visit.prison-profile.update" ||
      this.$route.meta.permission === "visit.prison.update"
    ) {
      formButton.buttons = ["back", "update"];
      permission = "edit";
    }
    if (this.$route.meta.role === "3") formButton.buttons = ["back"];
    const disabled = this.$route.meta.role === "3";
    // const waysOptions = [
    //   {
    //     value: '按次收费',
    //     label: 1
    //   },
    //   {
    //     value: '按分钟收费',
    //     label: 2
    //   }
    // ]
    // const validateMoney = (rule, value, callback) => {
    //   const { field } = rule
    //   const feeReg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
    //   if (this.formData[field] === '') callback(new Error('请输入基础费用'))
    //   else if (!feeReg.test(this.formData[field])) callback(new Error('请输入大于0的数字,且最多保留两位小数'))
    //   else callback()
    // }
    // const validateMinutes = (rule, value, callback) => {
    //   const { field } = rule
    //   const integerNumbers = Number.isInteger(this.formData[field])
    //   if (this.formData[field] === '') callback(new Error('请输入基础时间'))
    //   else if (!integerNumbers || this.formData[field] <= 0) callback(new Error('请输入正整数'))
    //   else callback()
    // }
    // const validateFixedMoney = (rule, value, callback) => {
    //   const { field } = rule
    //   const feeReg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
    //   if (this.formData[field] === '') callback(new Error('请输入基础时长后每分钟费用'))
    //   else if (!feeReg.test(this.formData[field])) callback(new Error('请输入大于0的数字,且最多保留两位小数'))
    //   else callback()
    // }
    const validateAbnormalCallduration = (rule, value, callback) => {
      const { field } = rule;
      const integerNumbers = Number.isInteger(this.slotFormData[field]);
      if (this.slotFormData[field] === "")
        callback(new Error("请输入异常可视电话时长"));
      else if (
        !integerNumbers ||
        this.slotFormData[field] < 10 ||
        this.slotFormData[field] > 600
      )
        callback(new Error("请输入10-600之间正整数"));
      else callback();
    };

    return {
      faceRecognitionValues,

      formItems: Object.assign(
        {},
        {
          formConfigs: { labelWidth: "180px" },
          // chargeType: {
          //   type: 'radio',
          //   label: '收费方式',
          //   disabled,
          //   rules: ['required'],
          //   props: {
          //     label: 'label',
          //     value: 'value'
          //   },
          //   options: waysOptions,
          //   relativeProps: ['diplomatistCharge'],
          //   configs: [
          //     // 按分钟收费
          //     {
          //       value: 2,
          //       itemConfigs: {
          //         onceMoney: 0
          //       }
          //     },
          //     // 按次付费
          //     {
          //       value: 1,
          //       itemConfigs: {
          //         basicConfigs: 0,
          //         fixedMoney: 0,
          //         totalCost: 0
          //       }
          //     }
          //   ]
          // },
          // basicConfigs: {
          //   slotName: 'basicConfigs',
          //   attrs: {
          //     label: '基础费用',
          //     required: true
          //   },
          //   func: this.onReset
          // },
          // fixedMoney: {
          //   slotName: 'fixedMoney',
          //   attrs: {
          //     label: '基础时长后每分钟费用',
          //     required: true
          //   }
          // },
          // totalCost: {
          //   slotName: 'totalCost',
          //   attrs: {
          //     label: '申请可视电话总费用'
          //   }
          // },
          // onceMoney: {
          //   type: 'input',
          //   label: '单次费用',
          //   disabled,
          //   rules: [
          //     'required',
          //     'isFee'
          //   ],
          //   append: '/元',
          //   value: 0
          // },
          branchPrison: {
            type: "switch",
            label: "是否需要分监区",
            disabled,
            rules: ["required"],
            value: 1,
            tips: "开启监狱分监区，请及时通知该监狱人员，为监狱审核人员分配监区权限",
            func: this.onBranchPrisonSwitch,
            // controlTheOther: true
          },
          // prisonAreaList: {
          //   type: 'input',
          //   label: '监区名称',
          //   disabled,
          //   placeholder: '请输入各监区名称，以逗号隔开',
          //   disableDependingProp: 'branchPrison',
          //   dependingRelation: false,
          //   changeRules: [{
          //     message: '请输入监区名称',
          //     required: true,
          //     validator: validator.required
          //   }]
          // },
          agreement: {
            type: "switch",
            label: "线上签署《可视电话告知书》",
            disabled,
            value: 0,
          },

          familyPhone: {
            type: "switch",
            label: "显示家属电话",
            disabled,
            rules: ["required"],
            value: 0,
          },
          // showPrisonerName: {
          //   type: 'switch',
          //   label: '显示罪犯姓名',
          //   disabled,
          //   value: 0
          // },
          meeting: {
            type: "switch",
            label: "可视电话模块开放",
            disabled,
            rules: ["required"],
            value: 1,
          },
          // dailyApplyLimit: {
          //   type: 'input',
          //   label: '每人日申请次数限制',
          //   disabled: this.$route.meta.role === '3',
          //   rules: [
          //     'isNumber',
          //     'numberRange0'
          //   ],
          //   append: '次/人',
          //   value: null
          // },
          rewards: {
            type: "switch",
            label: "奖励模块开放",
            disabled,
            rules: ["required"],
            value: 1,
          },

          shopping: {
            type: "switch",
            label: "电子商务模块开放",
            disabled,
            rules: ["required"],
            value: 1,
          },

          prisonTerm: {
            type: "switch",
            label: "监狱条款模块开放",
            disabled,
            rules: ["required"],
            value: 1,
          },

          faceRecognition: {
            type: "switch",
            label: "人脸识别模块开放",
            disabled,
            rules: ["required"],
            value: 1,
          },

          remittance: {
            type: "input",
            label: "汇款限制",
            disabled,
            rules: ["required", "isFee"],
            append: "/元",
            value: 0,
          },

          consumption: {
            type: "input",
            label: "消费限制",
            disabled,
            rules: ["required", "isFee"],
            append: "/元",
            value: 0,
          },
          // diplomatistCharge: {
          //   type: 'switch',
          //   label: '外交领事官员可视电话收费设置',
          //   disabled,
          //   func: this.onDiplomatistChargeChange,
          //   value: 0,
          //   relativeProps: ['chargeType'],
          //   configs: [
          //     // 打开外交领事官员可视电话收费设置
          //     {
          //       value: 1,
          //       itemConfigs: {}
          //     },
          //     // 关闭外交领事官员可视电话收费设置
          //     {
          //       value: 0,
          //       itemConfigs: {
          //         diplomaticConsulOfficialBasicConfigs: 0,
          //         diplomaticConsulOfficialFixedMoney: 0
          //       }
          //     }
          //   ]
          // },
          // diplomaticConsulOfficialBasicConfigs: {
          //   slotName: 'diplomaticConsulOfficialBasicConfigs',
          //   attrs: {
          //     label: '基础费用',
          //     required: true
          //   },
          //   func: this.onReset
          // },
          // diplomaticConsulOfficialFixedMoney: {
          //   slotName: 'diplomaticConsulOfficialFixedMoney',
          //   attrs: {
          //     label: '基础时长后每分钟费用',
          //     required: true
          //   }
          // },
          multistageExamine: {
            label: "多级审核配置",
            type: "switch",
            disabled,
            value: 0,
            setValueConfigs: [{ setValue: 0 }],
            func: this.onMultistageExamineSwitch,
          },

          userDefinedDuration: {
            label: "审核时可指定通话时长",
            type: "switch",
            disabled,
            value: 0,
          },

          abnormalCalldurationSwitch: {
            slotName: "abnormalCalldurationSwitch",
            attrs: {
              label: "异常可视电话时长配置",
              required: true
            },
          },

          useMeetingFloor: {
            label: "会见楼开关",
            type: "switch",
            disabled,
            value: 0,
            setValueConfigs: [
              { setValue: 1 }
            ],
            func: this.onMeetingRoomSwitch,
          },

          gkMessage: {
            type: "switch",
            label: "国科短信模块开放",
            disabled,
            rules: ["required"],
            value: 0,
          },

          sunJail: {
            type: "switch",
            label: "阳光监狱模块开放",
            disabled,
            rules: ["required"],
            value: 0,
          },

          thresholdConfigs: {
            slotName: "thresholdConfigs",
            customClass: "threshold__configs",
            attrs: {
              label: "人脸识别阈值设置",
            },
          },

          afrInterval: {
            label: "人脸检索间隔时间",
            type: "input",
            rules: [
              "required",
              "isPositiveIntegers",
              "numberRange10-3600"
            ],
            append: "秒",
            value: "60",
            disabled
          },

          familyPhoneScope: {
            label: "亲情电话通话范围",
            type: "checkboxgroup",
            group: [
              {
                label: "认证家属",
                value: 1,
              },

              {
                label: "亲情电话导入家属",
                value: 2,
              },
            ],
            attrs: {
              min: 1,
              disabled
            },
            value: []
          },

          accessTimes: {
            label: "可视电话免费剩余次数",
            type: "input",
            rules: ["required", "isPositiveNumber"],
            append: "次",
            value: "1",
            disabled
          },

          familyMsgScope: {
            label: "亲情短信发送范围",
            type: "checkboxgroup",
            group: [
              {
                label: "认证家属",
                value: 0,
              },

              {
                label: "亲情电话导入家属",
                value: 1,
              },
            ],
            value: [1],
            attrs: {
              disabled
            }
          },

          familyMsgCheckConf: {
            label: "亲情短信审核配置",
            type: "checkboxgroup",
            group: [
              {
                label: "家属发送需审核",
                value: 0,
              },

              {
                label: "服刑人员发送需审核",
                value: 1,
              },
            ],
            value: [0, 1],
            attrs: {
              disabled
            }
          },

          meetingEnabled: {
            type: "switch",
            label: "狱警通话开关",
            disabled,
            rules: ["required"],
            value: 0,
          },

          familyPhoneManageAuto: {
            type: "switch",
            label: "亲情电话家属自动审核开关",
            disabled,
            value: 0,
          },

          regAutoAudit: {
            type: "switch",
            label: "家属认证自动审核开关",
            disabled,
            value: 0,
          },

          loginAuthCode: {
            type: "switch",
            label: "快捷登录验证码",
            disabled,
            value: 0,
          },

          visiblePhonePeopleNumber: {
            label: "可视电话通话人数上限",
            type: "input",
            rules: [
              { validator: validator.isPositiveIntegers, ownMessage: '请输入可视电话通话人数上限' }
            ],
            append: "次",
            value: "6",
            customClass: ['el-form-item-people_number'],
            disabled
          },

          relationshipTemplate: {
            slotName: "relationshipTemplate",
            customClass: "threshold__configs",
            attrs: {
              label: "家属关系"
            },
          },

          familySendMsgType: {
            label: "家属短信发送内容",
            type: "checkboxgroup",
            group: this.$store.state.familySendMsgTypeOptions,
            value: [1],
            attrs: {
              disabled
            }
          },

          prisonerSendMsgType: {
            label: "服刑人员发送内容",
            type: "checkboxgroup",
            group: this.$store.state.prisonerSendMsgTypeOptions,
            value: [1, 2],
            attrs: {
              disabled
            }
          },

          visiblePhone: {
            slotName: 'visiblePhoneSlot',
            attrs: {
              label: '可视电话通话前提示'
            }
          },

          familyPhonePre: {
            slotName: 'familyPhonePreSlot',
            attrs: {
              label: '亲情电话通话前提示'
            }
          }
        },
        formButton
      ),

      values: {},
      relationship:[],
      permission,

      slotFormData: {
        abnormalCalldurationSwitch: 0,
        abnormalCallduration: 10,
        afrIOSSetValue: "0.2",
        afrAndroidSetValue: "0.4",
        visiblePhonePrompt: 0,
        visiblePhoneTextPrompt: '',
        familyPhonePrompt: 0,
        familyPhoneTextPrompt: '',
        visiblePhoneVoicePrompt: '',
        familyPhoneVoicePrompt: ''
      },

      slotFormRules: {
        abnormalCallduration: [
          { validator: validateAbnormalCallduration, trigger: "blur" },
        ],
      },

      isDisabled: disabled,

      // 可视电话/亲情电话通话前配置显示类型
      showPreConfig: {
        isShowViewPhoneText: false,
        isShowFamilyPhoneText: false
      },

      viewPhoneParentLoading: false,
      familyPhoneParentLoading: false
      // formData: {
      //   startMinutes: 5,
      //   startMoney: 15,
      //   fixedMoney: 2.2,
      //   // 外交领事官员基础费用分钟
      //   diplomatistStartMinutes: 5,
      //   // 外交领事官员基础费用 元
      //   diplomatistStartMoney: 12,
      //   // 外交领事官员基础时长后 每分钟 元
      //   diplomatistFixedMoney: 1.8
      // },
      // rules: {
      //   startMinutes: [
      //     { validator: validateMinutes, trigger: 'blur' }
      //   ],
      //   startMoney: [
      //     { validator: validateMoney, trigger: 'blur' }
      //   ],
      //   fixedMoney: [
      //     { validator: validateFixedMoney, trigger: 'blur' }
      //   ],
      //   diplomatistStartMinutes: [
      //     { validator: validateMinutes, trigger: 'blur' }
      //   ],
      //   diplomatistStartMoney: [
      //     { validator: validateMoney, trigger: 'blur' }
      //   ],
      //   diplomatistFixedMoney: [
      //     { validator: validateFixedMoney, trigger: 'blur' }
      //   ]
      // }
    };
  },
  computed: {
    ...mapState([
      "prison",
      "branchStatus",
      "haveMeetingFloorTerminals"
    ]),

    ...mapState("account", ["isHaveAdvancedAuditor"]),

    viewPhoneAttrs() {
      return {
        disabled: !this.slotFormData.visiblePhonePrompt || this.viewPhoneParentLoading || this.isDisabled
      }
    },

    familyPhoneAttrs() {
      return {
        disabled: !this.slotFormData.familyPhonePrompt || this.viewPhoneParentLoading || this.isDisabled
      }
    }

    // typeTotalCost() {
    //   const { normalQueue } = this.values
    //   if (normalQueue && Array.isArray(normalQueue) && normalQueue.length) {
    //     if (this.formData.startMinutes && this.formData.startMoney && this.formData.fixedMoney) {
    //       const countMinutes = normalQueue[0]['config'] ? normalQueue[0]['config'][0].split('-') : normalQueue[0].split('-')
    //       const startMinute = countMinutes[0]
    //       const endMinute = countMinutes[1]
    //       const minutes = Moment(endMinute, 'HH:mm').diff(Moment(startMinute, 'HH:mm'), 'minutes', true)
    //       const cost = new BigNumber(this.formData.startMoney).plus(new BigNumber(minutes - this.formData.startMinutes).times(this.formData.fixedMoney)).toNumber()
    //       return cost > 48 ? 48 : cost
    //     } else return 0
    //   } else return 48
    // }
  },

  async activated() {
    if (this.permission === "edit") await this.onInitPrisonConfigDetails();
  },

  mounted() {
    if (this.$route.meta.role === "3") this.formItems.branchPrison.tips = "";
    if (this.permission === "edit") return;
    if (
      parseInt(sessionStorage.getItem("step")) !== 1 ||
      !sessionStorage.getItem("base")
    ) {
      this.$router.push({ query: Object.assign({}, { tag: "prisonBase" }) });
    }
  },

  methods: {
    ...mapActions([
      "getPrisonDetail",
      "updatePrison",
      "getMeetingFloorTerminals",
    ]),

    ...mapActions("account", ["judgeAssignUsers"]),

    onSubmit(e) {
      // const { chargeType, diplomatistCharge } = e
      if (this.permission === "edit") {
        // if(e.prisonAreaList && e.prisonAreaList.length) {
        //   // 这里就是分监区的情况
        //   const prisonAreas = e.prisonAreaList.replace(/，/g, ',').split(',')
        //   let uniquePrisonAreas = [...new Set(prisonAreas)]

        //   if (prisonAreas.length !== uniquePrisonAreas.length) {
        //     this.$message.error('监区名不能重复');
        //     return
        //   }

        //   e.prisonAreaList = uniquePrisonAreas.map(val => val && ({name: helper.trimString(val)}))
        // }
        // else e.prisonAreaList = []

        if (
          (!this.slotFormData.visiblePhonePrompt && !this.slotFormData.familyPhonePrompt) ||
          (this.slotFormData.visiblePhonePrompt && (this.slotFormData.visiblePhoneTextPrompt || this.slotFormData.visiblePhoneVoicePrompt)) ||
          (this.slotFormData.familyPhonePrompt && (this.slotFormData.familyPhoneTextPrompt || this.slotFormData.familyPhoneVoicePrompt))
        ) {
          const { familyPhoneScope } = e;

          if (_.isEqual([1], familyPhoneScope)) e.familyPhoneScope = 1;
          if (_.isEqual([2], familyPhoneScope)) e.familyPhoneScope = 0;
          if (!_.difference([1, 2], familyPhoneScope).length)
            e.familyPhoneScope = 2;

          let params = Object.assign({}, e, {
            changed: 0,
            weekendChanged: 0,
            specialChanged: 0
          });

          const {
            abnormalCalldurationSwitch,
            abnormalCallduration,
            afrIOSSetValue,
            afrAndroidSetValue,
            visiblePhonePrompt,
            familyPhonePrompt,
            visiblePhoneVoicePrompt,
            visiblePhoneTextPrompt,
            familyPhoneVoicePrompt,
            familyPhoneTextPrompt
          } = this.slotFormData, { isShowViewPhoneText, isShowFamilyPhoneText } = this.showPreConfig;

          params = {
            ...params,
            abnormalCalldurationSwitch,
            afrAndroidSetValue,
            afrIOSSetValue,
            visiblePhonePrompt,
            familyPhonePrompt
          };

          if (abnormalCalldurationSwitch) {
            params = {
              ...params,
              abnormalCallduration
            };
          }

          if (visiblePhonePrompt || familyPhonePrompt) {
            let callPrompt = {}

            if (visiblePhonePrompt) {
              if (isShowViewPhoneText) {
                callPrompt = Object.assign({}, callPrompt, {
                  visiblePhoneTextPrompt: visiblePhoneTextPrompt.replace(/\s/g, '')
                })

                delete callPrompt['visiblePhoneVoicePrompt']
              } else {
                callPrompt = Object.assign({}, callPrompt, {
                  visiblePhoneVoicePrompt
                })

                delete callPrompt['visiblePhoneTextPrompt']
              }
            } else {
              delete callPrompt['visiblePhoneVoicePrompt']
              delete callPrompt['visiblePhoneTextPrompt']
            }

            if (familyPhonePrompt) {
              if (isShowFamilyPhoneText) {
                callPrompt = Object.assign({}, callPrompt, {
                  familyPhoneTextPrompt: familyPhoneTextPrompt.replace(/\s/g, '')
                })

                delete callPrompt['familyPhoneVoicePrompt']
              } else {
                callPrompt = Object.assign({}, callPrompt, {
                  familyPhoneVoicePrompt
                })

                delete callPrompt['familyPhoneTextPrompt']
              }
            } else {
              delete callPrompt['familyPhoneVoicePrompt']
              delete callPrompt['familyPhoneTextPrompt']
            }

            params = Object.assign({}, params, { callPrompt })
          } else delete params['callPrompt']

          this.updatePrison(params).then(async res => {
            if (!res) return;

            await this.onInitPrisonConfigDetails();

            this.$forceUpdate();
            // if (this.$route.meta.role !== '3') this.$router.push('/prison/list')
            // else this.$router.push('/jails/detail')
          });
        } else {
          this.$confirm('请上传通话前的提示语音或文字！', '提示', {
            type: 'warning',
            confirmButtonText: '确定',
            closeOnClickModal: false,
            showCancelButton: false
          })
        }
        // if (chargeType === 2) {
        //   const {
        //     startMinutes,
        //     startMoney,
        //     fixedMoney
        //   } = this.formData
        //   params = {
        //     ...params,
        //     startMinutes,
        //     startMoney,
        //     fixedMoney,
        //     cost: this.typeTotalCost
        //   }
        // }
        // if (chargeType === 1) {
        //   const { onceMoney } = e
        //   params = {
        //     ...params,
        //     cost: onceMoney
        //   }
        // }
        // if (diplomatistCharge === 1) {
        //   const {
        //     diplomatistStartMinutes,
        //     diplomatistStartMoney,
        //     diplomatistFixedMoney
        //   } = this.formData
        //   params = {
        //     ...params,
        //     diplomatistStartMinutes,
        //     diplomatistStartMoney,
        //     diplomatistFixedMoney,
        //   }
        // }
        // if (params.hasOwnProperty('totalCost')) delete params.totalCost
        // if (params.hasOwnProperty('diplomaticConsulOfficialFixedMoney')) delete params.diplomaticConsulOfficialFixedMoney
      }
    },

    onBack() {
      if (this.$store.getters.role === roles.SUPER_ADMIN)
        this.$router.push({ path: "/prison/list" });
      else this.$router.push({ path: "/jails/detail" });
    },
    // onReset(e, prop) {
    //   let {
    //     startMoney = 15,
    //     startMinutes = 5,
    //     fixedMoney = 2.2,
    //     diplomatistStartMinutes = 5,
    //     diplomatistStartMoney = 12,
    //     diplomatistFixedMoney = 1.8 } = this.prison
    //   startMoney = startMoney ? startMoney : 15
    //   startMinutes = startMinutes ? startMinutes : 5
    //   fixedMoney = fixedMoney ? fixedMoney : 2.2
    //   diplomatistStartMinutes = diplomatistStartMinutes ? diplomatistStartMinutes : 5
    //   diplomatistStartMoney = diplomatistStartMoney ? diplomatistStartMoney : 12
    //   diplomatistFixedMoney = diplomatistFixedMoney ? diplomatistFixedMoney : 1.8
    //   if (prop === 'chargeType') {
    //     this.$set(this.formData, 'startMoney', startMoney)
    //     this.$set(this.formData, 'startMinutes', startMinutes)
    //     this.$set(this.formData, 'fixedMoney', fixedMoney)
    //   }
    //   if (prop === 'diplomatistCharge') {
    //     this.$set(this.formData, 'diplomatistStartMinutes', diplomatistStartMinutes)
    //     this.$set(this.formData, 'diplomatistStartMoney', diplomatistStartMoney)
    //     this.$set(this.formData, 'diplomatistFixedMoney', diplomatistFixedMoney)
    //   }
    // },
    // onDiplomatistChargeChange(e, prop, item) {
    //   this.$refs['prison-config_form'].radioChangeEvent(e, prop, item)
    // },

    // 是否分监区
    onBranchPrisonSwitch(value, prop, item) {
      const branchPrisonItemObject = {
        [0]: {
          setValueConfigs: [
            {
              props: "branchPrison",
              setValue: 1,
            },
          ],
        },

        [1]: {
          setValueConfigs: [
            {
              props: "branchPrison",
              setValue: 0,
            },
          ],
        },
      };

      const setValueConfigs = branchPrisonItemObject[value]["setValueConfigs"];

      this.$set(
        this.formItems["branchPrison"],
        "setValueConfigs",
        setValueConfigs
      );

      this.$confirm(
        `调整监区结构后，原来所有的可视电话预约将全部取消，确认调整吗？调整监区结构后，为了避免预约问题，请及时调整该监狱的终端管理和会见楼配置。`,
        {
          closeOnClickModal: false,
          closeOnPressEscape: false,
          callback: (action) => {
            if (action === "cancel")
              this.$refs["prison-config_form"].setFieldValue(
                value,
                prop,
                this.formItems["branchPrison"]
              );
          },
        }
      );
    },

    // 多级审核配置
    async onMultistageExamineSwitch(value, prop, item) {
      // autoAuthorizeMeeting 是否开启自动审批
      // zipcode: 监狱编号 对应给公共服务的租户编号
      const { autoAuthorizeMeeting, zipcode } = this.prison;

      const options = {
        closeOnClickModal: false,
        closeOnPressEscape: false,
        customClass: "multistage_examine__message_box",
      };

      const have_automatic_audit = {
        message:
          "监狱配置已开启自动审核，当开启多级审核后，自动审核将失效，确认开启多级审核吗？",
        options: {
          ...options,

          callback: (action) => {
            if (action === "cancel")
              this.$refs["prison-config_form"].setFieldValue(value, prop, item);
          },
        },
      };

      const have_no_advanced_auditor = {
        message: "监狱没有高级审核人员账号，请先增加高级审核人员！",

        options: {
          ...options,
          closeOnClickModal: true,
          showCancelButton: false,
          callback: (action) => {
            this.$refs["prison-config_form"].setFieldValue(value, prop, item);
          },
        },
      };

      if (value === 1) {
        await this.judgeAssignUsers({
          params: {
            tenantCode: zipcode,
          },

          configs: {
            // 这个地方要和公共服务的角色名保存一致
            userRoles: ["高级审核人员"],
            mutationName: "setIsHaveAdvancedAuditor",
          },
        });

        if (!this.isHaveAdvancedAuditor) {
          this.$confirm(
            have_no_advanced_auditor["message"],
            have_no_advanced_auditor["options"]
          );
        } else {
          if (autoAuthorizeMeeting)
            this.$confirm(
              have_automatic_audit["message"],
              have_automatic_audit["options"]
            );
        }
      }
    },

    async onMeetingRoomSwitch(value, prop, item) {
      // 开启会见楼配置并且会见楼配置了终端的情况
      if (!value) {
        const jailId = this.$route.params.id;

        await this.getMeetingFloorTerminals(jailId);

        Message.closeAll();
        if (this.haveMeetingFloorTerminals) {
          this.$confirm(
            "该监狱配置了会见楼配置，请先移除会见楼的终端，再关闭会见楼开关！",
            {
              showCancelButton: false,
              closeOnClickModal: false,
              closeOnPressEscape: false,
              callback: (action) => {
                this.$refs["prison-config_form"].setFieldValue(
                  value,
                  prop,
                  item
                );
              },
            }
          );
        }
      }
    },

    async onInitPrisonConfigDetails() {
      const res = await this.getPrisonDetail({ id: this.$route.params.id });

      if (this.prison.relationshipTemplate) this.relationship = this.prison.relationshipTemplate.split(",")
      if (!res) return;
  
      const {
        abnormalCallduration,
        abnormalCalldurationSwitch,
        afrIOSSetValue,
        afrAndroidSetValue,
        visiblePhonePrompt,
        familyPhonePrompt,
        visiblePhoneVoicePrompt,
        visiblePhoneTextPrompt,
        familyPhoneVoicePrompt,
        familyPhoneTextPrompt,
        callPrompt
      } = _.cloneDeep(this.prison);

      this.values = _.cloneDeep(this.prison);

      if ((visiblePhonePrompt || familyPhonePrompt) && callPrompt && Object.prototype.toString.call(callPrompt) === '[object Object]') {
        const {
          familyPhoneTextPrompt,
          familyPhoneVoicePrompt,
          visiblePhoneTextPrompt,
          visiblePhoneVoicePrompt
        } = callPrompt

        this.slotFormData = Object.assign({}, this.slotFormData, {
          visiblePhonePrompt,
          familyPhonePrompt,
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

      this.$set(this.slotFormData, "abnormalCalldurationSwitch", abnormalCalldurationSwitch);
      this.$set(this.slotFormData, "abnormalCallduration", abnormalCallduration);
      this.$set(this.slotFormData, "afrIOSSetValue", +afrIOSSetValue);
      this.$set(this.slotFormData, "afrAndroidSetValue", +afrAndroidSetValue);
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
    }
  },
};
</script>

<style lang="scss" scoped>
.el-form {
  .el-form-item {
    /deep/ &-people_number {
      .el-input {
        width: 260px;
      }
    }
  }

  .el-row_preConfig {
    display: flex;
    align-items: flex-start;
    &-contents {
      width: 56%;
    }

    &-buttons {
      margin-left: 10px;
    }
  }
}
</style>

<template>
  <div>
    <m-form
      :items="formItems"
      @submit="onSubmit"
      @back="onBack"
      :values="values"
      ref="prison-config_form"
    />
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
import { mapActions, mapState } from 'vuex'
import validator, { helper } from '@/utils'
import roles from '@/common/constants/roles'
import cloneDeep from 'lodash/cloneDeep'
// import Moment from 'moment'
// import BigNumber from 'bignumber.js'
// import { Message } from 'element-ui'
export default {
  data() {
    let formButton = { buttons: [] }, permission
    if (this.$route.meta.permission === 'visit.prison-profile.update' || this.$route.meta.permission === 'visit.prison.update') {
      formButton.buttons = [
        'back',
        'update'
      ]
      permission = 'edit'
    }
    if (this.$route.meta.role === '3') formButton.buttons = ['back']
    const disabled = this.$route.meta.role === '3'
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
    return {
      formItems: Object.assign({}, {
        formConfigs: { labelWidth: '180px' },
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
          type: 'switch',
          label: '是否需要分监区',
          disabled,
          rules: ['required'],
          value: 1,
          tips: '开启监狱分监区，请及时通知该监狱人员，为监狱审核人员分配监区权限',
          func: this.onBranchPrisonSwitch
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
          type: 'switch',
          label: '线上签署《可视电话告知书》',
          disabled,
          value: 0
        },
        familyPhone: {
          type: 'switch',
          label: '显示家属电话',
          disabled,
          rules: ['required'],
          value: 0
        },
        // showPrisonerName: {
        //   type: 'switch',
        //   label: '显示罪犯姓名',
        //   disabled,
        //   value: 0
        // },
        meeting: {
          type: 'switch',
          label: '可视电话模块开放',
          disabled,
          rules: ['required'],
          value: 1
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
          type: 'switch',
          label: '奖励模块开放',
          disabled,
          rules: ['required'],
          value: 1
        },
        shopping: {
          type: 'switch',
          label: '电子商务模块开放',
          disabled,
          rules: ['required'],
          value: 1
        },
        prisonTerm: {
          type: 'switch',
          label: '监狱条款模块开放',
          disabled,
          rules: ['required'],
          value: 1
        },
        faceRecognition: {
          type: 'switch',
          label: '人脸识别模块开放',
          disabled,
          rules: ['required'],
          value: 1
        },
        remittance: {
          type: 'input',
          label: '汇款限制',
          disabled,
          rules: [
            'required',
            'isFee'
          ],
          append: '/元',
          value: 0
        },
        consumption: {
          type: 'input',
          label: '消费限制',
          disabled,
          rules: [
            'required',
            'isFee'
          ],
          append: '/元',
          value: 0
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
          label: '多级审核配置',
          type: 'switch',
          disabled,
          value: 0,
          setValueConfigs: [
            {
              props: 'multistageExamine',
              setValue: 0
            }
          ],

          func: this.onMultistageExamineSwitch
        },

        userDefinedDuration: {
          label: '审核时可指定通话时长',
          type: 'switch',
          disabled,
          value: 0
        }
      }, formButton),
      values: {},
      permission,
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
    }
  },
  computed: {
    ...mapState([
      'prison',
      'branchStatus']),

    ...mapState('account', ['isHaveAdvancedAuditor']),

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
  activated() {
    if (this.permission === 'edit') {
      this.getPrisonDetail({ id: this.$route.params.id }).then(res => {
        if (!res) return
        this.values = cloneDeep(this.prison)
        // if(this.values.prisonAreaList && this.values.prisonAreaList.length) {
        //   const prisonAreaList = (this.values.prisonAreaList.map(val => val.name)).join(',')
        //   this.$set(this.values, 'prisonAreaList', prisonAreaList)
        // }
        // if (this.$store.getters.role !== roles.INFORMATION_ADMIN) {
        //   if (!this.branchStatus) {
        //     this.$set(this.formItems['branchPrison'], 'disabled', true)
        //     this.$set(this.formItems['prisonAreaList'], 'disabled', true)
        //   }
        // }
        // delete this.formItems.dissMissConfigs
        // // 判断是什么收费情况 来初始化
        // if (this.values.chargeType === 2) {
        //   const { startMinutes = 5, startMoney = 15, fixedMoney = 2.2 } = this.values
        //   this.$set(this.formItems, 'dissMissConfigs', ['onceMoney'])
        //   this.$set(this.formItems['chargeType']['configs'][1], 'itemConfigs', { basicConfigs: 0, fixedMoney: 0, totalCost: 0 })
        //   this.$set(this.formData, 'startMinutes', startMinutes)
        //   this.$set(this.formData, 'startMoney', startMoney)
        //   this.$set(this.formData, 'fixedMoney', fixedMoney)
        // }
        // if (this.values.chargeType === 1) {
        //   const { onceMoney = 0 } = this.values
        //   this.$set(this.formItems, 'dissMissConfigs', ['basicConfigs', 'fixedMoney', 'totalCost'])
        //   this.$set(this.formItems['chargeType']['configs'][0], 'itemConfigs', { onceMoney })
        // }
        // if (this.values.diplomatistCharge === 1) {
        //   const { diplomatistStartMinutes = 5, diplomatistStartMoney = 12, diplomatistFixedMoney = 1.8 } = this.values
        //   this.$set(this.formItems['diplomatistCharge']['configs'][1], 'itemConfigs', { diplomaticConsulOfficialBasicConfigs: 0, diplomaticConsulOfficialFixedMoney: 0 })
        //   this.$set(this.formData, 'diplomatistStartMinutes', diplomatistStartMinutes)
        //   this.$set(this.formData, 'diplomatistStartMoney', diplomatistStartMoney)
        //   this.$set(this.formData, 'diplomatistFixedMoney', diplomatistFixedMoney)
        // }
        // if (!this.values.diplomatistCharge) {
        //   this.formItems['dissMissConfigs'] = [
        //     ...this.formItems['dissMissConfigs'],
        //     'diplomaticConsulOfficialBasicConfigs',
        //     'diplomaticConsulOfficialFixedMoney'
        //   ]
        //   this.$set(this.formItems['diplomatistCharge']['configs'][0], 'itemConfigs', {})
        // }
        // if (this.$store.getters.role !== roles.INFORMATION_ADMIN ) {
        //   (async() => {
        //     const res = await this.getBranchStatus(this.prison)
        //     Message.closeAll()
        //     Message({
        //       showClose: true,
        //       message: '查询监狱基本信息成功',
        //       duration: 2000,
        //       type: 'success'
        //     })
        //     if (!res) {
        //       this.$set(this.formItems['branchPrison'], 'disabled', true)
        //       this.$set(this.formItems['prisonAreaList'], 'disabled', true)
        //     }
        //   })()
        // }
      })
    }
  },
  mounted() {
    if (this.$route.meta.role === '3') this.formItems.branchPrison.tips = ''
    if (this.permission === 'edit') return
    if (parseInt(sessionStorage.getItem('step')) !== 1 || !sessionStorage.getItem('base')) {
      this.$router.push({ query: Object.assign({}, { tag: 'prisonBase' }) })
    }
  },
  methods: {
    ...mapActions([
      'getPrisonDetail',
      'updatePrison']),

    ...mapActions('account', ['judgeAssignUsers']),

    onSubmit(e) {
      // const { chargeType, diplomatistCharge } = e
      if (this.permission === 'edit') {
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

        let params = Object.assign({}, e, { changed: 0, weekendChanged: 0, specialChanged: 0 })

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
        this.updatePrison(params).then(res => {
          if (!res) return
          this.getPrisonDetail({ id: this.$route.params.id })
          // if (this.$route.meta.role !== '3') this.$router.push('/prison/list')
          // else this.$router.push('/jails/detail')
        })
      }
    },
    onBack() {
      if (this.$store.getters.role === roles.SUPER_ADMIN) this.$router.push({ path: '/prison/list' })
      else this.$router.push({ path: '/jails/detail' })
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
              props: 'branchPrison',
              setValue: 1
            }
          ],
        },

        [1]: {
          setValueConfigs: [
            {
              props: 'branchPrison',
              setValue: 0
            }
          ]
        }
      }

      const setValueConfigs = branchPrisonItemObject[value]['setValueConfigs']

      this.$set(this.formItems['branchPrison'], 'setValueConfigs', setValueConfigs)

      this.$confirm('调整监区结构后，原来所有的可视电话预约将全部取消，确认调整吗？', {
        closeOnClickModal: false,

        closeOnPressEscape: false,

        callback: (action) => {
            if (action === 'cancel') this.$refs['prison-config_form'].setFieldValue(value, prop, this.formItems['branchPrison'])
          }
      })
    },

    // 多级审核配置
    async onMultistageExamineSwitch(value, prop, item) {
      // autoAuthorizeMeeting 是否开启自动审批
      // zipcode: 监狱编号 对应给公共服务的租户编号
      const { autoAuthorizeMeeting, zipcode } = this.prison

      const options = {
        closeOnClickModal: false,

        closeOnPressEscape: false,

        customClass: 'multistage_examine__message_box'
      }

      const have_automatic_audit = {
        message: '监狱配置已开启自动审核，当开启多级审核后，自动审核将失效，确认开启多级审核吗？',

        options: {
          ...options,

          callback: (action) => {
            if (action === 'cancel') this.$refs['prison-config_form'].setFieldValue(value, prop, item)
          }
        }
      }

      const have_no_advanced_auditor = {
        message: '监狱没有高级审核人员账号，请先增加高级审核人员！',

        options: {
          ...options,

          closeOnClickModal: true,

          showCancelButton: false,

          callback: (action) => {
            this.$refs['prison-config_form'].setFieldValue(value, prop, item)
          }
        }
      }

      if (value === 1) {
        await this.judgeAssignUsers({
          params: {
            tenantCode: zipcode
          },

          configs: {
            // 这个地方要和公共服务的角色名保存一致
            userRoles: ['高级审核人员'],

            mutationName: 'setIsHaveAdvancedAuditor'
          }
        })

        if (!this.isHaveAdvancedAuditor) {
          this.$confirm(have_no_advanced_auditor['message'], have_no_advanced_auditor['options'])
        }
        else {
          if (autoAuthorizeMeeting) this.$confirm(have_automatic_audit['message'], have_automatic_audit['options'])
        }
      }
    }
  }
}
</script>

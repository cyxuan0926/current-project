<template>
  <div>
    <m-form
      :items="formItems"
      @submit="onSubmit"
      @back="onBack"
      :values="values"
    >
      <template #jichufeiyong>
        <el-col :span="11">
          <el-form-item prop="time" >
            <el-input
              v-model.number="test.time"
              placeholder="请输入基础时间"
              :disabled="$route.meta.role === '3'"
            >
              <template slot="append">分钟</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11" :offset="2">
          <el-form-item prop="money" :rules="rules.money">
            <el-input
              v-model="test.money"
              placeholder="请输入基础费用"
              :disabled="$route.meta.role === '3'"
            >
              <template slot="append">/元</template>
            </el-input>
          </el-form-item>
        </el-col>
      </template>
    </m-form>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import validator, { helper } from '@/utils'
import roles from '@/common/constants/roles'
import cloneDeep from 'lodash/cloneDeep'
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
    const waysOptions = [
      {
        value: '按次收费',
        label: 1
      },
      {
        value: '按分钟收费',
        label: 0
      }
    ]
    const validateMoney = (rule, value, callback) => {
      const feeReg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
      if (this.test.money === '') callback(new Error('请输入基础费用'))
      else if (!feeReg.test(this.test.money)) callback(new Error('请输入大于0的数字,且最多保留两位小数'))
      else callback()
    }
    return {
      formItems: Object.assign({}, {
        formConfigs: { labelWidth: '180px' },
        ways: {
          type: 'radio',
          label: '收费方式',
          disabled,
          rules: ['required'],
          props: {
            label: 'label',
            value: 'value'
          },
          options: waysOptions,
          configs: [
            // 按分钟收费
            {
              value: 0,
              itemConfigs: {
                cost: 0
              }
            },
            // 按次付费
            {
              value: 1,
              itemConfigs: {
                jichufeiyong: 0,
                basicCost: 2.2
              }
            }
          ]
        },
        jichufeiyong: {
          slotName: 'jichufeiyong',
          attrs: {
            label: '基础费用',
            required: true
          },
          func: this.onReset
        },
        basicCost: {
          type: 'input',
          label: '基础时长后每分钟费用',
          customClass: 'el-form__notFull',
          disabled,
          rules: [
            'required',
            'isFee'
          ],
          append: '/元',
          value: 2.2
        },
        cost: {
          type: 'input',
          label: '单次会见费用',
          disabled,
          rules: [
            'required',
            'isFee'
          ],
          append: '/元',
          value: 0
        },
        branchPrison: {
          type: 'switch',
          label: '是否需要分监区',
          disabled,
          rules: ['required'],
          value: 1,
          tips: '开启监狱分监区，请及时通知该监狱人员，为监狱审核人员分配监区权限',
          controlTheOther: true
        },
        prisonAreaList: {
          type: 'input',
          label: '监区名称',
          disabled,
          placeholder: '请输入各监区名称，以逗号隔开',
          disableDependingProp: 'branchPrison',
          dependingRelation: false,
          changeRules: [{
            message: '请输入监区名称',
            required: true,
            validator: validator.required
          }]},
        agreement: {
          type: 'switch',
          label: '线上签署《远程会见告知书》',
          disabled,
          value: 0
        },
        meeting: {
          type: 'switch',
          label: '会见模块开放',
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
        }
      }, formButton),
      values: {},
      permission,
      test: {
        time: 5,
        money: 15
      },
      rules: {
        money: [
          { validator: validateMoney, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState([
      'prison',
      'branchStatus'])
  },
  activated() {
    if (this.permission === 'edit') {
      this.getPrisonDetail({ id: this.$route.params.id }).then(res => {
        if (!res) return
        this.values = { ...cloneDeep(this.prison), ways: 0, basicCost: 2.2 }
        if(this.values.prisonAreaList && this.values.prisonAreaList.length) {
          const prisonAreaList = (this.values.prisonAreaList.map(val => val.name)).join(',')
          this.$set(this.values, 'prisonAreaList', prisonAreaList)
        }
        if (this.$store.getters.role !== roles.INFORMATION_ADMIN) {
          if (!this.branchStatus) {
            this.$set(this.formItems['branchPrison'], 'disabled', true)
            this.$set(this.formItems['prisonAreaList'], 'disabled', true)
          }
        }
        delete this.formItems.dissMissConfigs
        // // 判断是什么收费情况 来初始化
        if (this.values.ways === 0) {
          this.$set(this.formItems, 'dissMissConfigs', ['cost'])
        }
        if (this.values.ways === 1) {
          this.$set(this.formItems, 'dissMissConfigs', ['jichufeiyong', 'basicCost'])
        }
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
    onSubmit(e) {
      console.log(e)
      if (this.permission === 'edit') {
        if(e.prisonAreaList && e.prisonAreaList.length) {
          // 这里就是分监区的情况
          const prisonAreas = e.prisonAreaList.replace(/，/g, ',').split(',')
          let uniquePrisonAreas = [...new Set(prisonAreas)]

          if (prisonAreas.length !== uniquePrisonAreas.length) {
            this.$message.error('监区名不能重复');
            return
          }

          e.prisonAreaList = uniquePrisonAreas.map(val => val && ({name: helper.trimString(val)}))
        }
        else e.prisonAreaList = []

        const params = Object.assign({}, e, { changed: 0, weekendChanged: 0, specialChanged: 0 })
        // this.updatePrison(params).then(res => {
        //   if (!res) return
        //   this.getPrisonDetail({ id: this.$route.params.id })
        //   // if (this.$route.meta.role !== '3') this.$router.push('/prison/list')
        //   // else this.$router.push('/jails/detail')
        // })
      }
    },
    onBack() {
      if (this.$store.getters.role === roles.SUPER_ADMIN) this.$router.push({ path: '/prison/list' })
      else this.$router.push({ path: '/jails/detail' })
    },
    onReset() {
      this.$set(this.test, 'money', 15)
      this.$set(this.test, 'time', 5)
    }
  }
}
</script>

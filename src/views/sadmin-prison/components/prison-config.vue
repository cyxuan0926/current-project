<template>
  <div>
    <m-form :items="formItems" @submit="onSubmit" :values="values"></m-form>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    let formButton = { buttons: ['prev', 'next'] }, permission = 'add'
    if (this.$route.meta.permission === 'edit') {
      formButton.buttons = ['update']
      permission = 'edit'
    }
    if (this.$route.meta.role === '3') {
      delete formButton.buttons
    }
    return {
      formItems: Object.assign({}, {
        formConfigs: { labelWidth: '150px' },
        cost: { type: 'input', label: '单次会见费用', disabled: this.$route.meta.role === '3', rules: ['required', 'isFee'], append: '/元', value: 0 },
        branchPrison: { type: 'switch', label: '是否需要分监区', disabled: this.$route.meta.role === '3', rules: ['required'], value: 1, tips: '开启监狱分监区，请及时通知该监狱人员，为监狱审核人员分配监区权限' },
        meeting: { type: 'switch', label: '会见模块开放', disabled: this.$route.meta.role === '3', rules: ['required'], value: 1 },
        dailyApplyLimit: { type: 'input', label: '每人日申请次数限制', disabled: this.$route.meta.role === '3', rules: ['isNumber', 'numberRange0'], append: '次/人', value: null },
        rewards: { type: 'switch', label: '奖励模块开放', disabled: this.$route.meta.role === '3', rules: ['required'], value: 1 },
        shopping: { type: 'switch', label: '电子商务模块开放', disabled: this.$route.meta.role === '3', rules: ['required'], value: 1 },
        prisonTerm: { type: 'switch', label: '监狱条款模块开放', disabled: this.$route.meta.role === '3', rules: ['required'], value: 1 },
        faceRecognition: { type: 'switch', label: '人脸识别模块开放', disabled: this.$route.meta.role === '3', rules: ['required'], value: 1 },
        remittance: { type: 'input', label: '汇款限制', disabled: this.$route.meta.role === '3', rules: ['required', 'isFee'], append: '/元', value: 800 },
        consumption: { type: 'input', label: '消费限制', disabled: this.$route.meta.role === '3', rules: ['required', 'isFee'], append: '/元', value: 800 }
      }, formButton),
      values: {},
      permission
    }
  },
  computed: {
    ...mapState(['prison'])
  },
  activated() {
    if (this.permission === 'edit') {
      this.getPrisonDetail({ id: this.$route.params.id }).then(res => {
        if (!res) return
        this.values = this.prison
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
    ...mapActions(['getPrisonDetail', 'updatePrison']),
    onSubmit(e) {
      if (this.permission !== 'edit') {
        sessionStorage.setItem('config', JSON.stringify(e))
        sessionStorage.setItem('step', 2)
        this.$router.push({ query: Object.assign({}, { tag: 'prisonRemote' }) })
      }
      else if (this.permission === 'edit') {
        let params = Object.assign({}, e, { changed: 0, weekendChanged: 0, specialChanged: 0 })
        this.updatePrison(params).then(res => {
          if (!res) return
          // if (this.$route.meta.role !== '3') this.$router.push('/prison/list')
          // else this.$router.push('/jails/detail')
        })
      }
    }
  }
}
</script>

<style lang="css">
</style>

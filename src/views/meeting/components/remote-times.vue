<template>
  <div class="yt-form">
    <m-form
      :items="formItems"
      @submit="onSubmit"
      :values="values"/>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    let formButton = {}
    formButton.buttons = ['update']
    return {
      formItems: Object.assign({}, {
        formConfigs: { labelWidth: '150px' },
        dailyApplyLimit: { type: 'input', label: '每人日申请次数限制', rules: ['isNumber', 'numberRange0'], append: '次/人', value: null }
      }, formButton),
      values: {}
    }
  },
  computed: {
    ...mapState(['prison'])
  },
  activated() {
    this.getPrisonDetail({ id: this.$route.params.id }).then(res => {
      if (!res) return
      this.values = this.prison
    })
  },
  mounted() {
  },
  methods: {
    ...mapActions(['getPrisonDetail', 'updatePrison']),
    onSubmit(e) {
      let params = Object.assign({}, e, { changed: 0, weekendChanged: 0, specialChanged: 0 })
      this.updatePrison(params).then(res => {
        if (!res) return
        // if (this.$route.meta.role !== '3') this.$router.push('/prison/list')
        // else this.$router.push('/jails/detail')
      })
    }
  }
}
</script>

<style lang="css">
</style>

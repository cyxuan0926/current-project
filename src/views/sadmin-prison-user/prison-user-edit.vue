<template>
  <el-row class="page-edit">
    <el-col
      :span="10"
      :offset="7">
      <el-form
        :model="prisonUser"
        :rules="rules"
        ref="prisonUser"
        label-position="right"
        label-width="100px">
        <el-form-item
          v-if="routeRole !== '4'"
          label="监狱名称"
          prop="jailId">
          <el-select
            v-model="prisonUser.jailId"
            placeholder="请选择监狱"
            filterable
            :loading="gettingJails"
            @change="onPrisonChange">
            <el-option
              v-for="item in prisonAllWithBranchPrison"
              :key="item.id"
              :label="item.title"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="hasPrisonArea"
          label="监区"
          prop="prisonConfigIds">
          <el-select
            v-model="prisonUser.prisonConfigIds"
            filterable
            clearable
            multiple
            :loading="gettingPrisonArea"
            placeholder="请选择监区">
            <el-option
              v-for="prisonArea in jailPrisonAreas"
              :key="prisonArea.id"
              :label="prisonArea.name"
              :value="prisonArea.id"/>
          </el-select>
        </el-form-item>
        <el-form-item
          label="狱警号"
          prop="policeNumber">
          <el-input
            v-model="prisonUser.policeNumber"
            placeholder="请填写狱警号"/>
        </el-form-item>
        <el-form-item
          label="真实姓名"
          prop="realName">
          <el-input
            v-model="prisonUser.realName"
            placeholder="请填写真实姓名"/>
        </el-form-item>
        <el-form-item
          label="角色"
          prop="role">
          <el-select
            v-model="prisonUser.role"
            placeholder="请选择角色"
            clearable>
            <el-option
              v-for="item in $store.state.role"
              v-if="item.value !== 0 && item.value != routeRole"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item
          label="用户名"
          prop="username">
          <el-input
            v-model="prisonUser.username"
            placeholder="请填写用户名"/>
        </el-form-item>
      </el-form>
      <el-button
        class="submit"
        type="primary"
        @click="onSubmit"
        size="small">更新</el-button>
    </el-col>
  </el-row>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      rules: {
        jailId: [{ required: true, message: '请选择监狱名称' }],
        policeNumber: [{ required: true, message: '请填写狱警号' }],
        realName: [{ required: true, message: '请填写真实姓名' }],
        username: [{ required: true, message: '请填写用户名' }],
        role: [{ required: true, message: '请选择角色' }]
      },
      gettingJails: true,
      gettingPrisonArea: true,
      hasPrisonArea: false,
      routeRole: this.$route.matched[this.$route.matched.length - 1].props.default.role
    }
  },
  computed: {
    ...mapState(['prisonAllWithBranchPrison', 'jailPrisonAreas', 'prisonUser'])
  },
  mounted() {
    if (this.routeRole === '0') {
      this.getPrisonAllWithBranchPrison().then(res => {
        this.gettingJails = false
        this.getPrisonUserDetail(this.$route.params.id).then(res => {
          if (!res) return
          // this.handleConfigs()
          this.onPrisonChange(this.prisonUser.jailId, true)
        })
      })
    }
    else if (this.routeRole === '4') {
      this.getJailPrisonAreas().then(res => {
        if (!res) return
        this.getPrisonUserDetail(this.$route.params.id).then(res => {
          if (!res) return
          // this.handleConfigs()
          if (this.jailPrisonAreas.length !== 0) {
            this.hasPrisonArea = true
          }
          this.gettingPrisonArea = false
        })
      })
    }
  },
  methods: {
    ...mapActions(['updatePrisonUser', 'getPrisonAllWithBranchPrison', 'getJailPrisonAreas', 'getPrisonUserDetail']),
    onSubmit() {
      this.$refs.prisonUser.validate(valid => {
        if (valid) {
          let params = Object.assign({}, this.prisonUser)
          if (!this.hasPrisonArea || !params.prisonConfigIds.length) params.prisonConfigIds = null
          this.updatePrisonUser(params).then(res => {
            if (!res) return
            if (this.routeRole === '0') this.$router.push('/prison-user/list')
            else if (this.routeRole === '4') this.$router.push('/account/list')
          })
        }
      })
    },
    handleConfigs() {
      // let prisonConfigIds = []
      // if (this.prisonUser.prisonConfigList.length) {
      //   this.prisonUser.prisonConfigList.forEach(c => {
      //     prisonConfigIds.push(c.prisonConfigId)
      //   })
      // }
      // this.prisonUser.prisonConfigIds = prisonConfigIds
    },
    onPrisonChange(e, init) {
      if (!init) this.prisonUser.prisonConfigIds = []
      this.hasPrisonArea = false
      this.gettingPrisonArea = true
      this.getJailPrisonAreas({ jailId: e }).then(res => {
        if (!res) return
        if (this.jailPrisonAreas.length === 0) {
          this.hasPrisonArea = false
        }
        else {
          this.hasPrisonArea = true
        }
        this.gettingPrisonArea = false
      })
    }
  }
}
</script>

<style type="text/stylus" lang="stylus" scoped>

</style>

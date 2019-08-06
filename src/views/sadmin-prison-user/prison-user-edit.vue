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
          prop="roleIds">
          <el-select
            v-model="prisonUser.roleIds"
            placeholder="请选择角色"
            clearable>
            <template v-for="item in rolesList">
              <el-option            
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
              </template>
          </el-select>
        </el-form-item>
        <el-form-item
          label="用户名"
          prop="username">
          <el-input
            disabled
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
        policeNumber: [{ required: true, message: '请填写狱警号' }],
        realName: [{ required: true, message: '请填写真实姓名' }],
        username: [{ required: true, message: '请填写用户名' }],
        roleIds: [{ required: true, message: '请选择角色' }]
      },
      gettingPrisonArea: true,
      hasPrisonArea: false
    }
  },
  computed: {
    ...mapState(['jailPrisonAreas', 'prisonUser']),
    ...mapState({
      rolesList: state => state.account.rolesList
    })
  },
  mounted() {
    this.getJailPrisonAreas().then(res => {
      if (!res) return
      this.getPrisonUserDetail(this.$route.params.id).then(res => {
        if (!res) return
        if (this.jailPrisonAreas.length !== 0) {
          this.hasPrisonArea = true
        }
        this.gettingPrisonArea = false
      })
    })
  },
  methods: {
    ...mapActions(['updatePrisonUser', 'getJailPrisonAreas', 'getPrisonUserDetail']),
    ...mapActions('account', ['getRolesList']),
    onSubmit() {
      this.$refs.prisonUser.validate(valid => {
        if (valid) {
          let {id, policeNumber, prisonConfigIds, realName, roleIds, username} = this.prisonUser, params = { id, policeNumber, prisonConfigIds, realName, roleIds:[roleIds], username}
          if (!this.hasPrisonArea || !params.prisonConfigIds.length) params.prisonConfigIds = null
          this.updatePrisonUser(params).then(res => {
            if (!res) return
            this.$router.push('/account/list')
          })
        }
      })
    }
  }
}
</script>

<style type="text/stylus" lang="stylus" scoped>

</style>

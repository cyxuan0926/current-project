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
          <el-cascader
            v-model="prisonUser.prisonConfigIds"
            :options="allChildPrisonConfigs"
            :props="prisonConfigIdsProps"
            placeholder="请选择监区"
            clearable
            filterable
            separator="-"
          />
        </el-form-item>
        <el-form-item
          label="狱警号"
          prop="policeNumber">
          <el-input
            clearable
            v-model.trim="prisonUser.policeNumber"
            placeholder="请填写狱警号"/>
        </el-form-item>
        <el-form-item
          label="真实姓名"
          prop="realName">
          <el-input
            clearable
            v-model.trim="prisonUser.realName"
            placeholder="请填写真实姓名"/>
        </el-form-item>
        <el-form-item
          label="角色"
          prop="roleIds">
          <el-select
            v-model="prisonUser.roleIds"
            placeholder="请选择角色"
            multiple
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
            v-model.trim="prisonUser.username"
            placeholder="请填写用户名"/>
        </el-form-item>
      </el-form>
      <el-button
        class="submit"
        @click="onGoBack"
        >返回</el-button>
      <el-button
        class="submit"
        type="primary"
        @click="onSubmit"
        >更新</el-button>
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
      hasPrisonArea: false,
      prisonConfigIdsProps: {
        label: 'name',
        value: 'id',
        multiple: true
      }
    }
  },
  computed: {
    ...mapState(['prisonUser', 'allChildPrisonConfigs']),
    ...mapState({
      rolesList: state => state.account.rolesList
    })
  },
  async mounted() {
    await this.getRolesList()
    this.getAllChildPrisonConfigs().then(res => {
      if (!res) return
      this.getPrisonUserDetail(this.$route.params.id).then(res => {
        if (!res) return
        if (this.allChildPrisonConfigs.length !== 0) {
          this.hasPrisonArea = true
        }
      })
    })
  },
  methods: {
    ...mapActions(['updatePrisonUser', 'getAllChildPrisonConfigs', 'getPrisonUserDetail', 'getChildPrisonConfigs']),
    ...mapActions('account', ['getRolesList']),
    onSubmit() {
      this.$refs.prisonUser.validate(valid => {
        if (valid) {
          let {id, policeNumber, prisonConfigIds, realName, roleIds, username} = this.prisonUser, params = { id, policeNumber, prisonConfigIds, realName, roleIds, username}
          if (!this.hasPrisonArea || !params.prisonConfigIds.length) params.prisonConfigIds = null
          else {
            params.prisonConfigIds = params.prisonConfigIds.map(prisonConfigId => {
              return prisonConfigId[prisonConfigId.length - 1]
            })
          }

          this.updatePrisonUser(params).then(res => {
            if (!res) return
            this.$router.push('/account/list')
          })
        }
      })
    },

    onGoBack() {
      this.$router.back()
    }
  }
}
</script>

<style lang="scss" scoped>
.page-edit {
  padding-top: 5%;
}

.el-cascader {
  width: 100%;
}
</style>
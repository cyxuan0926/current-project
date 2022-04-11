<template>
  <el-row class="page-edit">
    <el-col :span="10" :offset="7">
      <el-form
        :model="prisonUser"
        :rules="rules"
        ref="prisonUser"
        label-position="right"
        label-width="100px"
      >
        <el-form-item
          v-if="hasPrisonArea"
          label="监区"
          prop="prisonConfigIds"
        >
          <!-- <el-cascader
            :options="allChildPrisonConfigs"
            :props="prisonConfigIdsProps"
            placeholder="请选择监区"
            clearable
            filterable
            separator="-"
          /> -->
          <el-cascader
            v-model="prisonUser.prisonConfigIds"
            :props="prisonConfigIdsProps"
            placeholder="请选择监区"
            clearable
            filterable
            separator="-"
          />
        </el-form-item>

        <el-form-item label="狱警号" prop="policeNumber">
          <el-input
            clearable
            v-model.trim="prisonUser.policeNumber"
            placeholder="请填写狱警号"
          />
        </el-form-item>

        <el-form-item label="真实姓名" prop="realName">
          <el-input
            clearable
            v-model.trim="prisonUser.realName"
            placeholder="请填写真实姓名"
          />
        </el-form-item>

        <el-form-item label="角色" prop="roleIds">
          <el-select
            v-model="prisonUser.roleIds"
            placeholder="请选择角色"
            multiple
            clearable
          >
            <template v-for="item in rolesList">
              <el-option
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
              </template>
          </el-select>
        </el-form-item>

        <el-form-item label="用户名" prop="username">
          <el-input
            clearable
            v-model.trim="prisonUser.username"
            placeholder="请填写用户名"
          />
        </el-form-item>

        <el-form-item label="手机号码" prop="phoneNumber">
          <el-input
            clearable
            v-model.trim="prisonUser.phoneNumber"
            placeholder="请填写手机号码"
          />
        </el-form-item>
      </el-form>

      <el-button class="submit" @click="onGoBack">返回</el-button>

      <el-button
        class="submit"
        type="primary"
        @click="onSubmit"
      >新增</el-button>
    </el-col>
  </el-row>
</template>

<script>
import {
  mapState,
  mapActions,
  mapGetters
} from 'vuex'

import validator from '@/utils'
export default {
  data() {
    const validatePhone = (rule, value, callback) => {
      const pattern = /^[1][3456789][0-9]{9}$/
      if (value && !pattern.test(value)) callback(new Error('手机号格式错误'))
      else callback()
    }
    return {
      rules: {
        policeNumber: [{ required: true, message: '请填写狱警号' }],
        realName: [{ required: true, message: '请填写真实姓名' }],
        username: [{ validator: validator.containerLetter }],
        roleIds: [{ required: true, message: '请选择角色' }],
        phoneNumber: [{ validator: validatePhone }]
      },

      prisonUser: { prisonConfigIds: [], roleIds: [] }
      // prisonConfigIdsProps: {
      //   label: 'name',
      //   value: 'id',
      //   multiple: true,
      // }
    }
  },
  computed: {
    ...mapState({
      rolesList: state => state.account.rolesList
    }),

    ...mapState([
      'prisonAllWithBranchPrison',
      'multiPrisonConfigs',
      'allChildPrisonConfigs'
    ]),

    ...mapGetters(['isSuperAdmin', 'hasPrisonArea']),

    prisonConfigIdsProps() {
      return ({
        multiple: true,

        lazy: true,

        lazyLoad: async(node, resolve) => {
          let temp = []

          const {
            level,
            value,
            label,
            root,
            isLeaf
          } = node

          if (!isLeaf) {
            if (root && this.hasPrisonArea) await this.getChildPrisonConfigs()

            else await this.getChildPrisonConfigs({ parentId: value })

            temp = this.multiPrisonConfigs.map(item => ({
              label: item.name,
              value: item.id,
              leaf: item.leaf === '1'
            }))
          }

          resolve(temp)
        }
      })
    }
  },

  async mounted() {
    await this.getRolesList()
  },

  methods: {
    ...mapActions(['addPrisonUser', 'getChildPrisonConfigs']),

    ...mapActions('account', ['estimateUsername', 'getRolesList']),

    onSubmit() {
      this.$refs.prisonUser.validate(async valid => {
        if (valid) {
          const res = await this.estimateUsername({username: this.prisonUser.username})

          if(!res) return

          let params = Object.assign({}, this.prisonUser, { roleIds: this.prisonUser.roleIds })

          if (!this.hasPrisonArea) delete params.prisonConfigIds

          else params.prisonConfigIds = params.prisonConfigIds.map(prisonConfigId => prisonConfigId[prisonConfigId.length - 1])

          this.addPrisonUser(params).then(res => {
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
  width: $absolutely-measure;
}
</style>

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
            clearable
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
        >新增</el-button>
    </el-col>
  </el-row>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import validator from '@/utils'

export default {
  data() {
    return {
      rules: {
        policeNumber: [{ required: true, message: '请填写狱警号' }],
        realName: [{ required: true, message: '请填写真实姓名' }],
        username: [{ validator: validator.containerLetter }],
        roleIds: [{ required: true, message: '请选择角色' }]
      },
      hasPrisonArea: true,
      prisonUser: { prisonConfigIds: [] }
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
            if (root) await this.getChildPrisonConfigs()

            else await this.getChildPrisonConfigs({ parentId: value })

            this.hasPrisonArea = !!this.multiPrisonConfigs.length

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
    ...mapActions(['addPrisonUser', 'getChildPrisonConfigs', 'getAllChildPrisonConfigs']),
    ...mapActions('account', ['estimateUsername', 'getRolesList']),
    onSubmit() {
      this.$refs.prisonUser.validate(async valid => {
        if (valid) {
          const res = await this.estimateUsername({username: this.prisonUser.username})
          if(!res) return
          let params = Object.assign({}, this.prisonUser, {roleIds: [this.prisonUser.roleIds]})
          if (!this.hasPrisonArea) delete params.prisonConfigIds
          else {
            params.prisonConfigIds = params.prisonConfigIds.map(prisonConfigId => {
              return prisonConfigId[prisonConfigId.length - 1]
            })
          }
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
</style>

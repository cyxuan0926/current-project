<template>
  <div class="face-recognition-configs">
    <div class="face-recognition-configs__main">
      <!-- <el-form class="cofigs__form" ref="m_form" :label-width="'120px'" :hide-required-asterisk="hideRequiredAsterisk">
        <el-form-item class="threshold__configs" label="人脸识别阈值设置" prop="thresholdConfigs">
          <template >
          <el-col :span="24">
            <el-form-item label="IOS配置" prop="afrIOSSetValue">
              <el-select v-model="formData.afrIOSSetValue" placeholder="请选择IOS阈值配置">
                <el-option 
                  v-for="configs in faceRecognitionValues"
                  :key="configs"
                  :label="configs"
                  :value="configs"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="安卓配置" prop="afrAndroidSetValue">
              <el-select v-model="formData.afrAndroidSetValue" placeholder="请选择安卓阈值配置">
                <el-option 
                  v-for="configs in faceRecognitionValues"
                  :key="configs"
                  :label="configs"
                  :value="configs"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </template>
        </el-form-item>
        <el-form-item label="人脸检索间隔时间" prop="afrInterval">
          <el-input placeholder="请输入人脸检索间隔时间" v-model="formData.afrInterval">
            <template slot="append">秒</template>
          </el-input>
        </el-form-item>
      </el-form> -->
      <m-form
        class="cofigs__form"
        ref="m_form"
        :items="formItems"
        :values="values"
        @submit="onUpdate"
      >
        <template #test>
          <el-col :span="24">
            <el-form-item label="IOS配置" prop="afrIOSSetValue">
              <el-select v-model="formData.afrIOSSetValue" placeholder="请选择IOS阈值配置">
                <el-option 
                  v-for="configs in faceRecognitionValues"
                  :key="configs"
                  :label="configs"
                  :value="configs"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="安卓配置" prop="afrAndroidSetValue">
              <el-select v-model="formData.afrAndroidSetValue" placeholder="请选择安卓阈值配置">
                <el-option 
                  v-for="configs in faceRecognitionValues"
                  :key="configs"
                  :label="configs"
                  :value="configs"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </template>
      </m-form>
    </div>
  </div>
</template>
<script>

import { faceRecognitionValues } from '@/common/constants/const'

import { mapActions, mapState } from 'vuex'
export default {
  data() {
    return {
      faceRecognitionValues,

      formData: {
        afrIOSSetValue: '0.2',

        afrAndroidSetValue: '0.4'
      },

      updateLoading: false,

      values: {}
    }
  },

  computed: {
    ...mapState(['faceRecognitionConfigs']),

    formItems() {
      return {
        formConfigs: {
          labelWidth: '120px',

          hideRequiredAsterisk: true
        },

        thresholdConfigs: {
          slotName: 'test',

          customClass: 'threshold__configs',

          attrs: {
            label: '人脸识别阈值设置'
          }
        },

        afrInterval: {
          label: '人脸检索间隔时间',

          type: 'input',

          rules: ['required', 'isPositiveIntegers', 'numberRange10-3600'],

          append: '秒',

          value: '1500'
        },

        buttons: [{
          text: '更新',
          add: {
            loading: this.updateLoading
          }
        }]
      }
    }
  },

  methods: {
    ...mapActions(['updateFaceRecognitionConfigs']),

    // 更新
    async onUpdate(params) {
      this.updateLoading = true

      this.values = { ...params }

      await this.updateFaceRecognitionConfigs({ ...params, ...this.formData })

      this.updateLoading = false
    }
  },

  watch: {
    faceRecognitionConfigs: {
      handler: function(val) {
        const {
          afrIOSSetValue,
          afrAndroidSetValue,
          afrInterval
        } = val

        this.$set(this.formData, 'afrAndroidSetValue', afrAndroidSetValue)

        this.$set(this.formData, 'afrIOSSetValue', afrIOSSetValue)

        this.values = _.cloneDeep(val)
      },

      immediate: true,

      deep: true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.face-recognition-configs {
  &__main {
    display: flex;

    justify-content: center;

    width: 100%;

    padding: 0px 5px;

    border: 1px solid #DCDFE6;
    .cofigs__form {
      /deep/ .el-form-item__content {
        .el-input {
          width: 60%;
        }
      }

      /deep/ .threshold__configs {
        display: flex;

        flex-direction: column;
        & > .el-form-item__content {
          margin-left: 0px !important;
        }

        .el-input {
          width: 100%;
        }

        .el-select {
          width: 60%;
        }
      }
    }
  }
}
</style>
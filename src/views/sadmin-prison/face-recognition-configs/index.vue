<template>
  <div class="face-recognition-configs">
    <div class="face-recognition-configs__main">
      <m-form
        class="cofigs__form"
        ref="m_form"
        :items="formItems"
        :values="{}"
        @submit="onUpdate"
      >
        <template #test>
          <el-col :span="24">
            <el-form-item label="IOS配置" prop="AFRIOSSetValue">
              <el-select v-model="formData.AFRIOSSetValue" placeholder="请选择IOS阈值配置">
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
            <el-form-item label="安卓配置" prop="AFRAndroidSetValue">
              <el-select v-model="formData.AFRAndroidSetValue" placeholder="请选择安卓阈值配置">
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
        AFRIOSSetValue: '0.2',

        AFRAndroidSetValue: '0.4'
      },

      updateLoading: false
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

        AFRInterval: {
          label: '人脸检索间隔时间',

          type: 'input',

          rules: ['required', 'isPositiveIntegers'],

          value: '60'
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
      console.log(params, this.formData)
      // this.updateLoading = true

      // await this.updateFaceRecognitionConfigs()

      // this.updateLoading = false
    }
  },

  created() {
    const { AFRIOSSetValue, AFRAndroidSetValue } = this.faceRecognitionConfigs

    this.$set(this.formData, 'AFRAndroidSetValue', AFRAndroidSetValue)

    this.$set(this.formData, 'AFRIOSSetValue', AFRIOSSetValue)
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
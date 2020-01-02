<template>
  <el-row
    class="page-edit"
    :gutter="0">
    <el-col
      :span="13"
      :offset="5">
      <el-form
        ref="form"
        :model="advertisementData"
        label-position="top"
        :rules="rules">
        <el-form-item
          label="广告名称"
          prop="name">
          <el-input
            v-model="advertisementData.name"
            placeholder="请填写广告名称" />
        </el-form-item>
        <el-form-item
          label="广告类型"
          prop="typeId">
          <el-select
            v-model="advertisementData.typeId"
            :loading="gettingType"
            placeholder="请选择广告类型"
            @change="onTypeChange">
            <el-option
              v-for="advertisementType in advertisementTypes"
              :key="advertisementType.id"
              :label="advertisementType.name"
              :value="advertisementType.id" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="广告有效时间"
          prop="time">
          <el-date-picker
            v-model="advertisementData.time"
            type="datetimerange"
            start-placeholder="广告开始生效时间"
            end-placeholder="广告截止生效时间"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            @change="onTimeRangeChange"/>
        </el-form-item>
        <el-form-item
          label="省份"
          prop="provinceId">
          <el-select
            v-model="advertisementData.provinceId"
            filterable
            clearable
            :loading="gettingProvince"
            placeholder="请选择省份">
            <el-option
              v-for="province in provincesAll"
              :key="province.id"
              :label="province.name"
              :value="province.id" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="是否上架"
          prop="status">
          <el-radio-group v-model="advertisementData.status">
            <el-radio :label="1">上架</el-radio>
            <el-radio :label="0">不上架</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="广告图片"
          prop="imageUrl">
          <m-upload-img
            v-model="advertisementData.imageUrl"
            :show-tip="showTip"
            :ratio="imageRatio"
            :slots="uploadImgSlots">
            <template slot="tooltipSlot">
              <el-tooltip v-bind="tooltipAttrs">
                <p class="
                  el-button
                  el-button--primary
                  el-button--small
                  is-disabled" >
                  <span>上传图片</span>
                </p>
              </el-tooltip>
            </template>
          </m-upload-img>
        </el-form-item>
      </el-form>
      <el-button
        class="submit"
        type="primary"
        @click="onSubmit"
        size="small">{{ buttonText }}</el-button>
    </el-col>
  </el-row>
</template>

<script>

import { mapActions, mapState } from 'vuex'
import dateFormate from '@/filters/modules/date'

export default {
  props: ['hasPermission'],
  data() {
    return {
      gettingType: true,
      gettingProvince: true,
      advertisementData: {},
      rules: {
        name: [
          {
            required: true,
            message: '请填写广告名称'
          }
        ],
        typeId: [
          {
            required: true,
            message: '请选择广告类型'
          }
        ],
        time: [
          {
            required: true,
            message: '请选择广告有效时间'
          }
        ],
        imageUrl: [
          {
            required: true,
            message: '请上传广告图片'
          }
        ],
        status: [
          {
            required: true,
            message: '请选择是否上架'
          }
        ]
      },
      imageRatio: '',
      // 上传图片组件是否显示默认提示
      showTip: false,
      // 提示组件的配置属性
      tooltipAttrs: {
        effect: 'light',
        content: '请先选择"广告类型"',
        placement: "top-start"
      },
      uploadImgSlots: {
        uploadSlots: [
          { slotName: 'tooltipSlot', type: 'tip' }
        ]
      }
    }
  },
  computed: {
    ...mapState([
      'advertisementTypes',
      'provincesAll',
      'advertisement'
    ]),
    // 根据所权限来区分按钮的文字
    buttonText() {
      return this.hasPermission === 'ádd' ? '新增' : '更新'
    }
  },
  watch: {
    'advertisementData.imageUrl'(url) {
      if (url) this.$refs.form.clearValidate('imageUrl')
      else this.$refs.form.validateField('imageUrl')
    }
  },
  async mounted() {
    if (this.hasPermission === 'add') {
      this.$set(this.uploadImgSlots, 'uploadSlots', [{ slotName: 'tooltipSlot', type: 'tip' }])
      this.showTip = false
    }
    if (this.hasPermission === 'edit') {
      const res = await this.getAdvertisementDetail({ id: this.$route.params.id })
      if (res) {
        this.setUrlStorage({ urls: [this.advertisement.imageUrl] })
        if (!this.advertisement.startDate || !this.advertisement.endDate) return
        this.advertisement.startDate = dateFormate.Date(this.advertisement.startDate)
        this.advertisement.endDate = dateFormate.Date(this.advertisement.endDate)
        this.advertisement.time = [this.advertisement.startDate, this.advertisement.endDate]
        this.imageRatio = this.advertisement.typeId === 2 ? '360:200' : (this.advertisement.typeId === 1 ? '9:16' : '')
        this.$set(this.uploadImgSlots, 'uploadSlots', [{ slotName: 'default', type: 'trigger' }])
        this.showTip = true
        this.advertisementData = this.advertisement
      }
    }
    await Promise.all([this.getAdvertisementTypes(), this.getProvincesAll()])
    this.gettingType = false
    this.gettingProvince = false
  },
  destroyed() {
    this.removeUrlStorage()
  },
  methods: {
    ...mapActions([
      'addAdvertisement',
      'getAdvertisementTypes',
      'getProvincesAll',
      'removeUrlStorage',
      'getAdvertisementDetail',
      'setUrlStorage',
      'updateAdvertisement'
    ]),
    onSubmit(e) {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let params = Object.assign({}, this.advertisementData), result
          delete params.time
          if (this.hasPermission === 'add') result = await this.addAdvertisement(params)
          if (this.hasPermission === 'edit') result = await this.updateAdvertisement(params)
          if (result) this.$router.push('/advertisement/list')
        }
      })
    },
    onTypeChange(e) {
      switch (e) {
        case 2:
          this.imageRatio = '360:200'
          this.$set(this.advertisementData, 'imageUrl', '')
          this.showTip = true
          this.$set(this.uploadImgSlots, 'uploadSlots', [{ slotName: 'default', type: 'trigger' }])
          break
        case 1:
          this.imageRatio = '9:16'
          this.$set(this.advertisementData, 'imageUrl', '')
          this.showTip = true
          this.$set(this.uploadImgSlots, 'uploadSlots', [{ slotName: 'default', type: 'trigger' }])
          break
        default:
          this.imageRatio = ''
          this.showTip = false
          this.$set(this.uploadImgSlots, 'uploadSlots', [{ slotName: 'tooltipSlot', type: 'tip' }])
      }
    },
    onTimeRangeChange(e) {
      if (e) {
        this.advertisementData.startDate = e[0]
        this.advertisementData.endDate = e[1]
      }
      else {
        this.advertisementData.startDate = ''
        this.advertisementData.endDate = ''
      }
    }
  }
}
</script>

<style type="text/stylus" lang="stylus">

</style>

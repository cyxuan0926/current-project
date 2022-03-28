<template>
  <div>
    <m-form
      v-if="show"
      ref="form"
      :items="formItems"
      @submit="onSubmit"
      @back="onBack"
      :values="values"
    />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import roles from '@/common/constants/roles'
export default {
  data() {
    const formButton = {
      buttons: [
        'back',
        { update: { loading: false } }
      ]
    }, permission = 'edit'
    let allFormItems = {
        formConfigs: { labelWidth: '140px' },
        title: {
          type: 'input',
          label: '监狱名称',
          rules: ['required'],
          disabled: true
        },
        provincesId: {
          type: 'select',
          label: '所在省',
          rely: 'citysId',
          func: this.onProvinceChange,
          loading: true,
          rules: ['required'],
          action: 'getProvincesAll',
          disabled: true
        },
        citysId: {
          type: 'select',
          label: '所在市',
          rules: ['required'],
          defer: true,
          disabled: true,
          loading: true
        },
        street: {
          type: 'input',
          label: '街道',
          disabled: true
        },
        visitAddress: {
          type: 'textarea',
          label: '探监路线',
          autosize: {
            minRows: 2,
            maxRows: 6
          }
        },
        zipcode: {
          type: 'input',
          label: '监狱编号',
          rules: ['required'],
          disabled: true
        },
        longitude: {
          type: 'input',
          label: '经度',
          disabled: true,
          noPlaceholder: true
        },
        latitude: {
          type: 'input',
          label: '纬度',
          disabled: true,
          noPlaceholder: true
        },
        description: {
          type: 'jaileditor',
          label: '监狱简介',
          rules: ['required']
        },
        audioPath: {
          type: 'uploadAudio',
          label: '监狱音频'
        },
        videoPath: {
          type: 'uploadVideo',
          label: '监狱视频'
        },
        imageUrl: {
          type: 'uploadImg',
          label: '监狱图片'
        }
      }
    if (this.$store.getters.role !== roles.SUPER_ADMIN) {
      delete allFormItems.longitude
      delete allFormItems.latitude
    }
    return {
      show: false,
      formItems: Object.assign({}, allFormItems, formButton),
      values: {},
      permission
    }
  },
  computed: {
    ...mapState(['prison'])
  },
  activated() {
    if ((this.permission === 'edit' && this.$route.query.tag === 'prisonBase') || (this.permission === 'edit' && !this.$route.query.tag)) {
      this.getPrisonDetail({ id: this.$route.params.id }).then(res => {
        if (!res) return
        this.setUrlStorage({ urls: [this.prison.imageUrl, this.prison.audioPath, this.prison.videoPath], contents: this.prison.description })
        this.values = this.prison
        this.onProvinceChange(this.prison.provincesId, 'init')
      })
    }
    this.show = true
  },
  deactivated() {
    if (this.permission === 'edit') this.show = false
  },
  destroyed() {
    this.removeUrlStorage()
  },
  methods: {
    ...mapActions(['getCities', 'getPrisonDetail', 'updatePrison', 'removeUrlStorage', 'setUrlStorage']),
    onSubmit(e) {
      if (this.$refs.form.$refs.audioPath[0].$refs.audio.loading || this.$refs.form.$refs.videoPath[0].$refs.video.loading) {
        this.$message.warning('正在上传文件')
        return false
      }
      if (this.permission === 'edit') {
        const { familyPhoneScope } = e

        if (_.isEqual([1], familyPhoneScope)) e.familyPhoneScope = 1

        if (_.isEqual([2], familyPhoneScope)) e.familyPhoneScope = 0

        if (!_.difference([1, 2], familyPhoneScope).length) e.familyPhoneScope = 2

        let params = Object.assign({}, e, { changed: 0, weekendChanged: 0, specialChanged: 0 })
        this.formItems.buttons[1].update.loading = true
        this.updatePrison(params).then(res => {
          this.formItems.buttons[1].update.loading = false
          if (!res) return
          // if (this.$route.meta.role !== '3') this.$router.push('/prison/list')
          // else this.$router.push('/jails/detail')
        })
      }
    },
    onProvinceChange(e, init) {
      if (init !== 'init') this.values = { citysId: '' }
      this.formItems.citysId.loading = true
      this.formItems.citysId.disabled = false
      this.getCities(e).then(res => {
        if (!res) return
        this.formItems.citysId = Object.assign({}, this.formItems.citysId, { options: res.options, props: { label: res.label, value: res.value }, loading: false, value: '', disabled: true })
      })
    },
    onBack() {
      if (this.$store.getters.role === roles.SUPER_ADMIN) this.$router.push({ path: '/prison/list' })
      else this.$router.push({ path: '/jails/detail' })
    }
  }
}
</script>

<style lang="css">
</style>

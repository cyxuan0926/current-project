<template>
  <div>
    <m-form
      v-if="show"
      ref="form"
      :items="formItems"
      @submit="onSubmit"
      :values="values"/>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    let formButton = { buttons: ['next'] }, permission = 'add'
    if (this.$route.meta.permission === 'edit') {
      formButton.buttons = [{ update: { loading: false } }]
      permission = 'edit'
    }
    return {
      show: false,
      formItems: Object.assign({}, {
        formConfigs: { labelWidth: '140px' },
        title: { type: 'input', label: '监狱名称', rules: ['required'] },
        provincesId: { type: 'select', label: '所在省', rely: 'citysId', func: this.onProvinceChange, loading: true, rules: ['required'], action: 'getProvincesAll' },
        citysId: { type: 'select', label: '所在市', rules: ['required'], defer: true, disabled: true, loading: true },
        street: { type: 'input', label: '街道' },
        visitAddress: { type: 'textarea', label: '探监路线', autosize: { minRows: 2, maxRows: 6 } },
        zipcode: { type: 'input', label: '监狱编号', rules: ['required', 'isNumber', 'lengthRange-6'] },
        description: { type: 'jaileditor', label: '监狱简介', rules: ['required'] },
        audioPath: { type: 'uploadAudio', label: '监狱音频' },
        videoPath: { type: 'uploadVideo', label: '监狱视频' },
        imageUrl: { type: 'uploadImg', label: '监狱图片' }
      }, formButton),
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
        this.values = this.prison
        this.onProvinceChange(this.prison.provincesId, 'init')
        let images = localStorage.getItem('images') ? JSON.parse(localStorage.getItem('images')) : []
        if (this.prison.description.match(/<img.*? \/>|<source.*? \/>/g)) {
          this.prison.description.match(/<img.*? \/>|<source.*? \/>/g).forEach(ele => {
            let a = document.createElement('div')
            a.innerHTML = ele
            if (images.indexOf(decodeURI(a.lastElementChild.src.split('?token=')[0])) < 0) images.push(decodeURI(a.lastElementChild.src.split('?token=')[0]))
          })
          localStorage.setItem('images', JSON.stringify(images))
        }
      })
    }
    this.show = true
  },
  deactivated() {
    if (this.permission === 'edit') {
      this.show = false
    }
  },
  destroyed() {
    if (localStorage.getItem('images') || localStorage.getItem('oldImages')) this.deleteUnusedImage()
  },
  methods: {
    ...mapActions(['getCities', 'getPrisonDetail', 'updatePrison', 'deleteUnusedImage']),
    onSubmit(e) {
      if (this.$refs.form.$refs.audioPath[0].$refs.audio.loading || this.$refs.form.$refs.videoPath[0].$refs.video.loading) {
        this.$message.warning('正在上传文件')
        return false
      }
      if (this.permission !== 'edit') {
        sessionStorage.setItem('base', JSON.stringify(e))
        sessionStorage.setItem('step', 1)
        this.$router.push({ query: Object.assign({}, { tag: 'prisonConfig' }) })
      }
      else if (this.permission === 'edit') {
        let params = Object.assign({}, e, { changed: 0, weekendChanged: 0, specialChanged: 0 })
        this.formItems.buttons[0].update.loading = true
        this.updatePrison(params).then(res => {
          this.formItems.buttons[0].update.loading = false
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
        this.formItems.citysId = Object.assign({}, this.formItems.citysId, { options: res.options, props: { label: res.label, value: res.value }, loading: false, value: '' })
      })
    }
  }
}
</script>

<style lang="css">
</style>

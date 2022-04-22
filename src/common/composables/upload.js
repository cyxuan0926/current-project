import { ref, computed, toRefs } from '@vue/composition-api'
import store from '@/store'
import Vue from 'vue'

export default function(props, { emit }, { uploadType, $accpet }) {
  const {
    elUploadAttrs,
    sizeLimit,
    triggerButtonAttrs,
    onControlParentLoading
  } = toRefs(props)
  const { headers = {}, data = {} } = elUploadAttrs.value

  // data
  const vueInstance = new Vue()
  const loading = ref(false)
  const notification = ref(null)
  // 上传组件的 ref 保持一直
  const $uploadRef = ref(null)

  // computed
  const actionUrl = computed(() => `${ vueInstance.$urls.publicApiHost }/files`)

  const $headers = computed(() => {
    const { access_token, token_type } = store.state.account.accountInfo

    return {
      Authorization: `${ token_type } ${ access_token }`,
      ...headers
    }
  })

  const $uploadData = computed(() => ({
    type: 'PUBLIC',
    ...data
  }))

  const $elUploadAttrs = computed(() =>
    Object.assign({}, {
      multiple: false,
      showFileList: false,
      action: actionUrl.value,
      onExceed,
      onError,
      onSuccess,
      beforeUpload: onBeforeUpload,
      disabled: loading.value,
      headers: $headers.value,
      data: $uploadData.value,
      accept: $accpet.value
    }, elUploadAttrs.value)
  )
  
  const $triggerButtonAttrs = computed(() =>
    Object.assign({}, {
      size: 'small',
      type: 'primary',
      disabled: loading.value
    }, triggerButtonAttrs.value)
  )

  // methods
  const onControlLoading = (val = false) => {
    if (onControlParentLoading.value) {
      onControlParentLoading.value(val)
    } else {
      loading.value = val
    }
  }

  const onExceed = () => {
    onControlLoading()
    vueInstance.$message.error(`${uploadType.value}数量超出限制`)
    notification.value && notification.value.close()
  }

  const onError = ({ message } = err) => {
    const msg = JSON.parse(message)

    vueInstance.$message.error(msg || `上传${uploadType.value}失败`)
    onControlLoading()

    $uploadRef.value && $uploadRef.value.clearFiles()
    notification.value && notification.value.close()
  }

  const unmountedMethod = () => {
    if (notification.value) {
      notification.value.close()
    }

    notification.value = null
  }

  const onBeforeUpload = file => {
    const fileType = $accpet.value.split(',')
    const type = fileType[0].split('/')[0]
    const typeAll = `${type}/*`
    const isAccept = fileType.includes(file.type) || fileType.includes(typeAll) || fileType.includes('*')

    if (!isAccept) {
      if (fileType.includes(typeAll) || fileType.includes('*')) {
        vueInstance.$message.error(`上传${uploadType.value}文件`)

        return false
      } else {
        const accept = fileType.reduce((accumulator, item) => {
          const type = item.substr(item.lastIndexOf('/') + 1)
          accumulator.push(type)
          return accumulator
        }, [])
        vueInstance.$message.error(`请上传${ accept.join('或') }格式的文件`)

        return false
      }
    }

    if (sizeLimit.value) {
      const isOK = file.size / 1024 / 1024 < sizeLimit.value
      if (!isOK) {
        vueInstance.$message.error(`上传${uploadType.value}大小不能超过${sizeLimit.value}MB`)

        return false
      }
    }

    onControlLoading(true)

    notification.value = vueInstance.$notify({
      title: '提示',
      message: `正在上传${uploadType.value}文件，请耐心等待`,
      type: 'warning',
      duration: 0,
      showClose: false
    })

    return true
  }

  const onSuccess = res => {
    if (res) {
      const { filename, url } = res

      vueInstance.$message.success(`${uploadType.value}上传成功`)
      emit('input', url || `${ vueInstance.$urls.publicApiHost }/files/${filename}`)
    }

    onControlLoading()
    notification.value && notification.value.close()
  }

  return {
    unmountedMethod,
    $elUploadAttrs,
    $uploadRef,
    $triggerButtonAttrs
  }
}
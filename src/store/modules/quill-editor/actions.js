import http from '@/service'
// var deleting = false

export default {
  // 富文本上传图片
  uploadImageFromEditor({ commit }, regs) {
    let formData = new FormData()
    formData.append('file', regs)

    http.uploadImageFromEditor(formData).then(res => commit('uploadImageFromEditor', res)).catch(err => Promise.reject(err))
  }
}
